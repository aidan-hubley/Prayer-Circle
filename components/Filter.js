import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Dimensions, FlatList, Pressable } from 'react-native';
import {
	default as ReAnimated,
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated';
import { FilterItem } from './FilterItem';
/* import { Timer } from './Timer'; */
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useStore } from '../app/global';

const AnimatedPressable = ReAnimated.createAnimatedComponent(Pressable);

const Filter = forwardRef((props, ref) => {
	const [open, setOpen] = useState(false);
	const opacity = useSharedValue(props.open ? 1 : 0);
	const scale = useSharedValue(props.open ? 1 : 0.8);
	const backdropOpacity = useSharedValue(props.open ? 1 : 0);
	const width = Dimensions.get('window').width;
	const itemSize = 80;
	const itemMargin = 10;
	const paddingH = width / 2 - (itemSize + itemMargin) / 2;
	let insets = useSafeAreaInsets();
	let topButtonInset = insets.top > 30 ? insets.top : insets.top + 10;
	const contentOffset = useSharedValue(0);
	const haptics = useStore((state) => state.haptics);

	const opacityStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
			transform: [{ scale: scale.value }],
			bottom: insets.bottom
		};
	});
	const backdropOpacityStyle = useAnimatedStyle(() => {
		return {
			opacity: backdropOpacity.value
		};
	});

	function toggleShown(toggle) {
		opacity.value = withTiming(toggle ? 1 : 0, { duration: 100 });
		scale.value = withTiming(toggle ? 1 : 0.7, { duration: 100 });
		backdropOpacity.value = withTiming(toggle ? 0.6 : 0, { duration: 100 });
		setOpen(toggle);
		if (props.toggleSwiping) props.toggleSwiping(!toggle);
	}

	let lastTriggeredMultiple = -1;
	const onScroll = (e) => {
		contentOffset.value = e.nativeEvent.contentOffset.x;
		const currentOffset = e.nativeEvent.contentOffset.x;

		// Calculate the current multiple of 90
		const currentMultiple = Math.round(currentOffset / 90);
		if (currentMultiple !== lastTriggeredMultiple) {
			lastTriggeredMultiple = currentMultiple;
			if (haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
		}
	};

	useImperativeHandle(ref, () => ({
		toggleShown
	}));

	return (
		<>
			{!props.backdropHidden && (
				<AnimatedPressable
					style={backdropOpacityStyle}
					pointerEvents={props.touchEvents ? 'none' : 'auto'}
					className={`absolute bottom-[-40px] h-screen w-screen bg-[#121212]`}
					onPress={() => {
						if (haptics)
							Haptics.impactAsync(
								Haptics.ImpactFeedbackStyle.Light
							);
						toggleShown();
						props.setPressed('none');
					}}
				/>
			)}
			<ReAnimated.View
				style={opacityStyle}
				pointerEvents={props.multiselect || open ? 'auto' : 'none'}
				className='absolute w-screen h-[250px] max-w-[500px] flex items-start justify-center'
			>
				<View
					style={{ top: topButtonInset - 500 }}
					className='absolute border border-outline rounded-3xl self-center'
				>
					{/* <Timer></Timer> */}
				</View>
				<FlatList
					data={
						props.multiselect
							? props.data.filter(
									(item) =>
										item.role !== 'suspended' &&
										item.role !== 'banned'
							  )
							: props.data.filter(
									(item) => item.role !== 'banned'
							  )
					}
					onScroll={onScroll}
					horizontal
					showsHorizontalScrollIndicator={false}
					scrollEventThrottle={16}
					snapToInterval={itemSize + itemMargin}
					decelerationRate={'fast'}
					contentContainerStyle={{ paddingHorizontal: paddingH }}
					// getItemLayout={(data, index) => ({
					// 	length: itemSize + itemMargin,
					// 	offset: (itemSize + itemMargin) * index,
					// 	index
					//   })}
					// initialScrollIndex={2}
					// scrollToIndex={2}
					renderItem={({ item, index }) => {
						return (
							<FilterItem
								data={item}
								index={index}
								contentOffset={contentOffset}
								itemSize={itemSize}
								itemMargin={itemMargin}
								toggleShown={toggleShown}
								multiselect={props.multiselect}
								setPressed={props.setPressed}
								circles={
									item.id === 'Gridview' ? props.data : []
								}
							/>
						);
					}}
					keyExtractor={(item) => item.id}
				/>
			</ReAnimated.View>
		</>
	);
});

export { Filter };
