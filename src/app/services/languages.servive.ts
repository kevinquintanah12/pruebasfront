import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { HttpHeaders } from '@angular/common/http';

// Consultas GraphQL
const GET_LANGUAGES_QUERY = gql`
  query GetLanguages($search: String) {
    languages(search: $search) {
      id
      name
      proficiency
      startDate
      endDate
    }
  }
`;

const GET_LANGUAGE_BY_ID_QUERY = gql`
  query GetLanguageById($idLanguage: Int!) {
    languageById(idLanguage: $idLanguage) {
      id
      name
      proficiency
      startDate
      endDate
    }
  }
`;

// Mutación GraphQL
const CREATE_OR_UPDATE_LANGUAGE_MUTATION = gql`
  mutation CreateOrUpdateLanguage(
    $idLanguage: Int
    $name: String!
    $proficiency: String!
    $startDate: Date!
    $endDate: Date!
  ) {
    createOrUpdateLanguage(
      idLanguage: $idLanguage
      name: $name
      proficiency: $proficiency
      startDate: $startDate
      endDate: $endDate
    ) {
      idLanguage
      name
      proficiency
      startDate
      endDate
    }
  }
`;

const DELETE_LANGUAGE_MUTATION = gql`
  mutation DeleteLanguage($idLanguage: Int!) {
    deleteLanguage(idLanguage: $idLanguage) {
      idLanguage
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GraphqlLanguageService {
  constructor(private apollo: Apollo) {}

  private createAuthHeader(token: string) {
    return {
      headers: new HttpHeaders().set('Authorization', `JWT ${token}`),
    };
  }

  getLanguages(token: string, search?: string) {
    return this.apollo.query({
      query: GET_LANGUAGES_QUERY,
      variables: { search },
      context: this.createAuthHeader(token),
    });
  }

  getLanguageById(idLanguage: number, token: string) {
    return this.apollo.query({
      query: GET_LANGUAGE_BY_ID_QUERY,
      variables: { idLanguage },
      context: this.createAuthHeader(token),
    });
  }

  createOrUpdateLanguage(
    language: {
      idLanguage?: number; // Opcional
      name: string;
      proficiency: string;
      startDate: string;
      endDate: string;
    },
    token: string
  ) {
    return this.apollo.mutate({
      mutation: CREATE_OR_UPDATE_LANGUAGE_MUTATION,
      variables: language,
      context: this.createAuthHeader(token),
    });
  }

  deleteLanguage(idLanguage: number, token: string) {
    return this.apollo.mutate({
      mutation: DELETE_LANGUAGE_MUTATION,
      variables: { idLanguage },
      context: this.createAuthHeader(token),
    });
  }
}
