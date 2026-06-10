import { useState, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';

const FRONTEND_URL = process.env.EXPO_PUBLIC_FRONTEND_URL;

/**
 * Reusable hook that opens the Next.js checkout page in an in-app browser
 * and listens for the deep-link callback to navigate to payment-success.
 *
 * Flow:
 *   1. Opens `${FRONTEND_URL}/checkout?source=mobile` via WebBrowser.openAuthSessionAsync
 *   2. Moyasar processes payment → redirects to /payment-success?source=mobile
 *   3. Next.js verifies payment → redirects to `flourandfirewood://payment-success?orderId=xxx`
 *   4. openAuthSessionAsync resolves → we parse the URL and navigate
 */
export const usePayment = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const startPayment = useCallback(async () => {
        if (!FRONTEND_URL) {
            console.error('EXPO_PUBLIC_FRONTEND_URL is not configured');
            return;
        }

        setIsLoading(true);

        try {
            // The return URL scheme that the web page will redirect to after payment
            const redirectUrl = Linking.createURL('payment-success');

            // Open the Next.js checkout page in an in-app auth session browser
            const result = await WebBrowser.openAuthSessionAsync(
                `${FRONTEND_URL}/checkout?source=mobile&redirect_url=${encodeURIComponent(redirectUrl)}`,
                redirectUrl
            );

            if (result.type === 'success' && result.url) {
                // Parse the deep link URL to extract the orderId
                const parsed = Linking.parse(result.url);
                const orderId = parsed.queryParams?.orderId;

                if (orderId) {
                    router.replace(`/payment-success?orderId=${orderId}`);
                } else {
                    // Payment completed but no orderId — navigate anyway
                    router.replace('/payment-success');
                }
            } else if (result.type === 'cancel' || result.type === 'dismiss') {
                // User closed the browser without completing payment
                console.log('Payment cancelled by user');
            }
        } catch (error) {
            console.error('Payment flow error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    return { startPayment, isLoading };
};
