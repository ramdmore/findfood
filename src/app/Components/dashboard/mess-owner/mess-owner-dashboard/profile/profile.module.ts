import { NgModule } from "@angular/core";
import { ProfileComponent } from "./profile.component";
import { ProfileRoutingModule } from "./profile-routing.module";

@NgModule({
    declarations:[
        ProfileComponent,
    ],
    imports:[
        ProfileRoutingModule
    ],
    providers:[]
})

export class ProfileModule{}