import React from 'react'
import { Image, Text, View, TouchableOpacity, Pressable } from 'react-native'
import { getImageKitUrl } from '../services/imagekit'
import { currencyFormate } from '../constants/Currency'
import Ionicons from '@expo/vector-icons/Ionicons';


const CartItem = ({ item, onQuantityChange, onRemove }) => {
    const sideAmount = item?.sides?.reduce((acc, side) => acc + side.side_price, 0) || 0
    const totalAmount = ((item?.price || item.product?.productPrice || 0) + sideAmount) * item?.quantity
    return (
        <View className="flex-row justify-between items-center gap-4 w-full max-5-md mx-auto bg-slate-100 px-2 py-3 rounded-lg">

            <View className="flex-row items-start gap-4 flex-1">
                <Image
                    className="w-20 h-20 rounded-2xl"
                    source={{ uri: getImageKitUrl(item.product?.productImage, 150, 150) }}
                    resizeMode="contain"
                />
                <View className="flex-1">
                    <Text
                        className="text-sm font-poppins text-slate-500"
                        numberOfLines={1}>{item.quantity} x {item.product?.productName}</Text>

                    <View className="flex-row flex-wrap gap-2 items-center mt-1">
                        {item.sides && item.sides.length > 0 ? item.sides?.map((side) => (
                            <View key={side._id || side.side_name} className="flex-row items-center gap-1">
                                <Text className="text-xs mr-2 text-slate-400 font-poppins-medium">{side.side_name}</Text>
                            </View>
                        )) : null}
                    </View>

                    <Text className='font-poppins-bold text-primary mt-1'>
                        {currencyFormate(totalAmount)}
                    </Text>

                </View>
            </View>

            <View className="flex-row items-center gap-3 px-2 py-3">
                <View className="flex-row items-center gap-3 p-3">
                    <TouchableOpacity onPress={() => onQuantityChange && onQuantityChange(item.product?._id, item.quantity - 1)}>
                        <Ionicons name="remove" size={20} color="black" />
                    </TouchableOpacity>
                    <Text className='font-poppins-bold'>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => onQuantityChange && onQuantityChange(item.product?._id, item.quantity + 1)}>
                        <Ionicons name="add" size={20} color="black" />
                    </TouchableOpacity>
                </View>
                <Pressable onPress={() => onRemove && onRemove(item.product?._id)} className="p-1 active:opacity-75">
                    <Ionicons name="trash-outline" size={20} color="black" />
                </Pressable>
            </View>
        </View>

    )
}

export default CartItem