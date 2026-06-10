import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGetOrderByIdForMobile } from '../services/cartQuery';
import { currencyFormate } from '../constants/Currency';

const SuccessSkeleton = () => {
    const opacity = React.useRef(new Animated.Value(0.3)).current;

    React.useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, [opacity]);

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center px-8">
            <Animated.View style={{ opacity }} className="w-24 h-24 rounded-full bg-slate-200 mb-6" />
            <Animated.View style={{ opacity }} className="w-48 h-8 bg-slate-200 rounded mb-3" />
            <Animated.View style={{ opacity }} className="w-64 h-4 bg-slate-200 rounded mb-8" />
            <Animated.View style={{ opacity }} className="w-full h-40 bg-slate-200 rounded-3xl mb-6" />
            <Animated.View style={{ opacity }} className="w-full h-14 bg-slate-200 rounded-2xl" />
        </SafeAreaView>
    );
};

const PaymentSuccess = () => {
    const { orderId } = useLocalSearchParams();
    const router = useRouter();
    const { data: order, isLoading, error } = useGetOrderByIdForMobile(orderId);

    if (isLoading || !orderId) {
        return <SuccessSkeleton />;
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center px-8">
                <View className="w-24 h-24 rounded-full bg-rose-50 border-2 border-rose-200 items-center justify-center mb-6">
                    <Ionicons name="alert-circle-outline" size={48} color="#F43F5E" />
                </View>
                <Text className="text-2xl font-poppins-bold text-slate-800 text-center mb-2">
                    Something Went Wrong
                </Text>
                <Text className="text-sm font-poppins text-slate-500 text-center mb-8 px-4 leading-5">
                    {error.message || "We couldn't load your order details. Please check your orders in your profile."}
                </Text>
                <TouchableOpacity
                    onPress={() => router.replace('/home')}
                    className="w-full bg-primary py-4 rounded-2xl items-center justify-center shadow-md active:opacity-90"
                >
                    <Text className="text-white font-poppins-bold text-base">Back to Home</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center px-8">
            {/* Success Icon */}
            <View className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-200 items-center justify-center mb-6">
                <Ionicons name="checkmark-circle" size={52} color="#10B981" />
            </View>

            {/* Title */}
            <Text className="text-2xl font-poppins-bold text-slate-800 text-center mb-2">
                Order Confirmed!
            </Text>
            <Text className="text-sm font-poppins text-slate-500 text-center mb-8 px-4 leading-5">
                Your payment has been processed successfully. Your delicious meal is being prepared!
            </Text>

            {/* Order Details Card */}
            {order && (
                <View className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 gap-3 mb-8">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-xs font-poppins text-slate-400">Order ID</Text>
                        <Text className="text-xs font-poppins-bold text-slate-700">
                            #{order._id?.slice(-8).toUpperCase()}
                        </Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                        <Text className="text-xs font-poppins text-slate-400">Items</Text>
                        <Text className="text-xs font-poppins-bold text-slate-700">
                            {order.items?.length || 0} item(s)
                        </Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                        <Text className="text-xs font-poppins text-slate-400">Status</Text>
                        <View className="flex-row items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full">
                            <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <Text className="text-[10px] font-poppins-bold text-emerald-600 uppercase">
                                Paid
                            </Text>
                        </View>
                    </View>
                    <View className="border-t border-slate-200 my-1" />
                    <View className="flex-row justify-between items-center">
                        <Text className="text-sm font-poppins-bold text-slate-700">Total Paid</Text>
                        <Text className="text-lg font-poppins-bold text-primary">
                            {currencyFormate(order.totalPrice)}
                        </Text>
                    </View>
                </View>
            )}

            {/* Actions */}
            <TouchableOpacity
                onPress={() => router.replace('/home')}
                className="w-full bg-primary py-4 rounded-2xl items-center justify-center shadow-md active:opacity-90 flex-row gap-2"
            >
                <Ionicons name="bag-handle-outline" size={18} color="white" />
                <Text className="text-white font-poppins-bold text-base">Continue Shopping</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default PaymentSuccess;
