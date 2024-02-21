import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { forwardRef, useEffect, useState } from 'react';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { readData } from '../backend/firebaseFunctions';

const StyledSafeArea = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const Terms = forwardRef(() => {
  const [lastUpdated, setLastUpdated] = useState('');
  const [intro, setIntro] = useState('');
  const [tableOfContents, setTableOfContents] = useState([]);
  const [tos, setTOS] = useState([]);

  useEffect(() => {
    const setUpTOS = async () => {
        const date = await readData(`prayer_circle/TOS/lastUpdated`);
        setLastUpdated(date);

        const intro = await readData(`prayer_circle/TOS/intro`);
        setIntro(intro);

        const table = await readData(`prayer_circle/TOS/tableOfContents`);
        setTableOfContents(table);
    
        const tos = [];
        for (let i = 1; i <= 26; i++) {
            const term = await readData(`prayer_circle/TOS/${i}`);
            tos.push(term);
        }
        setTOS(tos);
    };

    setUpTOS();
  }, []);

  return (
    <StyledSafeArea className='bg-offblack border border-offwhite rounded-[20px]'>
      <StyledView className='flex-1 items-center'>
        <StyledText className='text-xl text-offwhite'>
          TERMS AND CONDITIONS
        </StyledText>
        <StyledText className='text-offwhite'>
          Last updated: {lastUpdated}
        </StyledText>
        <ScrollView className='top-[10px] bottom-[10px] w-[90%] text-offwhite pt-[10px] pb-[20px]'>
          <StyledText className='text-offwhite py-2'>
            {intro}
          </StyledText>

          {tableOfContents.map((term, index) => {
            return (
              <StyledTouchableOpacity key={index}>
                <StyledText className='text-offwhite'>
                  {index}. {term}
                </StyledText>
              </StyledTouchableOpacity>
            );						
          })}

          {tos.map((term, index) => {
            return (
              <View key={index}>
                <StyledText className='text-xl text-offwhite pt-[10px]' >
                  {index + 1}. {tableOfContents[index + 1]}
                </StyledText>
                <StyledText className='text-offwhite'>
                  {term}
                </StyledText>
              </View>
            );						
          })}
        </ScrollView>
      </StyledView>
    </StyledSafeArea>
  );
});

export { Terms };