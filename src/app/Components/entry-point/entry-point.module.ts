import { NgModule } from "@angular/core";
import { EntryPointComponent } from "./entry-point.component";
import { EntryPointRoutingModule } from "./entry-point-routing.module";
import { CommonModule } from "@angular/common";
import { FoodMaterialModule } from "../../Shared/Module/food-material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
    declarations:[
        EntryPointComponent,
        
    ],
    imports:[
        CommonModule,
        FoodMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        EntryPointRoutingModule
    ],
    providers:[]
})

export class EntryPointModule{}