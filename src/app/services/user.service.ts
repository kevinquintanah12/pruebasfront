import { Injectable } from '@angular/core';
import { Credential } from '../models/user/Credential'
import { User } from '../models/user/User'
import { Token } from '../models/user/Token'
import {Apollo, gql} from 'apollo-angular';
import { HttpHeaders } from '@angular/common/http';

const TOKENAUTH = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

const CREATEUSER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      user { 
        id
        username
        email
      }
    }
  }
  `;


const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      username
      email
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apollo: Apollo) { }

  tokenAuth(myCredential: Credential) {

    console.log("username ... " + myCredential.username);
    console.log("password ... " + myCredential.password);

    var myToken = new Token();

    // call api

    return this.apollo.mutate({
      mutation: TOKENAUTH,
      variables: {
        username: myCredential.username,
        password: myCredential.password
      }
    });

/*    if ( (myCredential.email == "adsoft@live.com.mx") &&
	 (myCredential.password == "123"))
    {
       myToken.id = "0001";
       myToken.user = "adsoft";
       myToken.token = "gcp747844sdjksdkjsdkjds895850vb3";
    }
    else {
       myToken.id = "0";
       myToken.user = "bad credentials";
       myToken.token = "";
    }  
*/
   //  return myToken;
  }

  private createAuthHeader(token: string) {
    return {
      headers: new HttpHeaders().set('Authorization', `JWT ${token}`),
    };
  }


  createUser(myUser: User) {

    console.log("email ... " + myUser.email);
    console.log("password ... " + myUser.password);

    return this.apollo.mutate({
        mutation: CREATEUSER,
        variables: {
          username: myUser.username,
          email: myUser.email,
          password: myUser.password
        }
    });

 } 


 getCurrentUser(token: string) {
  return this.apollo.query({
    query: GET_CURRENT_USER,
    context: this.createAuthHeader(token),
  });
}




  resetPassword(email : String, password : String, token : String) : String {
   // call reset password API

   var isResetPassword = 1;

   this.destroyToken(token);

   return "" + isResetPassword;
   
  }

  sendUrlResetPassword(email: String): User {

    console.log("email ... " + email);

    var myUser = this.validateUser(email);

    if (myUser.id != 0) {

      var myUrlReset = this.createUrlReset(myUser.email);
      console.log(myUrlReset);
      var sendEmail = this.sendEmail(myUser.email, myUrlReset);
      console.log(sendEmail);
    }

    return myUser;

  }

  sendEmail(email: String, urlReset: String) : String {
    
   var emailSuccess = 0;

   // send email using SMTP (gmail, outlook..)

   // email sent
   emailSuccess = 1;
   console.log('sent to :' + email);
   console.log('url : ' + urlReset);
   
   return "" + emailSuccess; 
  
  }
  createUrlReset(email: String) : String {
    var myUrlReset = "" +
        this.createBaseURL() +
        "/" +   
        email +  
        "/" + 
        this.createTokenReset(email)

     return myUrlReset;
  }

  createBaseURL() : String {

   // call process to create base URL
    var baseURL = "http://localhost:4200/reset-password";

    return baseURL;
  }

  createTokenReset(email: String) : String {
    // JWT create a token to encrypt email
    var SECRET_KEY = "i-love-adsoftsito";

    var myToken = "lkjlskiei8093wjdjde9203394"

    return myToken;
  }


  validateUser(email: String ) : User {

    // call fake query api by email

    var myUser = new User();

    // Success, email valid
    if ( email == "adsoft@live.com.mx" )
    {
       console.log("Success " + myUser.id);
       myUser.id = 1; // Success
       myUser.email = email;
       myUser.username = "adsoft";
       myUser.password = "";
    }
    else {
       console.log("Error" + myUser.id);

       myUser.id = 0; // Error
    } 
    
    return myUser;
  
  }



  validateToken(email: String, token: String) : String {

    // call api to validate token 
    // success
    console.log('validating token ... ' + token);
    
    var validToken = 1;
    return ""+validToken;

  }

  destroyToken(token: String) : String {

    // call api to destroy token
    var istokenDestroyed = 1;
    console.log('destroying token ... ' + token);
    return "" + istokenDestroyed;
  }

}
