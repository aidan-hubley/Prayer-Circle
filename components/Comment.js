import React, { useState, useRef, useEffect } from 'react';
import { Text, View } from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';

const StyledView = styled(View);
const StyledText = styled(Text);

export const Comment = (comment) => {
	return (
		<StyledView className='flex flex-col w-full justify-start items-center rounded-b-[20px] pt-[4px] pb-[10px]'>
			<StyledView className='w-[90%] flex flex-row justify-between'>
				<StyledView className=' flex flex-row'>
					<StyledView className=' items-center justify-center'>
						<Ionicons name={'hand-left'} size={24} color='white' />
					</StyledView>
					<StyledView className='ml-[8px]'>
						<StyledView className=' flex flex-row'>
							<StyledText className='font-bold text-[18px] text-white'>
								{comment.content} 
							</StyledText>
							<StyledText className='font-bold text-[18px] text-outline'>
								{`${comment.edited ? ' edited' : ''}`}
							</StyledText>
						</StyledView>
						<StyledText className='text-white text-[12px]'>
							{comment.user}
						</StyledText>
					</StyledView>
				</StyledView>
				<StyledView className=' flex flex-col items-end justify-center'>
					<StyledText className='text-[13px] text-white'>
						{comment.timestamp}
					</StyledText>
				</StyledView>
			</StyledView>

			<StyledView className='w-[90%] border-t border-outline mt-[5px] mb-[3px]'></StyledView>
		</StyledView>
	);
};
