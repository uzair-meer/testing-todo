import { useState, useEffect } from 'react';
import './App.css';
import { generateClient } from 'aws-amplify/api';
import * as mutations from './graphql/mutations';
import { listTodos } from './graphql/queries';
const client = generateClient();

function TodoList() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const result = await client.graphql({ query: listTodos });
        const todosFromGraphQL = result.data.listTodos.items;
        setTodos(todosFromGraphQL);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

const addTodo = async (newTodo) => {
    if (newTodo.trim() !== '') {
      try {
        const newTodoId = Math.floor(Math.random() * 1000000);
        const newTodoData = await client.graphql({
          query: mutations.createTodo,
          variables: {
            input: {
              id: newTodoId.toString(),
              name: newTodo.trim()
            }
          }
        });
  
        const newTodoItem = newTodoData.data.createTodo; // Rename the variable
        setTodos(prevTodos => [...prevTodos, newTodoItem]); // Use the renamed variable
        setTodo('');
      } catch (error) {
        console.error('Error creating todo:', error);
      }
    }
  };
  
  const deleteTodo = async (id) => {
    try {
      await client.graphql({
        query: mutations.deleteTodo,
        variables: { input: { id } }
      });

      setTodos(prevTodos => prevTodos.filter(todoItem => todoItem.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodo = async (id, updateTodo) => {
    try {
      const updatedTodoData = await client.graphql({
        query: mutations.updateTodo,
        variables: {
          input: { id, name: updateTodo.trim() }
        }
      });

      const updatedTodo = updatedTodoData.data.updateTodo;
      setTodos(prevTodos => prevTodos.map(todoItem => todoItem.id === id ? updatedTodo : todoItem));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div>
      <input type="text" onChange={(e) => setTodo(e.target.value)} value={todo} />
      <button onClick={() => addTodo(todo)}>Add todo</button>
      {todos.map((todoItem) => (
        <div key={todoItem.id} style={{padding:'1rem', margin:'1rem',textAlign:'left'}}>
          <li style={{listStyle:'none'}}>{todoItem.name}</li>
          <button onClick={() => deleteTodo(todoItem.id)}>Delete</button>
          <button onClick={() => updateTodo(todoItem.id, prompt('Enter new todo name:', todoItem.name))}>
            Edit
          </button>
        </div>
      ))}
    </div>
  );
}

export default TodoList;
