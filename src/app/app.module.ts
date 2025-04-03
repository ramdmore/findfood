import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// toaster
import { ToastrModule } from 'ngx-toastr';

import {NgxUiLoaderModule} from 'ngx-ui-loader'

// import { NgChartsModule } from 'ng2-charts';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from './Shared/Module/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FoodMaterialModule } from './Shared/Module/food-material.module';
import { FilterComponent } from './Components/filter/filter.component';
import { FeedbackComponent } from './Components/feedback/feedback.component';
import { MenuDetailsComponent } from './Components/menu-details/menu-details.component';
import { ChartModule } from 'primeng/chart';
import {ButtonModule} from 'primeng/button';
import { LogoutConfirmDialogComponent } from './Components/logout-confirm-dialog/logout-confirm-dialog.component';
import { DeleteConfirmDialogComponent } from './Components/delete-confirm-dialog/delete-confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    FilterComponent,
    FeedbackComponent,
    MenuDetailsComponent,
    LogoutConfirmDialogComponent,
    DeleteConfirmDialogComponent,
   
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    FoodMaterialModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxUiLoaderModule,
    // NgChartsModule,
    ChartModule,
    ButtonModule,
    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
