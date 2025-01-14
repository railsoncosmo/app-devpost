import React, { useState, useLayoutEffect, useContext } from 'react';
import { Container, Input, ButtonShare, ButtonShareText } from './styles';

import { useNavigation } from '@react-navigation/native';
import  firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import { AuthContext } from '../../contexts/auth';

export default function NewPosts() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [post, setPost] = useState("");

  useLayoutEffect(() => {

    navigation.setOptions({
      headerRight: () => (
        <ButtonShare onPress={() => {handlePost()}}>
          <ButtonShareText>Compartilhar</ButtonShareText>
        </ButtonShare>
      )
    })

  }, [navigation, post])

  async function handlePost() {
    if(post === ''){
      alert("Post vazio, digite algo antes de compartilhar!");
      return;
    }

    let avatarUrl = null;

    try{
      const response = await storage().ref('users').child(user?.uid).getDownloadURL();
      avatarUrl = response;
    } 
    catch(error){
      avatarUrl = null;
    }

    await firestore().collection('posts')
    .add({
      created: new Date(),
      content: post,
      autor: user?.name,
      userId: user?.uid,
      likes: 0,
      avatarUrl,
    })
    .then(() => {
      setPost('');
      alert("Post compartilhado com sucesso!");
    })
    .catch((error) => {
      alert("Erro ao compartilhar post, tente novamente!", error.message);
    })

    navigation.goBack();

  }

 return (
   <Container>
      
      <Input
        placeholder="O que está acontecendo?"
        placeholderTextColor="#DDD"
        value={post}
        onChangeText={(text) => setPost(text)}
        autoCorrect={false} //Garante que o texto não seja corrigido automaticamente pelo corretor do teclado
        multiline={true} //Permite que o texto seja digitado em mais de uma linha
        maxLength={300} //Limita o tamanho do texto para 300 caracteres
      />

   </Container>
  );
}