import React, { useEffect, useState } from 'react';
import { Text, View, Image, Dimensions } from 'react-native';
import { readData } from '../backend/firebaseFunctions';
import CachedImage from './CachedImage';

function Interaction(props) {
	return (
		<View
			style={{ width: Dimensions.get('window').width - 30 }}
			className='flex flex-row items-center justify-start my-2'
		>
			<CachedImage
				className='rounded-[6px]'
				style={{ width: 40, height: 40 }}
				source={{ uri: props.image }}
				cacheKey={props.image?.split('2F')[2].split('?')[0]}
				placeholderContent={
					<View className='roudned-[5px] w-[40px] h-[40px] bg-grey'></View>
				}
			/>
			<Text className={`font-[600] text-offwhite text-[20px] ml-2`}>
				{props.name}
			</Text>
		</View>
	);
}

export { Interaction };
