import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  myUserRegisterApiUrl:string = 'https://findfood-ashen.vercel.app/api/user/register';
  //userId,password,role

  myUserLoginApiUrl:string = 'https://findfood-ashen.vercel.app/api/user/login'; 

  constructor( private http : HttpClient) { }

  postRegisterList(myUserObj:any){
    const myPayLoad ={
      "userId": myUserObj.email,
      "password": myUserObj.password,
      "role": myUserObj.role,
    }
    console.log(myPayLoad);
    
   return this.http.post(this.myUserRegisterApiUrl, myPayLoad,{
    withCredentials:true
   })

  }

  postLogIn(myUserObj:any){
    const myPayLoad ={
      "userId": myUserObj.email,
      "password": myUserObj.password,
    }
    console.log(myPayLoad);
    
   return this.http.post(this.myUserLoginApiUrl, myPayLoad, {
    withCredentials :true,
   })

  }

  
}
