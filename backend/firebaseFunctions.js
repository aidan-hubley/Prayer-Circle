import { database, auth, storage } from './config.js';
import { ref, child, get, push, set } from 'firebase/database';
import {
	ref as sRef,
	getDownloadURL,
	uploadBytesResumable
} from 'firebase/storage';

async function getUID() {
	return auth?.currentUser?.uid;
}

export async function readData(path) {
	return await get(child(ref(database), path))
		.then((snapshot) => {
			if (snapshot.exists()) {
				return snapshot.val();
			}
		})
		.catch((error) => {
			console.error(error);
		});
}

export async function writeData(path, data, overwrite = false) {
	if (overwrite) {
		set(ref(database, path), data)
			.then(() => {
				console.log('data written successfully');
			})
			.catch((error) => {
				console.error(error);
			});
	} else {
		push(ref(database, path), data)
			.then(() => {
				console.log('data written successfully');
			})
			.catch((error) => {
				console.error(error);
			});
	}
}

export async function deleteData(path) {
	set(ref(database, path), null)
		.then(() => {
			console.log('data deleted successfully');
		})
		.catch((error) => {
			console.error(error);
		});
}

export async function createCircle(data) {
	let uid = await getUID();
	let circleId = generateId();
	let circleCode = '';
	let divisor = 10;
	for (let i = 0; i < circleId.length / divisor; i++) {
		let section = circleId.substring(i * divisor, i * divisor + divisor);
		let sectionCode = 0;
		for (char of section) {
			sectionCode += char.charCodeAt(0);
		}
		circleCode += sectionCode.toString() + '.';
	}
	data.members[`${uid}`] = true;
	data.admin[`${uid}`] = true;
	data.owner = uid;
	data.codes = { admin: 0, public: 0 };

	let circles = Object.keys((await readData(`prayer_circle/circles`)) || {});
	let allCodes = [];
	for (let i = 0; i < circles.length; i++) {
		let circle = circles[i];
		let circleData =
			(await readData(`prayer_circle/circles/${circle}/codes`)) || {};
		allCodes.push(circleData.admin);
		allCodes.push(circleData.public);
	}

	while (data.codes.admin === 0 || data.codes.public === 0) {
		if (data.codes.admin === 0) {
			let tempAdminCode = Math.floor(Math.random() * 90000000 + 10000000);
			if (!allCodes.includes(tempAdminCode)) {
				data.codes.admin = tempAdminCode;
				allCodes.push(tempAdminCode);
			}
		}
		if (data.codes.public === 0) {
			let tempPublicCode = Math.floor(
				Math.random() * 90000000 + 10000000
			);
			if (!allCodes.includes(tempPublicCode)) {
				data.codes.public = tempPublicCode;
			}
		}
	}

	data.members[`${uid}`] = true;
	data.admin[`${uid}`] = true;
	data.owner = uid;
	let circlePermissions = {
		admin: true,
		read: true,
		write: true,
		owner: true
	};

	writeData(`prayer_circle/circles/${circleId}`, data, true);
	writeData(
		`prayer_circle/users/${uid}/private/circles/${circleId}/permissions`,
		circlePermissions,
		true
	);
}

export async function addUserToCircle(circle, otherUserUID) {
	let uid = await getUID();
	if (arguments.length >= 2) {
		uid = otherUserUID;
	}
	writeData(`prayer_circle/circles/${circle}/members/${uid}`, true, true);
	let circlePermissions = {
		admin: false,
		read: true,
		write: true,
		owner: false
	};
	writeData(
		`prayer_circle/users/${uid}/private/circles/${circle}/permissions`,
		circlePermissions,
		true
	);
}

export async function addUserToQueue(circle) {
	let uid = await getUID();
	writeData(
		`prayer_circle/circles/${circle}/awaitingEntry/${uid}`,
		true,
		true
	);
	writeData();
}

export function generateId() {
	return push(ref(database)).key;
}

export async function getCircles() {
	let uid = await getUID();
	let circles = Object.keys(
		(await readData(`prayer_circle/users/${uid}/private/circles`)) || {}
	);
	return circles;
}

export async function getFilterCircles() {
	let circles = await getCircles();
	let circlesData = [{ id: 'addCircles' }, { id: 'Gridview' }];

	for (const circle of circles) {
		let circleData =
			(await readData(`prayer_circle/circles/${circle}`)) || {};
		let circleStruct = {
			id: circle,
			iconColor: circleData.iconColor,
			title: circleData.title,
			color: circleData.color,
			icon: circleData.icon,
			description: circleData.description
		};
		circlesData.push(circleStruct);
	}
	return circlesData;
}

export async function getPosts(circleId) {
	let uid = await getUID();
	let circles = [];
	let posts = [];

	if (!circleId || circleId == 'unfiltered') {
		circles = Object.keys(
			(await readData(`prayer_circle/users/${uid}/private/circles`)) || {}
		);
	} else {
		circles.push(circleId);
	}
	if (circles.length == 0) return posts;
	for (circle of circles) {
		await readData(`prayer_circle/circles/${circle}/posts`).then(
			(circlePosts) => {
				circlePosts = circlePosts ? Object.entries(circlePosts) : [];
				posts.push(...circlePosts);
			}
		);
	}

	posts.sort((a, b) => {
		return b[1] - a[1];
	});

	let filteredPosts = [];
	for (let post of posts) {
		if (filteredPosts.indexOf(post[0]) === -1) {
			filteredPosts.push(post[0]);
		}
	}

	return filteredPosts;
}

export async function getProfilePosts() {
	let uid = await getUID();
	let posts = Object.entries(
		(await readData(`prayer_circle/users/${uid}/private/posts`)) || {}
	);

	posts.sort((a, b) => {
		return b[1] - a[1];
	});

	return posts;
}

export async function getHiddenPosts() {
	const uid = await getUID();
	let hiddenPosts = [];
	let hiddenPostsIds = await readData(
		`prayer_circle/users/${uid}/private/hidden_posts`
	);
	if (hiddenPostsIds) {
		// get the posts from their ids, with readData
		hiddenPostsIds = Object.keys(hiddenPostsIds);
		for (let i = 0; i < hiddenPostsIds.length; i++) {
			let post = await readData(
				`prayer_circle/posts/${hiddenPostsIds[i]}`
			);
			hiddenPosts.push([hiddenPostsIds[i], post]);
		}
	}
	return hiddenPosts;
}

export async function uploadImage(path, uri) {
	const img = await fetch(uri);
	const blob = await img.blob();

	const storageRef = sRef(storage, path + '/profile');
	await uploadBytesResumable(storageRef, blob);

	const downloadURL = await getDownloadURL(storageRef);
	return downloadURL;
}

export async function checkIfUserIsInCircle(circle) {
	let uid = await getUID();
	let inCircle = false;
	let withinPerimeter = Object.keys(
		(await readData(`prayer_circle/users/${uid}/private/circles`)) || {}
	);
	for (let i = 0; i < withinPerimeter.length; i++) {
		if (`${circle}` == withinPerimeter[i]) {
			inCircle = true;
			break;
		}
	}
	withinPerimeter = Object.keys(
		(await readData(
			`prayer_circle/users/${uid}/private/pending_circles`
		)) || {}
	);
	for (let i = 0; i < withinPerimeter.length; i++) {
		if (`${circle}` == withinPerimeter[i]) {
			inCircle = true;
			break;
		}
	}
	return inCircle;
}
