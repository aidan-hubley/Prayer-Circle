import React, { useState } from 'react';
import { Text, View, Image, Pressable } from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const StyledImage = styled(Image);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

export const Post = (post) => {
	function timeSince(timeStamp) {
		let now = Date.now();
		let timeDiff = now - timeStamp;

		timeDiff /= 1000;
		if (timeDiff < 60) {
			return Math.round(timeDiff) + 's';
		}
		timeDiff /= 60;
		if (timeDiff < 60) {
			return Math.round(timeDiff) + 'm';
		}
		timeDiff /= 60;
		if (timeDiff < 24) {
			return Math.round(timeDiff) + 'h';
		}
		timeDiff /= 24;
		if (timeDiff < 7) {
			return Math.round(timeDiff) + 'd';
		}
		timeDiff /= 7;
		if (timeDiff < 4) {
			return Math.round(timeDiff) + 'w';
		}
		timeDiff /= 4;
		if (timeDiff < 12) {
			return Math.round(timeDiff) + 'm';
		}
		timeDiff /= 12;
		if (timeDiff < 10) {
			return Math.round(timeDiff) + 'y';
		}
	}
	const tS = timeSince(post.timestamp);
	const [icon, setIcon] = useState(post.icon);
	const [toolbarShown, setToolbar] = useState(false);

	function bottomBar() {
		if (!post.end) {
			return (
				<StyledView className='flex items-center justify-center h-[30px] w-full'>
					<StyledView className='w-[75%] h-[1px] border border-[#EBEBEB22]'></StyledView>
				</StyledView>
			);
		}
	}

	function toolbar() {
		if (toolbarShown) {
			return (
				<StyledView className='flex flex-row justify-around items-center w-full h-[50px] mt-2 rounded-full bg-offblack border border-[#EBEBEB33] px-[15px]'>
					<StyledView className='w-[30px] h-[30px] border border-red' />
					<StyledView className='w-[30px] h-[30px] border border-red' />
					<StyledView className='w-[30px] h-[30px] border border-red' />
					<StyledView className='w-[30px] h-[30px] border border-red' />
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
		<StyledView>
			<StyledView className='flex flex-col justify-start items-center w-full bg-[#EBEBEB0D] rounded-[20px] h-auto px-[10px] py-[10px] mb-4'>
				<StyledView className='flex flex-row justify-between'>
					<GestureDetector gesture={tap}>
						<StyledView className=' w-[87%]'>
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
										{post.user} • {tS}
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
							<Ionicons name={icon} size={35} color='white' />
						</StyledPressable>
						<StyledPressable
							className='w-full aspect-square rounded-full border-4 border-offwhite'
							onPress={() => {
								setToolbar(!toolbarShown);
							}}
						></StyledPressable>
					</StyledView>
				</StyledView>
				{toolbar()}
			</StyledView>
			{/* {bottomBar()} */}
		</StyledView>
	);
};
