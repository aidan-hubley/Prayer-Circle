import React from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { addUserToCircle, deleteData } from '../backend/firebaseFunctions';
import CachedImage from './CachedImage';

const StyledText = styled(Text);
const StyledView = styled(View);
const StyledImage = styled(Image);

function MemberQueue({ img, name, last, uid, circle, updateUserQueueData }) {
	return (
		<StyledView
			style={{ width: Dimensions.get('window').width - 30 }}
			className={`h-[50px] flex flex-row justify-between items-center bg-grey pl-[10px] border-x border-[#6666660d]
			${last ? 'rounded-b-[20px] h-[60px]' : ''}`}
		>
			<StyledView className='flex flex-row'>
				<CachedImage
					className='rounded-[6px]'
					style={{ width: 40, height: 40 }}
					source={{ uri: img }}
					cacheKey={img?.split('2F')[2].split('?')[0]}
					placeholderContent={
						<View className='roudned-[5px] w-[40px] h-[40px] bg-grey'></View>
					}
				/>
				<StyledView className='pl-2 bottom-[3px]'>
					<StyledText
						className={`font-[600] text-offwhite text-[20px]`}
					>
						{name}
					</StyledText>
					<StyledText className={`text-offwhite text-[14px]`}>
						{last}
					</StyledText>
				</StyledView>
			</StyledView>
			<StyledView className='flex-row absoulte right space-x-3'>
				<TouchableOpacity
					onPress={() => {
						addUserToCircle(circle, uid);
						updateUserQueueData(uid);
					}}
				>
					<Ionicons
						name={'checkmark-circle'}
						size={40}
						color={'#00A55E'}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						deleteData(
							`prayer_circle/circles/${circle}/awaitingEntry/${uid}`
						);
					}}
				>
					<Ionicons
						name={'close-circle'}
						size={40}
						color={'#CC2500'}
					/>
				</TouchableOpacity>
			</StyledView>
		</StyledView>
	);
}

export { MemberQueue };
