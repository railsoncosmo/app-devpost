import React from 'react';
import { View } from 'react-native';
import { Container, Name } from './styles';

import { useNavigation } from '@react-navigation/native';
//import PostsUser from '../../pages/PostsUser';

export default function SearchList({data}) {
    const navigation = useNavigation();

 return (
   <Container onPress={() => navigation.navigate("HomeStack", { //Navegando para PostsUser pela Stack de HomeStack
        screen: "PostsUser",
        params: {
            userId: data.id,
            title: data.nome
            }
        }    
    )}
    >
      <Name>{data.nome}</Name>
   </Container>
  );
}