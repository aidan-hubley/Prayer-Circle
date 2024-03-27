import React, {
	forwardRef,
	useImperativeHandle,
	useEffect,
	useRef
} from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

export const Loading = forwardRef((props, ref) => {
	const visible = useRef(new Animated.Value(props.loading ? 1 : 0)).current;

	const visibleInter = visible.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1]
	});

	const toggleVisible = () => {
		console.log('toggleVisible', props.loading, props.loading ? 0 : 1);
		Animated.timing(visible, {
			toValue: props.loading ? 0 : 1,
			duration: 300,
			useNativeDriver: true
		}).start();
	};

	useEffect(() => {
		console.log('useEffect', props.loading);
		return () => {
			toggleVisible();
		};
	}, [props.loading]);

	return (
		<Animated.View
			style={{ opacity: visibleInter }}
			pointerEvents={props.allowEvents || 'none'}
			className={`absolute bg-[#121212BB] w-screen h-screen justify-center items-center`}
		>
			<View
				className={`bg-grey  ${props.width || 'w-screen'} ${
					props.height || 'h-screen'
				} ${
					props.border && 'border border-[#FFFBFC66]'
				} rounded-xl flex items-center justify-center`}
				pointerEvents={props.loading ? 'auto' : 'none'}
			>
				{props.circle && (
					<Progress.Circle
						size={80}
						borderWidth={4}
						indeterminate
						color='#FFFBFC'
					/>
				)}
				{props.text && (
					<Text className='text-white mt-4 text-[20px]'>
						{props.text || 'Loading...'}
					</Text>
				)}
			</View>
		</Animated.View>
	);
});

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
