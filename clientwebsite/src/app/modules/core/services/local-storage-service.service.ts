import { Injectable } from '@angular/core';
import { LocalStorageServiceKeys } from '../data/localStoragekeys';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageServiceService {
  constructor() {}

  set UserId(userId: string) {
    localStorage.setItem(LocalStorageServiceKeys.userId, userId);
  }

  get UserId() {
    return localStorage.getItem(LocalStorageServiceKeys.userId)!;
  }

  set CompanyId(companyId: any) {
    localStorage.setItem(LocalStorageServiceKeys.companyId, companyId);
  }

  get CompanyId() {
    return localStorage.getItem(LocalStorageServiceKeys.companyId);
  }

  set UserRole(role: string) {
    localStorage.setItem(LocalStorageServiceKeys.role, role);
  }

  get UserRole() {
    return localStorage.getItem(LocalStorageServiceKeys.role)!;
  }

  set SiteSettings(data: any) {
    localStorage.setItem(LocalStorageServiceKeys.site, JSON.stringify(data));
  }

  get SiteSettings() {
    return JSON.parse(localStorage.getItem(LocalStorageServiceKeys.site)!);
  }

  set DeptId(deptId: number) {
    localStorage.setItem(
      LocalStorageServiceKeys.deptId,
      JSON.stringify(deptId)
    );
  }

  get DeptId() {
    return JSON.parse(localStorage.getItem(LocalStorageServiceKeys.deptId)!);
  }
}
