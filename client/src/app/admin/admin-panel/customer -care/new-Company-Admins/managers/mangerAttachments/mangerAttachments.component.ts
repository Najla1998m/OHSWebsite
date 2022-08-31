import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Department } from 'src/app/admin/models/Department';
import { Roles } from 'src/app/shared/enum/roles';
import { CompanyAdminService } from '../../companyAdmin.service';
import { AttachCompanyService } from '../../companyAttachments/attachCompany.service';

@Component({
  selector: 'app-mangerAttachments',
  templateUrl: './mangerAttachments.component.html',
  styleUrls: ['./mangerAttachments.component.css'],
})
export class MangerAttachmentsComponent implements OnInit {
  listAttach: any[] = [];
  listRejects: any[] = [];
  displayReject: boolean = false;
  displayAccept: boolean = false;
  listDepts: any[] = [];
  userDept!: any;
  rejectForm: FormGroup;
  acceptForm: FormGroup;
  role!: any;
  @ViewChild(FormGroupDirective) form: FormGroupDirective;
  userId: any;
  taskId: any;
  constructor(
    private attachService: AttachCompanyService,
    private CompanyAdmin: CompanyAdminService,
    private ar: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.ar.params.subscribe((res: any) => {
      this.userId = res.id;

      //userdetals
      this.CompanyAdmin.getUserDetails(this.userId).subscribe((res: any) => {
        this.userDept = res?.user;
        this.role = res?.user.userRoles[0].name;
        console.log(this.role);
      });

      this.attachService.getAttachments(this.userId);
      this.attachService.getUpdates().subscribe((res: any) => {
        this.listAttach = res.attachments;
        this.taskId = res.id;
      });
    });

    this.attachService.getRejectReasons().subscribe((res: any) => {
      this.listRejects = [...res];
    });

    this.CompanyAdmin.getAllDepts().subscribe((res: any) => {
      this.listDepts = [...res];
    });

    this.rejectForm = this.fb.group({
      rejectReason: [null, [Validators.required]],
      subscriptionTypeAttachmentList: [[], Validators.required],
    });

    this.acceptForm = this.fb.group({
      correspondingDeptId: [null, [Validators.required]],
    });
  }

  public get CorrespondingDeptId(): FormControl {
    return this.acceptForm.get('correspondingDeptId') as FormControl;
  }

  public get RejectReason(): FormControl {
    return this.rejectForm.get('rejectReason') as FormControl;
  }
  public get Attach(): FormControl {
    return this.rejectForm.get('subscriptionTypeAttachmentList') as FormControl;
  }

  showReject() {
    this.displayReject = !this.displayReject;
  }

  showAccept() {
    if (this.role != Roles[12]) {
      this.attachService.acceptUser(this.userId, true);
      this.resetForm();
      return;
    }

    this.displayAccept = !this.displayAccept;
  }

  AcceptAttach() {
    let isActive = true;
    this.userDept.userDepartments[0].correspondingDeptId =
      this.CorrespondingDeptId.value;

    this.userDept.userDepartments[0].companyId = this.userDept.company.id;
    this.CompanyAdmin.UpdateUser(
      this.userDept.userDepartments[0].id,
      this.userDept.userDepartments[0]
    ).subscribe((res) => {
      this.attachService.acceptUser(this.userId, isActive);
      this.resetForm();
    });
  }
  rejectAttach() {
    let model = this.rejectForm.value;
    model.taskId = this.taskId;

    this.attachService.RejectAttachments(model);
    this.resetForm();
  }

  resetForm() {
    this.form.resetForm();
    this.displayReject = false;
    this.displayAccept = false;
  }
}
