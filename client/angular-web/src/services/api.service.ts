import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getEnv } from '../utils/environment';
import { Observable, map, catchError, throwError } from 'rxjs';
import { ApiResponse } from '../types';
@Injectable({
  providedIn: 'root',
})
export default class ApiProvider {
  private baseUrl: string = getEnv(false);
  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<T>) => ({
          status: response.status,
          ok: response.ok,
          ...(response.body as any),
        })),
        catchError((error) => {
          console.error('Error fetching data:', error);
          return throwError(() => error);
        })
      );
  }

  post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, data, {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<T>) => ({
          status: response.status,
          ok: response.ok,
          ...(response.body as any),
        })),
        catchError((error) => {
          console.error('Error posting data:', error);
          return throwError(() => error);
        })
      );
  }

  put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, data, {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<T>) => ({
          status: response.status,
          ok: response.ok,
          ...(response.body as any),
        })),
        catchError((error) => {
          console.error('Error updating data:', error);
          return throwError(() => error);
        })
      );
  }

  delete<T>(endpoint: string, data: any = null): Observable<ApiResponse<T>> {
    const options = {
      withCredentials: true,
      observe: 'response' as const,
      body: data || undefined,
    };

    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, options).pipe(
      map((response: HttpResponse<T>) => ({
        status: response.status,
        ok: response.ok,
        ...(response.body as any),
      })),
      catchError((error) => {
        console.error('Error deleting data:', error);
        return throwError(() => error);
      })
    );
  }
}
