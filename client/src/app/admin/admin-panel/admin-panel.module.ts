import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimeNGModule } from 'src/app/primeng.module';
import { SharedModule } from 'src/app/shared.module';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminPanelComponent } from './admin-panel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { UsersComponent } from './users/users.component';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { UserItemComponent } from './users/user-item/user-item.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { RolesComponent } from './roles/roles.component';
import { ToastrModule } from 'ngx-toastr';
import { PageCardComponent } from './static-pages/page-card/page-card.component';
import { AddStaticPageComponent } from './static-pages/add-static-page/add-static-page.component';
import { EditStaticPageComponent } from './static-pages/edit-static-page/edit-static-page.component';
import { StaticPagesComponent } from './static-pages/static-pages.component';
import { QuestionsComponent } from './General Settings/questions/questions.component';
import { SliderComponent } from './General Settings/Slider/Slider.component';
import { PackagesComponent } from './General Settings/package/package.component';
import { ClientsComponent } from './General Settings/clients/clients.component';
import { SiteSettingsComponent } from './General Settings/site-settings/site-settings.component';
import { StaticSliderBlockComponent } from './General Settings/static-slider-block/static-slider-block.component';
import { DepartmentComponent } from './common-pages/department/department/department.component';
import { DepartmentDetailsComponent } from './common-pages/department/department-details/department-details.component';
import { ProductsComponent } from './common-pages/products/products.component';
import { CategoryComponent } from './common-pages/category/category.component';
import { SubCategoryComponent } from './common-pages/sub-category/sub-category.component';
import { SignupRejectReasonsComponent } from './General Settings/Signup-Reject-Reasons/Signup-Reject-Reasons.component';
import { SkillsComponent } from './common-pages/Skills/Skills.component';
import { NotificationComponent } from './customer -care/notification/notification.component';
import { ContactUsMessagesComponent } from './customer -care/Contact-Us-Messages/Contact-Us-Messages.component';
import { ManagementsComponent } from './common-pages/Managements/Managements.component';
import { TeamsComponent } from './Teams/Teams.component';
import { TaskLevelsComponent } from './common-pages/Task-Levels/Task-Levels.component';
import { TaskStatusComponent } from './common-pages/Task-Status/Task-Status.component';
import { SubscriptionTypesComponent } from './common-pages/Subscription-Types/Subscription-Types.component';
import { CreateSubscriptionTermComponent } from './common-pages/Subscription-Types/CreateSubscription-term/CreateSubscription-term.component';
import { EditSubscriptionTermComponent } from './common-pages/Subscription-Types/editSubscriptionTerm/editSubscriptionTerm.component';
import { AttachmentComponent } from './common-pages/Subscription-Types/Attachment/attachment/attachment.component';
import { PackageDetailsComponent } from './General Settings/package/packageDetails/packageDetails.component';
import { MainFormsComponent } from './Website Forms/Main-Forms/Main-Forms.component';
import { FormFieldTypesComponent } from './Website Forms/Form-Field-Types/Form-Field-Types.component';
import { FormDropDownsComponent } from './Website Forms/Form-Drop-Downs/Form-Drop-Downs.component';
import { FormFieldsComponent } from './Website Forms/Form-Fields/Form-Fields.component';
import { FormsButtonsComponent } from './General Settings/formsButtons/formsButtons.component';
import { OptionsSetItemComponent } from './Website Forms/Form-Drop-Downs/OptionsSetItem/OptionsSetItem.component';
import { MangementDetailsComponent } from './common-pages/Managements/mangementDetails/mangementDetails.component';
import { TeamDetailsComponent } from './Teams/teamDetails/teamDetails.component';
import { NewCompanyAdminsComponent } from './customer -care/new-Company-Admins/new-Company-Admins.component';
import { NewIndividualVendorsComponent } from './customer -care/new-Individual-Vendors/new-Individual-Vendors.component';
import { NewCompanyVendorsComponent } from './customer -care/new-Company-Vendors/new-Company-Vendors.component';
import { CompanyDepartmentsComponent } from './customer -care/new-Company-Admins/companyDepartments/companyDepartments.component';
import { CompanyAttachmentsComponent } from './customer -care/new-Company-Admins/companyAttachments/companyAttachments.component';
import { VendorAttachmentsComponent } from './customer -care/new-Company-Vendors/vendorAttachments/vendorAttachments.component';
import { VendorDepartmentsComponent } from './customer -care/new-Company-Vendors/vendorDepartments/vendorDepartments.component';
import { ManagersComponent } from './customer -care/new-Company-Admins/managers/managers.component';
import { MangerAttachmentsComponent } from './customer -care/new-Company-Admins/managers/mangerAttachments/mangerAttachments.component';
import { VendorMangersComponent } from './customer -care/new-Company-Vendors/VendorMangers/VendorMangers.component';
import { VendorMangerAttachmentsComponent } from './customer -care/new-Company-Vendors/VendorMangers/VendorMangerAttachments/VendorMangerAttachments.component';
import { IndividualDepartmentComponent } from './customer -care/new-Individual-Vendors/individualDepartment/individualDepartment.component';
import { IndividualAttachmentsComponent } from './customer -care/new-Individual-Vendors/individualAttachments/individualAttachments.component';
import { IndividualManagersComponent } from './customer -care/new-Individual-Vendors/individualManagers/individualManagers.component';
import { IndividualManagerAttachmentComponent } from './customer -care/new-Individual-Vendors/individualManagers/IndividualManagerAttachment/IndividualManagerAttachment.component';
import { PollItemsComponent } from './common-pages/Poll-Items/Poll-Items.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AdminPanelComponent,
    DashboardComponent,
    UsersComponent,
    UserDetailsComponent,
    UserItemComponent,
    UserListComponent,
    RolesComponent,
    PageCardComponent,
    AddStaticPageComponent,
    EditStaticPageComponent,
    StaticPagesComponent,
    QuestionsComponent,
    SliderComponent,
    PackagesComponent,
    ClientsComponent,
    SiteSettingsComponent,
    StaticSliderBlockComponent,
    DepartmentComponent,
    DepartmentDetailsComponent,
    ProductsComponent,
    CategoryComponent,
    SubCategoryComponent,
    SignupRejectReasonsComponent,
    SkillsComponent,
    NotificationComponent,
    ContactUsMessagesComponent,
    ManagementsComponent,
    TeamsComponent,
    TaskLevelsComponent,
    TaskStatusComponent,
    SubscriptionTypesComponent,
    CreateSubscriptionTermComponent,
    EditSubscriptionTermComponent,
    AttachmentComponent,
    PackageDetailsComponent,
    MainFormsComponent,
    FormFieldTypesComponent,
    FormDropDownsComponent,
    FormFieldsComponent,
    FormsButtonsComponent,
    OptionsSetItemComponent,
    MangementDetailsComponent,
    TeamDetailsComponent,
    NewCompanyAdminsComponent,
    NewIndividualVendorsComponent,
    NewCompanyVendorsComponent,
    CompanyDepartmentsComponent,
    CompanyAttachmentsComponent,
    VendorAttachmentsComponent,
    VendorDepartmentsComponent,
    ManagersComponent,
    MangerAttachmentsComponent,
    VendorMangersComponent,
    VendorMangerAttachmentsComponent,
    IndividualDepartmentComponent,
    IndividualAttachmentsComponent,
    IndividualManagersComponent,
    IndividualManagerAttachmentComponent,
    PollItemsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminPanelRoutingModule,
    PrimeNGModule,
    SharedModule,
    TableModule,
    DropdownModule,
    ToastrModule,
    NgxChartsModule,
  ],
})
export class AdminPanelModule {}
