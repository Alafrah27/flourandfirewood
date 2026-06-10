import React, { useEffect, useRef } from 'react';
import { View, Animated, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SkeletonCard = () => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
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
        <View className="flex-1 max-w-[48%] py-5 px-3.5 pt-10 flex items-center justify-end bg-white shadow-md shadow-black/10 rounded-3xl">
            {/* Pulsing Image Placeholder (Square matching size-40) */}
            <Animated.View
                style={{ opacity }}
                className="size-40 bg-slate-200"
            />

            {/* Pulsing Title & Price Placeholders */}
            <View className="mt-3 w-full items-center gap-2">
                <Animated.View style={{ opacity }} className="w-3/4 h-4 bg-slate-200" />
                <Animated.View style={{ opacity }} className="w-1/2 h-4 bg-slate-200 mt-1" />
            </View>
        </View>
    );
};

const SkeletonLoader = () => {
    // Generate a list of 6 skeleton cards to display as a grid
    const placeholderData = Array.from({ length: 6 }, (_, index) => index);
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
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
        <SafeAreaView className="flex-1 bg-background">
            {/* Mock Header skeleton matching Navbar */}
            <View className="my-5 px-5 flex-row justify-between items-center">
                <View className="flex-row items-center gap-3">
                    <View className="w-11 h-11 rounded-full bg-slate-200" />
                    <View className="gap-1.5">
                        <View className="w-20 h-3 rounded bg-slate-200" />
                        <View className="w-28 h-4 rounded bg-slate-200" />
                    </View>
                </View>
                <View className="w-10 h-10 rounded-full bg-slate-200" />
            </View>

            {/* Mock Search Bar skeleton matching Home header search input */}
            <View className="px-5 mb-5">
                <View className="w-full h-[52px] rounded-2xl bg-white border border-slate-100 flex-row items-center px-4 justify-between shadow-sm shadow-slate-100/50">
                    <View className="flex-row items-center gap-3">
                        <View className="w-5 h-5 rounded-md bg-slate-200" />
                        <Animated.View style={{ opacity }} className="w-48 h-4 bg-slate-200" />
                    </View>
                    <View className="border-l border-slate-200 pl-3">
                        <View className="w-5 h-5 rounded-md bg-slate-200" />
                    </View>
                </View>
            </View>

            <FlatList
                data={placeholderData}
                keyExtractor={(item) => item.toString()}
                renderItem={() => <SkeletonCard />}
                numColumns={2}
                columnWrapperClassName="gap-7"
                contentContainerClassName="gap-7 px-5 pb-32"
            />
        </SafeAreaView>
    );
};

export default SkeletonLoader;
