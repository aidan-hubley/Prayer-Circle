import { Stack } from 'expo-router/stack';
import React, { useEffect, useState } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SplashScreen } from 'expo-router';
import { Provider, useAuth } from './context/auth';
import AnimatedSplash from 'react-native-animated-splash-screen';
import { readData } from '../backend/firebaseFunctions';
import * as Config from '../app.config';
import { auth } from '../backend/config.js';
import { useStore, notify } from './global.js';
import { NotifierWrapper } from 'react-native-notifier';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, setLoaded] = useState(false);
	const [setHaptics, setNotifications] = useStore((state) => [
		state.setHaptics,
		state.setNotifications
	]);

	useEffect(() => {
		(async () => {
			setTimeout(async () => {
				if (auth.currentUser) {
					let settings =
						(await readData(
							`prayer_circle/users/${auth?.currentUser?.uid}/private/settings`
						)) || {};
					setHaptics(settings?.haptics);
					setNotifications(settings?.notifications);
				}
			}, 1000);
			let latestVersion = await readData(
				'prayer_circle/constants/minimum_stable_version'
			);
			if (latestVersion > Config?.default?.expo.version) {
				notify(
					'App Update Available',
					'A new version of Prayer Circle is available. Please update to the latest version to continue using the app.',
					0
				);
			} else {
				setTimeout(() => {
					setLoaded(true);
				}, 1000);
			}
		})();
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
		<NotifierWrapper>
			<BottomSheetModalProvider>
				<Stack
					screenOptions={{
						headerShown: false,
						gestureEnabled: false
					}}
				>
					<Stack.Screen
						name='(aux)/circleSettings'
						options={{ presentation: 'modal' }}
					/>
					<Stack.Screen
						name='(aux)/shareCircle'
						options={{
							presentation: 'modal',
							gestureEnabled: true
						}}
					/>
					<Stack.Screen
						name='(aux)/prayerCircleInfo'
						options={{ presentation: 'modal' }}
					/>
				</Stack>
			</BottomSheetModalProvider>
		</NotifierWrapper>
	);
}
