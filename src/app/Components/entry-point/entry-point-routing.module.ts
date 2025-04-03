import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EntryPointComponent } from "./entry-point.component";

const entryPontRouting : Routes=[
    { path:'', component: EntryPointComponent},
    { path: 'viewdata/:userId', loadChildren: () => import('./view-data/view-data.module').then(m => m.ViewDataModule) }

]

@NgModule({
    imports:[RouterModule.forChild(entryPontRouting)],
    exports:[RouterModule]
})

export class EntryPointRoutingModule{}