import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TimeComponent } from "./time.component";

const TimeRoutering : Routes = [
    { path: '', component:TimeComponent}
]

@NgModule({
    imports:[RouterModule.forChild(TimeRoutering)],
    exports:[RouterModule]
})

export class TimeRoutingModule{}