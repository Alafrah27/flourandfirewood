import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { usePayment } from '../hooks/usePayment';

const PaymentButton = () => {
    const { startPayment, isLoading } = usePayment();

    return (
        <TouchableOpacity
            onPress={startPayment}
            disabled={isLoading}
            className={`w-full bg-primary py-4 rounded-2xl items-center justify-center shadow-md active:opacity-90 ${isLoading ? 'opacity-60' : ''}`}
        >
            {isLoading ? (
                <ActivityIndicator color="white" size="small" />
            ) : (
                <Text className="text-lg font-poppins-bold text-white">
                    Proceed to Payment
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default PaymentButton;
