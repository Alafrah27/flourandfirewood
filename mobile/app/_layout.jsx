import { Slot } from 'expo-router'
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider, useAuth } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import { Fonts } from '../constants/Fonts'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen';
import { useCreateUserForMobile } from '../services/cartQuery'

import "../global.css"
import { useEffect } from 'react';
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

const queryClient = new QueryClient();

function UserSync() {
  const { isSignedIn, isLoaded } = useAuth();
  const { mutate: syncUser } = useCreateUserForMobile();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      syncUser(undefined, {
        onSuccess: (data) => {
          console.log("User successfully synced to database:", data);
        },
        onError: (err) => {
          console.error("Failed to sync user to database:", err);
        }
      });
    }
  }, [isLoaded, isSignedIn]);

  return null;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({

    [Fonts.Poppins_Regular]: require('../assets/fonts/Poppins-Regular.ttf'),
    [Fonts.Poppins_Medium]: require('../assets/fonts/Poppins-Medium.ttf'),
    [Fonts.Poppins_Bold]: require('../assets/fonts/Poppins-Bold.ttf'),
  });



  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }



  return (
    <>
      <StatusBar style="dark" />
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <QueryClientProvider client={queryClient}>
          <UserSync />
          <Slot />
        </QueryClientProvider>
      </ClerkProvider>
    </>
  )
}

