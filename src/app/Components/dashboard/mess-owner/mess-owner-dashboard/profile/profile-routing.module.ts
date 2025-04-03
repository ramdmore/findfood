import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProfileComponent } from "./profile.component";

const ProfileRouting : Routes =[
    { path :'', component:ProfileComponent}
]

@NgModule({
    imports:[ RouterModule.forChild(ProfileRouting)],
    exports:[ RouterModule]
})

export class ProfileRoutingModule{}