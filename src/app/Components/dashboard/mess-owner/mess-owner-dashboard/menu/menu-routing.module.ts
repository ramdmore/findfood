import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MenuComponent } from "./menu.component";

const MenuRouting :Routes =[
    { path: '', component:MenuComponent}
]

@NgModule({
    imports:[ RouterModule.forChild(MenuRouting)],
    exports:[ RouterModule]
})

export class MenuRoutingModule{}