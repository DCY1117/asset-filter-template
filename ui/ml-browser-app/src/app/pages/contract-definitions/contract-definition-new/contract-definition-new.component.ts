import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { startWith, switchMap, finalize, tap } from 'rxjs/operators';

import { PolicyService } from '../../../shared/services/policy.service';
import { ContractDefinitionService } from '../../../shared/services/contract-definition.service';
import { MlAssetsService } from '../../../shared/services/ml-assets.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { MLAsset } from '../../../shared/models/ml-asset';
import { PolicyDefinition, ContractDefinitionInput } from '@think-it-labs/edc-connector-client';
import { PolicyCreateDialogComponent } from '../policy-create-dialog/policy-create-dialog.component';

@Component({
  selector: 'app-contract-definition-new',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './contract-definition-new.component.html',
  styleUrl: './contract-definition-new.component.scss'
})
export class ContractDefinitionNewComponent implements OnInit {
  private readonly policyService = inject(PolicyService);
  private readonly assetService = inject(MlAssetsService);
  private readonly contractDefinitionService = inject(ContractDefinitionService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  assetControl = new FormControl('');
  filteredAssets: MLAsset[] = [];
  selectedAssets: MLAsset[] = [];
  isLoading = false;
  
  policies: PolicyDefinition[] = [];
  accessPolicy?: PolicyDefinition;
  contractPolicy?: PolicyDefinition;

  contractDefinition: ContractDefinitionInput = {
    '@id': '',
    assetsSelector: [],
    accessPolicyId: '',
    contractPolicyId: ''
  };

  ngOnInit(): void {
    // Load pre-selected asset if navigated from ML Browser
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || (history.state && history.state.preSelectedAssetId ? history.state : null);
    const preSelectedAssetId = state?.['preSelectedAssetId'];

    if (preSelectedAssetId) {
      console.log('[Contract Definition New] Pre-selected asset ID:', preSelectedAssetId);
      this.loadPreSelectedAsset(preSelectedAssetId);
    }

    // Load available policies
    this.policyService.queryAllPolicies().subscribe({
      next: (policies) => {
        this.policies = policies;
        console.log('[Contract Definition New] Loaded policies:', policies.length);
      },
      error: (error) => {
        console.error('[Contract Definition New] Error loading policies:', error);
        this.notificationService.showError('Failed to load policies');
      }
    });

    // Setup asset autocomplete
    this.assetControl.valueChanges.pipe(
      startWith(''),
      tap(() => this.isLoading = true),
      switchMap(value => {
        const query = typeof value === 'string' ? value.trim() : '';
        
        if (!query) {
          return this.assetService.getMachinelearningAssets();
        }
        
        // Filter assets by search term
        return this.assetService.getMachinelearningAssets().pipe(
          switchMap(assets => {
            const filtered = assets.filter(asset => 
              asset.id.toLowerCase().includes(query.toLowerCase()) ||
              asset.name.toLowerCase().includes(query.toLowerCase())
            );
            return [filtered];
          })
        );
      }),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (assets) => {
        // Exclude already selected assets
        this.filteredAssets = assets.filter(asset => 
          !this.selectedAssets.find(selected => selected.id === asset.id)
        );
      },
      error: (error) => {
        console.error('[Contract Definition New] Error loading assets:', error);
        this.filteredAssets = [];
      }
    });
  }

  /**
   * Load pre-selected asset from ML Browser
   */
  private loadPreSelectedAsset(assetId: string): void {
    this.assetService.getMachinelearningAssets().subscribe({
      next: (assets) => {
        const asset = assets.find(a => a.id === assetId);
        if (asset) {
          this.selectedAssets = [asset];
          console.log('[Contract Definition New] Pre-selected asset loaded:', asset.name);
        } else {
          console.warn('[Contract Definition New] Pre-selected asset not found:', assetId);
        }
      },
      error: (error) => {
        console.error('[Contract Definition New] Error loading pre-selected asset:', error);
      }
    });
  }

  displayAsset(asset: MLAsset | null): string {
    return asset ? asset.id : '';
  }

  addAsset(event: any, asset: MLAsset): void {
    if (event.isUserInput && asset) {
      // Check if not already selected
      if (!this.selectedAssets.find(a => a.id === asset.id)) {
        this.selectedAssets.push(asset);
        this.assetControl.setValue('');
      }
    }
  }

  removeAsset(asset: MLAsset): void {
    const index = this.selectedAssets.findIndex(a => a.id === asset.id);
    if (index >= 0) {
      this.selectedAssets.splice(index, 1);
    }
  }

  onSave(): void {
    if (!this.checkRequiredFields()) {
      this.notificationService.showError('Please fill all required fields');
      return;
    }

    // Build contract definition
    this.contractDefinition.accessPolicyId = this.accessPolicy!['@id']!;
    this.contractDefinition.contractPolicyId = this.contractPolicy!['@id']!;
    this.contractDefinition.assetsSelector = [];

    if (this.selectedAssets.length > 0) {
      const ids = this.selectedAssets.map(asset => asset.id);

      this.contractDefinition.assetsSelector = [{
        operandLeft: 'https://w3id.org/edc/v0.0.1/ns/id',
        operator: 'in',
        operandRight: ids,
      }];
    }

    console.log('[Contract Definition New] Creating contract definition:', this.contractDefinition);

    this.contractDefinitionService.createContractDefinition(this.contractDefinition)
      .subscribe({
        next: () => {
          this.notificationService.showInfo('Contract definition created successfully');
          this.navigateToContractDefinitions();
        },
        error: (error) => {
          console.error('[Contract Definition New] Error creating contract definition:', error);
          const errorMsg = error?.error?.message || error?.message || 'Unknown error';
          this.notificationService.showError(`Contract definition cannot be created: ${errorMsg}`);
        }
      });
  }

  private checkRequiredFields(): boolean {
    return !!(
      this.contractDefinition['@id'] && 
      this.accessPolicy && 
      this.contractPolicy
    );
  }

  navigateToContractDefinitions(): void {
    this.router.navigate(['/ml-assets']);
  }

  cancel(): void {
    this.router.navigate(['/ml-assets']);
  }

  /**
   * Open dialog to create a new access policy
   */
  createAccessPolicy(): void {
    const dialogRef = this.dialog.open(PolicyCreateDialogComponent, {
      width: '700px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Reload policies and select the newly created one
        this.loadPolicies(result['@id']);
      }
    });
  }

  /**
   * Open dialog to create a new contract policy
   */
  createContractPolicy(): void {
    const dialogRef = this.dialog.open(PolicyCreateDialogComponent, {
      width: '700px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Reload policies and select the newly created one
        this.loadPolicies(undefined, result['@id']);
      }
    });
  }

  /**
   * Load policies from backend and optionally select specific ones
   */
  private loadPolicies(selectAccessPolicyId?: string, selectContractPolicyId?: string): void {
    this.policyService.queryAllPolicies().subscribe({
      next: (policies) => {
        this.policies = policies;
        
        if (selectAccessPolicyId) {
          this.accessPolicy = policies.find(p => p['@id'] === selectAccessPolicyId);
        }
        
        if (selectContractPolicyId) {
          this.contractPolicy = policies.find(p => p['@id'] === selectContractPolicyId);
        }
      },
      error: (error) => {
        console.error('[Contract Definition New] Error reloading policies:', error);
      }
    });
  }
}
