import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, ScrollView, Keyboard } from 'react-native';
import { styled } from 'nativewind';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
	SafeAreaView,
	useSafeAreaInsets
} from 'react-native-safe-area-context';
import { Button } from '../../components/Buttons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {
	readData,
	addUserToCircle,
	addUserToQueue,
	checkIfUserIsInCircle
} from '../../backend/firebaseFunctions';
import { router } from 'expo-router';
import { useStore, notify } from '../../app/global';
import { Loading } from '../../components/Loading';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);

export default function Page() {
	const [searching, setSearching] = useState(false);
	const [code, setCode] = useState('');
	const [hasPermission, setHasPermission] = useState(null);
	const [scanned, setScanned] = useState(false);
	const setFilterReload = useStore((state) => state.setFilterReload);
	let insets = useSafeAreaInsets();
	let topInset = Platform.OS == 'android' ? insets.top + 10 : 0;

	async function searchForCircle(code) {
		let publicCode,
			adminCode = false;
		let circles = Object.keys(
			(await readData(`prayer_circle/circles`)) || {}
		);
		let circle = null;
		for (const element of circles) {
			circle = element;
			let circleData =
				(await readData(`prayer_circle/circles/${circle}/codes`)) || {};
			if (circleData.public == code) {
				publicCode = true;
				break;
			} else if (circleData.admin == code) {
				adminCode = true;
				break;
			}
		}
		if (!(adminCode || publicCode)) {
			notify(
				'Error Finding Circle',
				'No circles have this code.',
				'#CC2500'
			);
			setSearching(false);
		} else {
			let inCircle = await checkIfUserIsInCircle(circle);
			if (!inCircle) {
				if (adminCode) {
					setSearching(false);
					addUserToCircle(circle);
					notify(
						'Added Directly to Circle',
						'You have been added to the circle.',
						'#00A55E'
					);
					router.replace('/');
				} else {
					setSearching(false);
					addUserToQueue(circle);
					notify(
						'Added to Circle Waiting Queue',
						"You have been added this circle's waiting queue, check back later!",
						'#00A55E'
					);
					router.replace('/');
				}
			} else {
				setSearching(false);
				notify('Invalid code', 'You are already in this circle.');
			}
		}
	}

	useEffect(() => {
		const getBarCodeScannerPermissions = async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === 'granted');
		};

		getBarCodeScannerPermissions();
	}, []);

	useEffect(() => {}, [searching]);

	const handleBarCodeScanned = ({ type, data }) => {
		setScanned(true);
		if (type === 'org.iso.QRCode' || type === 256) {
			setSearching(true);
			searchForCircle(data);
			setFilterReload(true);
		} else {
			console.error(type, data);
			notify('Error', 'Invalid code type!', '#CC2500');
		}
	};

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<>
			<StyledSafeArea
				className='bg-offblack flex-1 h-screen'
				style={{ paddingTop: topInset }}
			>
				<KeyboardAwareScrollView bounces={false}>
					<ScrollView bounces={false}>
						<StyledView className='flex-1 flex flex-col items-center'>
							<StyledView className='flex items-center justify-center text-center w-screen h-[90px]'>
								<StyledText className='text-offwhite font-bold text-4xl'>
									Join New Circle
								</StyledText>
							</StyledView>
							<StyledView className='border border-[#FFFBFC66] rounded-xl'>
								<StyledView className='w-[300px] h-[300px] rounded-xl overflow-hidden'>
									<BarCodeScanner
										mirrorImage={true}
										fixOrientation={true}
										className='w-full h-full'
										ratio='1:1'
										onBarCodeScanned={
											scanned
												? undefined
												: handleBarCodeScanned
										}
									/>
								</StyledView>
							</StyledView>
							<StyledView className='w-[300px] mt-2 rounded-xl'>
								<StyledInput
									className='min-h-[40px] bg-[#ffffff11] rounded-[10px] pl-3 pr-[50px] py-3 text-offwhite text-[16px] border border-[#FFFBFC66]'
									placeholder={'Code:'}
									placeholderTextColor={'#FFFBFC66'}
									inputMode='numeric'
									maxLength={8}
									onChangeText={(text) => {
										setCode(text);
										if (text.length == 8) {
											Keyboard.dismiss();
											setSearching(true);
											searchForCircle(text);
										}
									}}
									ref={(input) => {
										this.searchCode = input;
									}}
								/>
							</StyledView>
						</StyledView>
					</ScrollView>
				</KeyboardAwareScrollView>
				<StyledView
					className='absolute flex flex-row w-screen px-[15px] justify-between'
					style={{ bottom: insets.bottom }}
				>
					<Button
						height={'h-[50px]'}
						width={'w-[50px]'}
						iconSize={30}
						icon='arrow-back-outline'
						href='/'
						press={() => {
							this.searchCode.clear();
						}}
					/>
					<Button
						height={'h-[50px]'}
						width={'w-[50px]'}
						iconSize={30}
						icon='search-outline'
						press={async () => {
							if (code.length < 8) {
								notify(
									'Error finding circle',
									'Please enter 8 digits',
									'#CC2500'
								);
								return;
							} else {
								setSearching(true);
								searchForCircle(code);
							}
							this.searchCode.clear();
						}}
					/>
				</StyledView>
			</StyledSafeArea>
			<Loading
				loading={searching}
				width={'w-[280px]'}
				height={'h-auto py-10'}
				circle
				text={'Searching for circle...'}
				allowEvents={searching ? 'auto' : 'none'}
				border
			/>
		</>
	);
}
