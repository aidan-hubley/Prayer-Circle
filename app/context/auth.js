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
import {
	writeData,
	readData,
	uploadImage,
	createTutorial
} from '../../backend/firebaseFunctions';
import {
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	sendEmailVerification,
	updateProfile
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notify } from '../global';

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
			if (!user && !inAuthGroup) {
				setTimeout(() => {
					SplashScreen.hideAsync();
				}, 500);
				router.replace('/login');
			} else if (user && inAuthGroup) {
				SplashScreen.hideAsync();
				router.replace(
					''
				); /* TODO: fix this to replace the current screen */
			} else {
				SplashScreen.hideAsync();
			}
		}, [user, segments, authInitialized, isNavigationReady]);
	};
	useEffect(() => {
		onAuthStateChanged(auth, async (token) => {
			if (token && auth?.currentUser?.emailVerified) {
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
			.then(async () => {
				if (!auth?.currentUser?.emailVerified) {
					await sendEmailVerification(auth?.currentUser).catch(
						(err) => {
							console.error(err);
						}
					);
					return notify(
						'Verify Email',
						'Check your email for a verification link.',
						'#CC2500'
					);
				}
				setAuth(true);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error(errorCode, errorMessage);
				notify('Login Error', 'Incorrect email or password', '#CC2500');
			});
	};

	const registerUser = async (email, password, data, image) => {
		await createUserWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				// Signed in
				const user = userCredential.user;

				let imgURL = await uploadImage(
					`prayer_circle/users/${user.uid}`,
					image
				);
				data.public['profile_img'] = imgURL;

				writeData(`prayer_circle/users/${user.uid}`, data, true);
				
				createTutorial(user.uid);

				notify(
					'Welcome to Prayer Circle',
					'Thank you for becoming a part of Prayer Circle! Please verify your email before logging in. Check your email for a verification link.',
					'#00A55E',
					140000
				);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				if (errorCode === 'auth/email-already-in-use') {
					return notify(
						'Regitration Error',
						'Email already in use',
						'#CC2500'
					);
				} else console.error(errorCode, errorMessage);
			});
		await updateProfile(auth?.currentUser, {
			displayName: data.public.fname + ' ' + data.public.lname,
			photoURL: data.public.profile_img
		});
		await sendEmailVerification(auth?.currentUser).catch((err) =>
			console.error(err)
		);
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
