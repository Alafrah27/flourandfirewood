import { useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const Navbar = () => {
    const router = useRouter();
    const { isLoaded, isSignedIn, user } = useUser();

    // Fallback names and image
    const userName = isLoaded && isSignedIn && user ? (user.fullName || user.firstName || 'Guest') : 'Guest';
    const userImage = isLoaded && isSignedIn && user ? user.imageUrl : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120';

    return (



        <View className='flex-row justify-between items-center  pb-10'>
            <View className='flex-row items-center gap-3'>
                {/* Profile Image */}
                <Image
                    source={{ uri: userImage }}
                    className='w-11 h-11 rounded-full bg-gray-200'
                />
                <View>
                    <Text className='text-xs text-gray-500 font-poppins-medium'>Delivering to</Text>
                    <Text className='text-base font-poppins-bold text-primary'>{userName}</Text>
                </View>
            </View>

            {/* Cart Icon Container */}
            <TouchableOpacity onPress={() => router.push('/cart')} className='relative bg-primary p-2.5 rounded-full'>
                <Ionicons name='cart' size={20} color='#fff' />
                <View className='absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center border border-white'>
                    <Text className='text-xs text-white font-poppins'>0</Text>
                </View>
            </TouchableOpacity>
        </View>

    )
}

export default Navbar;
