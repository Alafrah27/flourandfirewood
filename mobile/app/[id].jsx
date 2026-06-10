import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity, Animated, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'

import { useLocalSearchParams } from 'expo-router'
import { useGetProductByIdForMobile } from '../services/productQuery'
import { getImageKitUrl } from '../services/imagekit'
import Ionicons from '@expo/vector-icons/Ionicons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { currencyFormate } from '../constants/Currency'
import SideMenu from '../components/SideMenu'
import { useAddToCartForMobile } from '../services/cartQuery'
import { useAuth } from '@clerk/expo'

const DetailSkeleton = () => {
    const opacity = React.useRef(new Animated.Value(0.3)).current;

    React.useEffect(() => {
        const pulse = Animated.sequence([
            Animated.timing(opacity, {
                toValue: 0.7,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0.3,
                duration: 800,
                useNativeDriver: true,
            })
        ]);

        const loop = Animated.loop(pulse);
        loop.start();

        return () => {
            loop.stop();
        };
    }, [opacity]);

    return (
        <SafeAreaView className='flex-1 bg-background'>
            <ScrollView
                className='flex-1 bg-background'
                showsVerticalScrollIndicator={false}>
                <View className="relative w-full pt-16">
                    {/* Centered Image Skeleton */}
                    <View className="items-center justify-center py-4">
                        <Animated.View
                            style={{
                                width: 260,
                                height: 260,
                                opacity
                            }}
                            className="bg-slate-200 rounded-3xl"
                        />
                    </View>

                    {/* Header overlay skeleton */}
                    <View className="w-full flex-row justify-between items-center px-5 absolute z-10 top-20 left-0 right-0">
                        <View className="w-10 h-10 rounded-full bg-slate-200" />
                        <View className="w-20 h-6 bg-slate-200 rounded-full" />
                        <View className="w-10 h-10 rounded-full bg-slate-200" />
                    </View>

                    {/* Text Details Skeletons */}
                    <View className="flex-col gap-4 w-full max-w-3xl mx-auto px-5 mt-6">
                        {/* Name */}
                        <Animated.View style={{ opacity }} className="w-1/2 h-7 bg-slate-200 rounded" />

                        {/* Description */}
                        <View className="gap-2 mt-1">
                            <Animated.View style={{ opacity }} className="w-[90%] h-4 bg-slate-200 rounded" />
                            <Animated.View style={{ opacity }} className="w-[80%] h-4 bg-slate-200 rounded" />
                            <Animated.View style={{ opacity }} className="w-[45%] h-4 bg-slate-200 rounded" />
                        </View>

                        {/* Rating */}
                        <View className="flex-row items-center gap-2 mt-1">
                            <View className="w-5 h-5 rounded bg-slate-200" />
                            <Animated.View style={{ opacity }} className="w-32 h-4 bg-slate-200 rounded" />
                        </View>

                        {/* Price */}
                        <Animated.View style={{ opacity }} className="w-24 h-8 bg-slate-200 rounded self-end mt-2" />
                    </View>

                    {/* Sides Title & List Skeleton */}
                    <View className="px-5 mt-6 gap-3">
                        <Animated.View style={{ opacity }} className="w-20 h-5 bg-slate-200 rounded" />
                        <View className="flex-row gap-4 mt-2">
                            {[1, 2, 3].map((i) => (
                                <View key={i} className="flex-col gap-2 px-4 py-3 rounded-xl border border-slate-100 items-center w-24">
                                    <Animated.View style={{ opacity }} className="w-12 h-12 rounded-full bg-slate-200" />
                                    <Animated.View style={{ opacity }} className="w-12 h-3 bg-slate-200 rounded" />
                                    <Animated.View style={{ opacity }} className="w-8 h-3 bg-slate-200 rounded" />
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Bar Skeleton */}
            <View className="flex-row items-center justify-between border-t border-slate-100 px-6 py-4 pb-10 pt-10">
                <View className="flex-row items-center gap-4">
                    <View className="w-8 h-8 rounded-full bg-slate-200" />
                    <View className="w-6 h-5 bg-slate-200 rounded" />
                    <View className="w-8 h-8 rounded-full bg-slate-200" />
                </View>
                <View className="w-36 h-12 rounded-2xl bg-slate-200 ml-6" />
            </View>
        </SafeAreaView>
    );
};

const OrderDetail = () => {
    const [quantity, setQuantity] = useState(1);
    const [selectedSides, setSelectedSides] = useState([]);
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { data: productDetails, isLoading, error } = useGetProductByIdForMobile(id)
    const { mutateAsync: addToCart, isPending: isAdding } = useAddToCartForMobile();

    const handleAddToCart = async () => {
        if (!isSignedIn) {
            Alert.alert(
                "You are not logged in",
                "Please log in to add items to your cart",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                    },

                ]
            )
            return;
        }

        try {
            const data = await addToCart({
                productId: id,
                quantity,
                sides: selectedSides,
            })
            Alert.alert("Success", "Item added to cart successfully!");
        } catch (error) {
            Alert.alert("Error", error.message || "Failed to add item to cart");
        }
    }

    const toggleSide = (sideName) => {
        if (selectedSides.includes(sideName)) {
            setSelectedSides(selectedSides.filter(name => name !== sideName));
        } else {
            setSelectedSides([...selectedSides, sideName]);
        }
    };

    // Calculate dynamic pricing
    const basePrice = productDetails?.productPrice || 0;
    const sidesPrice = selectedSides.reduce((sum, sideName) => {
        const sideItem = productDetails?.side?.find(s => s.side_name === sideName);
        return sum + (sideItem?.side_price || 0);
    }, 0);
    const totalPrice = (basePrice + sidesPrice) * quantity;

    if (error) {
        return <View className="flex-1 items-center justify-center bg-background">
            <Text className="text-primary font-poppins-medium">Error fetching product details</Text>
        </View>
    }
    if (isLoading) {
        return <DetailSkeleton />
    }

    return (
        <>

            <SafeAreaView className='flex-1 bg-background'>
                <ScrollView
                    className='flex-1 bg-background'
                    showsVerticalScrollIndicator={false}>
                    <View className="relative w-full pt-16">
                        <Image
                            source={{ uri: getImageKitUrl(productDetails.productImage, 300, 300) }}
                            style={{ height: Dimensions.get('window').height / 2.25 }}
                            className="rounded-b-3xl text-center"
                            resizeMode="contain"
                        />
                        <View className="w-full flex-row justify-between items-center px-5 absolute z-10 top-20 left-0 right-0">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="w-10 h-10 bg-primary rounded-full items-center justify-center shadow-sm">
                                <Ionicons name="arrow-back" size={22} color="white" />
                            </TouchableOpacity>
                            <Text className='text-primary font-poppins-bold text-lg'>
                                Details
                            </Text>
                            <TouchableOpacity className="w-10 h-10 bg-primary rounded-full items-center justify-center shadow-sm">
                                <Ionicons name="heart-outline" size={22} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-col gap-3 w-full max-w-3xl mx-auto px-5 mt-4">
                            <Text className="text-primary font-poppins-bold tracking-wide text-xl" >
                                {productDetails.productName}
                            </Text>
                            <Text className=' font-poppins-medium tracking-wide text-md'>
                                {productDetails.productDescription}
                            </Text>
                            {/* demo rating star */}
                            <View className="flex-row items-center">
                                <Ionicons name="star" size={20} color="gold" />
                                <Text className="text-primary font-poppins-medium ml-1">
                                    {productDetails.rating}
                                </Text>
                                <Text className="text-gray-500 ml-1 text-end">
                                    ({productDetails.numReviews} reviews)
                                </Text>
                            </View>
                            {/* pric */}
                            <Text className="text-primary font-poppins-bold text-2xl text-right w-full mt-2">
                                {currencyFormate(productDetails.productPrice)}
                            </Text>
                        </View>
                        {/* side menu */}
                        <View className="w-full mt-6 px-5">
                            <SideMenu 
                                productDetails={productDetails} 
                                selectedSides={selectedSides}
                                onToggleSide={toggleSide}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
            <View
                className="border-t border-slate-100 px-6 py-5 pb-10 pt-5 bg-white"
            >
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-gray-400 font-poppins-medium text-xs uppercase tracking-wider">Total Price</Text>
                        <Text className="text-primary font-poppins-bold text-2xl mt-0.5">{currencyFormate(totalPrice)}</Text>
                    </View>
                    
                    <View className='flex-row items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-1.5'>
                        <TouchableOpacity 
                            onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
                            className="active:opacity-70 p-1"
                        >
                            <Ionicons name="remove" size={20} color="#41431B" />
                        </TouchableOpacity>
                        <Text className="text-primary font-poppins-bold text-base min-w-[20px] text-center">
                            {quantity}
                        </Text>
                        <TouchableOpacity 
                            onPress={() => setQuantity(prev => prev + 1)}
                            className="active:opacity-70 p-1"
                        >
                            <Ionicons name="add" size={20} color="#41431B" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleAddToCart}
                    disabled={isAdding}
                    className={`w-full bg-primary py-4 rounded-2xl items-center justify-center shadow-md active:opacity-90 mt-4 ${isAdding ? 'opacity-50' : ''}`}
                >
                    {isAdding ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text className="text-white font-poppins-bold text-base">
                            Add to Cart
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </>

    )
}

export default OrderDetail