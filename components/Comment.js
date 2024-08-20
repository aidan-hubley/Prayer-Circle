import React, { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import { styled } from 'nativewind';
import { timeSince } from '../backend/functions';
import CachedImage from './CachedImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { readData } from '../backend/firebaseFunctions';
/* import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage'; */

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

/* 
TODO: implement faster storage solution
const cachedUserData = new MMKVLoader().withInstanceID('users').initialize();
 */
/* TODO: add swipe gesture for delete or edit comment */
export const Comment = (comment) => {
	const [data, setData] = useState(null);

	useEffect(() => {
		(async () => {
			// first check if user's data is cached in local storage
			// this may be pointless because what if the user changes their data?
			// maybe we can update the users data everytime we visit their profile?
			let cachedData = await AsyncStorage.getItem(`user/${comment.user}`);
			if (!cachedData) {
				// retrieve data from db and cache it
				let userData = await readData(
					`prayer_circle/users/${comment.user}/public`
				);
				setData(userData);
				await AsyncStorage.setItem(
					`user/${comment.user}`,
					JSON.stringify(userData)
				);
			} else {
				// use cached data
				setData(JSON.parse(cachedData));
			}
		})();
	}, []);
	return (
		<>
			{data && (
				<StyledView className='flex flex-row w-[90%] items-center px-1 my-2'>
					<CachedImage
						className='rounded-[5px] w-[40px] h-[40px] self-start'
						cacheKey={
							data.profile_img?.split('%2F')[2].split('?')[0]
						}
						source={{
							uri: data.profile_img
						}}
					/>
					<StyledView className='flex-1 ml-[8px]'>
						<StyledView className=' flex flex-row items-center'>
							<StyledText className='font-bold text-[18px] text-white'>
								{`${data.fname} ${data.lname}`}
							</StyledText>
							{/* <StyledText className='text-[14px] text-outline'>
						{`${comment.edited ? ' (edited)' : ''}`}
					</StyledText> */}
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
			)}
		</>
	);
};
