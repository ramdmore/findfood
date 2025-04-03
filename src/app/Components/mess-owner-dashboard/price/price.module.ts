import { NgModule } from "@angular/core";
import { PriceComponent } from "./price.component";
import { PriceRoutingModule } from "./price-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FoodMaterialModule } from "../../../Shared/Module/food-material.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations:[
        PriceComponent,
    ],
    imports:[
        CommonModule,
        PriceRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        FoodMaterialModule
    ],
    providers:[]
})

export class PriceModule{}