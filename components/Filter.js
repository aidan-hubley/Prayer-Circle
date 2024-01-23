import React, {
	useRef,
	useState,
	forwardRef,
	useImperativeHandle
} from 'react';
import { View, Animated, Dimensions, FlatList, Pressable } from 'react-native';
import { styled } from 'nativewind';
import { useSharedValue } from 'react-native-reanimated';
import { FilterItem } from './FilterItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const StyledView = styled(View);
const AnimatedView = Animated.createAnimatedComponent(StyledView);
const StyledPressable = styled(Pressable);
const AnimatedPressable = Animated.createAnimatedComponent(StyledPressable);

const Filter = forwardRef((props, ref) => {
	const width = Dimensions.get('window').width;
	const itemSize = 80;
	const itemMargin = 10;
	const paddingH = width / 2 - (itemSize + itemMargin) / 2;
	const opacity = useRef(new Animated.Value(0)).current;

	const opacityInter = opacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1]
	});
	const backdropOpacityInter = opacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 0.6]
	});

	let insets = useSafeAreaInsets();

	function toggleShown(toggle) {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		props.toggleSwiping(!toggle);
		Animated.timing(opacity, {
			toValue: toggle ? 1 : 0,
			duration: 200,
			useNativeDriver: true
		}).start();
	}

	const opacityStyle = {
		opacity: opacityInter,
		transform: [{ scale: opacityInter }],
		bottom: insets.bottom
	};
	const backdropOpacityStyle = {
		opacity: backdropOpacityInter
	};

	const contentOffset = useSharedValue(0);

	useImperativeHandle(ref, () => ({
		toggleShown
	}));

	return (
		<>
			<AnimatedPressable
				style={backdropOpacityStyle}
				pointerEvents={props.touchEvents ? 'none' : 'auto'}
				className={`absolute bottom-[-40px] h-screen w-screen bg-[#121212]`}
				onPress={() => {
					//Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
					toggleShown();
				}}
			/>
			<AnimatedView
				style={opacityStyle}
				className='absolute w-screen h-[250px] max-w-[500px] flex items-start justify-center'
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
								toggleShown={toggleShown}
							/>
						);
					}}
					keyExtractor={(item) => item.id}
				/>
			</AnimatedView>
		</>
	);
});

export { Filter };
