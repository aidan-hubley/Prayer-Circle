import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
/* import LazyImage from './lazy-image'; */

function getImgXtension(uri) {
	var basename = uri?.split(/[\\/]/).pop();
	return /[.]/.exec(basename) ? /[^.]+$/.exec(basename) : undefined;
}
async function findImageInCache(uri) {
	try {
		let info = await FileSystem.getInfoAsync(uri);
		return { ...info, err: false };
	} catch (error) {
		return {
			exists: false,
			err: true,
			msg: error
		};
	}
}
async function cacheImage(uri, cacheUri, callback) {
	try {
		const downloadImage = FileSystem.createDownloadResumable(
			uri,
			cacheUri,
			{},
			callback
		);
		const downloaded = await downloadImage.downloadAsync();
		return {
			cached: true,
			err: false,
			path: downloaded.uri
		};
	} catch (error) {
		return {
			cached: false,
			err: true,
			msg: error
		};
	}
}
const CachedImage = (props) => {
	const {
		source: { uri },
		cacheKey,
		style
	} = props;
	const isMounted = useRef(true);
	const [imgUri, setUri] = useState('');
	useEffect(() => {
		async function loadImg() {
			if (!uri) return alert(`Invalid URI:` + uri);
			let imgXt = getImgXtension(uri) || 'jpeg';
			if (!imgXt || !imgXt.length) {
				alert('Error Loading Image 1', `Couldn't load image!`);
				return;
			}
			const cacheFileUri = `${FileSystem.cacheDirectory}${cacheKey}.${imgXt}`;
			let imgXistsInCache = await findImageInCache(cacheFileUri);
			if (imgXistsInCache.exists) {
				setUri(cacheFileUri);
			} else {
				let cached = await cacheImage(uri, cacheFileUri, () => {});
				if (cached.cached) {
					setUri(cached.path);
				} else {
					alert('Error Loading Image 2', `Couldn't load image!`);
				}
			}
		}
		loadImg();
		return () => (isMounted.current = false);
	}, []);
	return (
		<>
			{imgUri ? (
				<Image source={{ uri: imgUri }} style={style} />
			) : (
				<View
					style={{
						...style,
						alignItems: 'center',
						justifyContent: 'center'
					}}
					backgroundColor={props.backgroundColor || null}
				>
					<ActivityIndicator size={33} />
				</View>
			)}
		</>
	);
};
export default CachedImage;
