import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DetailsComponent } from "./details.component";

const DetailsRouting : Routes=[
    { path:'', component:DetailsComponent}
]

@NgModule({
    imports:[ RouterModule.forChild(DetailsRouting)],
    exports:[ RouterModule]
})

export class DetailsRoutingModule{}