import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { HttpHeaders } from '@angular/common/http';

const LINKS_QUERY = gql`
  query FakeLinks  {
    links  {
        id
        url
        description
      }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class GraphqlLinkService {

  constructor(private apollo: Apollo) { }

  getLinks(mytoken: string) {
    
      return this.apollo.query({
        query: LINKS_QUERY,
        variables: {
        }, 
        context: {
          // example of setting the headers with context per operation
          headers: new HttpHeaders().set('Authorization', 'JWT ' + mytoken),
        },
      });
    //}
  
  }












}
