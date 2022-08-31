import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CompanyAdminService } from '../company-admin.service';
import { Role } from '../../models/role.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  @ViewChild('dt') table: Table;
  users: User[];
  selectedUsers: User[];
  user: User;
  productDialog: boolean;
  submitted: boolean;
  pageNumber = 1;
  pageSize = 5;
  totalCount = 0;
  loading = false;

  dropdownList: Role[] = [];
  selectedItems: any = [];
  dropdownSettings = {};

  constructor(
    private companyService: CompanyAdminService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.companyService.getRoles().subscribe((resData) => {
      this.dropdownList = resData;
    });
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
  editUser(user: User) {
    this.user = { ...user };
    this.selectedItems = user.userRoles;
    this.productDialog = true;
  }
  deleteUser(user: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.username + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
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
  saveUser() {
    this.submitted = true;
    if (this.user && !this.user.id) {
      this.companyService.createUser(this.user).subscribe((response) => {
        this.productDialog = false;
        this.user = {} as User;
        this.users.push(response);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000,
        });
      });
      return;
    }
    this.companyService.updateUser(this.user).subscribe((response) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Product Updated',
        life: 3000,
      });
    });
    this.users[this.findIndexById(this.user.id)] = this.user;
    this.users = [...this.users];
    this.productDialog = false;
    this.user = {} as User;
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
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }
  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users = this.users.filter(
          (val) => !this.selectedUsers.includes(val)
        );
        this.user = null;
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
    this.user = {} as User;
    this.submitted = false;
    this.productDialog = true;
  }
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
  loadUsers(event: {
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
    this.companyService
      .getUsers(
        this.pageNumber,
        this.pageSize,
        event.multiSortMeta != null ? event.multiSortMeta[0].order : 1,
        event.multiSortMeta != null ? event.multiSortMeta[0].field : '',
        event.globalFilter != null ? event.globalFilter : ''
      )
      .subscribe((response) => {
        this.loading = false;
        this.users = response.items;
        this.totalCount = response.totalItems;
        console.log(response);
      });
  }
}
