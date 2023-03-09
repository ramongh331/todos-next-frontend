
import { MongoClient } from 'mongodb';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const formData = req.body;
  
      // Retrieve the user's session to get their email
      const session = await getSession({ req });
      const userEmail = session?.user?.email ?? null;
  
      // Connect to MongoDB instance
      const client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db(process.env.MONGODB_DB);
  
      // Insert the form data into the "todos" collection with the user's email
      await db.collection('todos').insertOne({
        ...formData,
        userEmail
      });
  
      client.close();
      res.redirect('/todos');
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }