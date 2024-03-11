
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import TodoList from './TodoList';


function App({ signOut, user }) {
  return (
    <>
    <h2 className='text-center my-3 text-[1.2rem]'> Amplified todo's List</h2>
    <TodoList  user={user}/>
      <button onClick={signOut} className='p-1 bg-[red] rounded inline-block m-2  text-right'>Sign out</button>
    </>
  );
}

export default withAuthenticator(App);