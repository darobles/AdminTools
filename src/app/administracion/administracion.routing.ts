import { Routes } from '@angular/router';

import { AdministracionComponent } from './administracion/administracion.component';

export const AdministracionRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'administracion',
        component: AdministracionComponent,
        data: {
          title: 'Administración de SICTRAV',
          urls: [{ title: 'Administracion', url: '/administracion' }, { title: 'Administracion Dashboard' }]
        }
      }
    ]
  }
];
