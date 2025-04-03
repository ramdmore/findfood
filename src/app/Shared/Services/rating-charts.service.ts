import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RatingChartsService {

  constructor(private http: HttpClient) { }

  // Get Rating Chart Data from API Endpoint  
  getRatingChartData(){
    return this.http.get('https://findfood-ashen.vercel.app/api/user/getRatingData',{
      withCredentials:true,
    })
  }

  // Get Views Chart Data from API Endpoint
  getViewsChartData(){
    return this.http.get('https://findfood-ashen.vercel.app/api/user/getViews',{
      withCredentials:true,
    })
  }

  //API for getting views for Dashboard chart:
  getViewsForDashboard(period:string){
    return this.http.post('https://findfood-ashen.vercel.app/api/user/views',{period},{
      withCredentials:true,
    })
  }




}

