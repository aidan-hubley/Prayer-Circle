import React, {
	useState,
	useRef,
	forwardRef,
	useImperativeHandle
} from 'react';
import {
	View,
	Text,
	TouchableHighlight,
	Animated,
	Dimensions,
	FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSharedValue } from 'react-native-reanimated';
import { FilterItem } from './FilterItem';

const StyledView = styled(View);
const StyledTouchableHighlight = Animated.createAnimatedComponent(
	styled(TouchableHighlight)
);
const StyledIcon = styled(Ionicons);

const Filter = forwardRef(({ props }, ref) => {
	let insets = useSafeAreaInsets();
	const width = Dimensions.get('window').width;
	const itemSize = width <= 500 ? width / 5 : 120;
	const itemMargin = 10;
	const paddingH = width / 2 - (itemSize + itemMargin / 2) / 2;
	const opacity = useRef(new Animated.Value(1)).current;

	const opacityInter = opacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0.6, 1]
	});

	function toggleShown(toggle) {
		Animated.timing(opacity, {
			toValue: toggle ? 1 : 0,
			duration: 300,
			useNativeDriver: true
		}).start();
	}

	const opacityStyle = {
		opacity: opacityInter,
		transform: [{ scale: opacityInter }]
	};

	useImperativeHandle(ref, () => ({
		toggleShown
	}));

	const dummyData = [
		{
			id: '-NhXfdEbrH1yxRqiajYm',
			color: '#ff0000',
			icon: 'heart'
		},
		{
			id: '-NhXfdEbrH1yxRqiajYn',
			color: '#00ff00',
			icon: 'star'
		},
		{
			id: '-NhXfdEbrH1yxRqiajYo',
			color: '#0000ff',
			icon: 'person'
		},
		{
			id: '-NhXfdEbrH1yxRqiajYp',
			color: '#ff0000',
			icon: 'heart'
		},
		{
			id: '-NhXfdEbrH1yxRqiajYq',
			color: '#00ff00',
			icon: 'star'
		},
		{
			id: '-NhXfdEbrH1yxRqiajYr',
			color: '#0000ff',
			icon: 'person'
		},
		{
			id: '-NhXfdEbrH1yxRqiajYs',
			color: '#ff0000',
			icon: 'heart'
		},
		{
			id: '-NhXfdEbrH1yxRqiajYt',
			color: '#00ff00',
			icon: 'star'
		},
		{
			id: '-NhXfdEbrH1yxRqiajYu',
			color: '#0000ff',
			icon: 'person'
		},
		{
			id: '-NhXfdEbrH1yxRqiajYv',
			color: '#ff0000',
			icon: 'heart'
		},
		{
			id: '-NhXfdEbrH1yxRqiajYw',
			color: '#00ff00',
			icon: 'star'
		},
		{
			id: '-NhXfdEbrH1yxRqiajYx',
			color: '#0000ff',
			icon: 'person'
		}
	];

	const contentOffset = useSharedValue(0);

	return (
		<StyledView
			style={{ bottom: 0 }}
			className='absolute w-screen h-[200px] max-w-[500px] flex items-start justify-center overflow-visible'
		>
			<FlatList
				data={dummyData}
				onScroll={(e) => {
					contentOffset.value = e.nativeEvent.contentOffset.x;
				}}
				horizontal
				scrollEventThrottle={16} /* 
				snapToInterval={85}
				decelerationRate={'fast'} */
				contentContainerStyle={{ paddingHorizontal: paddingH }}
				renderItem={({ item, index }) => {
					return (
						<FilterItem
							data={item}
							index={index}
							contentOffset={contentOffset}
							itemSize={itemSize}
							itemMargin={itemMargin}
						></FilterItem>
					);
				}}
				keyExtractor={(item) => item.id}
			/>
		</StyledView>
	);
});

export { Filter };
