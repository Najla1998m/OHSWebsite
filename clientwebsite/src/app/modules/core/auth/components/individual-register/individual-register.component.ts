import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'src/app/modules/shared/models/subscription';
import { Skill } from 'src/app/modules/shared/models/skill';
import { AttachmentService } from '../../../services/attachment.service';
import { SkillsService } from '../../../services/skills.service';
import { AuthResponseData, AuthService } from '../../auth.service';
import { ErrorService } from '../../../services/error.service';
import { SubscriptionService } from '../../../services/subscription.service';

/* ----------------------------------- map ---------------------------------- */
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { SiteInfo } from 'src/app/modules/shared/models/site-info';
import { LocalStorageServiceService } from '../../../services/local-storage-service.service';
import { TermsService } from '../../../services/terms.service';

@Component({
  selector: 'app-individual-register',
  templateUrl: './individual-register.component.html',
  styleUrls: ['./individual-register.component.scss'],
})
export class IndividualRegisterComponent implements OnInit {
  @ViewChild('dropFiles', { static: false }) fileDropEl!: ElementRef;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  index = 0;
  logo: any = null;
  logoUrl: string = 'https://dummyimage.com/400x200/f9f9f9/aaa';
  attachments: any[] = [];
  skills!: Skill[];
  numberOfFiles!: number;
  isRegister: boolean = false;
  subscription!: Subscription;
  user!: AuthResponseData;
  site!: SiteInfo;
  model: any[] = [];
  listOfRequiredAttachments!: any[];
  completed: boolean = false;
  isRegistered: boolean = false;
  terms: any;
  acceptTerms: boolean = false;

  constructor(
    private fb: FormBuilder,
    private skillsService: SkillsService,
    private AuthService: AuthService,
    private router: Router,
    private errorServices: ErrorService,
    private attachmentService: AttachmentService,
    private subscriptionService: SubscriptionService,
    private localService: LocalStorageServiceService,
    private termsService: TermsService
  ) {
    this.firstFormGroup = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      phoneNumber: [null, [Validators.required]],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      city: [null, [Validators.required]],
      skillIdList: this.fb.array([], [Validators.required]),
    });

    this.secondFormGroup = this.fb.group({
      logo: [null, Validators.required],
      files: [null, Validators.required],
    });

    this.secondFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required],
    });

    this.site = this.localService.SiteSettings;
  }

  ngOnInit() {
    /* -------------------------- get subscription type ------------------------- */
    this.subscriptionService.getAll();
    this.subscriptionService.getUpdates().subscribe(
      (data: any) => {
        this.subscription = data.find(
          (d: Subscription) => d.subscriptionType?.id == 3
        );

        this.subscriptionService
          .getAttachmentBySubscriptionId(3)
          .subscribe((data) => {
            this.listOfRequiredAttachments = data;
            this.numberOfFiles = this.listOfRequiredAttachments.length;
          });
      },
      (err) => this.errorServices.handleError(err)
    );

    this.skillsService.getAll();
    this.skillsService.getUpdates().subscribe((data) => {
      this.skills = [...data];
    });
  }

  /**========================================================================
   *?                          Form Controls Getters
   *========================================================================**/

  public get Name(): FormControl {
    return this.firstFormGroup.get('name') as FormControl;
  }

  public get Phone(): FormControl {
    return this.firstFormGroup.get('phoneNumber') as FormControl;
  }

  public get Email(): FormControl {
    return this.firstFormGroup.get('email') as FormControl;
  }

  public get EmployeesNumbers(): FormControl {
    return this.firstFormGroup.get('employeesNumbers') as FormControl;
  }

  public get City(): FormControl {
    return this.firstFormGroup.get('city') as FormControl;
  }

  public get Address(): FormControl {
    return this.firstFormGroup.get('mapUrl') as FormControl;
  }

  public get Website(): FormControl {
    return this.firstFormGroup.get('website') as FormControl;
  }

  /**========================================================================
   *?                           Skills Handler
   *========================================================================**/
  onCheckboxChange(e: any) {
    const checkArray: FormArray = this.firstFormGroup.get(
      'skillIdList'
    ) as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  /**========================================================================
   *?                           slides Forms Submit
   *========================================================================**/

  onNextPressed(btn: HTMLButtonElement) {
    if (!this.isRegistered) {
      if (this.firstFormGroup.valid) {
        let formValue = this.firstFormGroup.value;
        let model = {
          subscriptionTypeId: this.subscription.subscriptionType.id,
          companyDto: {
            id: 1,
            name: formValue.name,
            email: formValue.email,
            city: formValue.city,
            phoneNumber: null,
            employeesNumbers: 100,
            logo: 'https://ohsjoeq.com/Images/Clients/Company Logo_637732728739055661.jfif',
            website: 'https://ohsjoeq.com',
          },

          skillIdList: formValue.skillIdList,
        };

        this.AuthService.registerVendorIndividual(model).subscribe(
          (data) => {
            btn.click();

            this.user = data;
            this.isRegistered = true;
          },
          (err) => {
            this.errorServices.handleError(err);
          }
        );
      }
    } else {
      btn.click();
    }
  }

  onSubmit() {
    this.attachmentService.uploadFiles(this.model).subscribe(() => {
      this.completed = true;
    });
  }

  /**========================================================================
   *?                           Files Handlers
   *========================================================================**/
  async onLogoUploaded(event: any) {
    this.logo = event.target.files[0];

    let image = await this.attachmentService.convertToBase64(this.logo);

    this.model.push({
      image: image.split(',')[1],
      imageUrl: '',
      name: 'Company Logo.' + this.logo.name.split('.').pop(),
      userId: this.user?.id,
      subscriptionTypeAttachmentMappingId:
        this.listOfRequiredAttachments[0].subscriptionTypeAttachmentMappingId,
    });

    this.createImageUrl(this.logo);
  }

  onFilesUploaded(event: any) {
    this.prepareFilesList(event.target.files);
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.attachments.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.attachments[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.attachments[index].progress += 5;
          }
        }, 100);
      }
    }, 1000);
  }

  deleteFile(index: number) {
    if (this.attachments[index].progress < 100) {
      ('Upload in progress.');
      return;
    }
    this.attachments.splice(index, 1);

    this.model.slice(index, 1);
  }

  async prepareFilesList(files: Array<any>) {
    for (let i = 0; i < this.numberOfFiles; i++) {
      files[i].progress = 0;
      let image = await this.attachmentService.convertToBase64(files[i]);

      this.model.push({
        image: image.split(',')[1],
        imageUrl: '',
        name: files[i].name + '.' + files[i].name.split('.').pop(),
        userId: this.user?.id,
        subscriptionTypeAttachmentMappingId:
          this.listOfRequiredAttachments[i].subscriptionTypeAttachmentMappingId,
      });
      this.attachments.push(files[i]);
    }

    this.fileDropEl.nativeElement.value = '';
    this.uploadFilesSimulator(0);
  }
  createImageUrl(image: any) {
    this.logoUrl = URL.createObjectURL(image);
  }

  getTerms(btn: HTMLButtonElement) {
    this.termsService
      .getTermsBySubscriptionId(this.subscription.subscriptionType.id)
      .subscribe((data) => {
        this.terms = data;
        btn.click();
      });
  }
}
