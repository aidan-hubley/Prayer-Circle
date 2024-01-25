import React, {
	useState,
	forwardRef,
	useImperativeHandle,
	useRef
} from 'react';
import {
	Text,
	View,
	Image,
	Pressable,
	Animated,
	Dimensions
} from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MemberPermissionSelector } from './MemberPermissionSelector';

const StyledText = styled(Text);
const StyledView = styled(View);
const StyledImage = styled(Image);
const StyledPressable = styled(Pressable);
const StyledIcon = styled(Ionicons);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));

function Member({ img, name, username, role, last }) {
	const [openRolePicker, setOpenRolePicker] = useState(null);
	const [newrole, setNewRole] = useState(null);

	const openRoleSelector = () => {
		setOpenRolePicker(true);
	};

	const closeRoleSelector = () => {	
		setOpenRolePicker(false);
	};

	const toggleRole = (selectedRole) => {
		if (role === selectedRole) {
			setNewRole(selectedRole);
			closeRoleSelector();
			console.log("same role");
			return;
		} else {
			setNewRole(selectedRole);
			console.log("new role " + selectedRole);
			closeRoleSelector();
			return;
		}
	}

	const selectorVal = useRef(new Animated.Value(0)).current;
	const selectorWidthInter = selectorVal.interpolate({
		inputRange: [0, 1],
	    outputRange: [40, 245],
	});

	useEffect(() => {
		let animation;
		animation = Animated.timing(selectorVal, {
			toValue: (openRolePicker ? 1 : 0),
			duration: 500,
			useNativeDriver: false,
		});

		animation.start();
	}, [openRolePicker, selectorVal]);

	const roleSelectorStyle = {
		width: selectorWidthInter,
		opacity: openRolePicker ? 1 : 0,
	};

	const roleIconStyle = {
		opacity: openRolePicker ? 0 : 1,
	};

function Member({ img, name, username, role, press, last }) {
	permissionRef = useRef(null);
	return (
		<StyledView
			style={{ width: Dimensions.get('window').width - 30 }}
			className={`h-[50px] flex flex-row justify-between items-center bg-grey pl-[10px] py-[10px] border-x border-[#6666660d]
			${last ? 'rounded-b-[20px] h-[60px]' : ''}`}
		>
			<StyledView className='flex flex-row'>
				<StyledImage
					className='rounded-xl'
					style={{ width: 40, height: 40 }}
					source={{ uri: img }}
				/>
				<StyledView className='pl-2 bottom-[3px]'>
					<StyledText className={`font-[600] text-offwhite text-[20px]`}>
						{name}
					</StyledText>
					<StyledText className={`text-offwhite text-[14px]`}>
						{username}
					</StyledText>
				</StyledView>
			</StyledView>
			<StyledView className='absolute right-2'>
				<MemberPermissionSelector role={role} ref={permissionRef} />
			</StyledView>
		</StyledView>
	);
}

export { Member };