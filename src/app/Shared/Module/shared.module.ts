import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations:[],
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers:[],
})

export class SharedModule{}