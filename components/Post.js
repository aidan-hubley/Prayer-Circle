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
const StyledIcon = styled(Ionicons);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledOpacity = styled(TouchableOpacity);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));
const AnimatedImage = Animated.createAnimatedComponent(StyledImage);

const Post = (post) => {
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

	function bottomBar() {
		if (!post.end) {
			return (
				<StyledView className='flex items-center justify-center h-[30px] w-full'>
					<StyledView className='w-[75%] h-[1px]'></StyledView>
				</StyledView>
			);
		}
	}

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
			<StyledView className='flex flex-col justify-start items-center w-full bg-grey rounded-[20px] py-[10px] my-[5px]'>
				<StyledView className='w-full flex flex-row justify-between px-[10px]'>
					<GestureDetector gesture={tap}>
						<StyledView className=' w-[88%]'>
							<StyledView className='flex flex-row mb-2 '>
								<StyledImage
									className='rounded-lg'
									style={{ width: 44, height: 44 }}
									source={{
										uri: post.img
									}}
								/>
								<StyledView className='ml-2'>
									<StyledText className='text-offwhite font-bold text-[20px]'>
										{post.title.length > 21
											? post.title.substring(0, 21) +
											  '...'
											: post.title}
									</StyledText>
									<StyledText className='text-white'>
										{post.user} • {tS} {post.edited ? '• (edited)' : null}
									</StyledText>
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
							<StyledIcon name={icon} size={35} color='white' />
						</StyledPressable>
						<StyledPressable
							className='flex items-center justify-center w-[39px] aspect-square mt-2'
							onPress={() => {
								toggleToolbar();
							}}
						>
							<AnimatedImage
								className='w-[39px] h-[39px]'
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
					<StyledView className='w-full overflow-hidden rounded-full bg-offblack'>
						<StyledView className='flex flex-row justify-around items-center w-full h-[50px]'>
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
							>
							</StyledOpacity>
						</StyledView>
					</StyledView>
				</StyledAnimatedView>
			</StyledView>
		</StyledView>
	);
};

const OwnedPost = (post) => {
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

	function bottomBar() {
		if (!post.end) {
			return (
				<StyledView className='flex items-center justify-center h-[30px] w-full'>
					<StyledView className='w-[75%] h-[1px]'></StyledView>
				</StyledView>
			);
		}
	}

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
			<StyledView className='flex flex-col justify-start items-center w-full bg-grey rounded-[20px] py-[10px] my-[5px]'>
				<StyledView className='w-full min-h-[100px] flex flex-row justify-between px-[10px]'>
					<GestureDetector gesture={tap}>
						<StyledView className='w-[88%]'>
							<StyledView className='mb-1 ml-2 flex h-5'>
								<StyledText className='text-offwhite font-bold text-[18px] w-[90%]'>
									{/* {post.title.length > 32
										? post.title.substring(0, 32) +
											'...'
										: post.title}  */}
									{post.title}
								</StyledText>
							</StyledView>
							{post.edited 
								? <StyledText className='ml-1 mb-1 text-offwhite text-[12px]'> (edited) </StyledText>
								: null}
							<StyledView className='flex flex-row items-center w-[95%] ml-2'>
								<StyledText className='text-white'>
									{post.content}
								</StyledText>
							</StyledView>
						</StyledView>
					</GestureDetector>
					<StyledView className='flex flex-col w-[12%] items-center content-center justify-between'>
						<StyledIcon name={icon} size={35} color='white' />
						<StyledText className='text-offwhite text-center text-[12px] absolute top-[34px]'>
							{post.interactions}
						</StyledText>
						
						<StyledPressable
							className='flex items-center justify-center w-[39px] aspect-square mt-2'
							onPress={() => {
								toggleToolbar();
							}}
						>
							<AnimatedImage
								className='w-[39px] h-[39px]'
								style={spiralStyle}
								source={require('../assets/spiral.png')}
							/>
							<StyledText className='text-offwhite text-center text-[12px] absolute top-[11px]'>
								{tS} 
							</StyledText>
						</StyledPressable>
					</StyledView>
				</StyledView>
				<StyledAnimatedView
					style={toolbarStyle}
					className='px-[10px] w-full overflow-hidden'
				>
					<StyledView className='w-full overflow-hidden rounded-full bg-offblack'>
						<StyledView className='flex flex-row justify-around items-center w-full h-[50px]'>
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
							>
							</StyledOpacity>
						</StyledView>
					</StyledView>
				</StyledAnimatedView>
			</StyledView>
		</StyledView>
	);
};

export { Post, OwnedPost }