import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ErrorView = ({ message, onRetry }) => {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 items-center justify-center px-6">
                {/* Warning Icon Backdrop */}
                <View className="w-20 h-20 items-center justify-center rounded-full bg-red-50 mb-5">
                    <Ionicons 
                        name="cloud-offline-outline" 
                        size={42} 
                        color="#ef4444" 
                        style={{ textAlign: 'center', textAlignVertical: 'center' }}
                    />
                </View>

                {/* Error text */}
                <Text className="text-xl font-poppins-bold text-slate-800 text-center mb-2">
                    Something went wrong
                </Text>
                <Text className="text-sm font-poppins text-slate-500 text-center mb-8 px-4 leading-5">
                    {message || "We encountered an error loading the menu. Please check your network and try again."}
                </Text>

                {/* Retry Button */}
                {onRetry && (
                    <TouchableOpacity 
                        onPress={onRetry} 
                        className="bg-primary py-3.5 px-10 rounded-full shadow-sm"
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-poppins-bold text-base">
                            Try Again
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

export default ErrorView;
