import { Routes } from '@angular/router';

import { MonitoreoComponent } from './monitoreo/monitoreo.component';

export const MonitoreoRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'monitoreo',
        component: MonitoreoComponent,
        data: {
          title: 'Monitoreo',
          urls: [{ title: 'Monitoreo', url: '/monitoreo' }, { title: 'Servidor SICTRAV' }]
        }
      }
    ]
  }
];
