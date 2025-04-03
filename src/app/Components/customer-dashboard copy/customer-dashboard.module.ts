import { NgModule } from "@angular/core";
import { CustomerDashboardComponent } from "./customer-dashboard.component";
import { CustomerDashboardRoutingModule } from "./customer-dashboard-routing.module";
import { CommonModule } from "@angular/common";
import { FoodMaterialModule } from "../../Shared/Module/food-material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../Shared/Module/shared.module";

@NgModule({
    declarations:[
        CustomerDashboardComponent,
       
    ],
    imports:[
        CommonModule,
        FoodMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CustomerDashboardRoutingModule,
    ],
    providers:[]
})

export class CustomerDashboardModule{}