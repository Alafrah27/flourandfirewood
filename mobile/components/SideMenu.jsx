
import { FlatList, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native'
import { getImageKitUrl } from '../services/imagekit'
import { currencyFormate } from '../constants/Currency'

const SideMenu = ({ productDetails, selectedSides = [], onToggleSide }) => {
    return (
        <FlatList
            data={productDetails?.side || []}
            keyExtractor={(item) => item._id || item.side_name}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3 py-2"
            renderItem={({ item }) => {
                const isSelected = selectedSides.includes(item.side_name);
                return (
                    <TouchableOpacity 
                        onPress={() => onToggleSide && onToggleSide(item.side_name)}
                        className={`flex-col gap-1 px-4 py-3 rounded-xl border items-center w-24 ${
                            isSelected 
                                ? 'border-[#41431B] bg-[#41431B]/5' 
                                : 'border-slate-100 bg-white'
                        }`}
                    >
                        <View className="">
                            <Image source={{ uri: getImageKitUrl(item.side_image, 100, 100) }} className="w-12 h-12 rounded-full" />
                        </View>
                        <Text className="font-poppins-medium text-xs text-slate-700 text-center" numberOfLines={1}>
                            {item.side_name}
                        </Text>
                        <Text className="font-poppins-bold text-xs text-[#41431B]">
                            +{currencyFormate(item.side_price)}
                        </Text>
                    </TouchableOpacity>
                )
            }}
            ListEmptyComponent={
                <View 
                    style={{ width: Dimensions.get('window').width - 40 }}
                    className="items-center justify-center my-6"
                >
                    <Text className="text-gray-400 font-poppins-medium text-sm">
                        No sides available
                    </Text>
                </View>
            }

        />
    )
}

export default SideMenu