import React, { useRef } from 'react';
import { Text, View, Image, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { MemberPermissionSelector } from './MemberPermissionSelector';
import CachedImage from 'expo-cached-image';
import shorthash from 'shorthash';

const StyledText = styled(Text);
const StyledView = styled(View);
const StyledImage = styled(Image);

function Member({ img, name, username, role, last }) {
	permissionRef = useRef(null);
	return (
		<StyledView
			style={{ width: Dimensions.get('window').width - 30 }}
			className={`h-[50px] flex flex-row justify-between items-center bg-grey pl-[10px] py-[10px] border-x border-[#6666660d]
			${last ? 'rounded-b-[20px] h-[60px]' : ''}`}
		>
			<StyledView className='flex flex-row'>
				<CachedImage
					className='rounded-[5px]'
					style={{ width: 40, height: 40 }}
					source={{ uri: img }}
					cacheKey={shorthash.unique(img)}
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
			<StyledView className='absolute right-2'>
				<MemberPermissionSelector role={role} ref={permissionRef} />
			</StyledView>
		</StyledView>
	);
}

export { Member };
