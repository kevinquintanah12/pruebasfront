import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { HttpHeaders } from '@angular/common/http';

// Queries GraphQL
const GET_DEGREES_QUERY = gql`
  query GetDegrees($search: String) {
    degrees(search: $search) {
      id
      degree
      university
      startDate
      endDate
    }
  }
`;

const GET_DEGREE_BY_ID_QUERY = gql`
  query GetDegreeById($id: Int!) {
    degreeById(id: $id) {
      id
      degree
      university
      startDate
      endDate
    }
  }
`;

// Mutaciones GraphQL
const CREATE_OR_UPDATE_EDUCATION_MUTATION = gql`
  mutation CreateOrUpdateEducation(
    $id: Int
    $degree: String!
    $university: String!
    $startDate: Date!
    $endDate: Date!
  ) {
    createOrUpdateEducation(
      id: $id
      degree: $degree
      university: $university
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      degree
      university
      startDate
      endDate
      postedBy {
        id
        username
      }
    }
  }
`;

const DELETE_EDUCATION_MUTATION = gql`
  mutation DeleteEducation($id: Int!) {
    deleteEducation(id: $id) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GraphqlEducationService {
  constructor(private apollo: Apollo) {}

  /**
   * Obtener títulos (grados) con búsqueda opcional.
   * @param search Cadena de búsqueda (si se pasa `null`, devuelve todos los títulos).
   * @param token Token de autenticación JWT.
   */
  getDegrees(search: string | null, token: string) {
    return this.apollo.query({
      query: GET_DEGREES_QUERY,
      variables: { search },
      context: {
        headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
      },
    });
  }

  /**
   * Obtener un título específico por ID.
   * @param id ID del título.
   * @param token Token de autenticación JWT.
   */
  getDegreeById(id: number, token: string) {
    return this.apollo.query({
      query: GET_DEGREE_BY_ID_QUERY,
      variables: { id },
      context: {
        headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
      },
    });
  }

  /**
   * Crear o actualizar un título académico.
   * @param education Datos de la educación (incluye `id` si es una actualización).
   * @param token Token de autenticación JWT.
   */
  createOrUpdateEducation(education: any, token: string) {
    return this.apollo.mutate({
      mutation: CREATE_OR_UPDATE_EDUCATION_MUTATION,
      variables: {
        id: education.id || null, // Pasar `null` si es un nuevo registro
        degree: education.degree,
        university: education.university,
        startDate: education.startDate,
        endDate: education.endDate,
      },
      context: {
        headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
      },
    });
  }

  /**
   * Eliminar un título académico por ID.
   * @param id ID del título a eliminar.
   * @param token Token de autenticación JWT.
   */
  deleteEducation(id: number, token: string) {
    return this.apollo.mutate({
      mutation: DELETE_EDUCATION_MUTATION,
      variables: { id },
      context: {
        headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
      },
    });
  }
}
