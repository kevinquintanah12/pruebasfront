import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { HttpHeaders } from '@angular/common/http';


const GET_EXPERIENCES_QUERY = gql`
  query GetAllExperiences {
    experiences(search: "*") {
      id
      role
      company
      accomplishments
      startDate
      endDate
      location
    }
  }
`;

const GET_EXPERIENCE_BY_ID_QUERY = gql`
  query GetExperienceById($idWorkExperience: Int!) {
    experienceById(idWorkExperience: $idWorkExperience) {
      id
      role
      company
      accomplishments
      startDate
      endDate
      location
    }
  }
`;



const CREATE_EXPERIENCE_MUTATION = gql`
  mutation CreateWorkExperience(
    $idWorkExperience: Int
    $role: String!
    $company: String!
    $accomplishments: [String!]!
    $startDate: Date!
    $endDate: Date!
    $location: String!
  ) {
    createWorkExperience(
      idWorkExperience: $idWorkExperience
      role: $role
      company: $company
      accomplishments: $accomplishments
      startDate: $startDate
      endDate: $endDate
      location: $location
    ) {
      idWorkExperience
      role
      company
      accomplishments
      startDate
      endDate
      location
      postedBy {
        id
        username
      }
    }
  }
`;

const UPDATE_EXPERIENCE_MUTATION = gql`
  mutation UpdateWorkExperience(
    $idWorkExperience: Int!
    $role: String!
    $company: String!
    $accomplishments: [String!]!
    $startDate: Date!
    $endDate: Date!
    $location: String!
  ) {
    createWorkExperience(
      idWorkExperience: $idWorkExperience
      role: $role
      company: $company
      accomplishments: $accomplishments
      startDate: $startDate
      endDate: $endDate
      location: $location
    ) {
      idWorkExperience
      role
      company
      accomplishments
      startDate
      endDate
      location
      postedBy {
        id
        username
      }
    }
  }
`;

const DELETE_EXPERIENCE_MUTATION = gql`
  mutation DeleteWorkExperience($idWorkExperience: Int!) {
    deleteWorkExperience(idWorkExperience: $idWorkExperience) {
      idWorkExperience
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GraphqlWorkExperienceService {
  constructor(private apollo: Apollo) {}

  /**
   * Crear una nueva experiencia laboral.
   * @param experience Datos de la nueva experiencia.
   * @param token Token de autenticación JWT.
   */
  createExperience(experience: any, token: string) {
    const headers = new HttpHeaders({
      'Authorization': `JWT ${token}`,
      'Content-Type': 'application/json',
    });

    return this.apollo.mutate({
      mutation: CREATE_EXPERIENCE_MUTATION,
      variables: {
        idWorkExperience: null, // Cambiar según tu lógica
        role: experience.role,
        company: experience.company,
        accomplishments: experience.accomplishments,
        startDate: experience.startDate,
        endDate: experience.endDate,
        location: experience.location,
      },
      context: { headers },
    });
  }

  /**
   * Actualizar una experiencia laboral existente.
   * @param idWorkExperience ID de la experiencia laboral a actualizar.
   * @param experience Datos actualizados de la experiencia laboral.
   * @param token Token de autenticación JWT.
   */
  updateExperience(idWorkExperience: number, experience: any, token: string) {
    const headers = new HttpHeaders({
      'Authorization': `JWT ${token}`,
      'Content-Type': 'application/json',
    });

    return this.apollo.mutate({
      mutation: UPDATE_EXPERIENCE_MUTATION,
      variables: {
        idWorkExperience,
        role: experience.role,
        company: experience.company,
        accomplishments: experience.accomplishments,
        startDate: experience.startDate,
        endDate: experience.endDate,
        location: experience.location,
      },
      context: { headers },
    });
  }


  getWorkExperienceById(idWorkExperience: number, token: string) {
    const headers = new HttpHeaders({
      'Authorization': `JWT ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.apollo.query({
      query: GET_EXPERIENCE_BY_ID_QUERY,
      variables: { idWorkExperience },
      context: { headers },
    });
  }
  



  getWorkExperiences(token: string) {
    const headers = new HttpHeaders({
      'Authorization': `JWT ${token}`,
      'Content-Type': 'application/json',
    });

    return this.apollo.query({
      query: GET_EXPERIENCES_QUERY,
      context: { headers },
    });
  }

  /**
   * Eliminar una experiencia laboral.
   * @param idWorkExperience ID de la experiencia laboral a eliminar.
   * @param token Token de autenticación JWT.
   */
  deleteExperience(idWorkExperience: number, token: string) {
    const headers = new HttpHeaders({
      'Authorization': `JWT ${token}`,
      'Content-Type': 'application/json',
    });

    return this.apollo.mutate({
      mutation: DELETE_EXPERIENCE_MUTATION,
      variables: {
        idWorkExperience,
      },
      context: { headers },
    });
  }
}
