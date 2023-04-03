import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { authInterceptorProviders } from '../authentication/helpers/auth.interceptor';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ChartsModule } from 'ng2-charts';
import { ConfiguradorPanelComponent } from './monitoreo-components/configurador-panel/configurador-panel.component';
import { MonitoreoComponent } from './monitoreo/monitoreo.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartistModule } from 'ng-chartist';
import { NgApexchartsModule } from "ng-apexcharts";
import { MonitoreoRoutes } from './monitoreo.routing';
import { GraficoLiveComponent } from './monitoreo-components/grafico-live/grafico-live.component';
import { GraficoCpujsComponent } from './monitoreo-components/grafico-cpujs/grafico-cpujs.component';
import { RamDoughnutComponent } from './monitoreo-components/ram-doughnut/ram-doughnut.component';
import { DiskPieComponent } from './monitoreo-components/disk-pie/disk-pie.component';
import { DiskTableComponent } from './monitoreo-components/disk-table/disk-table.component';
import { UserCpuUsageComponent } from './monitoreo-components/user-cpu-usage/user-cpu-usage.component';

@NgModule({
    imports: [
        FormsModule, 
        CommonModule, 
        NgbModule, 
        ChartsModule, 
        ChartistModule, 
        NgApexchartsModule,
        RouterModule.forChild(MonitoreoRoutes), 
        PerfectScrollbarModule],
    declarations: [
        ConfiguradorPanelComponent,
        MonitoreoComponent,
        GraficoLiveComponent,
        GraficoCpujsComponent,
        RamDoughnutComponent,
        DiskPieComponent,
        DiskTableComponent,
        UserCpuUsageComponent
    ],
    providers: [authInterceptorProviders],
    })
    export class MonitoreoModule { }
