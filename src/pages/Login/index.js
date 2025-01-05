import React, { useState } from 'react';
import { View, Text } from 'react-native';

import { Container, Title, Input, Button, ButtonText, SignUpButton, SignUpText } from './styles';

export default function Login() {
  const [login, setLogin] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function toggleLogin() {
    setLogin(!login); //Irá setar o valor contrário do valor atual
    setEmail('');
    setName('');
    setPassword('');
  }

  function handleSignIn(){
    if(email === '' || password === '') {
      alert("Preencha todos os campos!");
      return;
    }

  }

  function handleSignUp(){
    if(name === '' ||email === '' || password === '') {
      alert("Preencha todos os campos!");
      return;
    }
    
  }

  if(login) {
    return (
      <Container>
      <Title>
        Dev<Text style={{color: '#e52246', fontStyle: 'italic'}}>Post</Text>
      </Title>

      <Input
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={(text) =>setEmail(text)}
      />

      <Input
        placeholder="*******"
        value={password}
        onChangeText={(text) =>setPassword(text)}
        secureTextEntry={true}
      />

      <Button onPress={handleSignIn}>
        <ButtonText>Entrar</ButtonText>
      </Button>

      <SignUpButton onPress={toggleLogin}>
        <SignUpText>Criar uma conta</SignUpText>
      </SignUpButton>

   </Container>
    )
  }

 return (

   <Container>
      <Title>
        Dev<Text style={{color: '#e52246', fontStyle: 'italic'}}>Post</Text>
      </Title>

      <Input
        placeholder="Digite seu nome"
        value={name}
        onChangeText={(text) =>setName(text)}
      />

      <Input
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={(text) =>setEmail(text)}
      />

      <Input
        placeholder="*******"
        value={password}
        onChangeText={(text) =>setPassword(text)}
        secureTextEntry={true}
      />

      <Button onPress={handleSignUp}>
        <ButtonText>Cadastrar</ButtonText>
      </Button>

      <SignUpButton onPress={toggleLogin}>
        <SignUpText>Já possuo uma conta!</SignUpText>
      </SignUpButton>

   </Container>
  );
}