// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { StoreModule } from '@ngrx/store';

// Components
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [
    CommonModule,
    DashboardRoutingModule
    ],
    declarations: [
    DashboardComponent,
    ],
    exports: [],
    providers: [],
})
export class DashboardModule {}
