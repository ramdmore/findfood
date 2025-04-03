import { NgModule } from "@angular/core";
import { MessDetailFormComponent } from "./mess-detail-form.component";
import { MessDetailRoutingModule } from "./mess-detail-routing.module";
import { FoodMaterialModule } from "../../Shared/Module/food-material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations:[
        MessDetailFormComponent
    ],
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MessDetailRoutingModule,
        FoodMaterialModule
    ],
    providers:[
    ]
})

export class MessDetails{}