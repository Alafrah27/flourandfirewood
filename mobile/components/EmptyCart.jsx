import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from 'react'

const EmptyCart = () => {
    const router = useRouter();

    return (
        <View className="flex-1 items-center justify-center px-6">
            {/* Empty Cart Icon */}
            <View className="w-20 h-20 items-center justify-center rounded-full bg-slate-100 mb-5">
                <Ionicons
                    name="cart-outline"
                    size={40}
                    color="#41431B"
                    style={{ textAlign: 'center', textAlignVertical: 'center' }}
                />
            </View>

            {/* Text Messages */}
            <Text className="text-xl font-poppins-bold text-slate-800 text-center mb-2">
                Your Cart is Empty
            </Text>
            <Text className="text-sm font-poppins text-slate-500 text-center mb-8 px-4 leading-5">
                {"Looks like you haven't added anything to your cart yet. Go ahead and explore our menu to start ordering!"}
            </Text>

            {/* Explore Menu Button */}
            <TouchableOpacity
                onPress={() => router.push('/home')}
                className="bg-primary py-3.5 px-8 rounded-full shadow-sm"
            >
                <Text className="text-white font-poppins-bold text-base">
                    Explore Menu
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default EmptyCart
