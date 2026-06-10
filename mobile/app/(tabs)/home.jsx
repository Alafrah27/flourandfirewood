import React, { useState } from "react";
import { FlatList, View, RefreshControl, TextInput, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useGetProductsForMobile } from "../../services/productQuery";
import ProductItem from "../../components/productItem";
import Navbar from "../../components/navbar";
import SkeletonLoader from "../../components/SkeletonLoader";
import ErrorView from "../../components/ErrorView";
import FilterByCategory from "../../components/FilterByCategory";

const Home = () => {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    const { data: products, isLoading, refetch, error } = useGetProductsForMobile({
        limit: 30,
        random: false,
        category: selectedCategory || undefined
    });

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await refetch();
        } catch (e) {
            console.error("Failed to refresh products:", e);
        } finally {
            setRefreshing(false);
        }
    };

    if (isLoading) return <SkeletonLoader />;
    if (error) return <ErrorView onRetry={refetch} />;

    return (
        <SafeAreaView className="flex-1 bg-background">
            <FlatList
                data={products}
                renderItem={({ item }) => (

                    <View className="flex-1 max-w-[55%]">
                        <ProductItem item={item} />
                    </View>
                )}
                keyExtractor={(item, index) => item._id || index.toString()}
                numColumns={2}
                columnWrapperClassName="gap-7"
                contentContainerClassName="gap-7 px-5 pb-32"
                ListEmptyComponent={() => (
                    <View className="flex-1 justify-center items-center py-20">
                        <Text className="text-primary text-center font-poppins-medium text-sm">
                            No category available
                        </Text>
                    </View>
                )}
                ListHeaderComponent={() => (
                    <View className="my-5 gap-4">
                        <Navbar />
                        {/* Professional Search Input acting as Navigation Link */}
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => router.push('/search')}
                            className="flex-row items-center bg-white border border-slate-100 rounded-2xl px-4 py-3.5 shadow-sm shadow-slate-100/50 mb-2"
                        >
                            <Ionicons name="search" size={20} color="#41431B" />
                            <TextInput
                                className="flex-1 ml-3 text-gray-500 font-poppins text-sm p-0"
                                placeholder="Search for pizza, burger, pasta..."
                                placeholderTextColor="#a1a1aa"
                                editable={false}
                                pointerEvents="none"
                            />
                            <View className="border-l border-slate-200 pl-3">
                                <Ionicons name="options-outline" size={20} color="#41431B" />
                            </View>
                        </TouchableOpacity>

                        {/* Category Filter Pills */}
                        <FilterByCategory
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                        />
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#41431B"]}
                        tintColor="#41431B"
                    />
                }
            />
        </SafeAreaView>
    )
}

export default Home;