import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http:HttpClient) { }

  getMessDetailsForCustomer(){
    return this.http.get('https://findfood-ashen.vercel.app/api/user/getAllMess',{
      withCredentials:true,
    })
  }

  postFeedback(obj:any){

    return this.http.post(' https://findfood-ashen.vercel.app/api/user/saveRating',obj,{
      withCredentials :true
    })
  }

  addViewsToCustomer(myUserId:any){
    const payload = {
      messUserId:myUserId
    }
    return this.http.post("https://findfood-ashen.vercel.app/api/user/addViews",payload,{
      withCredentials:true
    })
  }

}

// https://findfood-ashen.vercel.app/api/user/saveRating
// payLoad : {
//                      customerUserId:"",
//                      messUserId:"",
//                      rating:"",
//                      feedback:""
//                    }
