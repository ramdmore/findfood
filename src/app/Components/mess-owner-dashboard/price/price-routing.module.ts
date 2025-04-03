import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PriceComponent } from "./price.component";

const PriceRouting : Routes = [
    { path:'', component:PriceComponent}
]

@NgModule({
    imports:[ RouterModule.forChild(PriceRouting)],
    exports:[ RouterModule]
})

export class PriceRoutingModule{}