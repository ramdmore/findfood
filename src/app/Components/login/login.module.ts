import { NgModule } from "@angular/core";
import { LoginComponent } from "./login.component";
import { LoginRoutingModule } from "./login-routing.module";
import { FoodMaterialModule } from "../../Shared/Module/food-material.module";
import { SharedModule } from "../../Shared/Module/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ToastrModule } from "ngx-toastr";

@NgModule({
    declarations:[
        LoginComponent
    ],

    imports:[
        FoodMaterialModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        LoginRoutingModule,
        ToastrModule

    ],
    providers:[],
})

export class LoginModule{}