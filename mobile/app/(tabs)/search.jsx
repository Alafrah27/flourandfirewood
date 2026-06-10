
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useGetProductsForMobile } from "../../services/productQuery";
import ProductItem from "../../components/productItem";
import FilterByCategory from "../../components/FilterByCategory";

const Search = () => {
    const router = useRouter();
    const [searchText, setSearchText] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // Debounce the search input by 400ms to optimize API usage
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchText);
        }, 400);

        return () => {
            clearTimeout(handler);
        };
    }, [searchText]);

    // Fetch products filtered by search text and/or selected category
    const { data: products, isLoading, isFetching } = useGetProductsForMobile(
        {
            search: debouncedSearch || undefined,
            category: selectedCategory || undefined
        },
        { enabled: !!debouncedSearch || !!selectedCategory }
    );

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* Search Header */}
            <View className="flex-row items-center px-5 py-4 gap-3 bg-white border-b border-slate-100">
                <TouchableOpacity
                    onPress={() => router.push('/home')}
                    className="p-2.5 bg-slate-50 rounded-2xl"
                >
                    <Ionicons name="arrow-back" size={22} color="#41431B" />
                </TouchableOpacity>

                <View className="flex-1 flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5">
                    <Ionicons name="search" size={18} color="#41431B" />
                    <TextInput
                        className="flex-1 ml-3 text-slate-700 font-poppins text-sm p-0"
                        placeholder="Search for pizza, burger, pasta..."
                        placeholderTextColor="#a1a1aa"
                        value={searchText}
                        onChangeText={setSearchText}
                        autoFocus={true}
                        clearButtonMode="while-editing"
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText("")}>
                            <Ionicons name="close-circle" size={18} color="#a1a1aa" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Results / Idle State */}
            {!debouncedSearch ? (
                <View className="flex-1 items-center justify-center bg-background px-8">
                    <View className="w-20 h-20 items-center justify-center rounded-3xl bg-white shadow-sm shadow-slate-100/50 mb-4">
                        <Ionicons name="search" size={36} color="#41431B" />
                    </View>
                    <Text className="text-lg font-poppins-bold text-primary mb-1">Search Flour & Firewood</Text>

                </View>
            ) : isLoading || isFetching ? (
                <View className="flex-1 items-center justify-center bg-background">
                    <ActivityIndicator size="large" color="#41431B" />
                </View>
            ) : products && products.length > 0 ? (
                <FlatList
                    data={products}
                    renderItem={({ item }) => (
                        <View className="flex-1 max-w-[48%]">
                            <ProductItem item={item} />
                        </View>
                    )}
                    numColumns={2}
                    columnWrapperClassName="gap-7"
                    contentContainerClassName="gap-7 px-5 pt-6 pb-32"
                    keyExtractor={(item) => item._id}
                    keyboardShouldPersistTaps="handled"
                />
            ) : (
                <View className="flex-1 items-center justify-center bg-background px-8">
                    <View className="w-20 h-20 items-center justify-center rounded-3xl bg-white shadow-sm shadow-slate-100/50 mb-4">
                        <Ionicons name="search-outline" size={36} color="#9ca3af" />
                    </View>
                    <Text className="text-lg font-poppins-bold text-primary mb-1">No dishes found</Text>
                    <Text className="text-slate-400 text-center font-poppins text-sm max-w-xs leading-relaxed">
                        {"We couldn't find anything matching \"" + debouncedSearch + "\". Try searching for something else!"}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default Search;
