import { NgModule } from "@angular/core";
import { ViewDataComponent } from "./view-data.component";
import { ViewDataRoutingModule } from "./view-data-routing.module";
import { CommonModule } from "@angular/common";
import { FoodMaterialModule } from "../../../Shared/Module/food-material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations:[
        ViewDataComponent,
    ],
    imports:[
        CommonModule,
        FoodMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        ViewDataRoutingModule
    ],
    exports:[],
    providers:[]
})

export class ViewDataModule{}