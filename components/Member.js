import React, { useRef } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { MemberPermissionSelector } from './MemberPermissionSelector';
import CachedImage from './CachedImage';

const StyledText = styled(Text);
const StyledView = styled(View);

function Member({ img, name, role, last, uid, setUp }) {
	permissionRef = useRef(null);
	return (
		<StyledView
			style={{ width: Dimensions.get('window').width - 30 }}
			className={`h-[50px] flex flex-row justify-between items-center bg-grey pl-[10px] py-[10px] border-x border-[#6666660d]
			${last ? 'rounded-b-[10px] h-[60px]' : ''}`}
		>
			<StyledView className={`flex flex-row self`}>
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
						className={`font-[600] text-offwhite text-[22px]`}
					>
						{name}
					</StyledText>
				</StyledView>
			</StyledView>
			<StyledView className='absolute right-2'>
				<MemberPermissionSelector
					role={role}
					uid={uid}
					ref={permissionRef}
					setUp={setUp}
				/>
			</StyledView>
		</StyledView>
	);
}

export { Member };
