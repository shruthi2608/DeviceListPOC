import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceDetail } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'https://localhost:7011/api/Devices/by-customer'; // 🔥 Update with your API URL

  constructor(private http: HttpClient) {}

getDevices(
  customerAccountId: number,
  pageIndex: number,
  pageSize: number,
  filters?: any[],
  globalSearchText?: string
): Observable<DeviceDetail[]> {
  let params = new HttpParams()
    .set('customerAccountId', customerAccountId)
    .set('pageIndex', pageIndex)
    .set('pageSize', pageSize);

  if (filters && filters.length > 0) {
    params = params.set('filters', JSON.stringify(filters));
  }

  if (globalSearchText && globalSearchText.trim() !== '') {
    params = params.set('globalSearchText', globalSearchText.trim());
  }

  return this.http.get<DeviceDetail[]>(this.apiUrl, { params });
}




}
