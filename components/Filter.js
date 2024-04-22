import React, {
	useRef,
	forwardRef,
	useImperativeHandle,
	useState
} from 'react';
import { View, Animated, Dimensions, FlatList, Pressable } from 'react-native';
import { styled } from 'nativewind';
import { useSharedValue } from 'react-native-reanimated';
import { FilterItem } from './FilterItem';
/* import { Timer } from './Timer'; */
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useStore } from '../app/global';

const StyledView = styled(View);
const AnimatedView = Animated.createAnimatedComponent(StyledView);
const StyledPressable = styled(Pressable);
const AnimatedPressable = Animated.createAnimatedComponent(StyledPressable);

const Filter = forwardRef((props, ref) => {
	const [open, setOpen] = useState(false);
	const opacity = useRef(new Animated.Value(props.open ? 1 : 0)).current;
	const width = Dimensions.get('window').width;
	const itemSize = 80;
	const itemMargin = 10;
	const paddingH = width / 2 - (itemSize + itemMargin) / 2;
	let insets = useSafeAreaInsets();
	let topButtonInset = insets.top > 30 ? insets.top : insets.top + 10;
	const contentOffset = useSharedValue(0);
	const haptics = useStore((state) => state.haptics);

	const opacityInter = opacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1]
	});
	const scaleInter = opacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0.8, 1]
	});
	const backdropOpacityInter = opacity.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 0.6]
	});
	const opacityStyle = {
		opacity: opacityInter,
		transform: [{ scale: scaleInter }],
		bottom: insets.bottom
	};
	const backdropOpacityStyle = {
		opacity: backdropOpacityInter
	};

	function toggleShown(toggle) {
		Animated.timing(opacity, {
			toValue: toggle ? 1 : 0,
			duration: 100,
			useNativeDriver: true
		}).start();
		setOpen(toggle);
		if (props.toggleSwiping) props.toggleSwiping(!toggle);
	}

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
						toggleShown();
						props.setPressed('none');
					}}
				/>
			)}
			<AnimatedView
				style={opacityStyle}
				pointerEvents={props.multiselect || open ? 'auto' : 'none'}
				className='absolute w-screen h-[250px] max-w-[500px] flex items-start justify-center'
			>
				<StyledView
					style={{ top: topButtonInset - 500 }}
					className='absolute border border-outline rounded-3xl self-center'
				>
					{/* <Timer></Timer> */}
				</StyledView>
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
					onScroll={(e) => {
						contentOffset.value = e.nativeEvent.contentOffset.x;
					}}
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
			</AnimatedView>
		</>
	);
});

export { Filter };
