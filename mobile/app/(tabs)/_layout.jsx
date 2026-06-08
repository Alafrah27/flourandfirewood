
import { Tabs, Redirect } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { Text, View, ActivityIndicator } from "react-native";
import { Fonts } from "../../constants/Fonts";
import { useAuth } from '@clerk/expo'



const TabBarIcon = ({ focused, icon, title }) => (
    <View className="flex min-w-20 items-center justify-center min-h-full gap-1 mt-12 ">
        <Ionicons name={icon} size={24} color={focused ? '#41431B' : 'gray'} />
        <Text className={'text-sm tracking-wider'} style={focused ? { color: '#41431B', fontFamily: Fonts.Poppins_Medium } : { color: 'gray', fontFamily: Fonts.Poppins_Medium }}>
            {title}
        </Text>
    </View>
)

export default function TabLayout() {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#41431B" />
            </View>
        )
    }

    if (!isSignedIn) {
        return <Redirect href="/" />
    }


    return (
        <Tabs
            safeAreaInsets={{ bottom: 0 }}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 80,
                },
                tabBarStyle: {
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50,
                    marginHorizontal: 20,
                    height: 80,
                    position: 'absolute',
                    bottom: 40,
                    backgroundColor: 'white',
                    shadowColor: '#1a1a1a',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5,
                    paddingBottom: 0,
                }

            }}
        >
            <Tabs.Screen name="home"
                options={{
                    title: "Home",
                    animation: 'fade',
                    tabBarIcon: ({ focused }) => <TabBarIcon icon={focused ? "home" : "home-outline"} title="Home" />
                }}
                
            />
            <Tabs.Screen name="search"
                options={{
                    title: "Search",
                    animation: 'fade',
                    tabBarIcon: ({ focused }) => <TabBarIcon icon={focused ? "search" : "search-outline"} title="Search" />
                }}
            />
            <Tabs.Screen name="cart"
                options={{
                    title: "Cart",
                    animation: 'fade',
                    tabBarIcon: ({ focused }) => <TabBarIcon icon={focused ? "cart" : "cart-outline"} title="Cart" />
                }}
            />
            <Tabs.Screen name="profile"
                options={{
                    animation: 'fade',
                    title: "Profile",
                    tabBarIcon: ({ focused }) => <TabBarIcon icon={focused ? "person" : "person-outline"} title="Profile" />
                }}
            />

        </Tabs>
    )
}