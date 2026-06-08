
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchIcon = () => {
    return (
        <View className="flex-1 items-center justify-center">
                       <View className="items-center gap-3">
                           <View className="w-16 h-16 items-center justify-center rounded-full bg-slate-100">
                               <Ionicons 
                                   name="search" 
                                   size={32} 
                                   color="#41431B" 
                                   style={{ textAlign: 'center', textAlignVertical: 'center' }} 
                               />
                           </View>
                           <Text className="text-lg font-poppins-bold text-primary">Search for dishes</Text>
                       </View>
                   </View>
    )
}

export default SearchIcon

