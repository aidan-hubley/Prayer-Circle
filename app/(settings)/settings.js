import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Animated,
    Alert,
    TextInput
} from 'react-native';
import {
    BottomSheetModal,
    BottomSheetBackdrop
} from '@gorhom/bottom-sheet';
import { styled } from 'nativewind';
import { signOut } from 'firebase/auth';
import { Button } from '../../components/Buttons';
import { auth } from '../../backend/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { sendPasswordResetEmail } from 'firebase/auth';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));
const StyledSafeArea = styled(SafeAreaView);
const StyledInput = styled(TextInput);

export default function Page() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const togglePosition = useRef(new Animated.Value(1)).current;
    const insets = useSafeAreaInsets();
    const bottomSheetModalRef = useRef(null);

    const handlePasswordReset = async () => {
        const user = auth.currentUser;
        if (user && user.email) {
            try {
                await sendPasswordResetEmail(auth, user.email);
                Alert.alert(
                    "Check your email",
                    "A link to reset your password has been sent to your email address.",
                    [{ text: "OK", onPress: () => bottomSheetModalRef.current?.dismiss() }]
                );
            } catch (error) {
                Alert.alert("Error", error.message);
            }
        } else {
            Alert.alert("Error", "No user is currently signed in.");
        }
    };

    const snapPoints = useMemo(() => ['85%'], []);
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index) => {}, []);

    const backdrop = (backdropProps) => {
        return (
            <BottomSheetBackdrop
                {...backdropProps}
                opacity={0.5}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                enableTouchThrough={true}
            />
        );
    };

    React.useEffect(() => {
        Animated.timing(togglePosition, {
            toValue: isEnabled ? 45 : 5,
            duration: 200,
            useNativeDriver: false
        }).start();
    }, [isEnabled]);

    return (
        <StyledSafeArea className='bg-offblack border' style={{ flex: 1 }}>
            <StyledView className='flex-1 items-center mt-45 pt-10'>
                <StyledText className='text-3xl text-offwhite text-center tracking-widest leading-10'>
                    Settings
                </StyledText>
                {/* ... rest of the UI elements ... */}
                <Button
                    title='Change Password'
                    btnStyles='border-2 border-yellow mt-5'
                    bgColor='offblack'
                    textStyles='text-yellow'
                    width='w-[70%]'
                    press={handlePresentModalPress}
                />
                <Button
                    title='Sign Out'
                    width='w-[70%]'
                    btnStyles='mt-5'
                    press={() => {
                        signOut(auth);
                        AsyncStorage.removeItem('user');
                        AsyncStorage.removeItem('name');
                        // Navigate to login screen or reset navigation state
                    }}
                />
            </StyledView>

            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                backdropComponent={backdrop}
                enableDismissOnClose={true}
            >
                <StyledView className='flex-1 bg-grey p-4'>
                    <StyledText className='text-3xl text-offwhite text-center tracking-widest leading-10'>
                        Change Password
                    </StyledText>
                    {/* ... Input fields and buttons for password reset ... */}
                </StyledView>
            </BottomSheetModal>
        </StyledSafeArea>
    );
}
