import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

//router
import { AppRoutingModule } from './app.routes';
//components
import { AppComponent } from './app.component';
import { AccueilComponent } from './accueil/accueil.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ManagerComponent } from './manager/manager.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EmploiComponent } from './manager/emploi/emploi.component';
import { TacheComponent } from './manager/tache/tache.component';
import { UtilisateurComponent } from './manager/utilisateur/utilisateur.component';

import { ReportComponent } from './manager/reports/reports.component';
import { ReportEditComponent } from './manager/reports/report-edit/report-edit.component';
import { ReportsTypesComponent } from "./manager/reports/reports-types/reports-types.component";
import { ReportsDataService } from "./manager/reports/reports-data.service";
import { MatDatepickerModule, MatInputModule, MatFormFieldModule, MatNativeDateModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReportItemComponent } from './manager/reports/reports-list/report-item/report-item.component';
import { ReportFormComponent } from './manager/reports/report-form/report-form.component';
import { ReportsListComponent } from './manager/reports/reports-list/reports-list.component';
import { TimeBalanceFormComponent } from './manager/reports/report-form/time-balance-form/time-balance-form.component';
import { LeaveTimeBalanceComponent } from './manager/reports/report-form/leave-time-balance/leave-time-balance.component';


//services
import { LoginService } from "./service/login.service";
import { AuthGuard } from "./service/auth-guard.service";
import { UserDataService } from './manager/utilisateur/user-data.service';
import { GeneratedReportComponent } from "./manager/reports/generated-report/generated-report.component";
import { LastCharacterCut } from "./manager/reports/lastCharacterCut.pipe";


import { CommonModule, DatePipe } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { DemoUtilsModule } from '../../demo-modules/demo-utils/module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateChartComponent } from "./manager/reports/create-chart/create-chart.component";
import { CreateChartService } from "./manager/reports/create-chart/create-chart.service";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { ChartFormComponent } from "./manager/reports/create-chart/chart-form/chart-form.component";
import { ChartConfigurationComponent } from "./manager/reports/create-chart/chart-configuration/chart-configuration.component";
import { ProjectsComponent } from './manager/tache/projects/projects.component';
import { ProjectDataService } from "./manager/tache/projects/project-data.service";
import { TaskComponent } from './manager/tache/task/task.component';
import { ClientComponent } from './manager/client/client-create.component';
import { ClientDataService } from "./manager/client/client-data.service";
import { HttpClientModule } from "@angular/common/http";
import { ProjectCreateComponent } from './manager/tache/projects/project-create-update/project-create.component';
import { ProjectDetailComponent } from "./manager/tache/projects/project-detail/project-detail.component";
import { TaskDataService } from "./manager/tache/task/task-data.service";
import { TaskCreateComponent } from "./manager/tache/task/task-create/task-create.component";
import { TaskUpdateComponent } from './manager/tache/task/task-update/task-update.component';
import { CalendarComponent } from './manager/emploi/calendar/calendar.component';
import { CrComponent } from './manager/emploi/cr/cr.component';
import { ClientDetailsComponent } from './manager/client/client-details/client-details.component';





@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    HeaderComponent,
    FooterComponent,
    ManagerComponent,
    LoginComponent,
    PageNotFoundComponent,
    EmploiComponent,
    TacheComponent,
    UtilisateurComponent,
    //Reports Component
    ReportComponent,
    ReportEditComponent,
    ReportsTypesComponent,
    ReportItemComponent,
    ReportFormComponent,
    ReportsListComponent,
    TimeBalanceFormComponent,
    LeaveTimeBalanceComponent,
    GeneratedReportComponent,
    LastCharacterCut,
    CreateChartComponent,
    ChartFormComponent,
    ChartConfigurationComponent,
    ProjectsComponent,
    TaskComponent,
    ClientComponent,
    ProjectCreateComponent,
    ProjectDetailComponent,
    TaskCreateComponent,
    TaskUpdateComponent,
    CalendarComponent,
    CrComponent,
    ClientDetailsComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,        // <----- import(must)
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    CommonModule,
    CalendarModule.forRoot(),
    DemoUtilsModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    ChartsModule,
    HttpClientModule,

  ],
  providers: [
    LoginService,
    AuthGuard,
    UserDataService,
    ReportsDataService,
    CreateChartService,
    ProjectDataService,
    ClientDataService,
    TaskDataService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
