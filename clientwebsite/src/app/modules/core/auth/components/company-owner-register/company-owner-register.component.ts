import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Attachment } from 'src/app/modules/shared/models/attachment';
import { Subscription } from 'src/app/modules/shared/models/subscription';
import { AttachmentService } from '../../../services/attachment.service';

import { ErrorService } from '../../../services/error.service';
import { SubscriptionService } from '../../../services/subscription.service';

import { AuthResponseData, AuthService } from '../../auth.service';

import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Terms } from 'src/app/modules/shared/models/terms';
import { TermsService } from '../../../services/terms.service';
import { SiteInfo } from 'src/app/modules/shared/models/site-info';
import { LocalStorageServiceService } from '../../../services/local-storage-service.service';

@Component({
  selector: 'app-company-owner-register',
  templateUrl: './company-owner-register.component.html',
  styleUrls: ['./company-owner-register.component.scss'],
})
export class CompanyOwnerRegisterComponent implements OnInit {
  @ViewChild('dropFiles', { static: false }) fileDropEl!: ElementRef;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  index = 0;
  logo: any = null;
  logoUrl: string = 'https://dummyimage.com/400x200/f9f9f9/aaa';
  attachments: any[] = [];
  numberOfFiles!: number;
  isRegistered: boolean = false;
  subscription!: Subscription;
  user!: AuthResponseData;
  model: any[] = [];
  listOfRequiredAttachments!: any[];
  completed: boolean = false;
  terms!: Terms;
  acceptTerms: boolean = false;
  site!: SiteInfo;

  /* ----------------------------------- map ---------------------------------- */
  latitude!: number;
  longitude!: number;
  zoom!: number;
  address!: string;
  private geoCoder!: any;

  @ViewChild('search')
  public searchElementRef!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private AuthService: AuthService,
    private messageService: MessageService,
    private attachmentService: AttachmentService,
    private subscriptionService: SubscriptionService,
    private errorServices: ErrorService,
    private ref: ChangeDetectorRef,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private termsService: TermsService,
    private localService: LocalStorageServiceService
  ) {
    /* ---------------------------- build first Form ---------------------------- */
    this.firstFormGroup = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      phoneNumber: [null, [Validators.required]],
      fullName: [null, [Validators.required, Validators.minLength(2)]],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      employeesNumbers: [null, [Validators.required, Validators.min(10)]],
      city: [null, [Validators.required]],
      mapUrl: [null],
      website: [null],
      skillIdList: this.fb.array([]),
    });

    /* ---------------------------- build second Form --------------------------- */
    this.secondFormGroup = this.fb.group({
      logo: [null, Validators.required],
      files: [null, Validators.required],
    });

    this.site = this.localService.SiteSettings;
  }

  ngOnInit() {
    /* -------------------------- get subscription type ------------------------- */
    this.subscriptionService.getAll();
    this.subscriptionService.getUpdates().subscribe(
      (data: any) => {
        this.subscription = data.find(
          (d: Subscription) => d.subscriptionType?.id == 1
        );

        this.subscriptionService
          .getAttachmentBySubscriptionId(1)
          .subscribe((data) => {
            data;

            this.listOfRequiredAttachments = data;
            this.numberOfFiles = this.listOfRequiredAttachments.length;
          });
      },
      (err) => this.errorServices.handleError(err)
    );

    /* ----------------------------- map search set ----------------------------- */
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  /* ------------------------- forms controls getters ------------------------- */

  public get Name(): FormControl {
    return this.firstFormGroup.get('name') as FormControl;
  }

  public get FullName(): FormControl {
    return this.firstFormGroup.get('fullName') as FormControl;
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

  /* --------------------- on submit for first slide form --------------------- */

  onNextPressed(btn: HTMLButtonElement) {
    if (!this.isRegistered) {
      if (this.firstFormGroup.valid) {
        this.subscription.subscriptionType.id;

        let formValue = this.firstFormGroup.value;
        let model = {
          subscriptionTypeId: this.subscription.subscriptionType.id,
          companyDto: {
            id: 0,
            name: formValue.name,
            email: formValue.email,
            employeesNumbers: formValue.employeesNumbers,
            city: formValue.city,
            website: formValue.website,
            phoneNumber: formValue.phoneNumber,
            mapUrl: formValue.mapUrl,
            logo: '',
          },
          skillIdList: formValue.skillIdList,
        };

        this.AuthService.registerCompanyOwner(model).subscribe(
          (data) => {
            btn.click();

            this.user = data;
            this.isRegistered = true;
          },
          (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ في الاتصال',
              detail: 'رجاء تحقق من اتصال الانترنت',
            });
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
    this.attachments;

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

      ('after Convert');

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

  /* ----------------------------------- map ---------------------------------- */
  // Get Current Location Coordinates
  public setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude: any, longitude: any) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: any) => {
        results;
        status;
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 12;
            this.address = results[0].formatted_address;
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
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
