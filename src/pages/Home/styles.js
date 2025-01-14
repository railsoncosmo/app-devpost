import styled from "styled-components/native";

export const Container = styled.View`
    flex: 1;
    background-color: #36393f;
`;

export const ButtonPost = styled.TouchableOpacity`
    position: absolute;
    bottom: 5%;
    right: 6%;
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background-color: #202225;
    justify-content: center;
    align-items: center;
    z-index: 99;  /*Garante que o botão fica por cima de todos os outros componentes da aplicação*/
`;

export const ListPosts = styled.FlatList`
    flex: 1;
    background-color: #f1f1f1;
`;