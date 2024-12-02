import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { HttpHeaders } from '@angular/common/http';

// Consultas GraphQL
const GET_SKILLS_QUERY = gql`
  query GetSkills {
    skills {
      id
      name
      level
      description
    }
  }
`;

const GET_SKILL_BY_ID_QUERY = gql`
  query GetSkillById($idSkill: Int!) {
    skillById(idSkill: $idSkill) {
      id
      name
      level
      description
    }
  }
`;

// Mutaciones GraphQL
const CREATE_SKILL_MUTATION = gql`
  mutation CreateSkill($name: String!, $level: String!, $description: String!) {
    createSkill(name: $name, level: $level, description: $description) {
      idSkill
      name
      level
      description
      user {
        id
        username
      }
    }
  }
`;

const UPDATE_SKILL_MUTATION = gql`
  mutation UpdateSkill(
    $idSkill: Int!,
    $name: String!,
    $level: String!,
    $description: String!
  ) {
    updateSkill(
      idSkill: $idSkill,
      name: $name,
      level: $level,
      description: $description
    ) {
      idSkill
      name
      level
      description
      user {
        id
        username
      }
    }
  }
`;

const DELETE_SKILL_MUTATION = gql`
  mutation DeleteSkill($idSkill: Int!) {
    deleteSkill(idSkill: $idSkill) {
      idSkill
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GraphqlSkillService {
  constructor(private apollo: Apollo) {}

  private createAuthHeader(token: string) {
    return {
      headers: new HttpHeaders().set('Authorization', `JWT ${token}`),
    };
  }

  /**
   * Obtener todas las habilidades del usuario.
   * @param token Token de autenticación JWT.
   */
  getSkills(token: string) {
    return this.apollo.query({
      query: GET_SKILLS_QUERY,
      context: this.createAuthHeader(token),
    });
  }

  /**
   * Obtener una habilidad específica por ID.
   * @param idSkill ID de la habilidad.
   * @param token Token de autenticación JWT.
   */
  getSkillById(idSkill: number, token: string) {
    return this.apollo.query({
      query: GET_SKILL_BY_ID_QUERY,
      variables: { idSkill },
      context: this.createAuthHeader(token),
    });
  }

  /**
   * Crear una nueva habilidad.
   * @param skill Datos de la nueva habilidad.
   * @param token Token de autenticación JWT.
   */
  createSkill(skill: { name: string; level: string; description: string }, token: string) {
    return this.apollo.mutate({
      mutation: CREATE_SKILL_MUTATION,
      variables: skill,
      context: this.createAuthHeader(token),
    });
  }

  /**
   * Actualizar una habilidad existente.
   * @param skill Datos actualizados de la habilidad.
   * @param token Token de autenticación JWT.
   */
  updateSkill(
    skill: { idSkill: number; name: string; level: string; description: string },
    token: string
  ) {
    return this.apollo.mutate({
      mutation: UPDATE_SKILL_MUTATION,
      variables: skill,
      context: this.createAuthHeader(token),
    });
  }

  /**
   * Eliminar una habilidad por ID.
   * @param idSkill ID de la habilidad a eliminar.
   * @param token Token de autenticación JWT.
   */
  deleteSkill(idSkill: number, token: string) {
    return this.apollo.mutate({
      mutation: DELETE_SKILL_MUTATION,
      variables: { idSkill },
      context: this.createAuthHeader(token),
    });
  }
}
