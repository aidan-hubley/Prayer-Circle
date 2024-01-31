import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Buttons';
import { useAuth } from '../context/auth';

export default function indexPage() {
	const authContext = useAuth();
	return (
		<SafeAreaView>
			<View>
				<Text>Index</Text>
				<Button title={'Sign Out'} press={authContext.signOut}></Button>
			</View>
		</SafeAreaView>
	);
}
