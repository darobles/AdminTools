import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { authInterceptorProviders } from '../authentication/helpers/auth.interceptor';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartistModule } from 'ng-chartist';
import { NgApexchartsModule } from "ng-apexcharts";
import { AdministracionRoutes } from './administracion.routing';
import { AdministracionComponent } from './administracion/administracion.component';
import { LogSictravComponent } from './administracion/log-sictrav/log-sictrav.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@NgModule({
    imports: [
        FormsModule, 
        ReactiveFormsModule,
        CommonModule, 
        NgbModule, 
        ChartistModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatDialogModule, 
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        NgApexchartsModule,                
        RouterModule.forChild(AdministracionRoutes), 
        NotifierModule,
        PerfectScrollbarModule],
    declarations: [
        AdministracionComponent,
        LogSictravComponent,
        ConfirmationDialogComponent
    ],
    providers: [authInterceptorProviders],
    })
    export class AdministracionModule { }
