/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onCreateTodo(filter: $filter) {
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
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onUpdateTodo(filter: $filter) {
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
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo($filter: ModelSubscriptionTodoFilterInput) {
    onDeleteTodo(filter: $filter) {
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
export const onCreateUserTodoCount = /* GraphQL */ `
  subscription OnCreateUserTodoCount(
    $filter: ModelSubscriptionUserTodoCountFilterInput
  ) {
    onCreateUserTodoCount(filter: $filter) {
      id
      userID
      count
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUserTodoCount = /* GraphQL */ `
  subscription OnUpdateUserTodoCount(
    $filter: ModelSubscriptionUserTodoCountFilterInput
  ) {
    onUpdateUserTodoCount(filter: $filter) {
      id
      userID
      count
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUserTodoCount = /* GraphQL */ `
  subscription OnDeleteUserTodoCount(
    $filter: ModelSubscriptionUserTodoCountFilterInput
  ) {
    onDeleteUserTodoCount(filter: $filter) {
      id
      userID
      count
      createdAt
      updatedAt
      __typename
    }
  }
`;
