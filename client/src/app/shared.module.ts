import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MyLoaderComponent } from './my-loader/my-loader.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CKEditorModule } from 'ckeditor4-angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SafeUrlPipe } from './shared/pipes/safeUrl.pipe';
import { ImageConversionPipe } from './shared/pipes/imageConversion.pipe';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SanitizeHtmlPipe } from './shared/pipes/sanitizeHtmlPipe.pipe copy';
@NgModule({
  declarations: [MyLoaderComponent, SafeUrlPipe, ImageConversionPipe,SanitizeHtmlPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    HttpClientModule,
    NgxSpinnerModule,
    CKEditorModule,
    AngularSvgIconModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
    }),
    ReactiveFormsModule,
    RouterModule,
    BsDatepickerModule.forRoot(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: false,
    }),
  ],
  exports: [
    HttpClientModule,
    NgxSpinnerModule,
    MyLoaderComponent,
    NgMultiSelectDropDownModule,
    ToastrModule,
    ReactiveFormsModule,
    RouterModule,
    CKEditorModule,
    SafeUrlPipe,
    ImageConversionPipe,
    AngularSvgIconModule,
    SanitizeHtmlPipe
  ],
})
export class SharedModule {}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
