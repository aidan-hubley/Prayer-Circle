import React, {
	useEffect,
	useState,
	useRef,
	forwardRef,
	useImperativeHandle
} from 'react';
import {
	View,
	Text,
	ScrollView,
	Animated,
	Pressable,
	TouchableOpacity
} from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledIcon = styled(Ionicons);
const StyledScrollView = styled(ScrollView);
const StyledAnimView = styled(Animated.View);
const StyledPressable = styled(Animated.createAnimatedComponent(Pressable));

const IconSelector = forwardRef(({}, ref) => {
	const icons = [
		'settings',
		'globe',
		'globe',
		'airplane',
		'alarm',
		'alert-circle',
		'american-football',
		'globe'
	];
	const [icon, setIcon] = useState('');
	const [opened, setOpened] = useState(false);
	const opacity = useRef(new Animated.Value(0)).current;
	const opacityInterpolation = opacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1]
	});
	const bgOpacityInterpolation = opacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 0.5]
	});

	const toggleSelector = (direction) => {
		if (direction) setOpened(direction);
		else setOpened(!opened);
		Animated.timing(opacity, {
			toValue: opened ? 0 : 1,
			duration: 400,
			useNativeDriver: false
		}).start();
	};

	useImperativeHandle(ref, () => ({
		toggleSelector,
		icon
	}));

	function IconsRow(icons) {
		return (
			<StyledView className='flex flex-row justify-around my-2'>
				<TouchableOpacity
					onPress={() => {
						setIcon(icons[0]);
					}}
				>
					<StyledIcon name={icons[0]} color={'#EBEBEB'} size={40} />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						setIcon(icons[1]);
					}}
				>
					<StyledIcon name={icons[1]} color={'#EBEBEB'} size={40} />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						setIcon(icons[2]);
					}}
				>
					<StyledIcon name={icons[2]} color={'#EBEBEB'} size={40} />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						setIcon(icons[3]);
					}}
				>
					<StyledIcon name={icons[3]} color={'#EBEBEB'} size={40} />
				</TouchableOpacity>
			</StyledView>
		);
	}

	function iconGallery(icons) {
		let generateIcons = [];
		for (let i = 0; i < icons.length / 4; i++) {
			let index = i * 4;
			generateIcons.push(
				IconsRow([
					icons[index],
					icons[index + 1],
					icons[index + 2],
					icons[index + 3]
				])
			);
		}

		return generateIcons;
	}

	return (
		<>
			<StyledPressable
				style={{ opacity: bgOpacityInterpolation }}
				pointerEvents={opened ? 'auto' : 'none'}
				onPress={() => toggleSelector(false)}
				className='absolute top-0 left-0 bg-offblack w-screen h-screen'
			/>
			<StyledAnimView
				style={{ opacity: opacityInterpolation }}
				pointerEvents={opened ? 'auto' : 'none'}
				className='absolute -translate-x-[150px] left-1/2 top-[60%] -translate-y-[250px] w-[80%] p-[15px] max-w-[300px] h-[50%] max-h-[500px] bg-offblack border border-[#3d3d3d] rounded-[20px]'
			>
				<StyledText className='text-offwhite font-bold text-3xl text-center mb-3'>
					Select an Icon
				</StyledText>
				<StyledScrollView>
					<StyledView className='flex flex-col'>
						{iconGallery(icons)}
					</StyledView>
				</StyledScrollView>
			</StyledAnimView>
		</>
	);
});

export { IconSelector };
