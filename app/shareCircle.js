import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { styled } from 'nativewind';
import { Button } from '../components/Buttons';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

export default function Page() {
	return (
		<StyledSafeArea className='bg-offblack border' style={{ flex: 1 }}>
			<StyledView className='flex-1 items-center'>
				<StyledText className='absolute top-20 text-3xl text-offwhite bg-grey text-center h-[60px] px-[35px] py-[12px] rounded-full'>
					Circle Name
				</StyledText>


				<Button
                    btnStyles='sticky absolute right-5 bottom-10'
					height={'h-[60px]'}
                    width={'w-[60px]'}
                    iconSize={40}
					icon='share-outline'					
                />
                <Button
                    btnStyles='sticky absolute left-5 bottom-10'
                    height={'h-[60px]'}
                    width={'w-[60px]'}
                    iconSize={40}
					icon='cog-outline'					
                    href='circleSettings'
                />
			</StyledView>
		</StyledSafeArea>
	);
}
