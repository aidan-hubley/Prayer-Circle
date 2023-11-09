import React, { useState, useEffect } from 'react';
import {
	SafeAreaView,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Image
} from 'react-native';
import { styled } from 'nativewind';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Buttons';
import { BarCodeScanner } from 'expo-barcode-scanner';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);

export default function Page() {
	let insets = useSafeAreaInsets();
	let topInset = insets.top > 30 ? insets.top : insets.top + 10;

	const [code, setCode] = useState('');
	const [hasPermission, setHasPermission] = useState(null);
	const [scanned, setScanned] = useState(false);

	useEffect(() => {
		const getBarCodeScannerPermissions = async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === 'granted');
		};

		getBarCodeScannerPermissions();
	}, []);

	const handleBarCodeScanned = ({ type, data }) => {
		setScanned(true);
		if (type == 'org.iso.QRCode') {
			alert(
				`Bar code with type ${type} and data ${data} has been scanned!`
			);
		} else {
			alert('Invalid code type!');
		}
	};

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<StyledSafeArea
			className='bg-offblack flex-1 h-screen'
			style={{ paddingTop: topInset }}
		>
			<KeyboardAwareScrollView bounces={false}>
				<StyledView className='flex-1 items-center h-screen'>
					<StyledView className='flex items-center justify-center text-center w-screen h-[90px]'>
						<StyledText className='text-offwhite font-bold text-4xl'>
							Join New Circle
						</StyledText>
					</StyledView>

					<StyledView className='absolute top-[15%] border-[10px] border-offwhite rounded-xl'>
						<StyledView className='w-[300px] h-[300px]'>
							<BarCodeScanner
								mirrorImage={true}
								fixOrientation={true}
								className='w-full h-full'
								ratio='1:1'
								onBarCodeScanned={
									scanned ? undefined : handleBarCodeScanned
								}
							/>
						</StyledView>
					</StyledView>
					<StyledView className='absolute w-[70%] bottom-[30%] border-[10px] border-offwhite mt-20 rounded-xl'>
						<StyledInput
							className='bg-offblack px-[10px] font-bold text-2xl flex-1 h-[42px] text-offwhite rounded-lg py-[5px] mr-1'
							placeholder={'Code:'}
							placeholderTextColor={'#FFFBFC'}
							inputMode='numeric'
							maxLength={8}
							onChangeText={(text) => {
								setCode(text);
							}}
							ref={(input) => {
								this.searchCode = input;
							}}
						/>
					</StyledView>				
				</StyledView>
				<StyledView
					className='absolute flex flex-row w-screen px-[15px] justify-between'
					style={{ bottom: insets.bottom }}
				>
					<Button
						height={'h-[50px]'}
						width={'w-[50px]'}
						iconSize={30}
						icon='arrow-back-outline'
						href='/mainViewLayout'
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
								alert('Please enter 8 digits');
								return;
							} else {
								alert(code);
							}
							this.searchCode.clear();
						}}
					/>
				</StyledView>
			</KeyboardAwareScrollView>
		</StyledSafeArea>
	);
}