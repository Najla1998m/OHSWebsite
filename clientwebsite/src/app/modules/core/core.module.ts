import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PrimengModule } from './primeng.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MartialModule } from './matrial.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoaderComponent } from './components/loader/loader.component';
import { FileCardComponent } from './components/file-card/file-card.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { HintComponent } from './components/hint/hint.component';
import { AgmCoreModule } from '@agm/core';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    LoaderComponent,
    FileCardComponent,
    HintComponent,
    DynamicFormComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: false,
    }),
    AngularSvgIconModule.forRoot(),
    CarouselModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    PrimengModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      closeButton: true,
      enableHtml: true,
    }),
    MartialModule,
    NgxSpinnerModule,
    NgxChartsModule,
    NgxPaginationModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBCEaE6r5iGZmOQVyu_4TwKXenaTyWfMh8&region=SA&language=ar',
      libraries: ['places', 'drawing'],
    }),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
  ],
  providers: [ToastrService],
  exports: [
    TranslateModule,
    FooterComponent,
    NavbarComponent,
    AngularSvgIconModule,
    CarouselModule,
    ReactiveFormsModule,
    FormsModule,
    PrimengModule,
    ToastrModule,
    MartialModule,
    NgxSpinnerModule,
    LoaderComponent,
    FileCardComponent,
    NgxChartsModule,
    NgxPaginationModule,
    HintComponent,
    AgmCoreModule,
    DynamicFormComponent,
    BsDatepickerModule,
    TimepickerModule,
  ],
})
export class CoreModule {}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
