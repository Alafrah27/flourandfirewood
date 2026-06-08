import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetProductsForMobile } from "../../services/productQuery";
import ProductItem from "../../components/productItem";
import Navbar from "../../components/navbar";

const Home = () => {
    
    const { data: products, isLoading, refetch, error } = useGetProductsForMobile({
        limit: 30,
        random: false
    })
    console.log("products", JSON.stringify(products, null, 2))
    if (isLoading) return <View className="flex-1 bg-background items-center justify-center"><Text>Loading...</Text></View>
    if (error) return <View className="flex-1 bg-background items-center justify-center"><Text>Error...</Text></View>
    return (
        <SafeAreaView className="flex-1 bg-background">
            <FlatList
                data={products}
                renderItem={({ item, index }) => (

                    <View className="flex-1 max-w-[48%]">
                        <ProductItem item={item} />
                    </View>


                )}
                numColumns={2}
                columnWrapperClassName="gap-7"
                contentContainerClassName="gap-7 px-5 pb-32"
                ListHeaderComponent={() => (
                    <View className="my-5 gap-5">
                        <Navbar />
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default Home