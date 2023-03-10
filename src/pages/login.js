import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"


export default function login (){
    const {data: session }= useSession()
    
    if (session){
        return (
            <>
            <h2>Welcome, {session.user.name}</h2>
            <img src={session.user.image} alt="" /> <br/>
            <Link href="/todos">View Todos</Link> <br/>
            <button onClick={() => signOut()}>Sign Out</button>
            </>
        )
    } else {
        return (
            <>
            <h2>You are not signed in</h2>
            <button onClick={() => signIn()}>Sign In</button>
            </>
        )
    }
}