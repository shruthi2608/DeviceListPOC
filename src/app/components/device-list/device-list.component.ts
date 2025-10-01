import { Component, OnInit, ViewChild } from '@angular/core';
import { DeviceDetail } from '../../../models/device.model';
import { DeviceService } from '../../../services/device.service';
import { LazyLoadEvent } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
})
export class DeviceListComponent implements OnInit {
  customers: DeviceDetail[] = [];
  loading: boolean = true;
  totalRecords: number = 0;
  columns = [
    { field: 'deviceId', header: 'Device ID', matchMode: 'contains' },
    { field: 'mac', header: 'MAC', matchMode: 'contains' },
    {
      field: 'deviceStatusName',
      header: 'Device Status',
      matchMode: 'contains',
    },
    { field: 'routerStatus', header: 'Router Status', matchMode: 'contains' },
    { field: 'packageStatus', header: 'Package Status', matchMode: 'contains' },
    {
      field: 'packageStatusId',
      header: 'Package Status ID',
      matchMode: 'equals',
    },
    { field: 'productId', header: 'Product ID', matchMode: 'equals' },
    { field: 'productName', header: 'Product Name', matchMode: 'contains' },
    { field: 'siM1', header: 'SIM1', matchMode: 'contains' },
    { field: 'siM1Status', header: 'SIM1 Status', matchMode: 'contains' },
    { field: 'siM1StatusId', header: 'SIM1 Status ID', matchMode: 'equals' },
    {
      field: 'siM1ProvisioningDate',
      header: 'SIM1 Provisioning Date',
      filterType: 'date',
      matchMode: 'dateIs',
    },
    { field: 'siM2', header: 'SIM2', matchMode: 'contains' },
    { field: 'siM2Status', header: 'SIM2 Status', matchMode: 'contains' },
    { field: 'siM2StatusId', header: 'SIM2 Status ID', matchMode: 'equals' },
    {
      field: 'siM2ProvisioningDate',
      header: 'SIM2 Provisioning Date',
      filterType: 'date',
      matchMode: 'dateIs',
    },
    {
      field: 'packingDate',
      header: 'Packing Date',
      filterType: 'date',
      matchMode: 'dateIs',
    },
    {
      field: 'shipmentDate',
      header: 'Shipment Date',
      filterType: 'date',
      matchMode: 'dateIs',
    },
    {
      field: 'customerAccountId',
      header: 'Customer Account ID',
      matchMode: 'equals',
    },
    {
      field: 'deviceSerialNumber',
      header: 'Device Serial Number',
      matchMode: 'contains',
    },
    {
      field: 'wifiConfiguration',
      header: 'WiFi Config',
      matchMode: 'contains',
    },
    { field: 'wifiStatus', header: 'WiFi Status', matchMode: 'contains' },
    { field: 'createdBy', header: 'Created By', matchMode: 'contains' },
    {
      field: 'createdOn',
      header: 'Created On',
      filterType: 'date',
      matchMode: 'dateIs',
    },
  ];
  statusColumns = [
    'deviceStatusName',
    'routerStatus',
    'packageStatus',
    'siM1Status',
    'siM2Status',
    'wifiStatus',
  ];

  // Hardcoded options for each column
  statusOptionsMap: Record<string, { label: string; value: string }[]> = {
    deviceStatusName: [
      { label: 'Active', value: 'active' },
      { label: 'Unassigned', value: 'unassigned' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' },
    ],
    routerStatus: [
      { label: 'Online', value: 'online' },
      { label: 'Offline', value: 'offline' },
    ],
    packageStatus: [
      { label: 'Active', value: 'Active' },
      { label: 'Inactive', value: 'Inactive' },
      { label: 'Assigned', value: 'Assigned' },
      { label: 'Unassigned', value: 'Unassigned' },
      { label: 'Damage', value: 'Damage' },
      { label: 'RMA Not Ready', value: 'RMA Not Ready' },
      { label: 'RMA Ready', value: 'RMA Ready' },
      { label: 'Active Unassigned', value: 'Active Unassigned' },
      { label: 'Active Assigned', value: 'Active Assigned' },
      { label: 'Suspend Assigned', value: 'Suspend Assigned' },
      { label: 'Inactive Unassigned', value: 'Inactive Unassigned' },
    ],
    siM1Status: [
      { label: 'Unassigned', value: 'Unassigned' },
      { label: 'Assigned', value: 'Assigned' },
      { label: 'Activation ready', value: 'Activation ready' },
      { label: 'Suspend', value: 'Suspend' },
      { label: 'Archive', value: 'Archive' },
      { label: 'Damage', value: 'Damage' },
      { label: 'Activating', value: 'Activating' },
      { label: 'Deactivating', value: 'Deactivating' },
      { label: 'Test Ready', value: 'Test Ready' },
      { label: 'Automatic Activation', value: 'Automatic Activation' },
      { label: 'Activated', value: 'Activated' },
      { label: 'Deactivated', value: 'Deactivated' },
    ],
    siM2Status: [
      { label: 'Unassigned', value: 'Unassigned' },
      { label: 'Assigned', value: 'Assigned' },
      { label: 'Activation ready', value: 'Activation ready' },
      { label: 'Suspend', value: 'Suspend' },
      { label: 'Archive', value: 'Archive' },
      { label: 'Damage', value: 'Damage' },
      { label: 'Activating', value: 'Activating' },
      { label: 'Deactivating', value: 'Deactivating' },
      { label: 'Test Ready', value: 'Test Ready' },
      { label: 'Automatic Activation', value: 'Automatic Activation' },
      { label: 'Activated', value: 'Activated' },
      { label: 'Deactivated', value: 'Deactivated' },
    ],
    wifiStatus: [
      { label: 'Connected', value: 'connected' },
      { label: 'Disconnected', value: 'disconnected' },
    ],
  };

  // Store selected values for all columns
  selectedStatusValues: Record<string, string[]> = {};
  currentFilters: any[] = [];
  private readonly FILTER_STORAGE_KEY = 'deviceListFilters';
  private readonly GLOBAL_SEARCH_KEY = 'deviceListGlobalSearch';

  @ViewChild('dt') dt!: Table;

  constructor(private deviceService: DeviceService) {}

ngOnInit() {
  // ⬇️ Restore filters
  const savedFilters = localStorage.getItem(this.FILTER_STORAGE_KEY);
  if (savedFilters) {
    try {
      this.currentFilters = JSON.parse(savedFilters);
      this.restoreSelectedStatusValues(this.currentFilters);
      setTimeout(() => {
        this.restoreInputFilters(this.currentFilters);
      });
    } catch (e) {
      console.error('Error parsing saved filters:', e);
    }
  }

  // ⬇️ Restore global search text
  const savedSearch = localStorage.getItem(this.GLOBAL_SEARCH_KEY);
  if (savedSearch) {
    this.globalSearchText = savedSearch;
  }

  this.loadDevices({
    first: 0,
    rows: 10,
    filters: this.buildPrimeNgFilters(this.currentFilters),
  });
}


  // 🔹 Restore dropdown selected values based on filters
  private restoreSelectedStatusValues(filters: any[]) {
    this.selectedStatusValues = {}; // reset

    filters.forEach((f) => {
      if (!this.selectedStatusValues[f.MatchField]) {
        this.selectedStatusValues[f.MatchField] = [];
      }
      this.selectedStatusValues[f.MatchField].push(f.SearchText);
    });
    /*{
      deviceStatusName: ["active","inactive"],
      routerStatus: ["online"]
    } */
  }

  private restoreInputFilters(filters: any[]) {
    if (!this.dt) return;

    const tableFilters: any = {};

    filters.forEach((f) => {
      if (!this.statusColumns.includes(f.MatchField)) {
        // If filter already exists for the field, push multiple values
        if (!tableFilters[f.MatchField]) {
          tableFilters[f.MatchField] = { value: [], matchMode: f.MatchMode };
        }
        tableFilters[f.MatchField].value.push(f.SearchText);
      }
    });

    // Set the table's internal filters
    for (const field of Object.keys(tableFilters)) {
      const filterMeta = tableFilters[field];
      // PrimeNG expects a single value for text/date filters
      this.dt.filter(
        filterMeta.value.length === 1 ? filterMeta.value[0] : filterMeta.value,
        field,
        filterMeta.matchMode
      );
    }
  }

  // ⬇️ When status changes
  onStatusChange(field: string, selected: string[] | null) {
    // Convert null to empty array
    this.selectedStatusValues[field] = selected || [];

    // Remove existing filters for this field
    this.currentFilters = this.currentFilters.filter(
      (f) => f.MatchField !== field
    );

    // Add back filters if any selected
    if (this.selectedStatusValues[field].length > 0) {
      const newFilters = this.selectedStatusValues[field].map((v: any) => ({
        SearchText: v,
        MatchField: field,
        MatchMode: 'equals',
      }));
      this.currentFilters.push(...newFilters);
    }
    localStorage.setItem(
      this.FILTER_STORAGE_KEY,
      JSON.stringify(this.currentFilters)
    );

    // Always reload with currentFilters, even if empty
    this.loadDevices({
      first: 0,
      rows: 10,
      filters: this.buildPrimeNgFilters(this.currentFilters),
    });
  }

  // Helper: build PrimeNG filters object from flat array
  private buildPrimeNgFilters(filters: any[]) {
    return filters.reduce((acc, f) => {
      if (!acc[f.MatchField]) {
        acc[f.MatchField] = { value: [], matchMode: f.MatchMode };
      }
      acc[f.MatchField].value.push(f.SearchText);
      return acc;
    }, {} as any);
    /*  deviceStatusName: { value: ["active"], matchMode: "equals" }, */
  }

loadDevices(event: TableLazyLoadEvent) {
  this.loading = true;

  const pageIndex = (event.first ?? 0) / (event.rows ?? 10);
  const pageSize = event.rows ?? 10;

  // existing filter building
  let filters: any[] = [...this.currentFilters];
  if (event.filters) {
    for (const field of Object.keys(event.filters)) {
      const filterMeta = (event.filters as any)[field];
      filters = filters.filter((f) => f.MatchField !== field);

      if (filterMeta && filterMeta.value != null && filterMeta.value !== '') {
        if (Array.isArray(filterMeta.value)) {
          filters.push(
            ...filterMeta.value.map((v: any) => ({
              SearchText: v,
              MatchField: field,
              MatchMode: filterMeta.matchMode,
            }))
          );
        } else {
          let value = filterMeta.value;
          if (value instanceof Date) {
            const year = value.getFullYear();
            const month = (value.getMonth() + 1).toString().padStart(2, '0');
            const day = value.getDate().toString().padStart(2, '0');
            value = `${year}-${month}-${day}`;
          }

          filters.push({
            SearchText: value,
            MatchField: field,
            MatchMode: filterMeta.matchMode,
          });
        }
      }
    }
  }

  this.currentFilters = filters;
  localStorage.setItem(this.FILTER_STORAGE_KEY, JSON.stringify(this.currentFilters));

  this.deviceService.getDevices(
    1, // customerAccountId
    pageIndex,
    pageSize,
    filters,
    this.globalSearchText // 👈 send here
  ).subscribe({
    next: (data: any) => {
      this.customers = data;
      if (data.length > 0 && data[0].totalRows) {
        this.totalRecords = data[0].totalRows;
      }
      this.loading = false;
    },
    error: () => (this.loading = false),
  });
}
globalSearchText: string = '';

onGlobalSearch() {
  localStorage.setItem(this.GLOBAL_SEARCH_KEY, this.globalSearchText); // ✅ Save
  this.loadDevices({
    first: 0,
    rows: 10,
    filters: this.buildPrimeNgFilters(this.currentFilters),
  });
}


clearGlobalSearch() {
  this.globalSearchText = '';
  localStorage.removeItem(this.GLOBAL_SEARCH_KEY); // ✅ Clear
  this.loadDevices({
    first: 0,
    rows: 10,
    filters: this.buildPrimeNgFilters(this.currentFilters),
  });
}


}
