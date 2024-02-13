import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Text, View, Platform, Animated, ScrollView, FlatList} from 'react-native';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Buttons';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomSheetModal, BottomSheetFlatList, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { handle, backdrop, SnapPoints } from '../../components/BottomSheetModalHelpers.js';
import { Terms } from '../../components/Terms';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledGradient = styled(LinearGradient);

export default function Page() {
	const [handles, setHandles] = useState('');
	const [snapPoints, setSnapPoints] = useState([]);
	const [modalContent, setModalContent] = useState(null);
	const bottomSheetModalRef = useRef(null);

	let insets = useSafeAreaInsets();

	// bottom sheet modal
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const handleModalPress = (
		modalContent,
		snapPoints,
		handleText,
		handleColor,
		extra = () => {}
	) => {
		extra();
		setModalContent(modalContent);
		setSnapPoints(snapPoints);
		setHandles(handle(handleText, handleColor));
		bottomSheetModalRef.current?.present();
	};

	const renderContent = () => {
		switch (modalContent) {
			case 'tos':
				return (
					<StyledView className='w-[90%] flex-1'>
						<BottomSheetFlatList
							data={[{ key: 'terms' }]}
							renderItem={({ item }) => <Terms />}
							keyExtractor={(item) => item.key}
							showsVerticalScrollIndicator={false}
						/>
					</StyledView>
				);
			default:
				return (
					<></>
				)			
		}
	};


	return (
		<BottomSheetModalProvider>
			<StyledView
				className='bg-offblack flex-1'
				style={{
					paddingTop: Platform.OS == 'android' ? insets.top : 0
				}}
			>
				<StyledGradient
					pointerEvents='none'
					start={{ x: 0, y: 0.1 }}
					end={{ x: 0, y: 1 }}
					style={{ height: 120 }}
					className='absolute w-screen'
					colors={['#121212ee', 'transparent']}
				/>
				<StyledView
					style={{
						top: Platform.OS == 'android' ? insets.top + 15 : 15
					}}
					className='absolute w-screen flex flex-row items-center justify-between px-[15px]'
				>
					<StyledText className='text-4xl font-bold text-offwhite'>
						Prayer Circle
					</StyledText>
					<Button
						icon='document-text'
						iconColor={'#FFFBFC'}
						iconSize={26}
						width={'w-[65px]'}
						height={'h-[35px]'}
						bgColor={'bg-transparent'}
						textColor={'text-offwhite'}
						borderColor={'border-offwhite'}
						btnStyles='border-2'
						press={() =>
							handleModalPress(
								'tos',
								['65%', '85%'],
								'Terms of Service',
								''
							)
						}
					></Button>
				</StyledView>

				<StyledView
					className='absolute flex flex-row w-screen px-[15px] justify-between'
					style={{ bottom: insets.bottom }}
				>
					<Button // Back to Feed Page
						height={'h-[50px]'}
						width={'w-[50px]'}
						iconSize={30}
						icon='arrow-back'
						href='/mainViewLayout'
					/>
					{/* <Button // Queue
						title='Queue: 4'
						height={'h-[50px]'}
						width={'w-[200px]'}
						press={handleQueuePress}
					/> */}
					<Button // to Share Page
						height={'h-[50px]'}
						width={'w-[50px]'}
						iconSize={30}
						icon='qr-code'
						href='shareCircle'
					/>
				</StyledView>

				<BottomSheetModal
					ref={bottomSheetModalRef}
					index={0}
					snapPoints={snapPoints}
					handleComponent={() => handles}
					backdropComponent={(backdropProps) => backdrop(backdropProps)}
					keyboardBehavior='extend'
				>
					<StyledView className='flex-1 bg-grey py-3 items-center text-offwhite'>
						{renderContent()}
					</StyledView>
				</BottomSheetModal>
			</StyledView>
		</BottomSheetModalProvider>
	);
}
