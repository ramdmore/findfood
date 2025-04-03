import { NgModule } from "@angular/core";
import { MessOwnerDashboardComponent } from "./mess-owner-dashboard.component";
import { MessOwnerDashboardRoutingModule } from "./mess-owner-dashboard-routing.module";
import { CommonModule } from "@angular/common";
import { FoodMaterialModule } from "../../../../Shared/Module/food-material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";



@NgModule({
    declarations:[
        MessOwnerDashboardComponent,
        

    ],
    imports:[
        CommonModule,
        FoodMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        MessOwnerDashboardRoutingModule
    ],
    providers:[]

})

export class MessOwnerDashboardModule{}