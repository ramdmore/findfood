import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessOwnerDetailsService {
  

  constructor( private http: HttpClient) { }

  // Post

  postMessDetails(messObj:any){
    return this.http.post('https://findfood-ashen.vercel.app/api/user/messData', messObj,{})
  }

  // Get

  getTimeDetails(){
    return this.http.get('https://findfood-ashen.vercel.app/api/user/timeDetailsData',{
      withCredentials: true
    })
  }

  getPriceDetails(){
    return this.http.get('https://findfood-ashen.vercel.app/api/user/priceDetailsData',{
      withCredentials: true
    })
  }

  getMessDetails(){
    return this.http.get('https://findfood-ashen.vercel.app/api/user/messDetailsData',{
      withCredentials : true
    })
  }

  getMenuDetails(){
    return this.http.get('https://findfood-ashen.vercel.app/api/user/menuDetailsData',{
      withCredentials: true
    })
  }

  // Update
  updateTimeDetails(timeObj:any){
    // console.log(timeObj);
    
    return this.http.patch('https://findfood-ashen.vercel.app/api/user/saveTimeDetails',timeObj.timeDetails,{
      withCredentials: true
    })
  }

  updatePriceDetails(priceObj:any){
    console.log(priceObj);

    return this.http.patch('https://findfood-ashen.vercel.app/api/user/savePriceDetails',priceObj.priceDetails,{
      withCredentials: true
    })
    
  }

  updateMessDetails(messDetailObj:any){
    console.log(messDetailObj);
    // messDetails

    return this.http.patch('https://findfood-ashen.vercel.app/api/user/saveMessDetails',messDetailObj.messDetails,{
      withCredentials: true
    })
  }

  updateMenuDetails(menuObj:any){
    console.log(menuObj);
    const payload=menuObj.menuDetails
    // menuDetails
    return this.http.patch('https://findfood-ashen.vercel.app/api/user/saveMenuDetails',payload,{
      withCredentials: true
    })
    
  }

}
