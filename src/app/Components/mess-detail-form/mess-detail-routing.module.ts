import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MessDetailFormComponent } from "./mess-detail-form.component";

const MessDetailRoutes : Routes =[
    { path: '', component:MessDetailFormComponent}
]

@NgModule({
    imports:[RouterModule.forChild(MessDetailRoutes)],
    exports:[RouterModule]
})

export class MessDetailRoutingModule{}