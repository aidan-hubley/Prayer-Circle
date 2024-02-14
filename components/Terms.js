import { Text, View, ScrollView } from 'react-native';
import React, { forwardRef } from 'react';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { readData } from '../../backend/firebaseFunctions';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);



const Terms = forwardRef(() => {
	return (
		<StyledSafeArea className='bg-offblack border border-offwhite rounded-[20px]'>
			<StyledView className='flex-1 items-center'>
				<StyledText className='text-xl text-offwhite'>
					TERMS AND CONDITIONS
				</StyledText>
				<StyledText className='text-offwhite'>
					Last updated: 
				</StyledText>
				<ScrollView className='top-[10px] bottom-[10px] w-[90%] text-offwhite pt-[10px] pb-[20px]'>
					{/* Below is the TOS container (collapsed) */}
					
				</ScrollView>
			</StyledView>
		</StyledSafeArea>
	);
});

export { Terms };
