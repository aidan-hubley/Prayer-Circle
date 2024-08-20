import React from 'react';

import { default as ExpoCachedImage } from 'expo-cached-image';
import { FadeIn } from 'react-native-reanimated';
import { createAnimatedFunctionComponent } from '../backend/functions';

const AnimatedCachedImage = createAnimatedFunctionComponent(ExpoCachedImage);

const CachedImage = (props) => {
	return (
		<AnimatedCachedImage
			entering={FadeIn.duration(500).delay(100)}
			style={props.style}
			cacheKey={props.cacheKey}
			source={props.source}
		/>
	);
};

export default CachedImage;
