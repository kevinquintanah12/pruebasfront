import { TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { GraphqlLinkService } from './graphql.link.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { gql } from 'apollo-angular';

describe('GraphqlLinkService', () => {
  let service: GraphqlLinkService;
  let httpMock: HttpTestingController;
  let apollo: Apollo;

  const mockLinksResponse = {
    data: {
      links: [
        { id: 1, url: 'https://example.com', description: 'Example link' },
        { id: 2, url: 'https://another-example.com', description: 'Another link' },
      ],
    },
    loading: false,  // Se agrega la propiedad loading
    networkStatus: 7,  // Se agrega la propiedad networkStatus
  };

  const LINKS_QUERY = gql`
    query FakeLinks {
      links {
        id
        url
        description
      }
    }
  `;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GraphqlLinkService, Apollo],
    });

    service = TestBed.inject(GraphqlLinkService);
    httpMock = TestBed.inject(HttpTestingController);
    apollo = TestBed.inject(Apollo);
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería realizar una consulta de links con el token correcto', () => {
    const mockToken = 'mock-jwt-token';
    const spy = spyOn(apollo, 'query').and.returnValue(of(mockLinksResponse));

    service.getLinks(mockToken).subscribe(response => {
      expect(response).toEqual(mockLinksResponse);
      expect(spy).toHaveBeenCalledWith({
        query: LINKS_QUERY,
        variables: {},
        context: {
          headers: new HttpHeaders().set('Authorization', 'JWT ' + mockToken),
        },
      });
    });
  });

  it('debería manejar el error al obtener los links', () => {
    const mockToken = 'mock-jwt-token';
    const mockError = { message: 'An error occurred' }; // Simulamos un error con un mensaje

    const spy = spyOn(apollo, 'query').and.returnValue(throwError(() => mockError)); // Lanzamos un error usando throwError

    service.getLinks(mockToken).subscribe(
      () => {},
      (error) => {
        expect(error.message).toBe('An error occurred'); // Verifica el mensaje de error
        expect(spy).toHaveBeenCalled();
      }
    );
  });

  it('debería realizar la solicitud HTTP con el encabezado de autorización correcto', () => {
    const mockToken = 'mock-jwt-token';
    const spy = spyOn(apollo, 'query').and.callThrough();

    service.getLinks(mockToken).subscribe();
    const req = httpMock.expectOne(req => req.headers.has('Authorization') && req.headers.get('Authorization') === `JWT ${mockToken}`);
    expect(req).toBeTruthy();
    httpMock.verify();
  });

  it('debería manejar un error de red correctamente', () => {
    const mockToken = 'mock-jwt-token';
    const mockNetworkError = { message: 'Network error' }; // Error de red simulado

    const spy = spyOn(apollo, 'query').and.returnValue(throwError(() => mockNetworkError)); // Lanzamos el error de red

    service.getLinks(mockToken).subscribe(
      () => {},
      (error) => {
        expect(error.message).toBe('Network error'); // Verifica el mensaje del error de red
      }
    );
  });
});
