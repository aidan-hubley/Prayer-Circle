import {
	useRootNavigation,
	useSegments,
	SplashScreen,
	useRouter
} from 'expo-router';
import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useMemo
} from 'react';
import { auth } from '../../backend/config';
import { writeData, readData } from '../../backend/firebaseFunctions';
import {
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export function Provider(props) {
	const [user, setAuth] = useState(null);
	const [authInitialized, setAuthInitialized] = useState(false);

	const useProtectedRoute = (user) => {
		const segments = useSegments();
		const router = useRouter();

		const [isNavigationReady, setNavigationReady] = useState(false);
		const rootNavigation = useRootNavigation();

		useEffect(() => {
			const unsubscribe = rootNavigation?.addListener(
				'state',
				(event) => {
					setNavigationReady(true);
				}
			);
			return function cleanup() {
				if (unsubscribe) {
					unsubscribe();
				}
			};
		}, [rootNavigation]);

		useEffect(() => {
			if (!isNavigationReady) return;

			const inAuthGroup = segments[0] === '(auth)';
			console.log('segments', segments);
			console.log('user', user, 'authGroup', inAuthGroup);
			if (!user && !inAuthGroup) {
				console.log('not logged in and send to auth');
				setTimeout(() => {
					SplashScreen.hideAsync();
				}, 500);
				router.replace('/login');
			} else if (user && inAuthGroup) {
				console.log('log in and send to main');
				SplashScreen.hideAsync();
				router.push(
					'/'
				); /* TODO: fix this to replace the current screen */
			} else {
				console.log('else');
				SplashScreen.hideAsync();
			}
		}, [user, segments, authInitialized, isNavigationReady]);
	};
	useEffect(() => {
		onAuthStateChanged(auth, (token) => {
			console.log('token', token);
			if (token) {
				setAuth(true);
			} else {
				setAuth(false);
			}
			setAuthInitialized(true);
		});
	}, []);

	const logout = async () => {
		await AsyncStorage.multiRemove([
			'user',
			'name',
			'email',
			'profile_img'
		]);
		await signOut(auth);
		setAuth(null);
	};

	const login = async (email, password) => {
		await signInWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				// Signed in
				const user = userCredential.user;
				let userData = await readData(
					`prayer_circle/users/${user.uid}`
				);

				await AsyncStorage.multiSet([
					['user', user.uid],
					[
						'name',
						`${userData.public.fname} ${userData.public.lname}`
					],
					['email', user.email],
					['profile_img', userData.public.profile_img]
				]);
				setAuth(true);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
				alert('Incorrect email or password');
			});
	};

	const registerUser = async (username, email, password, data) => {
		await createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				writeData(`prayer_circle/users/${user.uid}`, data, true);
				writeData(`usernames/${username}`, user.uid, true);
				login(email, password);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
			});
	};

	useProtectedRoute(user);

	const authContextValue = useMemo(
		() => ({
			signIn: login,
			signOut: logout,
			register: registerUser,
			user,
			authInitialized
		}),
		[login, logout, registerUser, user, authInitialized]
	);

	return (
		<AuthContext.Provider value={authContextValue}>
			{props.children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const authContext = useContext(AuthContext);

	if (!authContext) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return authContext;
};
