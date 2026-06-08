import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { currencyFormate } from '../constants/Currency';
import { getImageKitUrl } from '../services/imagekit';

const ProductItem = ({ item }) => {
    return (
        <TouchableOpacity className= "   py-5 px-3.5 pt-10 flex items-center justify-end bg-white shadow-md shadow-black/10 rounded-3xl "
            style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787' } : {}}>
            <Image
                className="size-40 "
                resizeMode="contain"
                source={{ uri: getImageKitUrl(item.productImage, 160, 160) }}
            />

            <View className="mt-3">
                <Text className="text-center text-primary font-poppins-medium"
                    numberOfLines={1}
                >
                    {item.productName}
                </Text>
                <Text className="text-center text-primary font-poppins-bold mt-1">
                    {currencyFormate(item.productPrice)}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default ProductItem;