import { NgModule } from "@angular/core";
import { RegisterComponent } from "./register.component";
import { RegisterRoutingModule } from "./register-routing.module";
import { FoodMaterialModule } from "../../Shared/Module/food-material.module";
import { SharedModule } from "../../Shared/Module/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations:[
        RegisterComponent,
    ],
    imports:[
        RegisterRoutingModule,
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        FoodMaterialModule
    ],
    providers:[
    ]
})

export class Resister{}