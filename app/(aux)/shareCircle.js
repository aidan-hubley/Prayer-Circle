import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
	Text,
	View,
	Share,
	Pressable,
	Platform,
	ScrollView
} from 'react-native';
import { styled } from 'nativewind';
import {
	BottomSheetModal,
	BottomSheetModalProvider
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Buttons';
import Ionicons from '@expo/vector-icons/Ionicons';
import QRCode from 'react-qr-code';
import { readData } from '../../backend/firebaseFunctions';
import { useStore } from '../global';
import { handle, backdrop } from '../../components/BottomSheetModalHelpers.js';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledIcon = styled(Ionicons);
const StyledPressable = styled(Pressable);

export default function Page() {
	let insets = useSafeAreaInsets();
	let topInset = Platform.OS == 'android' ? insets.top + 10 : 0;
	const [publicCode, setPublicCode] = useState(0);
	const [privateCode, setPrivateCode] = useState(0);
	const [circleName, setCircleName] = useState('');

	const bottomSheetModalRef = useRef(null);
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const [circlePermissions, setCirclePermissions] = useState(false);
	const [isCodeVisible, setIsCodeVisible] = useState(false);

	const toggleVisibleCode = () => {
		setIsCodeVisible(!isCodeVisible);
	};

	const filterTarget = useStore((state) => state.filter);
	const circlePermission = useStore((state) => state.currentCircleRole);

	const shareCircle = async () => {
		try {
			await Share.share({
				title:
					'Come join my ' +
					circleName +
					' Circle on Prayer Circle! Here is the code: ' +
					publicCode,
				message:
					'Come join my ' +
					circleName +
					' Circle on Prayer Circle! Here is the code: ' +
					publicCode,
				url:
					'Come join my ' +
					circleName +
					' Circle on Prayer Circle! Here is the code: ' +
					publicCode
			});
		} catch (error) {
			console.error('Error sharing:', error);
		}
	};

	useEffect(() => {
		(async () => {
			let codes = (await readData(
				`prayer_circle/circles/${filterTarget}/codes`
			)) || { public: 0, admin: 0 };
			setPublicCode(codes.public);
			setPrivateCode(codes.admin);
			let name =
				(await readData(
					`prayer_circle/circles/${filterTarget}/title`
				)) || 'Circle Name';
			setCircleName(name);
		})();
	}, []);

	return (
		<BottomSheetModalProvider>
			<StyledView
				className='bg-offblack'
				style={{ paddingTop: topInset }}
			>
				<ScrollView bounces={false}>
					<StyledView className='min-h-screen flex flex-col items-center'>
						<StyledView className='flex items-center justify-center text-center w-screen h-[90px]'>
							<StyledText className='text-offwhite font-bold text-4xl'>
								{circleName}
							</StyledText>
						</StyledView>
						<StyledView className='align-self-center'>
							<StyledView className='border bg-offwhite border-purple rounded-[20px]'>
								<StyledView className='p-[15px] rounded-xl'>
									<QRCode
										size={240}
										value={`${publicCode}`}
										onPress={() => shareCircle()}
									/>
								</StyledView>
							</StyledView>
							<StyledView className='border border-purple bg-offblack mt-4 p-[10px] rounded-[15px]'>
								<StyledText
									className='px-[5px] font-bold text-3xl text-offwhite text-center'
									onPress={() => shareCircle()}
								>
									{publicCode}
								</StyledText>
							</StyledView>
							{(circlePermission === 'owner' ||
								circlePermission === 'admin') && (
								<StyledView>
									<StyledPressable
										className='border border-[#FFFBFC66] bg-offblack p-[10px] mt-4 rounded-[15px] flex-row justify-center relative h-100 w-100'
										onPress={toggleVisibleCode}
									>
										{isCodeVisible ? (
											<>
												<StyledText
													className='font-bold text-3xl text-offwhite'
													onPress={() =>
														shareCircle()
													}
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
												<StyledText className='font-[600] ml-4 text-3xl text-offwhite'>
													Private Code
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
							)}
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
						press={() => handlePresentModalPress()}
					/>
					<Button // Share Circle
						height={'h-[50px]'}
						width={'w-[50px]'}
						iconSize={30}
						icon='share'
						press={() => shareCircle()}
					/>
				</StyledView>

				<BottomSheetModal
					enableDismissOnClose={true}
					ref={bottomSheetModalRef}
					snapPoints={['55%']}
					handleComponent={() =>
						handle('Share the ' + `${circleName}` + ' Circle with:')
					}
					backdropComponent={(backdropProps) =>
						backdrop(backdropProps)
					}
				>
					<StyledView className='flex-1 bg-grey'>
						<StyledView className='flex-1 mx-7 gap-y-8'>
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
							{circlePermission === 'owner' ||
							circlePermission === 'admin' ? (
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
										This skips the queue, share carefully!
									</StyledText>
								</StyledView>
							) : (
								<></>
							)}
						</StyledView>
					</StyledView>
				</BottomSheetModal>
			</StyledView>
		</BottomSheetModalProvider>
	);
}
