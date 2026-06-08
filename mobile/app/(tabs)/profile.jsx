import React, { useState, useRef, useEffect } from 'react';
import { Text, View, Image, Animated, TouchableOpacity, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser, useAuth } from "@clerk/expo";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const CustomSwitch = ({ value, onValueChange }) => {
    const animValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animValue, {
            toValue: value ? 1 : 0,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [value, animValue]);

    const backgroundColor = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#cbd5e1', '#41431B']
    });

    const translateX = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 18]
    });

    return (
        <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={() => onValueChange(!value)}
        >
            <Animated.View 
                style={{ backgroundColor }} 
                className="w-10 h-6 rounded-full justify-center"
            >
                <Animated.View 
                    style={{ transform: [{ translateX }] }} 
                    className="w-5 h-5 rounded-full bg-white shadow-sm"
                />
            </Animated.View>
        </TouchableOpacity>
    );
};

const ProfileRow = ({ icon, title, rightElement, onPress }) => (
    <TouchableOpacity 
        onPress={onPress} 
        disabled={!onPress}
        className="flex-row items-center justify-between py-3.5"
    >
        <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
                <Ionicons name={icon} size={20} color="#41431B" />
            </View>
            <Text className="text-base font-poppins-medium text-slate-800">{title}</Text>
        </View>
        {rightElement ? rightElement : <Ionicons name="chevron-forward" size={18} color="#41431B" />}
    </TouchableOpacity>
);

const Profile = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const { signOut } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // Fallback names and image
    const userName = isLoaded && isSignedIn && user ? (user.fullName || user.firstName || 'Guest') : 'Guest';
    const userImage = isLoaded && isSignedIn && user ? user.imageUrl : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120';
    const userEmail = isLoaded && isSignedIn && user ? user.emailAddresses?.[0]?.emailAddress : '';

    return (
        <SafeAreaView className="flex-1 bg-background">
                    <ScrollView showsVerticalScrollIndicator={false} className="flex-1 bg-background" >
            <View className="flex-1 px-4 py-3">
                {/* Profile Header */}
                <View className='flex-row items-center gap-3 mb-6 mt-6 bg-slate-100 py-5 px-4 rounded-2xl'>
                    <Image
                        source={{ uri: userImage }}
                        className='w-14 h-14 rounded-full bg-gray-200'
                    />
                    <View>
                        <Text className="text-lg font-poppins-bold text-slate-800">{userName}</Text>
                        {userEmail ? (
                            <Text className="text-xs font-poppins text-slate-500">{userEmail}</Text>
                        ) : null}
                    </View>
                </View>

                {/* Quick actions row */}
                <View className="flex-row items-center justify-between mb-6" >
                    <View className="flex-1 mr-2.5 items-center gap-1.5 bg-slate-100 py-4 px-3 rounded-2xl">
                        <Ionicons name="location" size={22} color="#41431B" />
                        <Text className="text-sm font-poppins-bold text-slate-800">Addresses</Text>
                    </View>
                    <View className="flex-1 items-center gap-1.5 bg-slate-100 py-4 px-3 rounded-2xl">
                        <MaterialIcons name="delivery-dining" size={22} color="#41431B" />
                        <Text className="text-sm font-poppins-bold text-slate-800">Orders</Text>
                    </View>
                </View>

                {/* Settings list */}
                <View className="bg-white rounded-2xl px-4 py-2">
                    <ProfileRow 
                        icon="notifications-outline" 
                        title="Notifications" 
                        rightElement={
                            <CustomSwitch 
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                            />
                        }
                    />
                    <ProfileRow 
                        icon="pricetag-outline" 
                        title="Coupons" 
                        onPress={() => console.log('Coupons')}
                    />
                    <ProfileRow 
                        icon="call-outline" 
                        title="Contact Us" 
                        onPress={() => Linking.openURL('tel:00966555475591')}
                    />
                    <ProfileRow 
                        icon="briefcase-outline" 
                        title="Apply for a Job" 
                        onPress={() => console.log('Apply for job')}
                    />
                </View>

                {/* Standalone Log Out Button */}
                <TouchableOpacity 
                    onPress={() => signOut()}
                    className="mt-8 bg-red-100 py-4 px-6 rounded-2xl flex-row items-center justify-center gap-2"
                >
                    <Ionicons name="log-out-outline" size={22} color="#dc2626" />
                    <Text className="text-base font-poppins-bold text-red-600">Log Out</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile;