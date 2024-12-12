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

  // Método para autenticar con usuario y contraseña predefinidos
  tokenAuth() {

    const myCredential: Credential = {
      username: 'kevin',
      password: '1212',
    };

    console.log("username ... " + myCredential.username);
    console.log("password ... " + myCredential.password);

    return this.apollo.mutate({
      mutation: TOKENAUTH,
      variables: {
        username: myCredential.username,
        password: myCredential.password
      }
    });
  }

  private createAuthHeader(token: string) {
    return {
      headers: new HttpHeaders().set('Authorization', `JWT ${token}`),
    };
  }

  // Ahora tokenAuth es un método que no requiere parámetros de entrada
  autoLogin() {
    return this.tokenAuth().subscribe(
      (response: any) => {
        if (response.data && response.data.tokenAuth && response.data.tokenAuth.token) {
          const token = response.data.tokenAuth.token;
          console.log('Inicio de sesión exitoso, token:', token);
  
          // Guardar el token en sessionStorage
          sessionStorage.setItem('token', token);
          return token;
        } else {
          console.error('Error en la autenticación automática');
          return null;
        }
      },
      (error) => {
        console.error('Error en la autenticación automática:', error);
        return null;
      }
    );
  }
  

  // Método para crear un nuevo usuario
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

  // Obtener información del usuario actual con token de autenticación
  getCurrentUser(token: string) {
    return this.apollo.query({
      query: GET_CURRENT_USER,
      context: this.createAuthHeader(token),
    });
  }

  // Otros métodos para manejo de usuarios, reset de contraseñas, etc.
  resetPassword(email: String, password: String, token: String): String {
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

  sendEmail(email: String, urlReset: String): String {
    var emailSuccess = 0;
    emailSuccess = 1;
    console.log('sent to :' + email);
    console.log('url : ' + urlReset);
    return "" + emailSuccess;
  }

  createUrlReset(email: String): String {
    var myUrlReset = "" + this.createBaseURL() + "/" + email + "/" + this.createTokenReset(email);
    return myUrlReset;
  }

  createBaseURL(): String {
    var baseURL = "http://localhost:4200/reset-password";
    return baseURL;
  }

  createTokenReset(email: String): String {
    var SECRET_KEY = "i-love-adsoftsito";
    var myToken = "lkjlskiei8093wjdjde9203394";
    return myToken;
  }

  validateUser(email: String): User {
    var myUser = new User();
    if (email == "adsoft@live.com.mx") {
       myUser.id = 1; // Success
       myUser.email = email;
       myUser.username = "adsoft";
       myUser.password = "";
    } else {
       myUser.id = 0; // Error
    }
    return myUser;
  }

  validateToken(email: String, token: String): String {
    var validToken = 1;
    return "" + validToken;
  }

  destroyToken(token: String): String {
    var istokenDestroyed = 1;
    console.log('destroying token ... ' + token);
    return "" + istokenDestroyed;
  }

}
