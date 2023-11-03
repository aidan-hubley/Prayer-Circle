import React, {
	useState,
	useRef,
	forwardRef,
	useImperativeHandle,
	useEffect
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
const AnimatedView = Animated.createAnimatedComponent(StyledView);
const StyledTouchableHighlight = Animated.createAnimatedComponent(
	styled(TouchableHighlight)
);

const Filter = forwardRef((props, ref) => {
	const width = Dimensions.get('window').width;
	const itemSize = width <= 500 ? width / 5 : 120;
	const itemMargin = 10;
	const paddingH = width / 2 - (itemSize + itemMargin / 2) / 2;
	const opacity = useRef(new Animated.Value(0)).current;

	const opacityInter = opacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1]
	});

	function toggleShown(toggle) {
		Animated.timing(opacity, {
			toValue: toggle ? 1 : 0,
			duration: 300,
			useNativeDriver: true
		}).start();
	}

	const opacityStyle = {
		opacity: opacityInter
		/* transform: [{ scale: opacityInter }] */
	};

	const contentOffset = useSharedValue(0);

	useImperativeHandle(ref, () => ({
		toggleShown
	}));

	return (
		<AnimatedView
			style={({ bottom: 0 }, opacityStyle)}
			className='w-screen h-[200px] max-w-[500px] flex items-start justify-center overflow-visible'
		>
			<FlatList
				data={props.data}
				onScroll={(e) => {
					contentOffset.value = e.nativeEvent.contentOffset.x;
				}}
				horizontal
				showsHorizontalScrollIndicator={false}
				scrollEventThrottle={16}
				snapToInterval={itemSize + itemMargin}
				decelerationRate={'fast'}
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
		</AnimatedView>
	);
});

export { Filter };
