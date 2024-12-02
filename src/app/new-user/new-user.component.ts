import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user/User';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Credential } from '../models/user/Credential';


@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})

export class NewUserComponent {

 constructor( 
	      private userService: UserService,
	      private storageService: StorageService,
	      private router: Router
    ) 
 {
 } 

 myPayloadUser = new User();
 //myNewUser = new User();
 myCredential = new Credential();

 createUser() {
   console.log(this.myPayloadUser);

 this.userService.createUser(this.myPayloadUser)
    .subscribe(({ data }) => {
       console.log('got data', data);

       //alert(JSON.stringify(this.myUser));

       this.myCredential.username = this.myPayloadUser.username;
       this.myCredential.password = this.myPayloadUser.password;

       this.userService.tokenAuth(this.myCredential)
       .subscribe(({ data }) => {
          console.log('logged: ', JSON.stringify(data));

          this.storageService.setSession("user", this.myPayloadUser.username);
          this.storageService.setSession("token", JSON.parse(JSON.stringify(data)).tokenAuth.token);
         
         alert("User created : " + JSON.stringify(data));

         this.router.navigate(['/home']);

       }, (error) => {
          console.log('error logging user : ', error);
          alert(error);
          
       });
     



    }, (error) => {
       console.log('error creating user : ', error);
       this.myPayloadUser.username = "";
       this.myPayloadUser.email = "";
       this.myPayloadUser.password = "";
       alert(error);
    });
  
  


 } 

}
