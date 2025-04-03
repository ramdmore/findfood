import { Component, NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { RouterModule, Routes } from "@angular/router";

const DashboardRouting : Routes =[
    { path:'', component: DashboardComponent}
]

@NgModule({
    imports:[RouterModule.forChild(DashboardRouting)],
    exports:[RouterModule]
})

export class DashboardRoutingModule{}