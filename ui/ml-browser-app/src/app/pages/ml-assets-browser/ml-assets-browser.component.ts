import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { MlAssetsService, MLAssetFilter } from '../../shared/services/ml-assets.service';
import { MLAsset } from '../../shared/models/ml-asset';
import { NotificationService } from '../../shared/services/notification.service';
import { MlAssetCardComponent } from './components/ml-asset-card/ml-asset-card.component';
import { MlFiltersComponent } from './components/ml-filters/ml-filters.component';
import { MlSearchBarComponent } from '../../components/ml-search-bar/ml-search-bar.component';
import { MlBrowserService } from '../../shared/services/ml-browser.service';
import { CatalogStateService } from '../../shared/services/catalog-state.service';

@Component({
  selector: 'app-ml-assets-browser',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MlAssetCardComponent,
    MlFiltersComponent,
    MlSearchBarComponent
  ],
  templateUrl: './ml-assets-browser.component.html',
  styleUrl: './ml-assets-browser.component.scss'
})
export class MlAssetsBrowserComponent implements OnInit {
  private readonly mlAssetsService = inject(MlAssetsService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly mlBrowserService = inject(MlBrowserService);
  private readonly catalogStateService = inject(CatalogStateService);

  allAssets: MLAsset[] = [];
  filteredAssets: MLAsset[] = [];
  displayedAssets: MLAsset[] = [];

  availableTasks: string[] = [];
  availableSubtasks: string[] = [];
  availableAlgorithms: string[] = [];
  availableLibraries: string[] = [];
  availableFrameworks: string[] = [];
  availableStorageTypes: string[] = [];
  availableSoftware: string[] = [];
  availableAssetSources: string[] = [];
  availableFormats: string[] = [];

  isLoading = false;
  isError = false;
  errorMessage = '';

  // Search and filters
  currentSearch = '';
  currentFilters: MLAssetFilter = {};

  // Pagination
  pageSize = 12;
  currentPage = 0;
  totalItems = 0;

  gridCols = 3;

  ngOnInit(): void {
    this.loadMachinelearningAssets();
    this.adjustGridCols();
    window.addEventListener('resize', () => this.adjustGridCols());
  }

  loadMachinelearningAssets(): void {
    console.log('[ML Browser Component] Starting to load IA assets...');
    this.isLoading = true;
    this.isError = false;

    this.fetchAssetsFromServer();
  }

  /**
   * Updates available filters based on all loaded assets
   */
  private updateAvailableFilters(): void {
    this.availableTasks = this.mlAssetsService.extractUniqueTasks(this.allAssets);
    this.availableSubtasks = this.mlAssetsService.extractUniqueSubtasks(this.allAssets);
    this.availableAlgorithms = this.mlAssetsService.extractUniqueAlgorithms(this.allAssets);
    this.availableLibraries = this.mlAssetsService.extractUniqueLibraries(this.allAssets);
    this.availableFrameworks = this.mlAssetsService.extractUniqueFrameworks(this.allAssets);
    this.availableStorageTypes = this.mlAssetsService.extractUniqueStorageTypes(this.allAssets);
    this.availableSoftware = this.mlAssetsService.extractUniqueSoftware(this.allAssets);
    this.availableAssetSources = this.mlAssetsService.extractUniqueAssetSources(this.allAssets);
    this.availableFormats = this.mlAssetsService.extractUniqueFormats(this.allAssets);
  }

  onSearch(searchTerm: string): void {
    this.currentSearch = searchTerm;
    this.currentPage = 0;
    this.fetchAssetsFromServer();
  }

  onFilterChange(filters: MLAssetFilter): void {
    this.currentFilters = filters;
    this.currentPage = 0;
    this.fetchAssetsFromServer();
  }

  private fetchAssetsFromServer(): void {
    const hasFilters = this.hasActiveFilters();
    const combinedFilters: MLAssetFilter = {
      searchTerm: this.currentSearch,
      ...this.currentFilters
    };

    this.isLoading = true;
    this.isError = false;

    this.mlAssetsService.getMachinelearningAssets(this.currentFilters, this.currentSearch)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: (assets: MLAsset[]) => {
          console.log('[ML Browser Component] Received assets:', assets.length);
          this.filteredAssets = assets;
          if (!hasFilters || this.allAssets.length === 0) {
            this.allAssets = assets;
            this.updateAvailableFilters();
          }
          this.totalItems = this.filteredAssets.length;
          this.updateDisplayedAssets();
          this.notificationService.showInfo(`Loaded ${this.allAssets.length} IA models`);
        },
        error: (error: unknown) => {
          console.error('[ML Browser Component] Error loading assets:', error);
          this.isError = true;
          const errorObj = error as Record<string, unknown>;
          this.errorMessage = 'Failed to load ML models: ' + (errorObj?.['message'] || 'Unknown error');
          this.notificationService.showError(this.errorMessage);
        }
      });
  }

  private updateDisplayedAssets(): void {
    const startIdx = this.currentPage * this.pageSize;
    const endIdx = startIdx + this.pageSize;
    this.displayedAssets = this.filteredAssets.slice(startIdx, endIdx);
  }

  private hasActiveFilters(): boolean {
    if (this.currentSearch && this.currentSearch.trim().length > 0) {
      return true;
    }
    const filters = this.currentFilters || {};
    return !!(
      (filters.tasks && filters.tasks.length > 0) ||
      (filters.subtasks && filters.subtasks.length > 0) ||
      (filters.algorithms && filters.algorithms.length > 0) ||
      (filters.libraries && filters.libraries.length > 0) ||
      (filters.frameworks && filters.frameworks.length > 0) ||
      (filters.storageTypes && filters.storageTypes.length > 0) ||
      (filters.software && filters.software.length > 0) ||
      (filters.assetSources && filters.assetSources.length > 0) ||
      (filters.formats && filters.formats.length > 0)
    );
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedAssets();
  }

  onViewDetails(asset: MLAsset): void {
    console.log('[ML Browser] View details for asset:', asset.id);
    // Navigate to asset detail page
    this.router.navigate(['/assets', asset.id]);
  }

  onDownloadAsset(asset: MLAsset): void {
    this.notificationService.showInfo(`Preparing to access "${asset.name}"...`);
    // TODO: Implement download/access logic
  }

  onCreateContract(asset: MLAsset): void {
    console.log('[ML Browser] Create contract for asset:', asset.name, asset.id);
    // Navigate to contract definition creation with pre-selected asset
    this.router.navigate(['/contract-definitions/create'], {
      state: { preSelectedAssetId: asset.id }
    });
  }

  onNegotiate(asset: MLAsset): void {
    console.log('[ML Browser] Negotiate for asset:', asset.name);
    this.notificationService.showInfo(`Loading contract offers for "${asset.name}"`);
    
    // Fetch catalog to get contract offers for this asset
    this.mlBrowserService.getCatalog({ offset: 0, limit: 100 }).subscribe({
      next: (catalogItems) => {
        // Find the asset in the catalog
        const catalogItem = catalogItems.find(item => item.assetId === asset.id);
        
        if (catalogItem && catalogItem.contractOffers && catalogItem.contractOffers.length > 0) {
          console.log('[ML Browser] Found catalog item with contract offers:', catalogItem);
          
          // Set data in service
          this.catalogStateService.setCurrentItem({
            assetId: catalogItem.assetId,
            properties: catalogItem.properties,
            originator: catalogItem.originator,
            contractOffers: catalogItem.contractOffers,
            contractCount: catalogItem.contractCount,
            catalogView: true,
            returnUrl: '/ml-assets',
            selectedTabIndex: 1 // Navigate directly to Contract Offers tab (index 1)
          });
          
          // Navigate to catalog detail view
          this.router.navigate(['/catalog/view']);
        } else {
          console.warn('[ML Browser] No contract offers found for asset:', asset.id);
          this.notificationService.showWarning(`No contract offers available for "${asset.name}"`);
        }
      },
      error: (error) => {
        console.error('[ML Browser] Error fetching catalog:', error);
        this.notificationService.showError('Failed to load contract offers');
      }
    });
  }

  retryLoading(): void {
    this.loadMachinelearningAssets();
  }

  private adjustGridCols(): void {
    const width = window.innerWidth;
    if (width > 1600) {
      this.gridCols = 4;
    } else if (width > 1200) {
      this.gridCols = 3;
    } else if (width > 768) {
      this.gridCols = 2;
    } else {
      this.gridCols = 1;
    }
  }

  get hasResults(): boolean {
    return this.filteredAssets.length > 0;
  }

  get noResultsMessage(): string {
    if (this.allAssets.length === 0) {
      return 'No ML models found in the dataspace';
    }
    if (this.currentSearch || Object.keys(this.currentFilters).length > 0) {
      return 'No ML models match your search or filters';
    }
    return 'No results';
  }
}
