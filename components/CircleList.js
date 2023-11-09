import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Image, Animated, Dimensions, FlatList, Pressable } from 'react-native';
import { styled } from 'nativewind';
import Modal from 'react-native-modal';
import { Button } from './Buttons';
import Ionicons from '@expo/vector-icons/Ionicons';

const StyledImage = styled(Image);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledModal = styled(Modal);
const AnimatedView = Animated.createAnimatedComponent(StyledView);
const StyledPressable = styled(Pressable);
const AnimatedPressable = Animated.createAnimatedComponent(StyledPressable);
const StyledIcon = styled(Ionicons);

export const CircleList = forwardRef((props, ref) => {

	const [isFilterModal, setFilterModal] = useState(false);
	const toggleFilterModal = () => {
		setFilterModal(!isFilterModal);
	};

	return (
		<>				
            <StyledModal
                className='w-[80%] self-center'
                isVisible={isFilterModal}
                onBackdropPress={toggleFilterModal}
            >
                <StyledView className='bg-offblack border-[2px] border-outline rounded-2xl h-[70%]'>
                    <StyledView className='flex-1 items-center h-[60%]'>
                        <StyledView className='top-[3%]'>
                            <StyledText className='text-3xl font-bold text-offwhite'>
                                Your circles
                            </StyledText>
                        </StyledView>
                        <StyledView className='top-[7%] h-[70%]'>
                            <FlatList
                                data={props.data}
                                numColumns={3}
                                renderItem={({ item }) => {
                                    return (
                                        <StyledView className='w-[100px] h-[130px] flex items-center justify-center'>
                                            <StyledView className='w-[90px] h-[35px]'>
                                                <StyledText className='text-center inline-block align-baseline text-offwhite'>
                                                    {item.title}
                                                </StyledText>
                                            </StyledView>
                                            <StyledView 
                                                style={{borderColor: item.color}}
                                                className='w-[80px] h-[80px] border-[6px] items-center justify-center rounded-full'
                                            >
                                                <StyledIcon
                                                    name={item.icon}
                                                    size={35}
                                                    color={item.iconColor}
                                                />
                                            </StyledView>
                                        </StyledView>
                                    );
                                }}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                            />
                        </StyledView>
                        <Button
                            title='close'
                            textColor={'text-offwhite'}
                            bgColor={'bg-offblack'}
                            borderColor={'border-outline'}
                            btnStyles={'absolute bottom-[3%]'}
                            width='w-[70%]'
                            press={toggleFilterModal}
                        />
                    </StyledView>
                </StyledView>
            </StyledModal>
		</>
	);
});