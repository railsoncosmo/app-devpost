import React, { useState, useContext, useCallback } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Container, ButtonPost, ListPosts } from "./styles";

import { AuthContext } from "../../contexts/auth";
import firestore from "@react-native-firebase/firestore";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";

import Header from "../../components/Header";
import PostsList from "../../components/PostsList";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [empytList, setEmpytList] = useState(false);
  const [lastItem, setLastItem] = useState('');


  useFocusEffect(
    useCallback(() => {
      let isActive = true; //Controla se a tela está montada para ação do callback

      function fetchPosts() {
        firestore()
          .collection("posts")
          .orderBy("created", "desc") //Busca em ordem decrescente os dados do banco
          .limit(5) //Define a quantidade de dados que vai buscar
          .get()
          .then((snapshot) => {
            if (isActive) {
              //Se estiver ativo, executa o callback
              setPosts([]);

              const postList = [];

              snapshot.docs.map((value) => {
                //Setando os dados do banco na variável "postList"
                postList.push({
                  ...value.data(),
                  id: value.id,
                });
              });

              setEmpytList(!!snapshot.empty); //Se o array estiver vazio, recebe true, se não false.
              setPosts(postList);
              setLastItem(snapshot.docs[snapshot.docs.length - 1]); //Pegando o ultimo item do array de objetos
              setLoading(false);
            }
          });
      }

      fetchPosts();

      return () => {
        isActive = false; //Quando a tela é desmontada ele se torna false e não realiza a requisição dos dados.
      };
    }, [])
  );

  //Buscar mais posts atualizados no banco de dados
  async function handleRefreshPosts(){
    setLoadingRefresh(true);

        firestore()
          .collection("posts")
          .orderBy("created", "desc") //Busca em ordem decrescente os dados do banco
          .limit(5) //Define a quantidade de dados que vai buscar
          .get()
          .then((snapshot) => {

              setPosts([]);

              const postList = [];

              snapshot.docs.map((value) => {
                //Setando os dados do banco na variável "postList"
                postList.push({
                  ...value.data(),
                  id: value.id,
                });
              });

              setEmpytList(false); //Se o array estiver vazio, recebe true, se não false.
              setPosts(postList);
              setLastItem(snapshot.docs[snapshot.docs.length - 1]); //Pegando o ultimo item do array de objetos
              setLoading(false);
          });

          setLoadingRefresh(false);

  }

  async function getListPosts(){
    if(empytList){
      setLoading(false);
      return null;
    }
    if(loading) return;

    firestore()
    .collection("posts")
    .orderBy("created", "desc")
    .startAfter(lastItem) //Busca os dados depois do ultimo item
    .limit(5)
    .get()
    .then((snapshot) => {
      
      const postList = [];

      snapshot.docs.map( value => {
        postList.push({
          ...value.data(),
          id: value.id,
        })
      })

      setEmpytList(!!snapshot.empty);
      setLastItem(snapshot.docs[snapshot.docs.length - 1]);
      setPosts( (oldPosts) => [...oldPosts, ...postList]); //Seta todos os pots na aplicação, os 5 primeiros e os 5 seguintes que foram carregados
      setLoading(false);

    })

  }

  return (
    <Container>
      <Header />

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={50} color={"#E52246"} />
        </View>
      ) : (
        <ListPosts
          showsVerticalScrollIndicator={false}
          data={posts}
          renderItem={({item}) => 
            <PostsList 
              data={item}
              userId={user.uid}
            />}
              refreshing={loadingRefresh} //Se estiver carregando, mostra o loading
              onRefresh={handleRefreshPosts} //Executa a função ao atualizar os dados do banco

              onEndReached={ () => getListPosts()} //Quando chegar no fim da lista, executa a função que busca mais 5 posts
              onEndReachedThreshold={0.2} //Define o ponto em que o onEndReached vai ser executado, ou seja, quando chegar em 60% da tela do ultimo post
        />
      )}

      <ButtonPost
        activeOpacity={0.8}
        onPress={() => navigation.navigate("NewPost")}
      >
        <Feather name="edit-2" size={25} color="#fff" />
      </ButtonPost>
    </Container>
  );
}
