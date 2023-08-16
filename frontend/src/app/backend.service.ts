import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private friends!: string;


  constructor(private http: HttpClient) { }  


  api ='http://localhost:3000';

   


  setfriends(friends:any) {
    this.friends= friends;
    

  }
  getfriends() {
 

    return this.friends;
  }
  



// add user
adduser(value:any){
  
  return this.http.post(`${this.api}/signup`,value)
}

//existingusername
existinguser(value:any){


  return this.http.get(`${this.api}/username/${value}`)
}

//userlogin
userlogin(value:any){
  return this.http.post(`${this.api}/login`,value)
}





addfriend(value:any,id:any){
  
   return this.http.post(`${this.api}/friend/${id}`,value)
}

displayfriends(){
 return this.http.get(`${this.api}/friendslist`)
}

//for displaying unique details of the user
uniquelanding(userid:any){
return this.http.get<any>(`${this.api}/uniquelogin/${userid}`)
}

// to display details in chatbox
 chatdetails(userid:any,fid:any){
  return this.http.get(`${this.api}/chatroom/${userid}/${fid}`)
}

userlogout(userid:any){
  return this.http.get(`${this.api}/logout/${userid}`) 
}


onlinestatus(friendname:any){
  console.log(friendname)
  const username=friendname.username
  

  return this.http.get(`${this.api}/active/${username}`)

}

addpic(formdata:any,userid:any){

  return this.http.post(`${this.api}/file/${userid}`,formdata)

}

profilepic(userid:any){
  
  return this.http.get(`${this.api}/getprofilepic/${userid}`);

}

gettoken() :boolean{
  return !!localStorage.getItem('token')
}


}
