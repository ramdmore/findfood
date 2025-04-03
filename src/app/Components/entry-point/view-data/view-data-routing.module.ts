import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewDataComponent } from "./view-data.component";

const viewDataRouting : Routes =[
    { path: '', component:ViewDataComponent}
]

@NgModule({
    imports:[RouterModule.forChild(viewDataRouting)],
    exports:[RouterModule],
})

export class ViewDataRoutingModule{}