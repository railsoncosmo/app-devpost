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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

function PostsList({ data, userId}) {

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
      <Header>
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

        <LikeButton>
          <Like>{data?.likes === 0 ? '' : data?.likes}</Like>
          <MaterialCommunityIcons 
          name={data?.likes === 0 ? "heart-plus-outline" : 'cards-heart'} 
          size={20} 
          color={"#e52246"}/>
        </LikeButton>

        <TimePost>{formatTimePost()}</TimePost>

      </Actions>

    </Container>
  );
}

export default PostsList;
