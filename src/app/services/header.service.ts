import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { HttpHeaders } from '@angular/common/http';

const GET_HEADERS_QUERY = gql`
  query GetHeaders($search: String!) {
    headers(search: $search) {
      id
      name
      description
      imageUrl
      email
      phoneNumber
      location
      github
    }
  }
`;

const GET_HEADER_BY_ID_QUERY = gql`
  query GetHeaderById($id: Int!) {
    headerById(idHeader: $id) {
      id
      name
      description
      imageUrl
      email
      phoneNumber
      location
      github
    }
  }
`;

const CREATE_HEADER_MUTATION = gql`
  mutation CreateHeader(
    $idHeader: Int!
    $name: String!
    $description: String!
    $imageUrl: String
    $email: String!
    $phoneNumber: String
    $location: String
    $github: String
  ) {
    createHeader(
      idHeader: $idHeader
      name: $name
      description: $description
      imageUrl: $imageUrl
      email: $email
      phoneNumber: $phoneNumber
      location: $location
      github: $github
    ) {
      idHeader
      name
      description
      email
    }
  }
`;

const UPDATE_HEADER_MUTATION = gql`
  mutation UpdateHeader(
    $idHeader: Int!
    $name: String!
    $description: String!
    $imageUrl: String
    $email: String!
    $phoneNumber: String
    $location: String
    $github: String
  ) {
    updateHeader(
      idHeader: $idHeader
      name: $name
      description: $description
      imageUrl: $imageUrl
      email: $email
      phoneNumber: $phoneNumber
      location: $location
      github: $github
    ) {
      idHeader
      name
      description
      email
    }
  }
`;

const DELETE_HEADER_MUTATION = gql`
  mutation DeleteHeader($id: Int!) {
    deleteHeader(idHeader: $id) {
      idHeader
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GraphqlHeaderService {
  constructor(private apollo: Apollo) {}

  /**
   * Obtener headers con búsqueda opcional.
   * @param search Cadena de búsqueda (si es '*', devuelve todos los headers).
   * @param token Token de autenticación JWT.
   */
  getHeaders(search: string, token: string) {
    return this.apollo.query({
      query: GET_HEADERS_QUERY,
      variables: { search },
      context: {
        headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
      },
    });
  }

  /**
   * Obtener un header por ID.
   * @param id ID del header.
   * @param token Token de autenticación JWT.
   */
  getHeaderById(id: number, token: string) {
    return this.apollo.query({
      query: GET_HEADER_BY_ID_QUERY,
      variables: { id },
      context: {
        headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
      },
    });
  }

  /**
   * Crear un nuevo header.
   * @param header Datos del nuevo header.
   * @param token Token de autenticación JWT.
   */
  createHeader(header: any, token: string) {
    const idHeader = Math.floor(Math.random() * 100000); // Generar un ID único
    return this.apollo.mutate({
      mutation: CREATE_HEADER_MUTATION,
      variables: {
        idHeader, // Incluye el ID aquí
        name: header.name,
        description: header.description,
        imageUrl: header.imageUrl || null,
        email: header.email,
        phoneNumber: header.phoneNumber || null,
        location: header.location || null,
        github: header.github || null,
      },
      context: {
        headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
      },
    });
  }

  /**
   * Actualizar un header existente.
   * @param header Datos del header a actualizar (debe incluir el idHeader).
   * @param token Token de autenticación JWT.
   */
  updateHeader(header: any, token: string) {
    return this.apollo.mutate({
      mutation: UPDATE_HEADER_MUTATION,
      variables: {
        idHeader: header.idHeader,
        name: header.name,
        description: header.description,
        imageUrl: header.imageUrl || null,
        email: header.email,
        phoneNumber: header.phoneNumber || null,
        location: header.location || null,
        github: header.github || null,
      },
      context: {
        headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
      },
    });
  }

  /**
   * Eliminar un header por ID.
   * @param id ID del header a eliminar.
   * @param token Token de autenticación JWT.
   */
  deleteHeader(id: number, token: string) {
    return this.apollo.mutate({
      mutation: DELETE_HEADER_MUTATION,
      variables: { id },
      context: {
        headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
      },
    });
  }
}
