import React, { useRef } from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';

const StyledText = styled(Text);
const StyledView = styled(View);
const StyledImage = styled(Image);

function MemberQueue({ img, name, username, last }) {
	return (
		<StyledView
			style={{ width: Dimensions.get('window').width - 30 }}
			className={`h-[50px] flex flex-row justify-between items-center bg-grey pl-[10px] py-[10px] border-x border-[#6666660d]
			${last ? 'rounded-b-[20px] h-[60px]' : ''}`}
		>
			<StyledView className='flex flex-row'>
				<StyledImage
					className='rounded-xl'
					style={{ width: 40, height: 40 }}
					source={{ uri: img }}
				/>
				<StyledView className='pl-2 bottom-[3px]'>
					<StyledText
						className={`font-[600] text-offwhite text-[20px]`}
					>
						{name}
					</StyledText>
					<StyledText className={`text-offwhite text-[14px]`}>
						{username}
					</StyledText>
				</StyledView>
			</StyledView>
			<StyledView className='flex-row absoulte right'>
				<TouchableOpacity onPress={() => {}}>
					<Ionicons
						name={'checkmark-circle'}
						size={30}
						color={'#00A55E'}
					/>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => {}}>
					<Ionicons
						name={'close-circle'}
						size={30}
						color={'#CC2500'}
					/>
				</TouchableOpacity>
			</StyledView>
		</StyledView>
	);
}

export { MemberQueue };
