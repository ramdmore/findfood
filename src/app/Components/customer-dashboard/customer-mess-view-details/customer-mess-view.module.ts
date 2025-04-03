import { NgModule } from "@angular/core";
import { CustomerMessViewDetailsRoutingModule } from "./customer-mess-view-details-routing.module";
import { CustomerMessViewDetailsComponent } from "./customer-mess-view-details.component";
import { CommonModule } from "@angular/common";
import { FoodMaterialModule } from "../../../Shared/Module/food-material.module";

@NgModule({
    declarations:[
        CustomerMessViewDetailsComponent
    ],
    imports:[
        CommonModule,
        FoodMaterialModule,
        CustomerMessViewDetailsRoutingModule
    ],
    providers:[]
})

export class CustomerMessDetailsModule{}