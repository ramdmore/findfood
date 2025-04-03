import { NgModule } from "@angular/core";
import { DetailsComponent } from "./details.component";
import { DetailsRoutingModule } from "./details-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FoodMaterialModule } from "../../../Shared/Module/food-material.module";

@NgModule({
    declarations:[
        DetailsComponent,
    ],
    imports:[
        CommonModule,
        DetailsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        FoodMaterialModule
    ],
    providers:[]
})

export class DetailsModule{}