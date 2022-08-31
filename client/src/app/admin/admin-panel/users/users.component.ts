import { Department } from './../../models/Department';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AdminService } from '../../admin.service';
import { Role } from '../../models/role.model';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/Auth/Auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  @ViewChild('dt') table: Table;
  @ViewChild('userForm') userForm: NgForm;
  formUserGroup: FormGroup;
  users: User[];
  selectedUsers: User[];
  user: User;
  productDialog: boolean;
  submitted: boolean;
  pageNumber = 1;
  pageSize = 5;
  totalCount = 0;
  loading = false;
  addUserDeptForm: FormGroup;
  roles: Role[] = [];
  selectedUserRoles: any = [];
  dropdownSettings = {};
  displayForm: boolean = false;
  userRoles: Role[] = [];
  listDepts: Department[];
  departments: any[];
  selectedDepartments: any[];
  userDepartements: any[];
  userId: any;
  constructor(
    private adminService: AdminService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.adminService.getChildRoles().subscribe((resData) => {
      this.roles = resData;
    });

    this.adminService.getDepartments().subscribe((resData) => {
      this.departments = resData;
      console.log(this.departments, 'depts');
    });
    this.addUserDeptForm = this.fb.group({
      departementId: [null, [Validators.required]],
    });

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
  onItemSelect(item: any, userId: string) {
    this.userRoles.push(item);
  }
  onSelectAll(items: any, userId: string) {
    this.userRoles.push(...items);
  }
  onUnSelectRole($event: any) {
    let index = this.userRoles.findIndex((s) => s.name == $event.name);
    this.userRoles.splice(index, 1);
  }
  onDepartementSelect(item: any, userId: string) {
    this.userDepartements.push(item);
  }
  onSelectAllDepartement(items: any, userId: string) {
    this.userDepartements.push(...items);
  }
  onUnSelectDepartement($event: any) {
    let index = this.userDepartements.findIndex((s) => s.name == $event.name);
    this.userDepartements.splice(index, 1);
  }

  editUser(user: User) {
    this.userRoles = [];
    this.userDepartements = [];
    this.selectedDepartments = [];
    this.selectedUserRoles = [];
    this.user = { ...user };
    this.selectedUserRoles = user.userRoles;
    this.userRoles.push(...user.userRoles);
    this.selectedDepartments = user.userDepartments;
    this.userDepartements.push(...user.userDepartments);
    this.productDialog = true;
  }
  deleteUser(user: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.username + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.adminService.deleteUser(user.id).subscribe((response) => {
          if (response) {
            this.users = this.users.filter((s) => s.id != user.id);
            this.totalCount = this.users.length;
          }
        });

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
    this.userForm.value;
    if (!this.userForm.valid) return;

    this.submitted = true;
    this.user.userRoles = this.userRoles;
    this.user.userDepartments = this.userDepartements;
    if (this.user && !this.user.id) {
      this.adminService.createUser(this.user).subscribe(
        (response) => {
          this.productDialog = false;
          this.user = {} as User;
          this.users.push(response);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Created',
            life: 3000,
          });
        },
        (error: HttpErrorResponse) => {
          if (typeof error.error == 'string') {
            this.toastr.error(error.error);
          }

          error.error.forEach((errMsg: any) => {
            this.toastr.error(errMsg.description);
          });
        }
      );
      return;
    }
    this.user.password = 'password';
    this.adminService.updateUser(this.user).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000,
        });
      },
      (error) => {}
    );
    this.users[this.findIndexById(this.user.id)] = this.user;
    this.users = [...this.users];
    this.productDialog = false;
    this.user = {} as User;
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
        let usersId = this.selectedUsers;
        // this.users = this.users.filter(
        //   (val) => !this.selectedUsers.includes(val)
        // );
        // this.user = null;
        // this.messageService.add({
        //   severity: 'success',
        //   summary: 'Successful',
        //   detail: 'Products Deleted',
        //   life: 3000,
        // });
      },
    });
  }
  openNew() {
    this.user = {} as User;
    this.selectedUserRoles = [];
    this.userRoles = [];
    this.selectedDepartments = [];
    this.userDepartements = [];
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
    this.adminService.getUsers().subscribe((response: any) => {
      console.log(response);

      this.loading = false;
      this.users = response;

      this.totalCount = response.totalItems;
      console.log(response);
    });
  }

  isManger(id: any, check: HTMLInputElement) {
    this.adminService.userIsManger(id, check.checked).subscribe(
      (res: any) => {
        console.log(res);

        Swal.fire('Added', '', 'success');
        this.adminService.getUsers().subscribe((res: any) => {
          this.users = res;
        });
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(error.error);
      }
    );
  }

  addDepartment(user: User) {
    console.log(user);
    this.userId = user.id;
    this.listDepts = user.userDepartments;
    this.displayForm = true;
  }

  addUserIndepts() {
    let model = this.addUserDeptForm.value;
    // model.userId=this.userId;
    console.log(model.departementId);
    this.adminService
      .addUserInDept(model.departementId, this.userId)
      .subscribe((res) => {
        Swal.fire('Added ', '', 'success');
        this.displayForm = false;
        this.adminService.getUsers().subscribe((res: any) => {
          this.users = res;
        });
      });
  }
}
