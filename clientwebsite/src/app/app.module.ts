import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CoreModule } from './modules/core/core.module';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { HeaderComponent } from './pages/home/header/header.component';
import { HeaderCardComponent } from './pages/home/header/header-card/header-card.component';
import { AboutOhsComponent } from './pages/home/about-ohs/about-ohs.component';
import { SubscriptionsComponent } from './pages/home/subscriptions/subscriptions.component';
import { SubjectsComponent } from './pages/home/subjects/subjects.component';
import { SubjectCardComponent } from './pages/home/subjects/subject-card/subject-card.component';
import { CommonQuestionsComponent } from './pages/home/common-questions/common-questions.component';

import { PackagesComponent } from './pages/packagesPage/packages.component';
import { PackageCardComponent } from './pages/packagesPage/package-card/package-card.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { UploadAttachmentsComponent } from './pages/upload-attachments/upload-attachments.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LoaderInterceptor } from './modules/core/auth/loaderInterceptor.service';
import { AuthInterceptorService } from './modules/core/auth/auth-interceptor.service';
import { PdfmakeService } from 'ng-pdf-make';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    HeaderComponent,
    HeaderCardComponent,
    AboutOhsComponent,
    SubscriptionsComponent,
    SubjectsComponent,
    SubjectCardComponent,
    CommonQuestionsComponent,
    PackagesComponent,
    PackageCardComponent,
    NotFoundComponent,
    UploadAttachmentsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      isolate: false,
    }),
    CoreModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    PdfmakeService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
