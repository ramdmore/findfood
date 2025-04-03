import { NgModule } from "@angular/core";
import { MenuComponent } from "./menu.component";
import { MenuRoutingModule } from "./menu-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FoodMaterialModule } from "../../../Shared/Module/food-material.module";

@NgModule({
    declarations:[
        MenuComponent,
    ],
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FoodMaterialModule,
        MenuRoutingModule
    ],
    providers:[]
})

export class menuModule{}