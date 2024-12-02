import { Component } from '@angular/core';
import { FakeProductService } from '../services/fake-product.service';
import { Subscription } from 'rxjs';
import { GraphqlLinkService} from '../services/graphql.link.service';
import { StorageService } from "../services/storage.service";

@Component({
  selector: 'app-fake-product',
  templateUrl: './fake-product.component.html',
  styleUrls: ['./fake-product.component.css']
})

export class FakeProductComponent {

  constructor(
              private storageService : StorageService,
              private fakeProductService: FakeProductService,
              private graphqlLinkService: GraphqlLinkService,
    ) 
    { }
    //arrFakeProducts = [];
    arrLinks = [];
    loading: boolean;
    token : string = "";

    private querySubscription: Subscription;    
    
    ngAfterViewInit(): void {
      this.getLinks();
     
    }

    private getLinks()
    {
     this.token = this.storageService.getSession("token");

     alert("token " + this.token);
     this.querySubscription = this.graphqlLinkService.getLinks(this.token)
      //.valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.arrLinks = JSON.parse(JSON.stringify(data)).links;
        console.log(JSON.stringify(this.arrLinks))
      });


    }
   
}
