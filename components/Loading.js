import React, {
	forwardRef,
	useImperativeHandle,
	useEffect,
	useRef
} from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

export const Loading = forwardRef((props, ref) => {
	const visible = useRef(new Animated.Value(0)).current;
	useImperativeHandle(ref, () => ({}));

	const visibleInter = visible.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1]
	});

	const toggleVisible = () => {
		Animated.timing(visible, {
			toValue: props.loading ? 0 : 1,
			duration: 300,
			useNativeDriver: true
		}).start();
	};

	useEffect(() => {
		return () => {
			toggleVisible();
		};
	}, [props.loading]);

	return (
		<Animated.View
			style={{ opacity: visibleInter }}
			pointerEvents={props.loading ? 'auto' : 'none'}
			className='absolute w-screen h-screen bg-offblack justify-center items-center'
		>
			<Progress.Circle
				size={80}
				borderWidth={4}
				indeterminate
				color='#FFFBFC'
			/>
			<Text className='text-white mt-2 text-[20px]'>Uploading...</Text>
		</Animated.View>
	);
});

const LoadingStyles = StyleSheet.create({});

export const Pulsating = (props) => {
	return (
		<Animated.View
			style={{
				width: props.width,
				height: props.height,
				borderRadius: props.borderRadius || 8
			}}
			className={`bg-outline ${props.styles || ''}`}
		></Animated.View>
	);
};
