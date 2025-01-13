import React, { useState } from "react";
import {
  Container,
  Header,
  Avatar,
  Name,
  ContentView,
  Content,
  Actions,
  LikeButton,
  Like,
  TimePost,
} from "./styles";

import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useNavigation } from "@react-navigation/native";

import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

function PostsList({ data, userId}) {

  const [likePost, setLikePost] = useState(data?.likes);
  const navigation = useNavigation();

  async function handleLikePost(id, likes){
    const docId = `${userId}_${id}`; //Criando um documento contendo o id do usuário da conta e o id do post

    //Checando se o post ja foi curtido pelo usuário logado
    const doc = await firestore().collection('likes').doc(docId).get();

    if(doc.exists){

      await firestore().collection('posts') //Se o usuário já tiver curtido, ele irá remover o like
      .doc(id).update({
        likes: likes - 1
      })

      await firestore().collection('likes').doc(docId) //após remover o like, ele irá deletar o documento do banco de dados
      .delete()
      .then(() => {
        setLikePost(likes - 1);
      })

      return;
    }

    await firestore().collection('likes').doc(docId) //Se o usuário não tiver curtido, ele irá adicionar a coleção de likes
    .set({
      postId: id,
      userId: userId
    })

    await firestore().collection('posts').doc(id) //Aumentando o like do post que foi curtido
    .update({
      likes: likes + 1
    }).then(() => {
      setLikePost(likes + 1);
    })

  }

  function formatTimePost(){
    const datePost = new Date(data?.created.seconds * 1000); //Transformando os segundos em data TimeStamp

    return formatDistance( //Formatando a data para o padrão brasileiro passando a data postada e a data atual
      new Date(),
      datePost,
      {
        locale: ptBR //Trazen do o valor da data em português
      }
    )

  }

  return (
    <Container>
      <Header onPress={ () => navigation.navigate("PostsUser", {title: data?.autor, userId: data?.userId})}>
         {data?.avatarUrl ? (
          <Avatar source={{uri: data?.avatarUrl}} />
        ) : (
          <Avatar source={require("../../assets/avatar.png")} />
        )}

        <Name numberOfLines={1}>{data?.autor}</Name>
      </Header>

      <ContentView>
        <Content>{data?.content}</Content>
      </ContentView>

      <Actions>

        <LikeButton onPress={ () => handleLikePost(data.id, likePost)}>
          <Like>{likePost === 0 ? '' : likePost}</Like>
          <MaterialCommunityIcons 
          name={likePost === 0 ? "heart-plus-outline" : 'cards-heart'} 
          size={20} 
          color={"#e52246"}/>
        </LikeButton>

        <TimePost>{formatTimePost()}</TimePost>

      </Actions>

    </Container>
  );
}

export default PostsList;
