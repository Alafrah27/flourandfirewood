import { useAuth } from '@clerk/expo'
import { AuthView } from '@clerk/expo/native'
import { Redirect } from 'expo-router'
import { View,  StyleSheet, ActivityIndicator } from 'react-native'


export default function MainScreen() {
  const { isSignedIn, isLoaded } = useAuth({ treatPendingAsSignedOut: false })

  if (!isLoaded) {
    return (
      <View style={styles.centered}>
        
        <ActivityIndicator color={"#41431B"} size={"large"} />
      </View>
    )
  }

  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        <AuthView mode="signInOrUp" style={styles.authView} />
      </View>
    )
  }

  return <Redirect href="/home" />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  authView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', 
    padding: 40,
  },
})