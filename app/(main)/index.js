/* import { Redirect } from 'expo-router';

const Index = () => {
	return <Redirect href='/mainViewLayout' />;
};
export default Index;
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function indexPage() {
	return (
		<View>
			<Text>Index</Text>
		</View>
	);
}
