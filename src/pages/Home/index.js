import React from 'react';
import { View, Text } from 'react-native';
import { Container, ButtonPost } from './styles';

import { useNavigation } from '@react-navigation/native';

import Feather from 'react-native-vector-icons/Feather';

export default function Home() {
  const navigation = useNavigation();

 return (
   <Container>
      <Text>Página Home</Text>

      <ButtonPost 
        activeOpacity={0.8}
        onPress={ () => navigation.navigate("NewPost") }
      >
        <Feather 
          name="edit-2"
          size={25} 
          color="#fff"
        />
      </ButtonPost>

   </Container>
  );
}