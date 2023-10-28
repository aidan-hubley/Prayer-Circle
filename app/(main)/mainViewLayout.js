import React, { useRef, useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { ExpandableButton } from '../../components/Buttons';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import FeedPage from './feed.js';
import ProfilePage from './profile.js';
import JournalPage from './journal.js';
import PagerView from 'react-native-pager-view';
import { Button } from '../../components/Buttons';

const StyledView = styled(View);

export default function Layout() {
	const profileRef = useRef();
	const journalRef = useRef();
	const pagerRef = useRef();
	const circleNameRef = useRef();
	let insets = useSafeAreaInsets();
	let topButtonInset = insets.top > 30 ? insets.top : insets.top + 10;
	let screenWidth = Dimensions.get('window').width;
	let circeNameWidth = screenWidth - 170;

	const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

	const timerHours = Math.floor(elapsedTime / 3600);
	const timerMinutes = Math.floor((elapsedTime % 3600) / 60);
	const timerSeconds = elapsedTime % 60;
	const screenTime = `${timerHours.toString().padStart(2, '0')}:${timerMinutes.toString().padStart(2, '0')}:${timerSeconds.toString().padStart(2, '0')}`;

	return (
		<ActionSheetProvider>
			<>
				<StyledView className='bg-offblack flex-1'>
					<PagerView
						ref={pagerRef}
						style={{ flex: 1 }}
						initialPage={1}
						onPageSelected={(e) => {
							let pos = e.nativeEvent.position;
							if (pos == 0) {
								journalRef.current.toggleButton('expand');
								profileRef.current.toggleButton('collapse');
								circleNameRef.current.toggleShown(false);
							} else if (pos == 1) {
								journalRef.current.toggleButton('collapse');
								profileRef.current.toggleButton('collapse');
								circleNameRef.current.toggleShown(true);
							} else if (pos == 2) {
								journalRef.current.toggleButton('collapse');
								profileRef.current.toggleButton('expand');
								circleNameRef.current.toggleShown(false);
							}
						}}
					>
						<JournalPage key='0' />
						<FeedPage key='1' />
						<ProfilePage key='2' />
					</PagerView>
				</StyledView>

				<StyledView
					style={{ top: topButtonInset, width: circeNameWidth }}
					className='absolute mx-[85px]'
				>
					<Button
						title={screenTime}
						textColor='text-[#5D5D5D]'
						bgColor='bg-transparent'
						height='h-[50]'
						width='w-full'
						href='/circleSettings'
						ref={circleNameRef}
					/>
				</StyledView>

				<StyledView
					style={{ top: topButtonInset }}
					className='absolute left-[20px]'
				>
					<ExpandableButton
						height={'h-[50px]'}
						iconSize={35}
						icon='journal-outline'
						expanded={false}
						expandedWidth={'70%'}
						collapsedWidth={50}
						title='Journal'
						ref={journalRef}
						press={() => {
							if (profileRef.current.pressed) {
								profileRef.current.toggleButton();
							}
							if (journalRef.current.pressed) {
								circleNameRef.current.toggleShown(true);
								pagerRef.current.setPage(1);
							} else {
								circleNameRef.current.toggleShown(false);
								pagerRef.current.setPage(0);
							}
						}}
					/>
				</StyledView>
				<StyledView
					style={{ top: topButtonInset }}
					className='absolute right-[20px]'
				>
					<ExpandableButton
						height={'h-[50px]'}
						iconSize={40}
						icon='person-circle-outline'
						expanded={false}
						expandedWidth={'70%'}
						collapsedWidth={50}
						title='Profile'
						ref={profileRef}
						press={() => {
							if (journalRef.current.pressed) {
								journalRef.current.toggleButton();
							}
							if (profileRef.current.pressed) {
								circleNameRef.current.toggleShown(true);
								pagerRef.current.setPage(1);
							} else {
								circleNameRef.current.toggleShown(false);
								pagerRef.current.setPage(2);
							}
						}}
					/>
				</StyledView>
			</>
		</ActionSheetProvider>
	);
}
