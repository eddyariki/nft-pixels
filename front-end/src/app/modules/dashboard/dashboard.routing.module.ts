// Modules
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';

// Others
import { config } from '../../config';
import { AuctionComponent } from './auction/auction.component';

const r = config.routes;

const routes: Routes = [
    {
        path: r.root,
        component: DashboardComponent,
        children: [
        {
            path: r.root,
            component: HomeComponent
        },
        {
            path: r.auction,
            component: AuctionComponent
        }
    ]
    }
];



@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
export class DashboardRoutingModule {}
