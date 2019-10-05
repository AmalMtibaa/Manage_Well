import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//components
import { AccueilComponent } from './accueil/accueil.component';
import { ManagerComponent } from './manager/manager.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EmploiComponent } from './manager/emploi/emploi.component';
import { TacheComponent } from './manager/tache/tache.component';
import { UtilisateurComponent } from './manager/utilisateur/utilisateur.component';
import {ReportComponent} from "./manager/reports/reports.component";
import {ReportEditComponent} from "./manager/reports/report-edit/report-edit.component";
import {ReportsTypesComponent} from "./manager/reports/reports-types/reports-types.component";

//services
import { AuthGuard } from "./service/auth-guard.service";
import {ReportsListComponent} from "./manager/reports/reports-list/reports-list.component";
import {GeneratedReportComponent} from "./manager/reports/generated-report/generated-report.component";
import {CreateChartComponent} from "./manager/reports/create-chart/create-chart.component";
import {ProjectDetailComponent} from "./manager/tache/projects/project-detail/project-detail.component";
import {CalendarComponent} from "./manager/emploi/calendar/calendar.component";
import {CrComponent} from "./manager/emploi/cr/cr.component";
import {ClientDetailsComponent} from "./manager/client/client-details/client-details.component";




const appRoutes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'accueil', component: AccueilComponent },
  { path: 'connexion', component: LoginComponent },
  { path: 'manager', component: ManagerComponent, canActivate: [AuthGuard], children: [
      {path: '', redirectTo: 'emploi', pathMatch: 'full'},
      {path: 'emploi', component: EmploiComponent, children: [
        {path: '', redirectTo: 'calendrier', pathMatch: 'full'},
        { path: 'calendar', component: CalendarComponent },
        { path: 'cr', component: CrComponent }
      ]},
      {path: 'tache', component: TacheComponent ,children:[
        {path:'client-detail/:clientName',component:ClientDetailsComponent},
        {path:'project-detail/:idProject',component:ProjectDetailComponent, data: {depth: 2}}
      ]},
      {path: 'reports', component: ReportComponent, children: [     // loadChildren: './manager/reports/reports.module#ReportsModule',
        { path: 'reports-types', component: ReportsTypesComponent },
        { path: 'report-edit/:id', component: ReportEditComponent },
        { path: 'reports-list', component: ReportsListComponent },
        { path: 'generated-report', component: GeneratedReportComponent },
        { path: 'generated-report/:id', component: GeneratedReportComponent },
        { path:'create-chart',component:CreateChartComponent}
      ]},
      {path: 'utilisateur', component: UtilisateurComponent}
    ] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
