import { MapsAPILoader, MouseEvent } from '@agm/core';
import {
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
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { AuthResponseData } from 'src/app/modules/core/auth/auth.service';
import { ErrorService } from 'src/app/modules/core/services/error.service';
import { MangmentService } from 'src/app/modules/core/services/mangment.service';
import { UserService } from 'src/app/modules/core/services/user.service';
import { Department } from 'src/app/modules/shared/models/department';
import { Roles } from 'src/app/modules/shared/models/roles';
import { UserDepartments } from 'src/app/modules/shared/models/userDepartments';
import Swal from 'sweetalert2';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
})
export class DepartmentsComponent implements OnInit {
  totalCount!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  Deptlist!: Department[];
  listMangs!: Department[];
  companyId!: number;
  subscriptionTypeId!: number;
  @ViewChild('close') closeModel!: ElementRef;
  form!: FormGroup;
  mangerForm!: FormGroup;
  selectedDept!: Department;
  manager!: AuthResponseData;
  userRole!: any;
  management!: UserDepartments;
  user!: any;
  latitude!: number;
  longitude!: number;
  zoom!: number;
  address!: string;
  private geoCoder!: any;
  selectedAddress!: any;

  @ViewChild('mageModelClose') formClose!: ElementRef;
  @ViewChild('successM') succes!: ElementRef;
  @ViewChild(FormGroupDirective) deptform!: FormGroupDirective;
  @ViewChild('addManger') addManger!: FormGroupDirective;
  @ViewChild('search')
  public searchElementRef!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private deptServic: MangmentService,
    private userService: UserService,
    private handelError: ErrorService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public navigationService: NavigationService
  ) {
    this.form = this.fb.group({
      parentId: [null, [Validators.required]],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      departementLocation: [null, [Validators.required]],
    });

    /* ------------------------------- mangerForm ------------------------------- */
    this.mangerForm = this.fb.group({
      fullName: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      phoneNumber: [null, [Validators.required]],
    });

    this.loadData();
  }

  ngOnInit() {
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

          // this.form
          //   .get('departementLocation')
          //   ?.setValue(JSON.stringify(place.geometry));

          //set latitude, longitude and zoom

          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 14;

          this.Location.setValue(
            JSON.stringify({
              address: this.searchElementRef?.nativeElement.value,
              longitude: this.longitude,
              latitude: this.latitude,
              zoom: this.zoom,
            })
          );
        });
      });
    });
  }

  public get Mangement(): FormControl {
    return this.form.get('parentId') as FormControl;
  }
  public get Name(): FormControl {
    return this.form.get('name') as FormControl;
  }
  public get Location(): FormControl {
    return this.form.get('departementLocation') as FormControl;
  }

  public get FName(): FormControl {
    return this.mangerForm.get('fullName') as FormControl;
  }

  public get Email(): FormControl {
    return this.mangerForm.get('email') as FormControl;
  }

  public get Phone(): FormControl {
    return this.mangerForm.get('phoneNumber') as FormControl;
  }

  onSubmit() {
    if (this.userRole == Roles[12]) {
      this.Mangement.setValue(this.management.id);
    }
    if (this.form.valid) {
      let dept = this.form.value;
      dept.companyId = this.companyId;

      this.deptServic.addDept(dept).subscribe(
        (res) => {
          this.deptServic.getAllDepts(this.companyId);
          this.closeModel.nativeElement.click();
          this.deptform.resetForm();
          Swal.fire('تمت الاضافه بنجاح', '', 'success');
        },
        (error) => {
          this.handelError.handleError(error);
        }
      );
    }
  }

  onSubmit2() {
    if (this.mangerForm.valid) {
      let Manger = this.mangerForm.value;
      Manger.companyId = this.companyId;
      Manger.subscriptionTypeId = this.subscriptionTypeId;
      Manger.departementId = this.selectedDept.id;
      Manger.roleName = Roles[8];

      this.deptServic.addManger(Manger).subscribe((data) => {
        this.manager = data;
        this.addManger.resetForm();
        this.succes.nativeElement.click();
      });
    }
  }

  paginate(event: number) {
    this.pageNumber = event;
  }

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

  getAddress(latitude: any, longitude: any) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: any) => {
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 14;
            this.address = results[0].formatted_address;
            this.searchElementRef.nativeElement.value = this.address;
            this.Location.setValue(
              JSON.stringify({
                address: this.searchElementRef.nativeElement.value,
                longitude: this.longitude,
                latitude: this.latitude,
                zoom: this.zoom,
              })
            );
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  markerDragEnd(event: MouseEvent) {
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  loadData() {
    this.userService.getUserDetails().subscribe((data) => {
      this.user = data;
      this.companyId = data.user.company.id;

      this.userRole = data.user.userRoles[0].name;

      this.management = data.user.userDepartments[0];

      if (this.userRole == Roles[12]) {
        this.deptServic.getAllDepartementsByCompanyIdAndMangmentId(
          this.companyId,
          this.management.id
        );
        this.deptServic.getUpdates().subscribe((data) => {
          this.Deptlist = data;
        });
      } else {
        this.deptServic.getAllDepts(this.companyId);
        this.deptServic.getUpdates().subscribe((data) => {
          this.Deptlist = data;
        });
        this.deptServic
          .getAllManagementByCompanyId(this.companyId)
          .subscribe((data: any) => {
            this.listMangs = data.filter(
              (e: any) => e.correspondingDeptId != 142
            );
          });
      }
    });
  }
}
