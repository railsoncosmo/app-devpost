import React, { useLayoutEffect, useState, useCallback, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Container, PostListUser } from './styles';

import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import PostsList from '../../components/PostsList';
import { AuthContext } from '../../contexts/auth';

export default function PostsUser() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState(route.params?.title); //recebe o titulo que foi passado pela navegação do feed
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title === '' ? '' : title //Se o title for vazio, ele irá ficar vazio, se não irá mostrar o nome do autor
    })
  }, [navigation, title]) //Executa a função toda vez que o title for alterado e navigation for chamado

  useFocusEffect(
    useCallback( () => {
      let isActive = true;

      firestore()
      .collection('posts')
      .where('userId', '==', route.params?.userId)
      .orderBy('created', 'desc')
      .get()
      .then( snapshot => {

        const postList = [];

        snapshot.docs.map( value => {
          postList.push({
            ...value.data(),
            id: value.id,
          })
        })

        if(isActive){

          setPosts(postList);
          setLoading(false);
        }

      })

      return () => {
        isActive = false;
      }
    }, [])
  )

 return (
   <Container>

      { loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={50} color="#e52246" />
        </View>
      ) : (
        <PostListUser
          showsVerticalScrollIndicator={false}
          data={posts}
          renderItem={ ({ item }) => <PostsList data={item} userId={user.uid} />}
        />
      )}

   </Container>
  );
}