import React from 'react';
import { SafeAreaView, Text, View, Share } from 'react-native';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Buttons';
import QRCode from 'react-qr-code';
import Ionicons from '@expo/vector-icons/Ionicons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledIcon = styled(Ionicons);

const shareCircle = async () => {
	try {
		await Share.share({
			title: 'Hey, this message was sent from our app! https://github.com/aidan-hubley/Prayer-Circle',
			message:
				'Hey, this message was sent from our app! https://github.com/aidan-hubley/Prayer-Circle',
			url: 'Hey, this message was sent from our app! https://github.com/aidan-hubley/Prayer-Circle'
		});
	} catch (error) {
		console.error('Error sharing:', error);
	}
};

export default function Page() {
	let insets = useSafeAreaInsets();
	let topInset = insets.top > 30 ? insets.top : insets.top + 10;

	return (
		<StyledView
			className='bg-offblack flex-1'
			style={{ paddingTop: topInset }}
		>
			<StyledView className='flex-1 items-center'>
				<StyledView className='flex items-center justify-center text-center w-screen h-[90px]'>
					<StyledText className='text-offwhite font-bold text-4xl'>
						Circle Name
					</StyledText>
				</StyledView>

				<StyledView className='absolute top-[15%] border-[10px] bg-offwhite border-purple p-[10px] rounded-xl'>
					<StyledView className='p-[15px] rounded-xl'>
						<QRCode
							size={240}
							value={'Hey, this is a test, it works! - Aidan'} // This is where the circle ID will go
							onPress={() => shareCircle()}
						/>
					</StyledView>
				</StyledView>
				<StyledView className='absolute bottom-[30%] border-[10px] border-purple bg-white mt-20 p-[10px] rounded-xl'>
					<StyledText
						className='px-[5px] font-bold text-3xl text-offblack'
						onPress={() => shareCircle()}
					>
						1234567890
					</StyledText>
				</StyledView>	
				<StyledView className='absolute bottom-[15%] border-[10px] border-purple bg-white mt-20 p-[10px] rounded-xl flex flex-row items-center'>
					<StyledIcon 
						name='shield' 
						size={30} 
						color='#121212'
					/>
					<StyledText
						className='px-[5px] font-bold text-3xl text-offblack'
						onPress={() => shareCircle()}
					>
						1234567890
					</StyledText>
				</StyledView>				
			</StyledView>
			<StyledView
				className='absolute flex flex-row w-screen px-[15px] justify-between'
				style={{ bottom: insets.bottom }}
			>
				<Button // to Settings Page
					height={'h-[50px]'}
					width={'w-[50px]'}
					iconSize={30}
					icon='cog'
					href='circleSettings'
				/>
				<Button // Share Circle
					height={'h-[50px]'}
					width={'w-[50px]'}
					iconSize={30}
					icon='share'
					press={() => shareCircle()}
				/>
			</StyledView>
		</StyledView>
	);
}
