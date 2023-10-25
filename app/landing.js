import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, Image, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { Easing } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

const styles = StyleSheet.create({
	headText: {
		fontSize: 30,
		color: 'white',
		textAlign: 'center',
		marginTop: 100
	},

	smalltext: {
		fontSize: 18,
		color: 'white'
	}
});

export default function Page() {
	const textAnim = useRef(new Animated.Value(0)).current;

	const textStyle = {
		transform: [
			{
				translateY: textAnim.interpolate({
					inputRange: [-1, 1],
					outputRange: [30, -30]
				})
			}
		]
	};

	useEffect(() => {
		const loopAnimation = Animated.loop(
			Animated.sequence([
				Animated.timing(textAnim, {
					toValue: 1,
					duration: 2000,
					easing: Easing.linear,
					useNativeDriver: true
				}),
				Animated.timing(textAnim, {
					toValue: -1,
					duration: 2000,
					easing: Easing.linear,
					useNativeDriver: true
				})
			]),
			{ iterations: -1 }
		);

		loopAnimation.start();

		// Clean up the animation when the component unmounts
		return () => {
			loopAnimation.stop();
		};
	}, [textAnim]);

	return (
		<StyledView className='flex-1 items-center pt-10 bg-black'>
			<StyledText className='text-3xl text-white text-center tracking-widest leading-10'>
				Welcome to {'\n'}Prayer Circle!
			</StyledText>
			<Image
				source={require('../assets/Logo_Dark.png')}
				style={{ height: 350, marginTop: 100 }}
				resizeMode='contain'
			/>
			<View style={{ marginTop: 130 }}>
				<Animated.Text style={[styles.smalltext, textStyle]}>
					Swipe up to get started Test
				</Animated.Text>
			</View>
		</StyledView>
	);
}

export function logout() {
	router.replace('/mainViewLayout');
}
