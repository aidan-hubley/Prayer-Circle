import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Image,
    FlatList,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Buttons';
import { Post } from '../../components/Post';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserData } from '../../backend/firebaseFunctions';
import { useStore } from '../global';
import { auth } from '../../backend/config';
import shorthash from 'shorthash';
import { router } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledGradient = styled(LinearGradient);

export default function ProfilePage() {
    const otherUserID = useStore((state) => state.otherUserID);
    const otherUserName = useStore((state) => state.otherUserName);
    const otherUserImg = useStore((state) => state.otherUserImg);
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [renderIndex, setRenderIndex] = useState(0);
    const [initialLoad, setInitialLoad] = useState('loading');
    const [scrolling, setScrolling] = useState(false);
    const globalReload = useStore((state) => state.globalReload);
    const [userData, setUserData] = useState(auth?.currentUser);

    const setUpVenn = async () => {
        let data = await getUserData(otherUserID);
        let circlelist = data['circlelist'];
        let postlist = data['postlist'];
        setRenderIndex(0);

        console.log(circlelist);
        console.log(postlist);

        let pl = await populateList(postlist, 0, 7);
        setPosts(pl);

        setInitialLoad('loaded');
    }

    async function populateList(list, start, numOfItems) {
        let renderedList = [];
        let endOfList =
            list.length < start + numOfItems ? list.length - start : numOfItems;
        for (let i of list.slice(start, endOfList + start)) {
            let id = i[0];
            let data = (await readData(`prayer_circle/posts/${id}`)) || {};
            if (data.user == userData.uid) renderedList.push([id, data]);
        }
        setRefreshing(false);
        setRenderIndex(start + endOfList);
        return renderedList;
    }

    useEffect(() => {
        setUpVenn();
    }, []);

    useEffect(() => {
        if (globalReload) {
            setUpVenn();
        }
    }, [globalReload]);

    let insets = useSafeAreaInsets();
    return (
        <StyledView className='flex-1 bg-offblack'>
            <FlatList
                data={posts}
                onEndReachedThreshold={0.4}
                windowSize={10}
                onScrollBeginDrag={() => {
                    setScrolling(true);
                }}
                onMomentumScrollEnd={() => {
                    setScrolling(false);
                }}
                onEndReached={() => {
                    if (initialLoad == 'loading' || !scrolling) return;
                    populateList(postList, renderIndex, 10).then((res) => {
                        setPosts([...posts, ...res]);
                    });
                }}
                style={{ paddingHorizontal: 15 }}
                estimatedItemSize={100}
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        progressViewOffset={insets.top + 60}
                        onRefresh={() => {
                            setRefreshing(true);
                            setUpVenn();
                        }}
                        refreshing={refreshing}
                        tintColor='#ebebeb'
                    />
                }
                ListHeaderComponent={
                    <StyledView
                        style={{ paddingTop: insets.top + 100 }}
                        className='flex items-center w-full mb-10'
                    >
                        <StyledView className='w-[175px] h-[175px] rounded-[20px]'>
                            <Image
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 18,
                                    display: otherUserImg
                                        ? 'flex'
                                        : 'none'
                                }}
                                source={{
                                    uri: otherUserImg
                                }}
                            />
                        </StyledView>
                        <StyledText className='font-bold text-offwhite text-[26px] mt-3'>
                            {otherUserName}
                        </StyledText>
                    </StyledView>
                }
                ListFooterComponent={
                    posts && posts.length > 0 ? (
                        <StyledView
                            className='w-full flex items-center mb-[10px] border-2 border-red'
                            style={{
                                height: insets.top + 60
                            }}
                        />
                    ) : (
                        <></>
                    )
                }
                ListEmptyComponent={
                    <StyledView className='w-full h-[250px] flex items-center justify-center'>
                        <StyledView
                            className={`${initialLoad == 'loaded' ? 'hidden' : 'flex'
                                }`}
                        >
                            <ActivityIndicator size='large' />
                        </StyledView>
                        <StyledText
                            className={`${initialLoad == 'loaded' ? 'flex' : 'hidden'
                                } text-white text-[24px]`}
                        >
                            No Posts Yet!
                        </StyledText>
                    </StyledView>
                }
                renderItem={({ item }) => (
                    <Post
                        user={item.name}
                        img={item.profile_img}
                        title={item.title}
                        timestamp={`${item.timestamp}`}
                        content={item.body}
                        icon={item.type}
                        id={item[0]}
                        owned={true}
                        edited={item.edited}
                        metadata={item.metadata}
                        data={item}
                    />
                )}
                keyExtractor={(item) => item[0]}
            />
            <StyledView
                style={{ bottom: insets.bottom }}
                className='absolute w-screen px-[15px] flex flex-row justify-between'
            >
                <Button
                    width='w-[60px]'
                    height='h-[60px]'
                    icon='arrow-back-outline'
                    iconSize={36}
                    press={() => { router.push('/') }}
                />
            </StyledView>
            <StyledGradient
                pointerEvents='none'
                start={{ x: 0, y: 0.1 }}
                end={{ x: 0, y: 1 }}
                style={{ height: insets.top + 60 }}
                className='absolute w-screen'
                colors={['#121212', 'transparent']}
            />
        </StyledView>
    );
}
