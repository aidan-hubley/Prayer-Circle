import React, {
	useState,
	useRef,
	useMemo,
	forwardRef,
	useCallback,
	useImperativeHandle
} from 'react';
import { View, Text, TouchableHighlight, Pressable, Image } from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from '../backend/config';
import Animated, {
	useAnimatedStyle,
	interpolate,
	Extrapolate
} from 'react-native-reanimated';
import {
	BottomSheetModalProvider,
	BottomSheetModal,
	BottomSheetBackdrop
} from '@gorhom/bottom-sheet';
import { useStore } from '../app/global.js';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledImage = styled(Image);
const StyledIcon = styled(Ionicons);
const StyledAnimatedHighlight = styled(
	Animated.createAnimatedComponent(TouchableHighlight)
);

const FilterItem = forwardRef(
	(
		{ data, index, contentOffset, itemSize, itemMargin, toggleShown },
		ref
	) => {
		const setFilter = useStore((state) => state.setFilter);
		const setFilterName = useStore((state) => state.setFilterName);
		const setFilterIcon = useStore((state) => state.setFilterIcon);
		const setFilterColor = useStore((state) => state.setFilterColor);
		const setFilterDescription = useStore((state) => state.setFilterDescription);
		const itemStyle = useAnimatedStyle(() => {
			const inputRange = [
				(index - 3) * (itemSize + itemMargin),
				(index - 2.5) * (itemSize + itemMargin),
				(index - 2) * (itemSize + itemMargin),
				(index - 1.5) * (itemSize + itemMargin),
				(index - 1) * (itemSize + itemMargin),
				index * (itemSize + itemMargin),
				(index + 1) * (itemSize + itemMargin),
				(index + 1.5) * (itemSize + itemMargin),
				(index + 2) * (itemSize + itemMargin),
				(index + 2.5) * (itemSize + itemMargin),
				(index + 3) * (itemSize + itemMargin)
			];
			const shrinkOutputRange = [
				0.6, 0.6, 0.7, 0.8, 0.8, 1, 0.8, 0.8, 0.7, 0.6, 0.6
			];
			const fadeOutputRange = [
				0.6, 0.6, 0.6, 0.6, 0.6, 1, 0.6, 0.6, 0.6, 0.6, 0.6
			];
			const xOutputRange = [-70, -50, -30, -10, 0, 0, 0, 10, 30, 50, 70];
			const yOutputRange = [
				300, 150, 75, 50, 20, 0, 20, 50, 75, 150, 300
			];
			const translateX = interpolate(
				contentOffset.value,
				inputRange,
				xOutputRange,
				Extrapolate.CLAMP
			);
			const translateY = interpolate(
				contentOffset.value,
				inputRange,
				yOutputRange,
				Extrapolate.CLAMP
			);
			const shrink = interpolate(
				contentOffset.value,
				inputRange,
				shrinkOutputRange
			);
			const fade = interpolate(
				contentOffset.value,
				inputRange,
				fadeOutputRange
			);
			return {
				transform: [
					{
						translateX: translateX
					},
					{
						translateY: translateY
					},
					{
						scale: shrink
					}
				],
				opacity: fade
			};
		});

		const bottomSheetModalRef = useRef(null);
		const snapPoints = useMemo(() => ['10%', '45%', '80%'], []);

		const handlePresentModalPress = useCallback(() => {
			bottomSheetModalRef.current?.present();
		}, []);
		const handleSheetChanges = useCallback((index) => {}, []);

		const handle = () => {
			return (
				<StyledView className='absolute bottom-0 w-screen flex items-center justify-center bg-grey rounded-t-[10px] py-3 border-b border-[#ffffff33]'>
					<StyledView className='w-[30px] h-[4px] rounded-full bg-[#dddddd11] mb-3' />
					<StyledText className='text-white font-[500] text-[20px]'>
						Circles
					</StyledText>
				</StyledView>
			);
		};

		const backdrop = (backdropProps) => {
			return (
				<BottomSheetBackdrop
					{...backdropProps}
					opacity={0.5}
					appearsOnIndex={0}
					disappearsOnIndex={-1}
					enableTouchThrough={true}
				/>
			);
		};

		if (data.id == 'addCircles') {
			return (
				<StyledAnimatedHighlight
					style={[
						{
							borderColor: data.color,
							width: itemSize,
							height: itemSize,
							marginHorizontal: itemMargin / 2,
							top: 60
						},
						itemStyle
					]}
					className='justify-center'
				>
					<StyledPressable
						className='flex items-center justify-center'
						onPress={async () => {
							router.push('findCircles');
						}}
					>
						<StyledImage
							source={require('../assets/spiral/thin.png')}
							style={{ width: 80, height: 80 }}
						/>
						<StyledIcon
							name={'search-outline'}
							size={45}
							color={'#FFFBFC'}
							style={{ position: 'absolute' }}
						/>
					</StyledPressable>
				</StyledAnimatedHighlight>
			);
		} else if (data.id == 'Gridview') {
			return (
				<StyledAnimatedHighlight
					style={[
						{
							borderColor: data.color,
							width: itemSize,
							height: itemSize,
							marginHorizontal: itemMargin / 2,
							top: 60
						},
						itemStyle
					]}
					className='justify-center'
				>
					<StyledPressable
						className='flex items-center justify-center'
						onPress={() => {
							handlePresentModalPress();
						}}
					>
						<StyledImage
							source={require('../assets/spiral/thin.png')}
							style={{ width: 80, height: 80 }}
						/>
						<StyledIcon
							name={'apps-outline'}
							size={35}
							color={'#FFFBFC'}
							style={{ position: 'absolute' }}
						/>
						<BottomSheetModalProvider>
							<BottomSheetModal
								enableDismissOnClose={true}
								ref={bottomSheetModalRef}
								index={1}
								snapPoints={snapPoints}
								onChange={handleSheetChanges}
								handleComponent={handle}
								backdropComponent={(backdropProps) =>
									backdrop(backdropProps)
								}
								keyboardBehavior='extend'
							>
								<StyledView className='flex-1 bg-grey'></StyledView>
							</BottomSheetModal>
						</BottomSheetModalProvider>
					</StyledPressable>
				</StyledAnimatedHighlight>
			);
		} else {
			return (
				<StyledAnimatedHighlight
					style={[
						{
							borderColor: data.color,
							width: itemSize,
							height: itemSize,
							marginHorizontal: itemMargin / 2,
							top: 60
						},
						itemStyle
					]}
					className='flex border-[6px] items-center justify-center rounded-full'
					onPress={() => {
						toggleShown();
						setFilter(data.id);
						setFilterName(data.title);
						setFilterIcon(data.icon);
						setFilterColor(data.color);
						setFilterDescription(data.description); //NRA
						console.log(data.icon);
						console.log(data.color);
						console.log(data.description);
					}}
				>
					<>
						<StyledText className='absolute text-white text-[20px] font-bold w-[150px] text-center bottom-20'>
							{data.title}
						</StyledText>
						<StyledIcon
							name={data.icon}
							size={35}
							color={data.iconColor || data.color}
						/>
					</>
				</StyledAnimatedHighlight>
			);
		}
	}
);

export { FilterItem };
