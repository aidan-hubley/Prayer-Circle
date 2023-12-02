import React, { useState, useRef, useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import { styled } from 'nativewind';
import { timeSince } from '../backend/functions';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

export const Comment = (comment) => {
	return (
		<StyledView className='flex flex-row w-[90%] items-start pt-[4px] pb-[10px] px-1 my-1'>
			<StyledView className='w-[35px] aspect-square pt-[4px] items-center justify-center self-start'>
				<StyledImage
					className='rounded-[5px]'
					width={35}
					height={35}
					source={{
						uri:
							comment.img ||
							`https://picsum.photos/${Math.round(
								Math.random() * 1000
							)}`
					}}
				/>
			</StyledView>
			<StyledView className='flex-1 ml-[8px]'>
				<StyledView className=' flex flex-row items-center'>
					<StyledText className='font-bold text-[18px] text-white'>
						{comment.username}
					</StyledText>
					<StyledText className='text-[14px] text-outline'>
						{`${comment.edited ? ' (edited)' : ''}`}
					</StyledText>
				</StyledView>
				<StyledText className='text-white text-[16px]'>
					{comment.content}
				</StyledText>
			</StyledView>
			<StyledView className='w-[35px] flex flex-col items-end justify-center'>
				<StyledText className='text-[13px] text-white'>
					{timeSince(comment.timestamp)}
				</StyledText>
			</StyledView>
		</StyledView>
	);
};
