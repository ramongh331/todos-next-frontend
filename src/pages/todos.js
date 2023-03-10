import Head from "next/head";
import { signOut, signIn, getSession } from "next-auth/react";
import { MongoClient } from "mongodb";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const userEmail = session.user.email;
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db(process.env.MONGODB_DB);

  const todos = await db.collection("todos").find({ userEmail }).toArray();

  client.close();

  const serializedTodos = JSON.parse(JSON.stringify(todos));

  return {
    props: {
      session,
      todos: serializedTodos,
    },
  };
}

export default function Home({ session, todos }) {
  if (session) {
    return (
      <>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <button onClick={() => signOut()}>Sign Out</button>
          <h2>Hi, {session.user.name}</h2>
          <h3>All Todos</h3>
          {todos.map((todo) => (
            <div key={todo._id}>
              <h4>{todo.todo}</h4>
              <p>{todo.details}</p>
              <p>{todo.userEmail}</p>
            </div>
          ))}
          <form action="/api/submit-form" method="POST">
            <input type="text" name="todo" placeholder="Todo Title" />
            <input type="text" name="details" placeholder="Todo Details" />
            <button type="submit">Add Todo</button>
          </form>
        </main>
      </>
    );
  } else {
    return (
      <>
        <h2>You are not signed in</h2>
        <button onClick={() => signIn()}>Sign In</button>
      </>
    );
  }
}
