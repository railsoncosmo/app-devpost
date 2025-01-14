import React, { useContext, useState } from 'react';
import { Modal, Platform } from 'react-native';

import { 
Container,
Nome,
Email,
Button,
ButtonText,
Avatar,
UploadButton,
UploadText,
ModalContainer,
ButtonBack,
Input,
} from './styles';
import { AuthContext } from '../../contexts/auth';
import firestore from '@react-native-firebase/firestore'; 
import Header from '../../components/Header';

import Feather from 'react-native-vector-icons/Feather';

export default function Profile() {

  const [nome, setNome] = useState(user?.name);
  const [url, setUrl] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const { signOut, user, setUser, storageUser } = useContext(AuthContext);

  async function handleSignOut(){
    await signOut();

  }

  async function handleUpdateProfile(){
    if(nome === ''){
      return;
    }

    await firestore().collection('users')
    .doc(user?.uid)
    .update({
      nome: nome
    })

    const postDocs = await firestore().collection('posts')
    .where('userId', '==', user?.uid).get();

    postDocs.forEach( async doc => {
      await firestore().collection('posts')
      .doc(doc.id)
      .update({
        autor: nome
      })
    })

    let data = {
      uid: user.uid,
      nome: nome,
      email: user.email
    }

    setUser(data);
    storageUser(data);
    alert('Perfil atualizado com sucesso!');
    setOpenModal(false);
  }

 return (
   <Container>
    <Header/>

      { url ? (
          <UploadButton>
            <UploadText> + </UploadText>
            <Avatar
              source={{ uri: url }}
            />
          </UploadButton>
        ) : (
          <UploadButton>
            <UploadText> + </UploadText>
          </UploadButton>
      )}

      <Nome>{user?.nome}</Nome>
      <Email>{user.email}</Email>

      <Button bg="#418cfd" onPress={() => setOpenModal(true)}>
        <ButtonText color="#fff">Atualizar perfil</ButtonText>
      </Button>

      <Button bg="#DDD" onPress={handleSignOut}>
        <ButtonText color="#353840">Sair</ButtonText>
      </Button>

      <Modal visible={openModal} animationType="fade" transparent={true}>
        <ModalContainer
          behavior={Platform.OS === 'android' ? '' : 'padding'}
        >

          <ButtonBack onPress={() => setOpenModal(false)}>
            <Feather name="arrow-left" size={22} color="#121212" />
            <ButtonText color="#121212">Voltar</ButtonText>
          </ButtonBack>

          <Input
            placeholder={user?.nome}
            value={nome}
            onChangeText={(text) => setNome(text)}
          />

        <Button bg="#418cfd" onPress={handleUpdateProfile}>
          <ButtonText color="#fff">Salvar</ButtonText>
        </Button>

        </ModalContainer>
      </Modal>


   </Container>
  );
}