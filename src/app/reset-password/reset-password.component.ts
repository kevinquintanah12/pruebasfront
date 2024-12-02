import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

   password : String = "";
   confirmpassword : String = "";
   email : String = "";
   token : String = "";

   constructor( private route: ActivatedRoute,
                private userService: UserService
              ) 
   { 
    // this.route.params.subscribe( res =>console.log(res) ); 
     console.log(this.route.snapshot.params['email']);
     console.log(this.route.snapshot.params['token']);
     this.email = this.route.snapshot.params['email'];
     this.token = this.route.snapshot.params['token'];

   }

  
   callResetPassword() {
     console.log(this.password);
     console.log(this.confirmpassword);
     var myValidToken = this.userService.validateToken(this.email, this.token);
   
     if (myValidToken == "1")
     {
         // call reset password
         var myResetPassword = this.userService.resetPassword(this.email,
                                                              this.password, 
							      this.token);
         console.log('reset password ' + myResetPassword);
     }

   }
}
