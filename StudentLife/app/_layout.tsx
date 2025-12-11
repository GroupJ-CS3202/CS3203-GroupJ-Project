import { Stack } from 'expo-router';

import { SessionProvider, useSession} from '../ctx';
import { SplashScreenController } from '../splash';

export default function Root() {
  // Set up the auth context and render your layout inside of it.
  return (
    <SessionProvider>
      <SplashScreenController />
      <RootNavigator />
    </SessionProvider>
  );
}

// Create a new component that can access the SessionProvider context later.
function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" options={{headerShown: false}}/>
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="login" options={{headerShown: false}}/>
      </Stack.Protected>
    </Stack>
  );
}
