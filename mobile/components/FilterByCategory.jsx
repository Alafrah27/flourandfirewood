import React, { useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useCategoriesForMobile } from '../services/productQuery';

const SkeletonPill = () => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 800 }),
                withTiming(0.3, { duration: 800 })
            ),
            -1,
            true
        );
    }, [opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                animatedStyle,
                {
                    width: 96,
                    height: 40,
                    backgroundColor: "#e2e8f0",
                    borderRadius: 999,
                },
            ]}
        />
    );
};

const FilterByCategory = ({ selectedCategory, onSelectCategory }) => {
    const { data: categories, isLoading, error } = useCategoriesForMobile();

    if (error) {
        console.error("Error loading categories:", error);
        return null;
    }

    if (isLoading) {
        return (
            <View className="flex-row gap-2 py-2">
                {[1, 2, 3, 4].map((i) => (
                    <SkeletonPill key={i} />
                ))}
            </View>
        );
    }

    // Include the default "All" category at the top of the list
    const listData = categories ? [{ _id: 'all', categoryName: 'All' }, ...categories] : [];


    const renderItem = ({ item }) => {
        // "All" represents an empty category filter string
        const itemCategoryVal = item.categoryName === 'All' ? '' : item.categoryName;
        const isSelected = selectedCategory === itemCategoryVal;
      
        return (
            <TouchableOpacity
                onPress={() => onSelectCategory(itemCategoryVal)}
                activeOpacity={0.85}
                className={`flex-row items-center px-4 py-2 rounded-full border transition-all ${isSelected
                        ? 'bg-primary border-primary shadow-sm shadow-primary/20'
                        : 'bg-white border-slate-100'
                    }`}
            >
                {item.imageUrl && item.categoryName !== 'All' ? (
                    <Image
                        source={{ uri: item.imageUrl }}
                        className="w-6 h-6 rounded-full mr-2 bg-slate-100"
                        resizeMode="cover"
                    />
                ) : null}
                <Text
                    className={`font-poppins-medium text-xs ${isSelected ? 'text-white' : 'text-primary'
                        }`}
                >
                    {item.categoryName}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View className="py-2">
            <FlatList
                data={listData}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
            />
        </View>
    );
};

export default FilterByCategory;