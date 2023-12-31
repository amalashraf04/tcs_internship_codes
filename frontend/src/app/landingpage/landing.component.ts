import { Component } from '@angular/core';
import { BackendService } from '../backend.service';
import { FormBuilder,FormGroup } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { io } from 'socket.io-client';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})

export class LandingComponent {

  statusArray: string[] = [];
  inviteform:any;
  userdash:any;
  friend:any[] = [];
  friendsdata:any;
  friendname:any;
  activestatus:any;
  imageArray:string[]=[];
  dp:any;
  imageUrl: string | null = null;
  chatUrl : string | null = null;
  socket = io('http://localhost:3001');


  constructor(private chatService: BackendService,private fb:FormBuilder,private route:ActivatedRoute,
    private router :Router,private messageservice:ChatService){
   
    this.inviteform = this.fb.group({
      name:[''],
      email :['']
     })


  }

  ngOnInit(){

    this.socket.emit('loggedinusers',localStorage.getItem('userid'));
    // this.onlinestatus()
      this.uniquelogin();
      this.fetchprofilepic();

  }
  
  invite() {
    let friend = this.inviteform.value;
    let userid = this.route.snapshot.params['id'];
    console.log(friend)
    this.chatService.addfriend(friend,userid).subscribe((res: any) => {
      if (res.status === 200) {
        this.friend = [res.data];
        console.log("friend reached front from back");
        console.log(this.friend);
        alert("friend added");
      } else if (res.status ===300){
        alert("you are already friends");

      }
      else if (res.status === 500) {
        alert("not a registered user");
      } else {
        alert("friend cannot be added");
      }
    });
  }

uniquelogin() {
  let userid = this.route.snapshot.params['id'];
  console.log(userid);

  this.chatService.uniquelanding(userid).subscribe((res: any) => {
    this.userdash = res.data;
    this.chatService.setfriends(this.userdash.friends);
    console.log(this.userdash);
    this.onlinestatusanddp();
  });
}
fetchprofilepic() {
  let userid = this.route.snapshot.params['id'];
  this.chatService.profilepic(userid).subscribe(
    (res: any) => {
     // console.log('Base64 string fetched from back');
      this.dp = res.imageBinaryData.data;
      console.log(this.dp);

      const uint8Array = new Uint8Array(this.dp);
      const blob = new Blob([uint8Array], { type: 'image/*' });

      // Release the previously created URL if it exists
      if (this.imageUrl) {
        URL.revokeObjectURL(this.imageUrl);
      }

      // Create a new URL for the new blob
      this.imageUrl = URL.createObjectURL(blob);
      //console.log("Image URL is", this.imageUrl);
    },
    (error) => {
      console.error('Error loading dp:', error);
    }
  );
}

 
 //to display online status and profile picture of friends
     onlinestatusanddp(){
     const friendslist=   this.chatService.getfriends()
     for(let i=0;i<friendslist.length;i++){
      let chatfriend = friendslist[i]
      console.log('for loop friend friend')
      this.chatService.onlinestatus(chatfriend).subscribe((res:any)=>{
        this.activestatus =  res.data
         
         this.statusArray.push(this.activestatus);
        
         let image = res.image.data     
         const uint8Array = new Uint8Array(image);
         const base64String = btoa(
           String.fromCharCode.apply(null, Array.from(uint8Array))
         );
         const blob = new Blob([uint8Array], { type: 'image/*' });
         this.chatUrl = URL.createObjectURL(blob);
         this.imageArray.push(this.chatUrl);

       })
      }
   }

  
  // for opening the chatbox of corressponding friend
    chathead(fid:any){
    //console.log(fid)
    let userid = this.route.snapshot.params['id'];
        localStorage.setItem('chatfriendid',fid)
    this.router.navigate(['land', userid, 'chatroom'], { queryParams: { fid: fid } });


  }
  
 
  logout(){
    let userid= localStorage.getItem('userid')
    this.chatService.userlogout(userid).subscribe((res:any)=>{
      //console.log('loggedout')
     let status = res.data;

    })
    localStorage.removeItem('token')
    this.router.navigate(['']);

  }


  
}
