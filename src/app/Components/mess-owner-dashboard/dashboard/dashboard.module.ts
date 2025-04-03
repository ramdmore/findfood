import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { CommonModule } from "@angular/common";
import { FoodMaterialModule } from "../../../Shared/Module/food-material.module";
import { SharedModule } from "../../../Shared/Module/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {ButtonModule} from 'primeng/button';


@NgModule({
    declarations:[
        DashboardComponent,
    ],
    imports:[
        CommonModule,
        SharedModule,
        FoodMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        DashboardRoutingModule,
        
    ],
    providers:[],
})

export class DashboardModule{}