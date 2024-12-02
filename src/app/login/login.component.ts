import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Credential } from '../models/user/Credential';
import { Router } from '@angular/router';
import { Token } from '../models/user/Token';
import { StorageService } from "../services/storage.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

    constructor( private userService: UserService,
                 private storageService : StorageService,
	         private router: Router
    ) 
    { } 

    username : String = "";
    password : String = "";
    myCredential = new Credential();

    callLogin() {

      
     this.myCredential.username = this.username;
     this.myCredential.password = this.password;
 
     this.userService.tokenAuth(this.myCredential)
    .subscribe(({ data }) => {
       console.log('user logged: ', JSON.stringify(data));
       this.storageService.setSession("user", this.myCredential.username);
       this.storageService.setSession("token", JSON.parse(JSON.stringify(data)).tokenAuth.token);

       this.router.navigate(['/home']);

    }, (error) => {
       console.log('there was an error sending the query', error);
       this.myCredential.username = "";
       this.myCredential.password = "";
       alert(error);
      });



    } 
}
