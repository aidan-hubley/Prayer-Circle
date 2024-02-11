import React, { useState, useEffect } from 'react';
import {
	Text,
	View,
	Image,
	Share,
	Pressable,
	Platform,
	ScrollView
} from 'react-native';
import { styled } from 'nativewind';
import Modal from 'react-native-modal';
import {
	SafeAreaView,
	useSafeAreaInsets
} from 'react-native-safe-area-context';
import { Button } from '../../components/Buttons';
import Ionicons from '@expo/vector-icons/Ionicons';
import QRCode from 'react-qr-code';
import { readData } from '../../backend/firebaseFunctions';
import { useStore } from '../global';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledIcon = styled(Ionicons);
const StyledModal = styled(Modal);
const StyledPressable = styled(Pressable);

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

async function getCircleCodes(circle, type) {
	return (
		(await readData(`prayer_circle/circles/${circle}/codes/${type}`)) || {}
	);
}

export default function Page() {
	let insets = useSafeAreaInsets();
	let topInset = Platform.OS == 'android' ? insets.top + 10 : 0;

	const [isModalVisible1, setModalVisible1] = useState(false);
	const toggleModal1 = () => {
		setModalVisible1(!isModalVisible1);
	};

	const [isCodeVisible, setIsCodeVisible] = useState(false);

	const toggleVisibleCode = () => {
		setIsCodeVisible(!isCodeVisible);
	};

	const filterTarget = useStore((state) => state.filter);

	let publicCode,
		privateCode = 0;
	fetchCodes = async () => {
		publicCode = await getCircleCodes(filterTarget, 'public');
		privateCode = await getCircleCodes(filterTarget, 'admin');
	};
	fetchCodes().then(() => {
		console.log(publicCode);
		console.log(privateCode);
	});

	return (
		<StyledView
			className='bg-offblack flex-1'
			style={{ paddingTop: topInset }}
		>
			<ScrollView bounces={false}>
				<StyledView className='flex-1 min-h-screen flex flex-col items-center'>
					<StyledView className='flex items-center justify-center text-center w-screen h-[90px]'>
						<StyledText className='text-offwhite font-bold text-4xl'>
							Circle Name
						</StyledText>
					</StyledView>
					<StyledView className='align-self-center'>
						<StyledView className='border-[6px] bg-offwhite border-purple rounded-xl'>
							<StyledView className='p-[15px] rounded-xl'>
								<QRCode
									size={240}
									value={
										'Hey, this is a test, it works! - Aidan'
									} // This is where the circle ID will go
									onPress={() => shareCircle()}
								/>
							</StyledView>
						</StyledView>
						<StyledView className='border-[4px] border-purple bg-white mt-7 p-[10px] rounded-xl'>
							<StyledText
								className='px-[5px] font-bold text-3xl text-offblack text-center'
								onPress={() => shareCircle()}
							>
								{publicCode}
							</StyledText>
						</StyledView>
						<StyledView className='flex-row justify-center items-baseline'>
							<StyledText className='text-white mt-10 mb-2 text-center font-bold text-3xl'>
								Private Code
							</StyledText>
						</StyledView>
						<StyledPressable
							className='border-[4px] border-offwhite bg-offblack p-[10px] rounded-xl flex-row justify-center relative h-100 w-100'
							onPress={toggleVisibleCode}
						>
							{isCodeVisible ? (
								<>
									<StyledText
										className='font-bold text-3xl text-offwhite'
										onPress={() => shareCircle()}
									>
										{privateCode}
									</StyledText>
									<StyledView className='absolute left-3 top-3'>
										<StyledIcon
											className=''
											name='eye'
											size={30}
											color='#FFFBFC'
										/>
									</StyledView>
								</>
							) : (
								<>
									<StyledText className='font-bold text-3xl text-offwhite'>
										Tap to View
									</StyledText>
									<StyledView className='absolute left-3 top-3'>
										<StyledIcon
											className=''
											name='eye-off'
											size={30}
											color='#FFFBFC'
										/>
									</StyledView>
								</>
							)}
						</StyledPressable>
					</StyledView>
				</StyledView>
			</ScrollView>
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
				<Button
					title='How to share?'
					height={'h-[50px]'}
					width={'w-[200px]'}
					press={toggleModal1}
				/>
				<Button // Share Circle
					height={'h-[50px]'}
					width={'w-[50px]'}
					iconSize={30}
					icon='share'
					press={() => shareCircle()}
				/>
			</StyledView>

			<StyledModal
				className='w-[80%] self-center'
				isVisible={isModalVisible1}
				onBackdropPress={toggleModal1}
			>
				<StyledView className='bg-offblack border-[5px] border-purple rounded-2xl h-[55%] px-2 py-3'>
					<StyledView className='items-center'>
						<StyledText className='top-[6%] text-3xl text-offwhite'>
							How to share circles:
						</StyledText>
					</StyledView>
					<StyledView className='flex-1 mx-2 gap-y-8'>
						<StyledView className='flex-row items-center pt-6'>
							<StyledIcon
								className=''
								name='qr-code-outline'
								size={30}
								color='#FFFBFC'
							/>
							<StyledText className='ml-3 text-2xl text-offwhite'>
								Scan this QR code
							</StyledText>
						</StyledView>
						<StyledView className='flex-row items-center'>
							<StyledIcon
								className=''
								name='text'
								size={30}
								color='#FFFBFC'
							/>
							<StyledText className='ml-3 text-2xl text-offwhite'>
								Share this code
							</StyledText>
						</StyledView>
						<StyledView className='flex-row items-center'>
							<StyledIcon
								className=''
								name='share-outline'
								size={30}
								color='#FFFBFC'
							/>
							<StyledText className='ml-3 text-2xl text-offwhite'>
								Share on other apps
							</StyledText>
						</StyledView>
						<StyledView className='flex-row items-center'>
							<StyledIcon
								className=''
								name='shield'
								size={30}
								color='#FFFBFC'
							/>
							<StyledText className='ml-3 text-2xl text-offwhite'>
								Share the private code
							</StyledText>
							<StyledText className='absolute top-10 left-10 text-l text-offwhite'>
								Only share with trusted people!
							</StyledText>
						</StyledView>
					</StyledView>
					<StyledView className='items-center py-3'>
						<Button
							title='Got it!'
							width='w-[70%]'
							press={toggleModal1}
						/>
					</StyledView>
				</StyledView>
			</StyledModal>
		</StyledView>
	);
}
