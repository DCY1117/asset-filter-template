import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MlBrowserService } from './ml-browser.service';
import { MLAsset } from '../models/ml-asset';

export interface ModelExecutionRequest {
  assetId: string;
  payload: any;
  method?: string;
  path?: string;
  headers?: Record<string, string>;
}

export interface ModelExecutionResponse {
  status: 'success' | 'error';
  assetId: string;
  output?: any;
  error?: string;
  timestamp: string;
}

export interface ExecutableAsset {
  id: string;
  name: string;
  execution_path: string;
  contentType?: string;
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ModelExecutionService {
  private readonly http = inject(HttpClient);
  private readonly mlBrowserService = inject(MlBrowserService);

  private readonly INFER_URL = environment.runtime.inferApiUrl || `${environment.runtime.consumerApiUrl}/api/infer`;

  executeModel(request: ModelExecutionRequest): Observable<ModelExecutionResponse> {
    const body: Record<string, unknown> = {
      assetId: request.assetId,
      method: request.method || 'POST',
      path: request.path || '/infer',
      headers: request.headers || { 'Content-Type': 'application/json' },
      payload: request.payload
    };

    return this.http.post<any>(this.INFER_URL, body, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => ({
        status: response.status >= 200 && response.status < 300 ? 'success' : 'error',
        assetId: request.assetId,
        output: response.body,
        timestamp: new Date().toISOString()
      }))
    );
  }

  getExecutableAssets(): Observable<ExecutableAsset[]> {
    return this.mlBrowserService.getPaginatedMLAssets().pipe(
      map((assets) => assets.filter((asset) => this.isExecutableAsset(asset))),
      map((assets) => assets.map((asset) => this.toExecutableAsset(asset)))
    );
  }

  private isExecutableAsset(asset: MLAsset): boolean {
    const contentType = (asset.contentType || '').toLowerCase();
    const tags = (asset.keywords || []).map(t => t.toLowerCase());
    return contentType.includes('application/json') || tags.includes('inference') || tags.includes('endpoint');
  }

  private toExecutableAsset(asset: MLAsset): ExecutableAsset {
    return {
      id: asset.id,
      name: asset.name,
      execution_path: this.extractInferencePath(asset),
      contentType: asset.contentType,
      tags: asset.keywords
    };
  }

  private extractInferencePath(asset: MLAsset): string {
    const candidates = [
      'https://pionera.ai/edc/hf#inference_path',
      'hf:inference_path',
      'inference_path',
      'inferencePath',
      'path'
    ];

    const fromObject = (obj?: Record<string, unknown>) => {
      if (!obj) return undefined;
      for (const key of candidates) {
        const value = obj[key];
        if (typeof value === 'string' && value.trim()) {
          return value.trim();
        }
      }
      return undefined;
    };

    const direct = fromObject(asset.rawProperties);
    if (direct) return this.normalizePath(direct);

    const props = (asset.rawProperties?.['properties'] as Record<string, unknown>) || undefined;
    const nested = fromObject(props);
    if (nested) return this.normalizePath(nested);

    return '/infer';
  }

  private normalizePath(path: string): string {
    return path.startsWith('/') ? path : `/${path}`;
  }
}
