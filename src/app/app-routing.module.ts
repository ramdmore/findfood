import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo:'entrypoint', pathMatch: 'full'},

  { path: 'login', loadChildren: ()=>{ return import ('./Components/login/login.module').then((m)=> m.LoginModule)}},

  { path: 'register', loadChildren: ()=>{ return import ('./Components/register/register.module').then((m)=>m.Resister)}},
  
  // { path: 'dashboard', loadChildren: ()=>{ return import ('./Components/dashboard/dashboard.module').then((m)=>m.DashboardModule)}},

  { path: 'messdetail', loadChildren: ()=>{ return import ('./Components/mess-detail-form/mess-detail.module').then((m)=>m.MessDetails)}},

  { path:'messownerdashboard', loadChildren:()=>{return import('./Components/mess-owner-dashboard/mess-owner-dashboard.module').then((m)=>m.MessOwnerDashboardModule)}},

  { path: 'customer', loadChildren: ()=>{ return import ('./Components/customer-dashboard/customer-dashboard.module').then((m)=>m.CustomerDashboardModule)}},

  { path: 'entrypoint', loadChildren:()=>{return import('./Components/entry-point/entry-point.module').then((m)=>m.EntryPointModule)}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
