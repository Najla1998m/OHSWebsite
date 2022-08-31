import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaticPagesComponent } from './static-pages/static-pages.component';
import { AdminPanelComponent } from './admin-panel.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { RolesComponent } from './roles/roles.component';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { UsersComponent } from './users/users.component';
import { AddStaticPageComponent } from './static-pages/add-static-page/add-static-page.component';
import { EditStaticPageComponent } from './static-pages/edit-static-page/edit-static-page.component';
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
import { NewCompanyVendorsComponent } from './customer -care/new-Company-Vendors/new-Company-Vendors.component';
import { NewIndividualVendorsComponent } from './customer -care/new-Individual-Vendors/new-Individual-Vendors.component';
import { CompanyDepartmentsComponent } from './customer -care/new-Company-Admins/companyDepartments/companyDepartments.component';
import { CompanyAttachmentsComponent } from './customer -care/new-Company-Admins/companyAttachments/companyAttachments.component';
import { VendorDepartmentsComponent } from './customer -care/new-Company-Vendors/vendorDepartments/vendorDepartments.component';
import { VendorAttachmentsComponent } from './customer -care/new-Company-Vendors/vendorAttachments/vendorAttachments.component';
import { ManagersComponent } from './customer -care/new-Company-Admins/managers/managers.component';
import { MangerAttachmentsComponent } from './customer -care/new-Company-Admins/managers/mangerAttachments/mangerAttachments.component';
import { VendorMangersComponent } from './customer -care/new-Company-Vendors/VendorMangers/VendorMangers.component';
import { VendorMangerAttachmentsComponent } from './customer -care/new-Company-Vendors/VendorMangers/VendorMangerAttachments/VendorMangerAttachments.component';
import { IndividualDepartmentComponent } from './customer -care/new-Individual-Vendors/individualDepartment/individualDepartment.component';
import { IndividualAttachmentsComponent } from './customer -care/new-Individual-Vendors/individualAttachments/individualAttachments.component';
import { IndividualManagersComponent } from './customer -care/new-Individual-Vendors/individualManagers/individualManagers.component';
import { IndividualManagerAttachmentComponent } from './customer -care/new-Individual-Vendors/individualManagers/IndividualManagerAttachment/IndividualManagerAttachment.component';
import { PollItemsComponent } from './common-pages/Poll-Items/Poll-Items.component';
// import { PackagesComponent } from './General Settings/Packages/Packages.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
        children: [
          {
            path: ':id',
            component: UserDetailsComponent,
          },
        ],
      },
      {
        path: 'roles',
        component: RolesComponent,
      },
      {
        path: 'teams',
        component: TeamsComponent,
      },

      {
        path: 'teams/:id',
        component: TeamDetailsComponent,
      },

      {
        path: 'mangement',
        component: ManagementsComponent,
      },
      {
        path: 'mangement/:id',
        component: MangementDetailsComponent,
      },

      {
        path: 'department',
        component: DepartmentComponent,
      },
      {
        path: 'department/:id',
        component: DepartmentDetailsComponent,
      },
      {
        path: 'static-pages',
        component: StaticPagesComponent,
      },
      {
        path: 'static-pages/add',
        component: AddStaticPageComponent,
      },
      {
        path: 'static-pages/edit/:id',
        component: EditStaticPageComponent,
      },
      {
        path: 'general-settings/site-settings',
        component: SiteSettingsComponent,
      },
      {
        path: 'general-settings/questions',
        component: QuestionsComponent,
      },
      {
        path: 'general-settings/slider',
        component: SliderComponent,
      },
      {
        path: 'general-settings/packages',
        component: PackagesComponent,
      },

      {
        path: 'general-settings/packages/package-details/:id',
        component: PackageDetailsComponent,
      },

      {
        path: 'general-settings/clients',
        component: ClientsComponent,
      },
      {
        path: 'general-settings/reject-reasons',
        component: SignupRejectReasonsComponent,
      },
      {
        path: 'general-settings/static-slide-blocks',
        component: StaticSliderBlockComponent,
      },

      {
        path: 'common-pages/products',
        component: ProductsComponent,
      },
      {
        path: 'common-pages/categories',
        component: CategoryComponent,
      },
      {
        path: 'common-pages/sub-categories',
        component: SubCategoryComponent,
      },
      {
        path: 'common-pages/skills',
        component: SkillsComponent,
      },

      {
        path: 'common-pages/task-levels',
        component: TaskLevelsComponent,
      },
      {
        path: 'common-pages/task-status',
        component: TaskStatusComponent,
      },
      {
        path: 'common-pages/subscription-types',
        component: SubscriptionTypesComponent,
      },
      {
        path: 'common-pages/subscription-types/creat/:id',
        component: CreateSubscriptionTermComponent,
      },
      {
        path: 'common-pages/subscription-types/edit/:id',
        component: EditSubscriptionTermComponent,
      },
      {
        path: 'common-pages/subscription-types/attachment/:id',
        component: AttachmentComponent,
      },
      {
        path: 'common-pages/poll-items',
        component: PollItemsComponent,
      },
      {
        path: 'website-forms/main-forms',
        component: MainFormsComponent,
      },
      {
        path: 'website-forms/forms-field-type',
        component: FormFieldTypesComponent,
      },
      {
        path: 'website-forms/forms-drop-downs',
        component: FormDropDownsComponent,
      },
      {
        path: 'website-forms/forms-drop-downs/options/:id',
        component: OptionsSetItemComponent,
      },
      {
        path: 'website-forms/forms-fields',
        component: FormFieldsComponent,
      },
      {
        path: 'website-forms/form-buttons',
        component: FormsButtonsComponent,
      },

      {
        path: 'customer-care/contact-us',
        component: ContactUsMessagesComponent,
      },
      {
        path: 'customer-care/company-admin',
        component: NewCompanyAdminsComponent,
      },
      {
        path: 'customer-care/company-admin/department/:id',
        component: CompanyDepartmentsComponent,
      },
      {
        path: 'customer-care/company-admin/attachment/:id',
        component: CompanyAttachmentsComponent,
      },
      {
        path: 'customer-care/company-admin/managers/:id',
        component: ManagersComponent,
      },
      {
        path: 'customer-care/company-admin/attachmentManger/:id',
        component: MangerAttachmentsComponent,
      },
      {
        path: 'customer-care/company-vendors',
        component: NewCompanyVendorsComponent,
      },
      //
      {
        path: 'customer-care/company-vendors/department/:id',
        component: VendorDepartmentsComponent,
      },
      {
        path: 'customer-care/company-vendors/attachment/:id',
        component: VendorAttachmentsComponent,
      },
      {
        path: 'customer-care/company-vendors/managers/:id',
        component: VendorMangersComponent,
      },
      {
        path: 'customer-care/company-vendors/attachmentManger/:id',
        component: VendorMangerAttachmentsComponent,
      },
      {
        path: 'customer-care/individual-vendors',
        component: NewIndividualVendorsComponent,
      },
      {
        path: 'customer-care/individual-vendors/department/:id',
        component: IndividualDepartmentComponent,
      },
      {
        path: 'customer-care/individual-vendors/attachment/:id',
        component: IndividualAttachmentsComponent,
      },
      {
        path: 'customer-care/individual-vendors/managers/:id',
        component: IndividualManagersComponent,
      },
      {
        path: 'customer-care/individual-vendors/attachmentManger/:id',
        component: IndividualManagerAttachmentComponent,
      },

      {
        path: 'notification/all-notifications',
        component: NotificationComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPanelRoutingModule {}
