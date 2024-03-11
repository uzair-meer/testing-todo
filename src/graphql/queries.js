/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      image
      userId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        image
        userId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserTodoCount = /* GraphQL */ `
  query GetUserTodoCount($id: ID!) {
    getUserTodoCount(id: $id) {
      id
      userID
      count
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUserTodoCounts = /* GraphQL */ `
  query ListUserTodoCounts(
    $filter: ModelUserTodoCountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserTodoCounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        count
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
