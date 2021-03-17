// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { StoreModule } from '@ngrx/store';

// Components
import { DashboardComponent } from './dashboard.component';
import { HeaderComponent } from './header/header.component';
import { LoginModalComponent } from './login-modal/login-modal.component';


@NgModule({
    imports: [
    CommonModule,
    DashboardRoutingModule,

    ],
    declarations: [
    DashboardComponent,
    HeaderComponent,
    LoginModalComponent
    ],
    exports: [],
    providers: [],
})
export class DashboardModule {}
