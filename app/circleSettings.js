import React, { useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Animated } from 'react-native';
import { styled } from 'nativewind';
import { Button } from '../components/Buttons';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));

export default function Page() {

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const togglePosition = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(togglePosition, {
      toValue: isEnabled ? 45 : 5,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isEnabled]);

  return (
    <StyledSafeArea className='bg-offblack border' style={{ flex: 1 }}>
      <StyledView className='flex-1 items-center'>
        <Button
          btnStyles='sticky absolute left-5 top-10 bg-grey rotate-180'
          height={'h-[60px]'}
          width={'w-[60px]'}
          iconSize={40}
          icon='log-out'
          iconColor='yellow'
        />
        <Button
          btnStyles='sticky absolute right-5 top-10 bg-grey'
          height={'h-[60px]'}
          width={'w-[60px]'}
          iconSize={40}
          icon='trash'
          iconColor='red'
        />
        <StyledText className='absolute top-10 text-3xl text-offwhite bg-grey text-center h-[60px] px-[35px] py-[12px] rounded-full'>
          Settings
        </StyledText>

        <StyledView className='top-[130px] w-[85%] gap-y-8 flex'>
          <StyledView className="bg-grey h-[60px] py-[9px] px-[50px] rounded-xl items-center flex flex-row">
            <Button
              btnStyles='inline bg-grey border-2 border-purple mr-3'
              height={'h-[45px]'}
              width={'w-[45px]'}
              iconSize={30}
              icon='musical-notes'
              iconColor='white'
            />
            <StyledText className='inline font-bold text-3xl text-offwhite'>
              Circle Name
            </StyledText>
          </StyledView>
          <StyledView className="bg-grey h-[60px] py-[12px] rounded-xl pl-5 flex flex-row">
            <StyledText className='font-bold text-3xl text-offwhite'>
              Notifications
            </StyledText>
            <TouchableOpacity onPress={toggleSwitch}>
              <StyledView
                className='left-10 pt-9 w-[80px] h-[30px] rounded-full'
                style={{
                  backgroundColor: isEnabled ? "#00A55E" : '#F9A826',
                }}
              >
                <StyledAnimatedView
					className='absolute top-1 w-[28px] h-[28px] rounded-full bg-white	'
					style={{
						left: togglePosition,
					}}
                />
              </StyledView>
            </TouchableOpacity>
          </StyledView>
          <StyledView className="bg-grey h-[60px] py-[12px] rounded-xl pl-5 flex flex-row">
            <StyledText className='font-bold text-3xl text-offwhite'>
              Members
            </StyledText>
          </StyledView>
        </StyledView>

        <Button
          btnStyles='sticky absolute right-5 bottom-10'
          height={'h-[60px]'}
          width={'w-[60px]'}
          iconSize={40}
          icon='qr-code'
          href='shareCircle'
        />
        <Button
          btnStyles='sticky absolute left-5 bottom-10'
          height={'h-[60px]'}
          width={'w-[60px]'}
          iconSize={40}
          icon='arrow-back'
          href='/feed'
        />
      </StyledView>
    </StyledSafeArea>
  );
}