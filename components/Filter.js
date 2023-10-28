// import React, { useState, useRef } from 'react';
import * as React from 'react';
import {
	Text,
	View,
	Image,
	Pressable,
	TouchableOpacity,
	Animated,
    Dimensions
} from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { timeSince } from '../backend/functions';
import { writeData } from '../backend/firebaseFunctions';
import { Worklet } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

const StyledImage = styled(Image);
const StyledIcon = styled(Ionicons);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledOpacity = styled(TouchableOpacity);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));
const AnimatedImage = Animated.createAnimatedComponent(StyledImage);

console.log("filter component loaded");

const FilterCarousel = () => {
//   const onSnapToItem = (index) => {
//     // Schedule a function to be executed on the UI thread as soon as possible.
//     console.log('index:', index);
//     Worklet.runOnUIImmediately(() => {
//       console.log('current index:', index);
//     });
//   };

  return (
    // <Worklet>
      <Carousel
        loop
        width={'100px'}
        height={'100px'}
        autoPlay={true}
        data={[...new Array(6).keys()]}
        scrollAnimationDuration={1000}
        // onSnapToItem={onSnapToItem}
        renderItem={({ index }) => (
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              justifyContent: 'center',
            }}
          >
            <Text style={{ textAlign: 'center', fontSize: 30 }}>
              {index}Hi
            </Text>
          </View>
        )}
      />
    // </Worklet>

  );
};

export { FilterCarousel };