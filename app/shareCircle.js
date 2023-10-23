import React from 'react';
import { SafeAreaView, Text, View, Share } from 'react-native';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Buttons';
import QRCode from "react-qr-code";

const StyledView = styled(View);
const StyledText = styled(Text);

const shareCircle = async () => {
  try {
    await Share.share({
      title: 'Hey, this message was sent from our app! https://github.com/aidan-hubley/Prayer-Circle',
      message: 'Hey, this message was sent from our app! https://github.com/aidan-hubley/Prayer-Circle',
      url: 'Hey, this message was sent from our app! https://github.com/aidan-hubley/Prayer-Circle'
    });
  } catch (error) {
    console.error('Error sharing:', error);
  }
}

export default function Page() {
	let insets = useSafeAreaInsets();
	let topButtonInset = insets.top > 30 ? insets.top : insets.top + 10;

	return (
		<StyledView style={{ flex: 1 }}>
			<StyledView className='bg-offblack border flex-1'>
				<StyledView className='flex-1 items-center'>
					<StyledView className='absolute top-10 bg-grey text-center h-[60px] px-[35px] py-[12px] rounded-full'>
						<StyledText className='text-3xl text-offwhite'>
							Circle Name
						</StyledText>
					</StyledView>

					<StyledView className="absolute top-[20%] border-[10px] bg-offwhite border-purple p-[10px] rounded-xl">
						<StyledView className='p-[15px] rounded-xl'>
							<QRCode
								size={240}
								value={"Hey, this is a test, it works! - Aidan"} // This is where the circle ID will go
								onPress={() =>shareCircle()}
							/>
						</StyledView>
					</StyledView>
					<StyledView className="absolute bottom-[25%] border-[10px] border-purple bg-white mt-20 p-[10px] rounded-xl">
						<StyledText className='px-[5px] font-bold text-3xl text-offblack' onPress={() =>shareCircle()}>
							1234567890
						</StyledText>
					</StyledView>	
					
				</StyledView>
					<Button // Share Circle
						btnStyles='absolute right-5 bottom-5'
						height={'h-[60px]'}
						width={'w-[60px]'}
						iconSize={40}
						icon='share'	
						press={() => shareCircle()}		
					/>

					<Button // to Settings Page 	
						btnStyles='absolute left-5 bottom-5'
						height={'h-[60px]'}
						width={'w-[60px]'}
						iconSize={40}
						icon='cog'					
						href='circleSettings'
					/>
			</StyledView>
		</StyledView>
	);
}
