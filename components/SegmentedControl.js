import React, {
	useRef,
	forwardRef,
	useImperativeHandle,
	useEffect
} from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import {
	default as ReAnimated,
	useSharedValue,
	useAnimatedStyle,
	withTiming
} from 'react-native-reanimated';

const SegmentedControl = forwardRef((props, ref) => {
	const selected = useSharedValue(-1);

	const width = props.width || Dimensions.get('window').width - 30;
	const increment = width / props.icons.length;

	const handlePress = (index) => {
		selected.value = withTiming(index * increment + increment / 2, {
			duration: 200
		});
	};

	useEffect(() => {
		let i = props.selected !== undefined ? props.selected : 2;
		handlePress(i);
		if (props.fireEventOnLoad) props.icons[i]?.onPress();
	}, []);

	const highlightPosition = useAnimatedStyle(() => {
		return {
			left: selected.value,

			transform: [
				{
					translateX: props.indicatorSize
						? props.indicatorSize / -2
						: -((increment - 10) / 2)
				}
			],
			width: props.indicatorSize || increment - 10
		};
	});

	const option = (index, value, type, onPress) => {
		return (
			<TouchableOpacity
				key={index}
				style={{ width: increment, height: props.height || 50 }}
				className='flex items-center justify-center'
				onPress={() => {
					if (onPress) onPress();
					handlePress(index);
				}}
			>
				{type === 'image' && value && (
					<Image source={value} className='w-[26px] h-[26px]' />
				)}
				{type === 'text' && value && (
					<Text className='text-offwhite font-bold text-lg'>
						{value}
					</Text>
				)}
			</TouchableOpacity>
		);
	};

	useImperativeHandle(ref, () => ({
		selected
	}));

	return (
		<View
			style={{ height: props.height || 50 }}
			className={`flex flex-row items-center w-full border border-outline rounded-[15px] ${
				props.noYMargin ? '' : 'my-3'
			}`}
		>
			{props.icons.map((item, index) =>
				option(index, item.value, item.type, item?.onPress)
			)}
			<ReAnimated.View
				style={[
					highlightPosition,
					{ height: props.height ? props.height - 10 : 40 }
				]}
				className='absolute flex items-center justify-center rounded-[10px] bg-[#EBEBEB2c] '
			/>
		</View>
	);
});

export { SegmentedControl };
