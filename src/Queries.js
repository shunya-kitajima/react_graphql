import gql from "graphql-tag";

export const CREATE_USER = gql`
  mutation ($username: String!, $password: String!) {
    createUser(input: { username: $username, password: $password, email: "" }) {
      user {
        id
        username
      }
    }
  }
`;

export const GET_TOKEN = gql`
  mutation ($username: String!, $password: String!) {
    tokenAuth(input: { username: $username, password: $password }) {
      token
    }
  }
`;
