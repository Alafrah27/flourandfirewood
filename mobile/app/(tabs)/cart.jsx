import React from 'react';
import { FlatList, View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyCart from '../../components/EmptyCart';
import SkeletonLoader from '../../components/SkeletonLoader';
import ErrorView from '../../components/ErrorView';
import {
    useGetCartForMobile,
    useUpdateCartItemForMobile,
    useRemoveFromCartForMobile
} from '../../services/cartQuery';
import { useAuth } from '@clerk/expo';
import CartItem from '../../components/CartItem';
import PaymentButton from '../../components/PaymentButton';

const Cart = () => {
    const { isSignedIn } = useAuth();
    const { data: cart, isLoading, error, refetch } = useGetCartForMobile();
    const { mutateAsync: updateCartItem } = useUpdateCartItemForMobile();
    const { mutateAsync: removeFromCart } = useRemoveFromCartForMobile();

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveItem(productId);
            return;
        }
        try {
            await updateCartItem({ productId, quantity: newQuantity });
        } catch (err) {
            Alert.alert("Error", err.message || "Failed to update quantity");
        }
    };

    const handleRemoveItem = async (productId) => {
        Alert.alert(
            "Remove Item",
            "Are you sure you want to remove this item from your cart?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await removeFromCart(productId);
                        } catch (err) {
                            Alert.alert("Error", err.message || "Failed to remove item");
                        }
                    }
                }
            ]
        );
    };

    if (!isSignedIn) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
                <Text className="text-lg font-poppins-medium text-slate-500 text-center mb-4">
                    Please log in to view your cart
                </Text>
            </SafeAreaView>
        );
    }

    if (isLoading) return <SkeletonLoader />;
    if (error) return <ErrorView onRetry={refetch} />;



    return (
        <SafeAreaView className="flex-1 bg-white" >
            <FlatList
                data={cart?.products || []}
                keyExtractor={(item, index) => item.product?._id || index.toString()}
                renderItem={({ item }) => <CartItem item={item} onQuantityChange={handleQuantityChange} onRemove={handleRemoveItem} />}
                contentContainerClassName="gap-3 px-3 pb-32"
                ListHeaderComponent={() => (
                    <View className="px-5 pt-6 pb-8 mb-1">
                        <Text className="text-2xl font-poppins-bold text-primary">My Cart</Text>
                    </View>
                )}
                ListFooterComponent={() => cart?.products?.length > 0 ? (
                    <View className="px-5 py-6 gap-4">
                        <Text className="text-xl font-poppins-bold text-primary mb-2">Order Summary</Text>
                        <View className="flex-row justify-between items-center">
                            <Text className="text-sm font-poppins-medium text-slate-500">Total</Text>
                            <Text className="text-sm font-poppins-medium text-primary">${cart?.totalPrice}</Text>
                        </View>
                        <View className="flex-row justify-between items-center">
                            <Text className="text-sm font-poppins-medium text-slate-500">Delivery Fee </Text>
                            <Text className="text-sm font-poppins-medium text-primary">free</Text>
                        </View>
                        <View className="my-5">
                            <PaymentButton />
                        </View>
                    </View>
                ) : null}
                ListEmptyComponent={<EmptyCart />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            />


        </SafeAreaView>
    );
};

export default Cart;