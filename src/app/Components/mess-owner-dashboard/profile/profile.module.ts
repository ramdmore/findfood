import { NgModule } from "@angular/core";
import { ProfileComponent } from "./profile.component";
import { ProfileRoutingModule } from "./profile-routing.module";
import { FoodMaterialModule } from "../../../Shared/Module/food-material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { share } from "rxjs";
import { SharedModule } from "../../../Shared/Module/shared.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations:[
        ProfileComponent,
    ],
    imports:[
        CommonModule,
        ProfileRoutingModule,
        FoodMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    providers:[]
})

export class ProfileModule{}