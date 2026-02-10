import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CatalogStateService } from '../../../shared/services/catalog-state.service';

interface ContractOffer {
  '@id': string;
  '@type': string;
  contractId: string;
  accessPolicyId: string;
  contractPolicyId: string;
  accessPolicy: any;
  contractPolicy: any;
}

interface CatalogDetailData {
  assetId: string;
  properties: any;
  originator: string;
  contractOffers: ContractOffer[];
  contractCount: number;
  catalogView?: boolean;
  returnUrl?: string;
  selectedTabIndex?: number;
}

/**
 * Catalog Detail Component
 * Shows asset information and contract offers for negotiation
 * Similar to dataspace-connector-interface contract-offers-viewer
 */
@Component({
  selector: 'app-catalog-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatListModule,
    MatChipsModule,
    MatExpansionModule,
    MatProgressBarModule
  ],
  templateUrl: './catalog-detail.component.html',
  styleUrl: './catalog-detail.component.scss'
})
export class CatalogDetailComponent implements OnInit {
  private router = inject(Router);
  private catalogStateService = inject(CatalogStateService);

  data: CatalogDetailData | null = null;
  selectedTabIndex = 0;

  ngOnInit(): void {
    console.log('[Catalog Detail] Component initialized');
    
    // Get data from service
    this.data = this.catalogStateService.getCurrentItem();
    console.log('[Catalog Detail] Data from service:', this.data);

    // Check if we have the required data
    if (!this.data || !this.data.assetId) {
      console.error('[Catalog Detail] No data available, redirecting to catalog');
      this.router.navigate(['/catalog']);
      return;
    }

    // Set selected tab index if provided
    if (this.data.selectedTabIndex !== undefined) {
      this.selectedTabIndex = this.data.selectedTabIndex;
      console.log('[Catalog Detail] Tab index set to:', this.selectedTabIndex);
    }

    console.log('[Catalog Detail] Successfully loaded data for asset:', this.data.assetId);
  }

  backToList(): void {
    const returnUrl = this.data?.returnUrl || '/catalog';
    this.router.navigate([returnUrl]);
  }

  getPolicyAction(policy: any): string {
    if (!policy?.policy) return 'N/A';
    const permissions = policy.policy['odrl:permission'];
    if (Array.isArray(permissions) && permissions.length > 0) {
      return permissions[0]['odrl:action'] || 'N/A';
    }
    return 'N/A';
  }

  getPolicyConstraints(policy: any): any[] {
    if (!policy?.policy) return [];
    const permissions = policy.policy['odrl:permission'];
    if (Array.isArray(permissions) && permissions.length > 0) {
      return permissions[0]['odrl:constraint'] || [];
    }
    return [];
  }

  formatConstraint(constraint: any): string {
    const leftOperand = constraint['odrl:leftOperand'] || '';
    const operator = constraint['odrl:operator'] || '';
    const rightOperand = constraint['odrl:rightOperand'] || '';
    return `${leftOperand} ${operator} ${rightOperand}`;
  }

  viewPolicyJson(policy: any): void {
    console.log('[Catalog Detail] Policy JSON:', policy);
    // TODO: Open dialog with JSON viewer
  }

  negotiateContract(offer: ContractOffer): void {
    console.log('[Catalog Detail] Negotiating contract:', offer);
    // TODO: Implement contract negotiation
  }

  getPropertyKeys(): string[] {
    if (!this.data?.properties) return [];
    return Object.keys(this.data.properties).filter(key => 
      !['name', 'version', 'contentType', 'description', 'shortDescription', 
        'keywords', 'byteSize', 'format', 'type', 'owner'].includes(key)
    );
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  getEntries(obj: any): { key: string; value: any }[] {
    if (!obj || typeof obj !== 'object') return [];
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }
}
