import { NgModule } from "@angular/core";
import { MenuComponent } from "./menu.component";
import { MenuRoutingModule } from "./menu-routing.module";

@NgModule({
    declarations:[
        MenuComponent,
    ],
    imports:[
        MenuRoutingModule
    ],
    providers:[]
})

export class menuModule{}