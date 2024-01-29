export default {
	expo: {
		name: 'PrayerCircle',
		slug: 'prayer-circle',
		scheme: 'prayer-circle-scheme',
		version: '0.0.1',
		orientation: 'portrait',
		icon: './assets/Dark_Margin.png',
		userInterfaceStyle: 'dark',
		splash: {
			image: './assets/Dark_Margin.png',
			resizeMode: 'contain',
			backgroundColor: '#121212'
		},
		assetBundlePatterns: ['**/*'],
		ios: {
			supportsTablet: false,
			bundleIdentifier: 'com.prayercircle.prayercircle'
		},
		android: {
			adaptiveIcon: {
				foregroundImage: './assets/adaptive-icon.png',
				backgroundColor: '#ffffff'
			},
			package: 'com.prayercircle.prayercircle'
		},
		web: {
			favicon: './assets/favicon.png'
		},
		extra: {
			eas: {
				projectId: 'ba379de7-859d-424a-a1be-46c133aab81a'
			},
			router: {
				origin: false
			}
		},
		plugins: [
			'expo-router',
			[
				'expo-image-picker',
				{
					photosPermission:
						'The app accesses your photos to let you share them with your friends.'
				}
			]
		],
		runtimeVersion: {
			policy: 'appVersion'
		},
		owner: 'prayer-circle'
	}
};
