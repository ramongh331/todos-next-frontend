import { signOut, signIn, getSession } from "next-auth/react";
import { MongoClient } from "mongodb";

export async function getServerSideProps(context) {
  const session = await getSession(context)

  console.log(session)
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  
  const userId = context.query.userId
  const userEmail = session.user.email;

  // CONNECT TO MONGODB DATABASE
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db(process.env.MONGODB_DB);

  // QUERY FOR SPECIFIC DATA
  const user = db.collection("users").findOne({_id: userId});
  const todos = await db.collection("todos").find({ userEmail }).toArray();

  client.close();

  // SERIALIZE DATA AND TURN IT INTO JSON
  const serializedUser = JSON.parse(JSON.stringify(user));
  const serializedTodos = JSON.parse(JSON.stringify(todos));

  // ADD TO PROPS OBJECT TO EXTRACT AS PROPS IN THE PAGE JSX
  return {
    props: {
      user: serializedUser,
      todos: serializedTodos,
    }
  }

}


export default function ViewProfile({ user, todos }) {
  console.log(user)
  
  if(user){
    return (<>
    <h2>Hello {user.name}! This is your profile</h2>
    <h3>All Todos</h3>
          {todos.map((todo) => (
            <div key={todo._id}>
              <h4>{todo.todo}</h4>
              <p>{todo.details}</p>
              <p>{todo.userEmail}</p>
            </div>
          ))}
    </>)
  } else {
    return (
      <>
        <h2>You are not signed in</h2>
        <button onClick={() => signIn()}>Sign In</button>
      </>
    );
  }
  
}

