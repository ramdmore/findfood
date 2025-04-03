import { NgModule } from "@angular/core";
import { MessOwnerDashboardComponent } from "./mess-owner-dashboard.component";
import { MessOwnerDashboardRoutingModule } from "./mess-owner-dashboard-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FoodMaterialModule } from "../../Shared/Module/food-material.module";



@NgModule({
    declarations:[
        MessOwnerDashboardComponent,
    ],
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FoodMaterialModule,
        MessOwnerDashboardRoutingModule
    ],
    providers:[]

})

export class MessOwnerDashboardModule{}