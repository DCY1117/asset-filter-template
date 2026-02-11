import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MLAsset } from '../models/ml-asset';
import { MLAssetFilter } from './ml-assets.service';

@Injectable({
  providedIn: 'root'
})
export class MlBrowserService {

  private readonly httpClient = inject(HttpClient);
  private readonly FILTER_URL = environment.runtime.filterApiUrl || `${environment.runtime.consumerApiUrl}/api/filter/catalog`;

  /**
   * Retrieves ML assets using the filtering extension.
   */
  getPaginatedMLAssets(filters?: MLAssetFilter, searchTerm?: string): Observable<MLAsset[]> {
    const query = this.buildFilterQuery(filters, searchTerm);
    const url = query ? `${this.FILTER_URL}?${query}` : this.FILTER_URL;

    const body = this.buildCatalogRequestBody();

    console.log('[ML Browser Service] Calling filter catalog:', url);

    return this.httpClient.post<any>(url, body).pipe(
      map(response => this.parseCatalogResponse(response))
    );
  }

  count(): Observable<number> {
    return this.getPaginatedMLAssets().pipe(map(assets => assets.length));
  }

  /**
   * Fetch raw catalog items (used in catalog views)
   */
  getCatalog(querySpec: { offset: number; limit: number }): Observable<any[]> {
    const body = {
      '@context': { '@vocab': 'https://w3id.org/edc/v0.0.1/ns/' },
      counterPartyAddress: environment.runtime.providerProtocolUrl,
      protocol: environment.runtime.catalogProtocol,
      querySpec
    };

    return this.httpClient.post<any[]>(`${environment.runtime.consumerManagementUrl}/v3/catalog/request`, body);
  }

  getCatalogCount(): Observable<number> {
    return this.httpClient.post<number>(`${environment.runtime.consumerManagementUrl}/v3/catalog/request/count`, {});
  }

  private buildCatalogRequestBody(): Record<string, unknown> {
    return {
      '@context': { '@vocab': 'https://w3id.org/edc/v0.0.1/ns/' },
      counterPartyAddress: environment.runtime.providerProtocolUrl,
      protocol: environment.runtime.catalogProtocol
    };
  }

  private buildFilterQuery(filters?: MLAssetFilter, searchTerm?: string): string {
    const params: string[] = [];
    params.push('profile=daimo');

    if (searchTerm) {
      params.push(`q=${encodeURIComponent(searchTerm)}`);
    }

    if (filters?.tasks?.length) {
      params.push(`task=${encodeURIComponent(filters.tasks.join(','))}`);
    }
    if (filters?.libraries?.length) {
      params.push(`library=${encodeURIComponent(filters.libraries.join(','))}`);
    }
    if (filters?.frameworks?.length) {
      params.push(`library=${encodeURIComponent(filters.frameworks.join(','))}`);
    }
    if (filters?.formats?.length) {
      params.push(`filter=contenttype=${encodeURIComponent(filters.formats.join(','))}`);
    }

    return params.join('&');
  }

  private parseCatalogResponse(response: any): MLAsset[] {
    if (!response) return [];

    const datasets = response['dcat:dataset'] || response['dataset'] || [];
    const list = Array.isArray(datasets) ? datasets : [datasets];

    return list.map((dataset: any) => this.parseCatalogDataset(dataset));
  }

  private parseCatalogDataset(dataset: any): MLAsset {
    const id = dataset['@id'] || dataset['id'] || 'unknown';
    const name = dataset['name'] || id;

    const daimoTags = dataset['https://pionera.ai/edc/daimo#tags'] || dataset['daimo:tags'] || [];
    const keywords = Array.isArray(daimoTags) ? daimoTags : [daimoTags].filter(Boolean);

    const pipelineTag = dataset['https://pionera.ai/edc/daimo#pipeline_tag'] || dataset['daimo:pipeline_tag'];
    const libraryName = dataset['https://pionera.ai/edc/daimo#library_name'] || dataset['daimo:library_name'];

    const contentType = dataset['contenttype'] || dataset['https://pionera.ai/edc/daimo#contenttype'] || '';

    return {
      id: String(id),
      name: String(name),
      version: 'N/A',
      description: '',
      shortDescription: '',
      assetType: 'machineLearning',
      contentType: String(contentType),
      byteSize: '',
      format: '',
      keywords: keywords.map((k: any) => String(k)),
      tasks: pipelineTag ? [String(pipelineTag)] : [],
      subtasks: [],
      algorithms: [],
      libraries: libraryName ? [String(libraryName)] : [],
      frameworks: libraryName ? [String(libraryName)] : [],
      modelType: '',
      storageType: '',
      fileName: '',
      owner: '',
      isLocal: false,
      hasContractOffers: true,
      contractOffers: dataset['odrl:hasPolicy'] ? [dataset['odrl:hasPolicy']] : [],
      endpointUrl: undefined,
      participantId: dataset['dspace:participantId'] || '',
      assetData: dataset,
      rawProperties: dataset,
      originator: 'Federated Catalog'
    } as MLAsset;
  }
}
