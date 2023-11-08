import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Image, Animated, Dimensions, FlatList, Pressable } from 'react-native';
import { styled } from 'nativewind';
import { useSharedValue } from 'react-native-reanimated';
import { FilterItem } from './FilterItem';
import { Button } from './Buttons';
import { router } from '../backend/config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import Ionicons from '@expo/vector-icons/Ionicons';

const StyledImage = styled(Image);
const StyledView = styled(View);
const StyledText = styled(Text);
const AnimatedView = Animated.createAnimatedComponent(StyledView);
const StyledPressable = styled(Pressable);
const AnimatedPressable = Animated.createAnimatedComponent(StyledPressable);
const StyledModal = styled(Modal);
const StyledIcon = styled(Ionicons);

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

	const [isFilterModal, setFilterModal] = useState(false);
	const toggleFilterModal = () => {
		setFilterModal(!isFilterModal);
	};

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
						if (index === 0) {
							return (
								<StyledPressable className='w-[65px] h-[65px] flex items-center justify-center' onPress={router.push('joinCircle')}>
									<StyledImage
										source={require('../assets/spiral/thin.png')}
										style={{ width: 65, height: 65 }}
									/>
									<StyledIcon
										name={'add-outline'}
										size={45}
										color={'#FFFBFC'}
										style={{ position: 'absolute' }}
									/>
								</StyledPressable>
							);
						} else if (index === 1) {
							return (								
								<StyledPressable className='w-[65px] h-[65px] flex items-center justify-center' onPress={toggleFilterModal}>
									<StyledImage
										source={require('../assets/spiral/thin.png')}
										style={{ width: 65, height: 65 }}
									/>
									<StyledIcon
										name={'apps-outline'}
										size={35}
										color={'#FFFBFC'}
										style={{ position: 'absolute' }}
									/>
								</StyledPressable>
							);
						} else {
							return (
								<FilterItem
									data={item}
									index={index}
									contentOffset={contentOffset}
									itemSize={itemSize}
									itemMargin={itemMargin}
								/>
							);
						}
					}}
					keyExtractor={(item) => item.id}
				/>
				{/*
					// If index is 0 show this button
					<Button
						bgColor={'bg-offdark'}
						icon={'apps-outline'}
						iconColor={'#FFFBFC'}
						iconSize={35}
						btnStyles={'h-[65px] w-[65px] rounded-full border-2'}
						borderColor={'border-outline'}
						press={toggleFilterModal}
					/>
					
					// If index is 1 show this button
					<Button
						bgColor={'bg-offdark'}
						icon={'add-outline'}
						iconColor={'#FFFBFC'}
						iconSize={45}
						btnStyles={'h-[65px] w-[65px] rounded-full border-2'}
						borderColor={'border-outline'}
						href={'joinCircle'}
					/>

					// starting at index 2 show the data from the array
				*/}
			</AnimatedView>

			<StyledModal
				className='w-[80%] self-center'
				isVisible={isFilterModal}
				onBackdropPress={toggleFilterModal}
			>
				<StyledView className='bg-offblack border-[2px] border-outline rounded-2xl h-[70%]'>
					<StyledView className='flex-1 items-center h-[60%]'>
						<StyledView className='top-[3%]'>
							<StyledText className='text-3xl font-bold text-offwhite'>
								Your circles
							</StyledText>
						</StyledView>
						<StyledView className='top-[7%] h-[70%]'>
							<FlatList
								data={props.data}
								numColumns={3}
								renderItem={({ item }) => {
									return (
										<StyledView className='w-[100px] h-[130px] flex items-center justify-center'>
											<StyledView className='w-[90px] h-[35px]'>
												<StyledText className='text-center inline-block align-baseline text-offwhite'>
													{item.title}
												</StyledText>
											</StyledView>
											<StyledView 
												style={{borderColor: item.color}}
												className='w-[80px] h-[80px] border-[6px] items-center justify-center rounded-full'
											>
												<StyledIcon
													name={item.icon}
													size={35}
													color={item.iconColor}
												/>
											</StyledView>
										</StyledView>
									);
								}}
								keyExtractor={(item) => item.id}
								showsVerticalScrollIndicator={false}
							/>
						</StyledView>
						<Button
							title='close'
							textColor={'text-offwhite'}
							bgColor={'bg-offblack'}
							borderColor={'border-outline'}
							btnStyles={'absolute bottom-[3%]'}
							width='w-[70%]'
							press={toggleFilterModal}
						/>
					</StyledView>
				</StyledView>
			</StyledModal>
		</>
	);
});

export { Filter };
