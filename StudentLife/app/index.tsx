// app/index.tsx
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { verifyAuthWithServer } from '../services/authService'; // adjust path

export default function Index() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      const auth = await verifyAuthWithServer();
      setAuthed(!!auth);
      setReady(true);
    })();
  }, []);

  if (!ready) return null; // or a loading component

  if (!authed) {
    return <Redirect href="/login" />; //go login
  }

  return <Redirect href="/home" />; //go home
}
