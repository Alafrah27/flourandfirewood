import React from 'react';
import EmptyCart from '@/components/EmptyCart';
import { SafeAreaView } from 'react-native-safe-area-context';

const Cart = () => {

    return (
        <SafeAreaView className="flex-1 bg-white">
            <EmptyCart />
        </SafeAreaView>
    )
}

export default Cart;