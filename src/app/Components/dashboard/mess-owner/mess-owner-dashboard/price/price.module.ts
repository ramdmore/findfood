import { NgModule } from "@angular/core";
import { PriceComponent } from "./price.component";
import { PriceRoutingModule } from "./price-routing.module";

@NgModule({
    declarations:[
        PriceComponent,
    ],
    imports:[
        PriceRoutingModule
    ],
    providers:[]
})

export class PriceModule{}