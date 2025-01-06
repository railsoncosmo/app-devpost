import React, { useState, useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { Container, Title, Input, Button, ButtonText, SignUpButton, SignUpText } from './styles';

import { AuthContext } from '../../contexts/auth';

export default function Login() {
  const [login, setLogin] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUp, signIn, loadingAuth } = useContext(AuthContext);

  function toggleLogin() {
    setLogin(!login); //Irá setar o valor contrário do valor atual
    setEmail('');
    setName('');
    setPassword('');
  }

  async function handleSignIn(){
    if(email === '' || password === '') {
      alert("Preencha todos os campos!");
      return;
    }

    await signIn(email, password);

  }

  async function handleSignUp(){
    if(name === '' ||email === '' || password === '') {
      alert("Preencha todos os campos!");
      return;
    }

    await signUp(email, password, name);
    alert("Usuário cadastrado com sucesso!");
    
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
        {loadingAuth ? (
          <ActivityIndicator size={25} color="#fff" />
        ) : (
          <ButtonText>Entrar</ButtonText>
        )}
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
      {loadingAuth ? (
          <ActivityIndicator size={25} color="#fff" />
        ) : (
          <ButtonText>Cadastrar</ButtonText>
        )}
      </Button>

      <SignUpButton onPress={toggleLogin}>
        <SignUpText>Já possuo uma conta!</SignUpText>
      </SignUpButton>

   </Container>
  );
}