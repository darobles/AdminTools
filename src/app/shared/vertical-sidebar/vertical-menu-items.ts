import { RouteInfo } from "./vertical-sidebar.metadata";

export const ROUTES: RouteInfo[] = [
   
    {
        path: 'monitoreo',
        title: 'Monitoreo',
        icon: 'Monitor',
        class: '',
        extralink: false,
        label: '',
        labelClass: '',
        submenu: [],
        access_req: 2
    },
    {
        path: 'administracion',
        title: 'Administracion',
        icon: 'Tool',
        class: '',
        extralink: false,
        label: '',
        labelClass: '',
        submenu: [],
        access_req: 1
    }
];
