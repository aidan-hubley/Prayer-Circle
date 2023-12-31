import { database, auth, router } from './config.js';
import { ref, child, get, push, set } from 'firebase/database';
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function getUIDFromStorage() {
	return await AsyncStorage.getItem('user');
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
	const UID = await getUIDFromStorage();
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
	data.members[`${UID}`] = true;
	data.admin[`${UID}`] = true;
	data.owner = UID;
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

	data.members[`${UID}`] = true;
	data.admin[`${UID}`] = true;
	data.owner = UID;
	let circlePermissions = {
		admin: true,
		read: true,
		write: true,
		owner: true
	};

	writeData(`prayer_circle/circles/${circleId}`, data, true);
	writeData(
		`prayer_circle/users/${UID}/private/circles/${circleId}/permissions`,
		circlePermissions,
		true
	);
}

export async function registerUser(username, email, password, data) {
	await createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed in
			const user = userCredential.user;
			writeData(`prayer_circle/users/${user.uid}`, data, true);
			writeData(`usernames/${username}`, user.uid, true);
			loginUser(email, password);
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(errorCode, errorMessage);
		});
}

export async function loginUser(email, password) {
	await signInWithEmailAndPassword(auth, email, password)
		.then(async (userCredential) => {
			// Signed in
			const user = userCredential.user;
			await AsyncStorage.setItem('user', user.uid);

			let name = await readData(`prayer_circle/users/${user.uid}`);
			name = name.public.fname + ' ' + name.public.lname;
			await AsyncStorage.setItem('name', name);

			await AsyncStorage.setItem('email', user.email);

			router.replace('/mainViewLayout');
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(errorCode, errorMessage);
			alert('Incorrect email or password');
		});
}

export async function checkUsername(username) {
	let usernames = (await readData(`usernames`)) || {};
	let taken = false;

	usernames = Object.keys(usernames);
	usernames.forEach((uName) => {
		if (!taken && uName.toLowerCase() == username.toLowerCase()) {
			console.log('username taken', username);
			taken = true;
		}
	});
	return taken;
}

export function generateId() {
	return push(ref(database)).key;
}

export async function userLoggedIn(onLogIn, onLogOut) {
	await onAuthStateChanged(auth, (user) => {
		if (user) {
			if (onLogIn) onLogIn();
		} else {
			if (onLogOut) onLogOut();
		}
	});
}

export async function getCircles() {
	const UID = await getUIDFromStorage();
	let circles = Object.keys(
		(await readData(`prayer_circle/users/${UID}/private/circles`)) || {}
	);
	return circles;
}

export async function getFilterCircles() {
	let circles = await getCircles();
	let circlesData = [{ id: 'addCircles' }, { id: 'Gridview' }];

	for (let i = 0; i < circles.length; i++) {
		let circle = circles[i];
		let circleData =
			(await readData(`prayer_circle/circles/${circle}`)) || {};
		let circleStruct = {
			id: circle,
			iconColor: circleData.iconColor,
			title: circleData.title,
			color: circleData.color,
			icon: circleData.icon
		};
		circlesData.push(circleStruct);
	}
	return circlesData;
}

export async function getPosts(circleId) {
	const UID = await getUIDFromStorage();
	let circles = [];
	let posts = [];

	if (!circleId || circleId == 'unfiltered') {
		circles = Object.keys(
			(await readData(`prayer_circle/users/${UID}/private/circles`)) || {}
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
	return posts;
}
