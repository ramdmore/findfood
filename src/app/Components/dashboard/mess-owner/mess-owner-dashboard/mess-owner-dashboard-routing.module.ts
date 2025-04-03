import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MessOwnerDashboardComponent } from "./mess-owner-dashboard.component";

const MessOwnerDashboardRouting : Routes =[
    { path:'', component: MessOwnerDashboardComponent,
        children:[
            
    { path:'dashboard', loadChildren:()=> {return import('./dashboard/dashboard.module').then((m)=>m.DashboardModule) }},

    { path:'details', loadChildren:()=>{ return import('./details/details.module').then((m)=>m.DetailsModule)}},

    { path:'menu', loadChildren:()=>{return import('./menu/menu.module').then((m)=>m.menuModule)}},

    { path:'price', loadChildren:()=>{return import('./price/price.module').then((m)=>m.PriceModule)}},

    { path:'profile', loadChildren:()=>{ return import('./profile/profile.module').then((m)=>m.ProfileModule)}},

    { path:'time', loadChildren:()=>{ return import('./time/time.module').then((m)=>m.TimeModule)}}

        ]
    },

]


@NgModule({
    imports: [RouterModule.forChild(MessOwnerDashboardRouting)],
    exports:[RouterModule]
})

export class MessOwnerDashboardRoutingModule{}