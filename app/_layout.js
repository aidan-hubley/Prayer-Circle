import { Stack } from 'expo-router/stack';
import React, { useEffect, useState } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SplashScreen } from 'expo-router';
import { Provider, useAuth } from './context/auth';
import AnimatedSplash from 'react-native-animated-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setLoaded(true);
		}, 2000);
	}, []);

	useEffect(() => {
		if (loaded) {
			setTimeout(() => {
				SplashScreen.hideAsync();
			}, 100);
		}
	}, [loaded]);

	return (
		<Provider>
			<AnimatedSplash
				backgroundColor={'#121212'}
				translucent={true}
				logoImage={require('../assets/Squared_Logo_Dark.png')}
				logoHeight={240}
				logoWidth={240}
				isLoaded={loaded}
			>
				<RootLayoutNavigation />
			</AnimatedSplash>
		</Provider>
	);
}

function RootLayoutNavigation() {
	const { authInitialized, user } = useAuth();

	if (!authInitialized && !user) return null;

	return (
		<BottomSheetModalProvider>
			<Stack screenOptions={{ headerShown: false }}></Stack>
		</BottomSheetModalProvider>
	);
}
