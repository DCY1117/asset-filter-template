import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JSON_LD_DEFAULT_CONTEXT } from '@think-it-labs/edc-connector-client';

/**
 * Contract Negotiation Service
 * 
 * Handles contract negotiation operations with the EDC connector
 */
@Injectable({
  providedIn: 'root'
})
export class ContractNegotiationService {
  private readonly http = inject(HttpClient);

  private readonly BASE_URL = `${environment.runtime.managementApiUrl}${environment.runtime.service.contractNegotiation.baseUrl}`;

  /**
   * Get all contract negotiations
   */
  getAll(): Observable<any[]> {
    const body = {
      '@context': JSON_LD_DEFAULT_CONTEXT,
      'filterExpression': []
    };

    return from(lastValueFrom(
      this.http.post<any[]>(`${this.BASE_URL}${environment.runtime.service.contractNegotiation.getAll}`, body)
    ));
  }

  /**
   * Get a specific contract negotiation by ID
   */
  get(id: string): Observable<any> {
    if (!id) {
      throw new Error('Contract negotiation ID is required');
    }

    return from(lastValueFrom(
      this.http.get<any>(`${this.BASE_URL}${environment.runtime.service.contractNegotiation.get}${id}`)
    ));
  }

  /**
   * Initiate a new contract negotiation
   */
  initiate(negotiationRequest: any): Observable<any> {
    const body = {
      ...negotiationRequest,
      '@context': JSON_LD_DEFAULT_CONTEXT
    };

    return from(lastValueFrom(
      this.http.post<any>(this.BASE_URL, body)
    ));
  }

  /**
   * Terminate a contract negotiation
   */
  terminate(id: string, reason?: string): Observable<any> {
    if (!id) {
      throw new Error('Contract negotiation ID is required');
    }

    const body = {
      '@context': JSON_LD_DEFAULT_CONTEXT,
      '@id': id,
      'reason': reason || 'Terminated by user'
    };

    return from(lastValueFrom(
      this.http.post<any>(`${this.BASE_URL}/${id}/terminate`, body)
    ));
  }
}
