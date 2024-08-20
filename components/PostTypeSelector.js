import React, {
	useRef,
	forwardRef,
	useImperativeHandle,
	useEffect
} from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import {
	default as ReAnimated,
	useSharedValue,
	useAnimatedStyle,
	withTiming
} from 'react-native-reanimated';

const PostTypeSelector = forwardRef((props, ref) => {
	const selected = useSharedValue(props.selected || 2);
	const iconPaths = [
		require('../assets/post/annoucement.png'),
		require('../assets/post/praise.png'),
		require('../assets/post/prayer.png'),
		require('../assets/post/calendar.png'),
		require('../assets/post/thought.png')
	];

	const width = props.width || Dimensions.get('window').width - 30;
	const increment = width / 5;

	const handlePress = (index) => {
		console.log(index, increment * index, increment / 2);
		selected.value = withTiming(index * increment + increment / 2, {
			duration: 200
		});
		if (props.onSelect) props.onSelect(index);
	};

	useEffect(() => {
		handlePress(props.selected || 2);
	}, []);

	const highlightPosition = useAnimatedStyle(() => {
		return {
			left: selected.value,

			transform: [{ translateX: -25 }],
			width: 50
		};
	});

	const option = (index, path) => {
		return (
			<TouchableOpacity
				key={index}
				style={{ width: increment }}
				className='flex items-center justify-center w-[50px] h-[50px]'
				onPress={() => handlePress(index)}
			>
				{path && <Image source={path} className='w-[26px] h-[26px]' />}
			</TouchableOpacity>
		);
	};

	useImperativeHandle(ref, () => ({
		selected
	}));

	return (
		<View
			className={`flex flex-row items-center h-[50px] w-full border border-outline rounded-[15px] ${
				props.noYMargin ? '' : 'my-3'
			}`}
		>
			{iconPaths.map((path, index) => option(index, path))}
			<ReAnimated.View
				style={highlightPosition}
				className='absolute flex items-center justify-center rounded-[15px] bg-[#EBEBEB2c] h-[40px]'
			></ReAnimated.View>
		</View>
	);
});

export { PostTypeSelector };
