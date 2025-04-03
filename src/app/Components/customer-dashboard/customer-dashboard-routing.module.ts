import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomerDashboardComponent } from "./customer-dashboard.component";

const CustomerRouting: Routes =[
    { path: '', component:CustomerDashboardComponent},
    { path:'messviewdetails/:userId',loadChildren:()=> {return import('./customer-mess-view-details/customer-mess-view.module').then((m)=>m.CustomerMessDetailsModule)}}

]

@NgModule({
    imports:[RouterModule.forChild(CustomerRouting)],
    exports:[RouterModule]
})

export class CustomerDashboardRoutingModule{}