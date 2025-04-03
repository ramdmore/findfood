import { NgModule } from "@angular/core";
import { TimeComponent } from "./time.component";
import { TimeRoutingModule } from "./time-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatStepperModule } from '@angular/material/stepper'; // ✅ Add this
import { MatButtonModule } from '@angular/material/button'; 
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { FoodMaterialModule } from "../../../Shared/Module/food-material.module";


@NgModule({
    declarations:[
        TimeComponent
    ],
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TimeRoutingModule,
        FoodMaterialModule
        // MatStepperModule,
        // MatButtonModule,
        // CdkAccordionModule
    ],
    providers:[]
})

export class TimeModule{}