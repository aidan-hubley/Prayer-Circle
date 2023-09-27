import React, { useEffect } from "react";
import {
	SafeAreaView,
	Text,
	View,
	Image,
	ScrollView,
	StatusBar
} from "react-native";
import { Circle } from "../components/Circle";
import { styled } from "nativewind";
import { Button } from "../components/Buttons";
import { signOut } from "firebase/auth";
import { auth, router } from "../backend/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Post } from "../components/Post";

const StyledImage = styled(Image);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeArea = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

export default function Page() {
	return (
		<StyledSafeArea className="bg-offblack border" style={{ flex: 1 }}>
			<StyledView className="flex-1 items-center">
				<StyledScrollView className="w-screen">
					<StyledView className="w-full h-[125px]" />
					<Post
						user="Alex Muresan"
						img="https://i.imgur.com/0y8Ftya.png"
						title="Pray for my dog he is very sick"
						timestamp={1695846631107}
						content="He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh"
						icon="heart-outline"
					/>
					<Post
						user="Alex Muresan"
						img="https://i.imgur.com/0y8Ftya.png"
						title="Pray for my dog he is very sick"
						timestamp={1695846631107}
						content="He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh"
						icon="heart-outline"
					/>
					<Post
						user="Alex Muresan"
						img="https://i.imgur.com/0y8Ftya.png"
						title="Pray for my dog he is very sick"
						timestamp={1695846631107}
						content="He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh"
						icon="heart-outline"
					/>
					<Post
						user="Alex Muresan"
						img="https://i.imgur.com/0y8Ftya.png"
						title="Pray for my dog he is very sick"
						timestamp={1695846631107}
						content="He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh"
						icon="heart-outline"
					/>
					<Post
						user="Alex Muresan"
						img="https://i.imgur.com/0y8Ftya.png"
						title="Pray for my dog he is very sick"
						timestamp={1695846631107}
						content="He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh"
						icon="heart-outline"
					/>
					<Post
						user="Alex Muresan"
						img="https://i.imgur.com/0y8Ftya.png"
						title="Pray for my dog he is very sick"
						timestamp={1695846631107}
						content="He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh"
						icon="heart-outline"
					/>
					<Post
						user="Alex Muresan"
						img="https://i.imgur.com/0y8Ftya.png"
						title="Pray for my dog he is very sick"
						timestamp={1695846631107}
						content="He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh"
						icon="heart-outline"
					/>
					<Post
						user="Alex Muresan"
						img="https://i.imgur.com/0y8Ftya.png"
						title="Pray for my dog he is very sick"
						timestamp={1695846631107}
						content="He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh"
						icon="heart-outline"
					/>
					<Post
						user="Alex Muresan"
						img="https://i.imgur.com/0y8Ftya.png"
						title="Pray for my dog he is very sick"
						timestamp={1695846631107}
						content="He is very sick blah blah blah blah oh blah blah blah blah blah blah blah
blah blah blah blah blah blah blah oh no he’s gonna die ahhhhhhhhhhh"
						icon="heart-outline"
						end={true}
					/>
					<StyledView className="w-full h-[125px]" />
				</StyledScrollView>
			</StyledView>

			<StyledView className="absolute bottom-10 flex flex-row justify-center w-screen">
				<Circle
					backgroundColor="transparent"
					size="w-[100px] h-[100px]"
					borderColor="#FFFBFC"
					press={() => {
						console.log("pressed");
					}}
				/>
			</StyledView>
		</StyledSafeArea>
	);
}
