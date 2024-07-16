import React, { forwardRef, useRef, useState } from 'react';
import {
	View,
	Text,
	TouchableHighlight,
	Pressable,
	Image,
	Dimensions
} from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import Animated, {
	useAnimatedStyle,
	interpolate,
	Extrapolate
} from 'react-native-reanimated';
import { useStore } from '../app/global.js';
import {
	handle,
	backdrop,
	SnapPoints
} from '../components/BottomSheetModalHelpers.js';
import { BottomSheetModal, BottomSheetFlatList } from '@gorhom/bottom-sheet';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledImage = styled(Image);
const StyledIcon = styled(Ionicons);
const StyledAnimatedHighlight =
	Animated.createAnimatedComponent(TouchableHighlight);

const FilterItem = forwardRef((props, ref) => {
	const [
		setFilter,
		setFilterName,
		setFilterIcon,
		setFilterColor,
		setFilterIconColor,
		setCurrentCircleRole
	] = useStore((state) => [
		state.setFilter,
		state.setFilterName,
		state.setFilterIcon,
		state.setFilterColor,
		state.setFilterIconColor,
		state.setCurrentCircleRole
	]);

	const [selected, setSelected] = useState(false);
	const itemStyle = useAnimatedStyle(() => {
		const inputRange = [
			(props.index - 3) * (props.itemSize + props.itemMargin),
			(props.index - 2.5) * (props.itemSize + props.itemMargin),
			(props.index - 2) * (props.itemSize + props.itemMargin),
			(props.index - 1.5) * (props.itemSize + props.itemMargin),
			(props.index - 1) * (props.itemSize + props.itemMargin),
			props.index * (props.itemSize + props.itemMargin),
			(props.index + 1) * (props.itemSize + props.itemMargin),
			(props.index + 1.5) * (props.itemSize + props.itemMargin),
			(props.index + 2) * (props.itemSize + props.itemMargin),
			(props.index + 2.5) * (props.itemSize + props.itemMargin),
			(props.index + 3) * (props.itemSize + props.itemMargin)
		];
		const shrinkOutputRange = [
			0.6, 0.6, 0.7, 0.8, 0.8, 1, 0.8, 0.8, 0.7, 0.6, 0.6
		];
		const fadeOutputRange = [
			0.4, 0.4, 0.5, 0.6, 0.7, 1, 0.7, 0.6, 0.5, 0.4, 0.4
		];
		const xOutputRange = [-70, -50, -30, -10, 0, 0, 0, 10, 30, 50, 70];
		const yOutputRange = [300, 150, 75, 50, 20, 0, 20, 50, 75, 150, 300];
		const translateX = interpolate(
			props.contentOffset.value,
			inputRange,
			xOutputRange,
			Extrapolate.CLAMP
		);
		const translateY = interpolate(
			props.contentOffset.value,
			inputRange,
			yOutputRange,
			Extrapolate.CLAMP
		);
		const shrink = interpolate(
			props.contentOffset.value,
			inputRange,
			shrinkOutputRange
		);
		const fade = interpolate(
			props.contentOffset.value,
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
			opacity: selected ? 1 : fade
		};
	});
	const bottomSheetModalRef = useRef(null);
	const [addCircles, setAddCircles] = useStore((state) => [
		state.addCircles,
		state.setAddCircles
	]);

	if (!props.multiselect) {
		if (props.data.id == 'addPost') {
			return (
				<StyledAnimatedHighlight
					style={[
						{
							borderColor: props.data.color,
							width: props.itemSize,
							height: props.itemSize,
							marginHorizontal: props.itemMargin / 2,
							top: 60
						},
						itemStyle
					]}
					className='justify-center'
				>
					<StyledPressable
						className='flex items-center justify-center'
						onPress={async () => {
							props.toggleShown();
							props.setPressed('none');
							router.push('createPost');
						}}
					>
						<StyledImage
							source={require('../assets/spiral/thin.png')}
							style={{ width: 80, height: 80 }}
						/>
						<StyledText className='absolute text-white text-[20px] font-bold w-[150px] text-center bottom-[84px]'>
							Sketch a Post
						</StyledText>
						{/* <StyledIcon
							name={'ios-add'}
							size={50}
							color={'#FFFBFC'}
							style={{ position: 'absolute' }}
						/> */}
					</StyledPressable>
				</StyledAnimatedHighlight>
			);
		} else if (props.data.id == 'Gridview') {
			return (
				<>
					<StyledAnimatedHighlight
						style={[
							{
								borderColor: props.data.color,
								width: props.itemSize,
								height: props.itemSize,
								marginHorizontal: props.itemMargin / 2,
								top: 60
							},
							itemStyle
						]}
						className='justify-center'
						onPress={() => {
							bottomSheetModalRef.current.present();
							props.toggleShown();
							props.setPressed('none');
						}}
					>
						<StyledView className='flex items-center justify-center'>
							<StyledImage
								source={require('../assets/spiral/thin.png')}
								style={{ width: 80, height: 80 }}
							/>
							<StyledText className='absolute text-white text-[20px] font-bold w-[150px] text-center bottom-20'>
								View Circles
							</StyledText>
							<StyledIcon
								name={'apps-outline'}
								size={35}
								color={'#FFFBFC'}
								style={{ position: 'absolute' }}
							/>
						</StyledView>
					</StyledAnimatedHighlight>
					<BottomSheetModal
						enableDismissOnClose={true}
						ref={bottomSheetModalRef}
						index={0}
						snapPoints={SnapPoints(['85%'])}
						handleComponent={() => handle('All Circles')}
						backdropComponent={(backdropProps) =>
							backdrop(backdropProps)
						}
						keyboardBehavior='extend'
					>
						<StyledView className='flex-1 bg-grey'>
							<BottomSheetFlatList
								data={props.circles.slice(3)}
								keyExtractor={(item) => item.id}
								contentContainerStyle={{
									paddingVertical: 20,
									paddingHorizontal: 12,
									alignItems: 'center'
								}}
								numColumns={3}
								renderItem={({ item }) => {
									const vw = Dimensions.get('window').width;
									return (
										<StyledView
											className='items-center justify-around my-[10px]'
											style={{ width: vw / 3 - 8 }}
										>
											<StyledText className=' text-white text-[18px] font-[600] text-center  pb-2'>
												{item.title}
											</StyledText>
											<StyledAnimatedHighlight
												style={[
													{
														borderColor: item.color
													}
												]}
												className='flex border-[6px] items-center justify-center rounded-full w-[85px] aspect-square'
												onPress={() => {
													bottomSheetModalRef.current.dismiss();
													props.toggleShown();
													props.setPressed('none');
													setFilter(item.id);
													setFilterName(item.title);
													setFilterIcon(item.icon);
													setFilterColor(item.color);
													setFilterIconColor(
														item.iconColor
													);
												}}
											>
												<StyledIcon
													name={item.icon}
													size={45}
													color={
														item.iconColor ||
														item.color
													}
												/>
											</StyledAnimatedHighlight>
										</StyledView>
									);
								}}
							/>
						</StyledView>
					</BottomSheetModal>
				</>
			);
		} else if (props.data.id == 'allCircles') {
			return (
				<StyledAnimatedHighlight
					style={[
						{
							borderColor: props.data.color,
							width: props.itemSize,
							height: props.itemSize,
							marginHorizontal: props.itemMargin / 2,
							top: 60
						},
						itemStyle
					]}
					className='justify-center'
					onPress={() => {
						props.toggleShown();
						props.setPressed('none');
						setFilter('unfiltered');
						setFilterName('Prayer Circle');
					}}
				>
					<StyledView className='flex items-center justify-center'>
						<StyledImage
							source={require('../assets/spiral/thin.png')}
							style={{ width: 80, height: 80 }}
						/>
						<StyledText className='absolute text-white text-[20px] font-bold w-[150px] text-center bottom-20'>
							All Circles
						</StyledText>
					</StyledView>
				</StyledAnimatedHighlight>
			);
		} else {
			return (
				<StyledAnimatedHighlight
					style={[
						{
							borderColor: props.data.color,
							width: props.itemSize,
							height: props.itemSize,
							marginHorizontal: props.itemMargin / 2,
							top: 60
						},
						itemStyle
					]}
					className='flex border-[6px] items-center justify-center rounded-full'
					onPress={() => {
						props.toggleShown();
						props.setPressed('none');
						setFilter(props.data.id);
						setFilterName(props.data.title);
						setFilterIcon(props.data.icon);
						setFilterColor(props.data.color);
						setFilterIconColor(props.data.iconColor);
						setCurrentCircleRole(props.data.role);
					}}
				>
					<>
						<StyledText className='absolute text-white text-[20px] font-bold w-[150px] text-center bottom-20'>
							{props.data.title}
						</StyledText>
						<StyledIcon
							name={props.data.icon}
							size={35}
							color={props.data.iconColor || props.data.color}
						/>
					</>
				</StyledAnimatedHighlight>
			);
		}
	} else {
		return (
			<StyledAnimatedHighlight
				style={[
					{
						backgroundColor: selected ? '#00A55E' : '#00000000',
						borderColor: selected ? '#00A55E' : props.data.color,
						width: props.itemSize,
						height: props.itemSize,
						borderRadius: 100,
						marginHorizontal: props.itemMargin / 2,
						top: 60
					},
					itemStyle
				]}
				className='flex border-[6px] items-center justify-center rounded-full'
				underlayColor={selected ? '#00A55E60' : props.data.color + '60'}
				activeOpacity={1}
				onPress={() => {
					if (addCircles.includes(props.data.id)) {
						setAddCircles(
							addCircles.filter(
								(circle) => circle !== props.data.id
							)
						);
						setSelected(false);
					} else {
						setAddCircles([...addCircles, props.data.id]);
						setSelected(true);
					}
				}}
			>
				<>
					<StyledText className='absolute text-white text-[20px] font-bold w-[150px] text-center bottom-20'>
						{props.data.title}
					</StyledText>
					{!selected && (
						<StyledIcon
							name={props.data.icon}
							size={35}
							color={props.data.iconColor || props.data.color}
						/>
					)}
					{selected && (
						<View className='flex items-center justify-center ml-1'>
							<Ionicons
								name={'checkmark-circle'}
								color={'white'}
								size={50}
								style={{ display: selected ? 'flex' : 'none' }}
							/>
						</View>
					)}
				</>
			</StyledAnimatedHighlight>
		);
	}
});

export { FilterItem };
