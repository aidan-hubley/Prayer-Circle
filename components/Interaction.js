import React, { useEffect, useState } from 'react';
import { Text, View, Image, Dimensions } from 'react-native';
import { readData } from '../backend/firebaseFunctions';
import CachedImage from './CachedImage';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Interaction(props) {
	const [data, setData] = useState(null);

	useEffect(() => {
		(async () => {
			// first check if user's data is cached in local storage
			// this may be pointless because what if the user changes their data?
			// maybe we can update the users data everytime we visit their profile?
			let cachedData = await AsyncStorage.getItem(`user/${props.user}`);
			if (!cachedData) {
				// retrieve data from db and cache it
				let userData = await readData(
					`prayer_circle/users/${props.user}/public`
				);
				setData(userData);
				await AsyncStorage.setItem(
					`user/${props.user}`,
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
				<View
					style={{ width: Dimensions.get('window').width - 30 }}
					className='flex flex-row items-center justify-start my-2'
				>
					<CachedImage
						className='rounded-[6px]'
						style={{ width: 40, height: 40 }}
						source={{ uri: props.image }}
						cacheKey={
							data.profile_img?.split('%2F')[2].split('?')[0]
						}
						placeholderContent={
							<View className='roudned-[5px] w-[40px] h-[40px] bg-grey'></View>
						}
					/>
					<Text
						className={`font-[600] text-offwhite text-[20px] ml-2`}
					>
						{`${data.fname} ${data.lname}`}
					</Text>
				</View>
			)}
		</>
	);
}

export { Interaction };
