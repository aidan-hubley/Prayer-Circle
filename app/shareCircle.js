import React from 'react';
import { SafeAreaView, Text, View, Share } from 'react-native';
import { styled } from 'nativewind';
import { Button } from '../components/Buttons';
import QRCode from "react-qr-code";

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

const shareCircle = async () => {
  try {
    await Share.share({
      title: 'Hey, join my prayer circle!! Here is the link: https://prayercircle.app/circle/654911684217646',
      message: 'Hey, join my prayer circle!! Here is the link: https://prayercircle.app/circle/654911684217646',
      url: 'Hey, join my prayer circle!! Here is the link: https://prayercircle.app/circle/654911684217646'
    });
  } catch (error) {
    console.error('Error sharing:', error);
  }
}

export default function Page() {
	return (
		<StyledSafeArea className='bg-offblack border' style={{ flex: 1 }}>
			<StyledView className='flex-1 items-center'>
				<StyledText className='absolute top-10 text-3xl text-offwhite bg-grey text-center h-[60px] px-[35px] py-[12px] rounded-full'>
					Circle Name
				</StyledText>

				<StyledView className='absolute top-[200px]'>
					<StyledView className="bg-purple p-[10px] rounded-xl">
						<StyledView className='p-[25px] bg-offwhite rounded-xl'>
							<QRCode
								size={240}
								value={"Hey, this is a test, it works! -"}
								 onPress={() =>shareCircle()}
							/>
						</StyledView>
					</StyledView>
					<StyledView className="bg-purple mt-20 p-[10px] rounded-xl">
						<StyledText className='p-[5px] bg-offwhite rounded-xl text-center font-bold text-3xl text-offblack' onPress={() =>shareCircle()}>
							654911684217646
						</StyledText>
					</StyledView>
				</StyledView>	
				
				<Button
					btnStyles='absolute right-5 bottom-10'
					height={'h-[60px]'}
					width={'w-[60px]'}
					iconSize={40}
					icon='share-outline'	
					press={() => shareCircle()}		
				/>

                <Button
                    btnStyles='absolute left-5 bottom-10'
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
