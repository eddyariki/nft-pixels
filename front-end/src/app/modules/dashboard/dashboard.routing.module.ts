// Modules
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { DashboardComponent } from './dashboard.component';

// Others
import { config } from '../../config';

const r = config.routes;

const routes: Routes = [
    {
        path: r.root,
        component: DashboardComponent
    }
];



@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
export class DashboardRoutingModule {}
