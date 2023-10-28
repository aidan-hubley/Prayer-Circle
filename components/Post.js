import React, { useState, useRef } from 'react';
import {
	Text,
	View,
	Image,
	Pressable,
	TouchableOpacity,
	Animated
} from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { timeSince } from '../backend/functions';
import { writeData } from '../backend/firebaseFunctions';

const StyledImage = styled(Image);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledOpacity = styled(TouchableOpacity);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));
const AnimatedImage = Animated.createAnimatedComponent(StyledImage);
const StyledIcon = styled(Ionicons);

export const Post = (post) => {
	const tS = timeSince(post.timestamp);

	const [icon, setIcon] = useState(post.icon);
	const [commentIcon, setCommentIcon] = useState(post.icon);
	const [toolbarShown, setToolbar] = useState(false);

	const { showActionSheetWithOptions } = useActionSheet();

	const toolbarVal = useRef(new Animated.Value(0)).current;
	const toolbarHeightInter = toolbarVal.interpolate({
		inputRange: [0, 0.5, 0.75, 1],
		outputRange: [2, 10, 40, 51]
	});
	const toolbarOpactiyInter = toolbarVal.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1]
	});
	const toolbarMarginInter = toolbarVal.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 10]
	});
	const toolbarStyle = {
		height: toolbarHeightInter,
		opacity: toolbarOpactiyInter,
		marginTop: toolbarMarginInter
	};
	const spinInter = toolbarVal.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '180deg']
	});

	const spiralStyle = {
		transform: [{ rotate: spinInter }]
	};

	function toggleToolbar() {
		setToolbar(!toolbarShown);
		Animated.spring(toolbarVal, {
			toValue: toolbarShown ? 0 : 1,
			duration: 100,
			useNativeDriver: false
		}).start();
	}

	const onPress = () => {
		const options = ['Delete', 'Save', 'Cancel'];
		const destructiveButtonIndex = 0;
		const cancelButtonIndex = 2;

		showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
				destructiveButtonIndex
			},
			(selectedIndex) => {
				switch (selectedIndex) {
					case 1:
						// Save
						break;

					case destructiveButtonIndex:
						console.log(post.id);
						writeData(
							`prayer_circle/circles/-NhXfdEbrH1yxRqiajYm/posts/${post.id}`,
							null,
							true
						);
						writeData(
							`prayer_circle/users/BBAzhYq9VGgofMNO5Jl3cmpT2xe2/posts/${post.id}`,
							null,
							true
						);
						writeData(
							`prayer_circle/posts/${post.id}`,
							null,
							true
						).then(() => {
							setTimeout(() => {
								post.refresh();
							}, 200);
						});

						break;

					case cancelButtonIndex:
					// Canceled
				}
			}
		);
	};

	const tap = Gesture.Tap()
		.numberOfTaps(2)
		.onStart(() => {
			toggleIcon();
		});

	function toggleIcon() {
		if (icon.includes('-outline')) {
			setIcon(icon.replace('-outline', ''));
		} else {
			setIcon(icon + '-outline');
		}
	}

	return (
		<StyledView className='w-full max-w-[500px]'>
			<StyledView className='flex flex-col justify-start items-center w-full bg-[#EBEBEB0D] border border-[#6666660D] rounded-[20px] h-auto py-[10px] my-[5px]'>
				<StyledView className='w-full flex flex-row justify-between px-[10px]'>
					<GestureDetector gesture={tap}>
						<StyledView className=' w-[88%]'>
							<StyledView className='flex flex-row mb-2 '>
								<StyledImage
									className={`${
										post.owned ? 'hidden' : 'flex'
									} rounded-lg`}
									style={{ width: 44, height: 44 }}
									source={{
										uri: post.img
									}}
								/>
								<StyledView
									className={`${post.owned ? '' : 'ml-2'}`}
								>
									<StyledText className='text-offwhite font-bold text-[20px]'>
										{post.title.length > 21
											? post.title.substring(0, 21) +
											  '...'
											: post.title}
									</StyledText>
									<StyledView className='flex flex-row'>
										<StyledText
											className={`${
												post.owned ? 'hidden' : ''
											} text-white`}
										>
											{post.user} •{' '}
										</StyledText>
										<StyledText className={`text-white`}>
											{tS}{' '}
										</StyledText>
										<StyledText
											className={`${
												post.edited ? 'flex' : 'hidden'
											} text-white`}
										>
											(edited){post.edited}
										</StyledText>
									</StyledView>
								</StyledView>
							</StyledView>
							<StyledView className='flex flex-row items-center w-[95%]'>
								<StyledText className='text-white'>
									{post.content}
								</StyledText>
							</StyledView>
						</StyledView>
					</GestureDetector>
					<StyledView className='flex flex-col w-[12%] items-center justify-between'>
						<StyledPressable
							onPress={() => {
								toggleIcon();
							}}
						>
							<Ionicons name={icon} size={35} color='white' />
						</StyledPressable>
						<StyledPressable
							className='flex items-center justify-center w-[39px] aspect-square mt-2'
							onPress={() => {
								toggleToolbar();
							}}
						>
							<AnimatedImage
								className='w-[32px] h-[32px]'
								style={spiralStyle}
								source={require('../assets/spiral.png')}
							/>
						</StyledPressable>
					</StyledView>
				</StyledView>
				<StyledAnimatedView
					style={toolbarStyle}
					className='px-[10px] w-full overflow-hidden'
				>
					<StyledView className='w-full overflow-hidden rounded-full bg-offblack border border-outline'>
						<StyledView className='flex flex-row justify-around items-center w-full h-[49px]'>
							{post.owned || post.ownedToolBar ? (
								<>
									<StyledOpacity
										className='flex items-center justify-center w-[30px] h-[30px]'
										activeOpacity={0.4}
										onPress={onPress}
									>
										<StyledIcon
											name={'trash-outline'}
											size={29}
											color='#CC2500'
										/>
									</StyledOpacity>
									<StyledOpacity
										className='flex items-center justify-center w-[30px] h-[30px]'
										activeOpacity={0.4}
									>
										<StyledIcon
											name={'cog-outline'}
											size={29}
											color='#F9A826'
										/>
									</StyledOpacity>
									<StyledOpacity
										className='flex items-center justify-center w-[30px] h-[30px]'
										activeOpacity={0.4}
									>
										<StyledIcon
											name={'create-outline'}
											size={29}
											color='#00A55E'
										/>
									</StyledOpacity>
									<StyledOpacity
										className='flex items-center justify-center w-[30px] h-[30px]'
										activeOpacity={0.4}
									>
										<StyledIcon
											name={'chatbubble-outline'}
											size={29}
											color='#5946B2'
										/>
									</StyledOpacity>
									<StyledOpacity
										className='flex w-[29px] h-[29px] border-2 border-offwhite rounded-full justify-center'
										activeOpacity={0.4}
									></StyledOpacity>
								</>
							) : (
								<>
									<StyledOpacity
										className='flex items-center justify-center w-[30px] h-[30px]'
										activeOpacity={0.4}
									>
										<StyledIcon
											name={'flag-outline'}
											size={29}
											color='#CC2500'
										/>
									</StyledOpacity>
									<StyledOpacity
										className='flex items-center justify-center w-[30px] h-[30px]'
										activeOpacity={0.4}
									>
										<StyledIcon
											name={'eye-off-outline'}
											size={29}
											color='#F9A826'
										/>
									</StyledOpacity>
									<StyledOpacity
										className='flex items-center justify-center w-[30px] h-[30px]'
										activeOpacity={0.4}
									>
										<StyledIcon
											name={'bookmark-outline'}
											size={29}
											color='#00A55E'
										/>
									</StyledOpacity>
									<StyledOpacity
										className='flex items-center justify-center w-[30px] h-[30px]'
										activeOpacity={0.4}
									>
										<StyledIcon
											name={'chatbubble-outline'}
											size={29}
											color='#5946B2'
										/>
									</StyledOpacity>
									<StyledOpacity
										className='flex w-[29px] h-[29px] border-2 border-offwhite rounded-full justify-center'
										activeOpacity={0.4}
									></StyledOpacity>
								</>
							)}
						</StyledView>
					</StyledView>
				</StyledAnimatedView>
			</StyledView>
		</StyledView>
	);
};
