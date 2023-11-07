import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Animated, Dimensions, FlatList, Pressable } from 'react-native';
import { styled } from 'nativewind';
import { useSharedValue } from 'react-native-reanimated';
import { FilterItem } from './FilterItem';
import { Button } from './Buttons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const StyledView = styled(View);
const StyledText = styled(Text);
const AnimatedView = Animated.createAnimatedComponent(StyledView);
const StyledPressable = styled(Pressable);
const AnimatedPressable = Animated.createAnimatedComponent(StyledPressable);

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
	const backdropOpacityInter = opacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 0.6]
	});

	let insets = useSafeAreaInsets();

	function toggleShown(toggle) {
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
					toggleShown();
				}}
			/>
			<AnimatedView
				style={opacityStyle}
				className='absolute w-screen h-[250px] max-w-[500px] flex items-start justify-center overflow-visible'
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
				<StyledView
					className='absolute bottom-[250px] w-full h-[60px] flex items-center justify-center'
				>
					<StyledText					
						className='text-white text-2xl font-bold'
					>
						Circle Name
					</StyledText>
				</StyledView>
				<StyledView
					className='absolute bottom-[20px] right-[70px]'
				>
					<Button
						bgColor={'bg-offdark'}
						icon={'apps-outline'}
						iconColor={'#FFFBFC'}
						iconSize={35}
						btnStyles={'h-[65px] w-[65px] rounded-full border-2'}
						borderColor={'border-outline'}
					/>
				</StyledView>
				<StyledView
					className='absolute bottom-[20px] left-[70px]'
				>
					<Button
						bgColor={'bg-offdark'}
						icon={'add-outline'}
						iconColor={'#FFFBFC'}
						iconSize={45}
						btnStyles={'h-[65px] w-[65px] rounded-full border-2'}
						borderColor={'border-outline'}
						href={'joinCircle'}
					/>
				</StyledView>
			</AnimatedView>
		</>
	);
});

export { Filter };
