import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AdminService } from '../../admin.service';
import { Role } from '../../models/role.model';
import { User } from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit {
  @ViewChild('dt') table: Table;
  @ViewChild('roleForm') roleForm: NgForm;
  // users: User[];
  selectedRoles: Role[];
  // user: User;
  productDialog: boolean;
  submitted: boolean;
  pageNumber = 1;
  pageSize = 5;
  totalCount = 0;
  loading = false;

  roles: Role[] = [];
  role: Role = {} as Role;
  selectedItems: any = [];
  dropdownSettings = {};

  selectedParentRole: Role;

  parentRoles: Role[];

  constructor(
    private adminService: AdminService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.adminService.getParentRoles().subscribe((resData: Role[]) => {
      this.parentRoles = resData;
    });
    this.adminService.getChildRoles().subscribe((response) => {
      this.loading = false;
      this.roles = response;
      // this.users = response.items;
      this.totalCount = response.length;
      console.log(response);
    });
    // this.adminService.getRoles().subscribe(resData => {
    //   this.dropdownList = resData;
    // });

    // this.dropdownList = [
    //   { item_id: 1, item_text: 'Mumbai' },
    //   { item_id: 2, item_text: 'Bangaluru' },
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' },
    //   { item_id: 5, item_text: 'New Delhi' }
    // ];
    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' }
    // ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  editRole(role: Role) {
    this.selectedParentRole = this.parentRoles.find(
      (s) => s.id == role.parentId
    );
    this.role = { ...role };
    // this.selectedItems=user.userRoles;
    this.productDialog = true;
  }
  deleteRole(role: Role) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + role.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.adminService.deleteRole(role).subscribe(
          (response) => {
            let s = this.roles;
          },
          (error) => {}
        );
        this.roles = this.roles.filter((s) => s.id != role.id);
        this.totalCount = this.roles.length;
        // this.products = this.products.filter(val => val.id !== product.id);
        // this.product = {};
        // this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
      },
    });
  }
  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }
  saveRole() {
    if (!this.role.name) return;

    this.role.name = this.roleForm.value.role;
    this.role.parentId = this.selectedParentRole?.id;
    this.submitted = true;
    if (this.role && !this.role.id) {
      this.adminService.createRole(this.role).subscribe(
        (response) => {
          this.productDialog = false;
          this.role = {} as Role;
          this.roles.push(response);
          this.totalCount = this.roles.length;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Created',
            life: 3000,
          });
        },
        (error: HttpErrorResponse) => {
          let errMsg = error.error[0].description;
          this.toastr.error(errMsg);
        }
      );
      return;
    }
    this.adminService.updateRole(this.role).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000,
        });
      },
      (error: HttpErrorResponse) => {
        let errMsg = error.error[0].description;
        this.toastr.error(errMsg);
      }
    );
    this.roles[this.findIndexById(this.role.id)] = this.role;
    this.roles = [...this.roles];
    this.productDialog = false;
    this.role = {} as Role;
    // if (this.product.name.trim()) {
    //     if (this.product.id) {
    //         this.products[this.findIndexById(this.product.id)] = this.product;
    //         this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
    //     }
    //     else {
    //         this.product.id = this.createId();
    //         this.product.image = 'product-placeholder.svg';
    //         this.products.push(this.product);
    //         this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
    //     }

    //     this.products = [...this.products];
    //     this.productDialog = false;
    //     this.product = {};
    // }
  }
  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }
  deleteSelectedRoles() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roles = this.roles.filter(
          (val) => !this.selectedRoles.includes(val)
        );
        this.role = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000,
        });
      },
    });
  }
  openNew() {
    this.role = {} as Role;
    this.submitted = false;
    this.productDialog = true;
  }
  onChangeRole(role: Role) {}
  filterGlobal($event: any, val: string) {
    this.table.filterGlobal(
      (<HTMLInputElement>$event.target).value,
      'contains'
    );
  }
  onPage(event: any) {
    let pageIndex = event.first / event.rows + 1;
  }
  loadCarsLazy(event: any) {}
  loadRoles(event: {
    filters: any;
    first: number;
    globalFilter: any;
    multiSortMeta: { field: string; order: number }[];
    rows: number;
    sortField: string;
  }) {
    console.log(event);
    this.loading = true;
    this.pageNumber = event.first / event.rows + 1;
    this.adminService.getChildRoles().subscribe((response) => {
      this.loading = false;
      this.roles = response;
      // this.users = response.items;
      this.totalCount = response.length;
      console.log(response);
    });
  }
}
