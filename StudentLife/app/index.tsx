// app/index.tsx
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { verifyAuthWithServer } from '../services/authService';

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

  if (!ready) return null;

  if (!authed) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="../(tabs)/home" />;
}
