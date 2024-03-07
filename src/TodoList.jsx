import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import * as mutations from './graphql/mutations';
import { listTodos } from './graphql/queries';
import { uploadData } from 'aws-amplify/storage';
const client = generateClient();

function TodoList() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [fileData, setFileData] = useState();
  const [fileStatus, setFileStatus] = useState(false)

  const uploadFile = async () => {
    try {
      const result = await uploadData({
        key: fileData.name,
        data: fileData,
        options: {
          accessLevel: 'guest', // Adjust the access level as needed
          // You can include an optional progress callback if needed
          // onProgress: (progress) => console.log(`Progress: ${progress.loaded}/${progress.total}`)
        }
      });
      console.log('Succeeded: ', result); // Log the successful upload result
      setFileStatus(true);
    } catch (error) {
      console.log('Error: ', error);
    }
  };
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
        const newTodoId = Math.floor(Math.random() * 10000);
        const newTodoData = await client.graphql({
          query: mutations.createTodo,
          variables: {
            input: {
              id: newTodoId.toString(),
              name: newTodo.trim()
            }
          }
        });
  
        const newTodoItem = newTodoData.data.createTodo; 
        setTodos(prevTodos => [...prevTodos, newTodoItem]);
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
    <div className='m-auto w-[30rem]'>
     <div className='text-center'>
     <input type="text" onChange={(e) => setTodo(e.target.value)} value={todo} className='border-1 rounded bg-red-100 p-1 ' />
      <button onClick={() => addTodo(todo)} className='py-1 px-2 bg-[green] rounded inline-block m-2 text-white'>Add todo</button>
     </div>
     <div>
     <input type="file" onChange={(e) => setFileData(e.target.files[0])} />
     <button onClick={uploadFile} className='py-1 px-2 bg-[green] rounded inline-block m-2 text-white'>Upload File</button>
      {fileStatus ? 'file uploaded successfule':''}
     </div>
      {todos.map((todoItem) => (
        <div key={todoItem.id} className='p-2 border rounded my-2'>
          <li className='list-none'>{todoItem.name}</li>
         <div className=' text-right p-1'>
         <button onClick={() => deleteTodo(todoItem.id)} className='p-1 bg-[red] rounded inline-block m-2'>Delete</button>
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
