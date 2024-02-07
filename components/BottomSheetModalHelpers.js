import React, {
	forwardRef,
	useCallback,
	useMemo,
	useImperativeHandle
} from 'react';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

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

const handle = (title, color) => {
	return (
		<StyledView className='flex items-center justify-center w-screen bg-grey rounded-t-[10px] pt-3'>
			<StyledView
				className={`w-[30px] h-[4px] rounded-full ${
					color || 'bg-[#dddddd11]'
				} mb-3`}
			/>
			{title ? (
				<StyledText className='text-white font-[600] text-[24px] pb-2'>
					{title}
				</StyledText>
			) : (
				<></>
			)}
		</StyledView>
	);
};

const HandleChanges = () => {
	return useCallback((index) => {}, []);
};

const SnapPoints = (points) => {
	return useMemo(() => points, []);
};

export { backdrop, handle, HandleChanges, SnapPoints };
