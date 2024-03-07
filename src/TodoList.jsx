import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { uploadData, remove } from 'aws-amplify/storage';
import * as mutations from './graphql/mutations';
import { listTodos } from './graphql/queries';

const client = generateClient();
const img__url = `https://meer-images113026-staging.s3.eu-north-1.amazonaws.com/public/`
function TodoList() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [fileData, setFileData] = useState();
  const [fileStatus, setFileStatus] = useState(false);


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

  const addTodoWithImage = async (newTodo, newFileData) => {
    if (newTodo.trim() !== '' && newFileData) {
      try {
        // Upload the file
         uploadData({
          key: newFileData.name,
          data: newFileData,
          options: {
            accessLevel: 'guest',
          }
        });

        // Create the todo with the associated image
        const newTodoId = Math.floor(Math.random() * 10000);
        const newTodoData = await client.graphql({
          query: mutations.createTodo,
          variables: {
            input: {
              id: newTodoId.toString(),
              name: newTodo.trim(),
              image: newFileData.name // Assuming the image field in GraphQL schema is named 'image'
            }
          }
        });

        const newTodoItem = newTodoData.data.createTodo;
        setTodos(prevTodos => [...prevTodos, newTodoItem]);
        setTodo('');
        setFileData(null);
        setFileStatus(true);
      } catch (error) {
        console.error('Error creating todo:', error);
      }
    }
  }

  const deleteTodo = async (id, imageName) => {
    try {
      await client.graphql({
        query: mutations.deleteTodo,
        variables: { input: { id } }
      });
  
      // Delete image from S3 bucket
      await remove({ key: imageName });
      
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
    <div className='m-auto w-[30rem]'>
      <div className='text-center'>
        <input type="text" onChange={(e) => setTodo(e.target.value)} value={todo} className='border-1 rounded bg-red-100 p-1 ' />
        <input type="file" onChange={(e) => setFileData(e.target.files[0])} />
        <button onClick={() => addTodoWithImage(todo, fileData)} className='py-1 px-2 bg-[green] rounded inline-block m-2 text-white'>Add todo with image</button>
      </div>
      {todos.map((todoItem) => (
        <div key={todoItem.id} className='p-2 border rounded my-2'>
          <li className='list-none'>{todoItem.name}</li>
          <img src={`${img__url}${todoItem.image}`} alt="Todo Image" className='w-[8rem]' /> 
          <div className='text-right p-1'>
            <button onClick={() => deleteTodo(todoItem.id, todoItem.image)} className='p-1 bg-[red] rounded inline-block m-2'>Delete</button>
            <button onClick={() => updateTodo(todoItem.id, prompt('Enter new todo name:', todoItem.name))} className='py-1 px-2 bg-[green] rounded inline-block m-2 text-white'>
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TodoList;
