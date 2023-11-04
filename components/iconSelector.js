import React, {
    useEffect,
    useState,
    useRef,
    forwardRef,
    useImperativeHandle
} from 'react';
import {
    View,
    Text,
    ScrollView,
    Animated,
    Pressable,
    TouchableOpacity
} from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledIcon = styled(Ionicons);
const StyledScrollView = styled(ScrollView);
const StyledAnimView = styled(Animated.View);
const StyledPressable = styled(Animated.createAnimatedComponent(Pressable));
const StyledOpacity = styled(TouchableOpacity);

const IconSelector = forwardRef(({ close }, ref) => {
    const icons = [
        'airplane',
        'american-football',
        'aperture',
        // 'globe',
        'attach',
        // 'bandage',
        'barbell',
        'baseball',
        'basketball',
        'bicycle',
        'boat',
        'body',
        'bonfire',
        'book',
        'briefcase',
        'bug',
        'bus',
        'business',
        'cafe',
        'camera',
        'car',
        // 'cart',
        'chatbox-ellipses',
        'chatbubble-ellipses',
        'chatbubbles',
        'cloud',
        'cloudy-night',
        'code-slash',
        'cog',
        'color-palette',
        'compass',
        'construct',
        'contrast',
        'cube',
        'desktop',
        'disc',
        'ear',
        'earth',
        'eye',
        'fast-food',
        'female',
        'finger-print',
        'fitness',
        'flag',
        'flame',
        'flash',
        'flask',
        'flower',
        'football',
        'game-controller',
        'glasses',
        'globe',
        'golf',
        'grid',
        'hammer',
        'hand-left',
        'hand-right',
        'happy',
        'headset',
        'heart',
        'home',
        'ice-cream',
        'images',
        'infinite',
        'key',
        'language',
        'laptop',
        'leaf',
        'library',
        'location',
        'mail',
        'male',
        'man',
        'map',
        'medical',
        'medkit',
        'mic',
        'moon',
        'musical-note',
        'musical-notes',
        'navigate',
        'newspaper',
        'nutrition',
        'options',
        'paper-plane',
        'partly-sunny',
        'paw',
        'people',
        'person',
        'pizza',
        'planet',
        'play',
        'power',
        'pulse',
        'radio',
        'radio-button-off',
        'radio-button-on',
        'rainy',
        'reader',
        'reload',
        'restaurant',
        'ribbon',
        'rocket',
        'rose',
        'school',
        'settings',
        'shapes',
        'shield',
        'snow',
        'square',
        'star',
        'subway',
        'sunny',
        'sync',
        'tennisball',
        'thunderstorm',
        'today',
        'trail-sign',
        'triangle',
        'trophy',
        'tv',
        'umbrella',
        'videocam',
        'woman'
    ];
    const [icon, setIcon] = useState('');
    const [opened, setOpened] = useState(false);
    const opacity = useRef(new Animated.Value(0)).current;
    const opacityInterpolation = opacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    });
    const bgOpacityInterpolation = opacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5]
    });

    const toggleSelector = (direction) => {
        if (direction) setOpened(direction);
        else setOpened(!opened);
        Animated.timing(opacity, {
            toValue: opened ? 0 : 1,
            duration: 400,
            useNativeDriver: false
        }).start();
    };

    useImperativeHandle(ref, () => ({
        toggleSelector,
        icon
    }));

    function iconGallery(icons) {
        let items = [];
        let numRows = Math.ceil(icons.length / 4) * 4;
        for (let i = 0; i < numRows; i++) {
            if (icons[i]) {
                items.push(
                    <StyledOpacity
                        key={`icon${i}`}
                        onPress={() => {
                            setIcon(icons[i]);
                            toggleSelector(false);
                            close();
                        }}
                        className="w-[60px] h-[60px] items-center justify-center mb-1"
                    >
                        <StyledIcon
                            key={i}
                            name={icons[i]}
                            size={40}
                            color={'#ffffff'}
                        />
                    </StyledOpacity>
                );
            } else {
                items.push(
                    <StyledView
                        key={`icon${i}`}
                        className="w-[60px] h-[60px] mb-1"
                    ></StyledView>
                );
            }
        }
        return items;
    }

    return (
        <>
            <StyledPressable
                style={{ opacity: bgOpacityInterpolation }}
                pointerEvents={opened ? 'auto' : 'none'}
                onPress={() => {
                    toggleSelector(false);
                    close();
                }}
                className="absolute top-0 left-0 bg-offblack w-screen h-screen"
            />
            <StyledAnimView
                style={{ opacity: opacityInterpolation }}
                pointerEvents={opened ? 'auto' : 'none'}
                className="absolute -translate-x-[150px] left-1/2 top-[60%] -translate-y-[280px] w-[80%] p-[15px] max-w-[300px] h-[85%] max-h-[500px] bg-offblack border border-[#3D3D3D] rounded-[20px]"
            >
                <StyledText className="text-offwhite font-bold text-3xl text-center mb-3">
                    Select an Icon
                </StyledText>
                <StyledScrollView>
                    <StyledView className="flex justify-around flex-row flex-wrap">
                        {iconGallery(icons)}
                    </StyledView>
                </StyledScrollView>
            </StyledAnimView>
        </>
    );
});

export { IconSelector };
