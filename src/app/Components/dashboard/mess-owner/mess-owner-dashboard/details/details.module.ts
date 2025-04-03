import { NgModule } from "@angular/core";
import { DetailsComponent } from "./details.component";
import { DetailsRoutingModule } from "./details-routing.module";

@NgModule({
    declarations:[
        DetailsComponent,
    ],
    imports:[
        DetailsRoutingModule
    ],
    providers:[]
})

export class DetailsModule{}