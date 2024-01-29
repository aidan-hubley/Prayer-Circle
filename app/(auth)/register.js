import React from 'react';
import {
	Pressable,
	Text,
	View,
	Dimensions,
	StyleSheet,
	Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../global';

export default function LoginPage() {
	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: Colors.primary
			}}
		></SafeAreaView>
	);
}
