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
	onAuthStateChanged,
	sendEmailVerification,
	updateProfile
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '../global';

const AuthContext = createContext(null);

export function Provider(props) {
	const [user, setAuth] = useState(null);
	const [authInitialized, setAuthInitialized] = useState(false);
	const [setUid, setName, setPfp, setEmail] = useStore((state) => [
		state.setUid,
		state.setName,
		state.setPfp,
		state.setEmail
	]);

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
			if (!user && !inAuthGroup) {
				setTimeout(() => {
					SplashScreen.hideAsync();
				}, 500);
				router.replace('/login');
			} else if (user && inAuthGroup) {
				SplashScreen.hideAsync();
				router.replace(
					'/'
				); /* TODO: fix this to replace the current screen */
			} else {
				SplashScreen.hideAsync();
			}
		}, [user, segments, authInitialized, isNavigationReady]);
	};
	useEffect(() => {
		onAuthStateChanged(auth, async (token) => {
			if (token && auth.currentUser.emailVerified) {
				setUid(token.uid);
				setName(token.displayName);
				setEmail(token.email);
				setPfp(token.photoURL);
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
				if (!auth.currentUser.emailVerified) {
					sendEmailVerification(auth.currentUser).catch((err) => {
						console.error(err);
					});
					return alert(
						'Please verify your email before logging in. Check your email for a verification link.'
					);
				}
				// Signed in
				const user = userCredential.user;
				let userData = await readData(
					`prayer_circle/users/${user.uid}`
				);

				setAuth(true);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error(errorCode, errorMessage);
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

				alert(
					'Thank you for becoming a part of Prayer Circle! Please verify your email before logging in. Check your email for a verification link.'
				);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error(errorCode, errorMessage);
			});
		await sendEmailVerification(auth.currentUser).catch((err) =>
			console.error(err)
		);
		await updateProfile(auth.currentUser, {
			displayName: data.public.fname + ' ' + data.public.lname,
			photoURL: data.public.profile_img
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
