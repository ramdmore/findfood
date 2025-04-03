import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomerMessViewDetailsComponent } from "./customer-mess-view-details.component";

const CustomerMessViewDetailsRouting : Routes=[
    { path:'', component: CustomerMessViewDetailsComponent}
]

@NgModule({
    imports:[RouterModule.forChild(CustomerMessViewDetailsRouting)],
    exports:[RouterModule]
})

export class CustomerMessViewDetailsRoutingModule{}