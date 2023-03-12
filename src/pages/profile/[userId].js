import { signOut, signIn, getSession } from "next-auth/react";
import { MongoClient } from "mongodb";



export default function ViewProfile({ todos }) {
  // if(session){
    return (<>
    <h2>Hello this is your profile</h2>
    <h3>All Todos</h3>
          {todos.map((todo) => (
            <div key={todo._id}>
              <h4>{todo.todo}</h4>
              <p>{todo.details}</p>
              <p>{todo.userEmail}</p>
            </div>
          ))}
    </>)
  // } else {
  //   return (
  //     <>
  //       <h2>You are not signed in</h2>
  //       <button onClick={() => signIn()}>Sign In</button>
  //     </>
  //   );
  // }
  
}

export async function getStaticProps(context) {
  const session = await getSession(context);

  console.log(session)

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  
  // const userEmail = session.user.email;
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db(process.env.MONGODB_DB);

  const todos = await db.collection("todos").find().toArray();

  client.close();

  const serializedTodos = JSON.parse(JSON.stringify(todos));

  return {
    props: {
      session,
      todos: serializedTodos,
    },
  };
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db(process.env.MONGODB_DB);

  const users = await db.collection("users").find().toArray();

  const paths = users.map((user) => ({
    params: { userId: user._id.toString() },
  }));

  return { paths, fallback: false };
}
