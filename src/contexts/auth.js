import React, { useState, createContext, useEffectt, useEffect } from 'react';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({});

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorage() {
            const storageUser = await AsyncStorage.getItem('@authdevpost');

            if(storageUser){ //Se houver um usuário salvo, ele irá ser setado na variável de estado de user
                setUser(JSON.parse(storageUser)); //Convertendo o json em um objeto
            }

            setLoading(false);

        }

        loadStorage();
        setLoading(false);

    }, [])

    async function signUp(email, password, name) {
        setLoadingAuth(true);

        await auth().createUserWithEmailAndPassword(email, password) //Criando o usuário no firebase
        .then(async (value) => {
            let uid = value.user.uid; //Pegando o id do usuário e atribuindo a variável 'uid'
            await firestore().collection('users') //Cadastrando os dados no banco de dados firestore do firebase na tabela 'users'
            .doc(uid).set({ //Setando os dados do usuário que serão cadastrados no banco de dados firestore
                nome: name,
                createdAt: new Date(),
            })
            .then(()=> { //Se o cadastro for feito com sucesso, a variável de estado recebe os dados do usuário
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                }

                setUser(data); //Setando os dados do usuário na variável de estado
                storageUser(data);
                setLoadingAuth(false);
            })
        })
        .catch( (error)=> {
            alert("Erro ao cadastrar, verifique os dados e tente novamente!", error.message);
            setLoadingAuth(false);
        })
    }

    async function signIn(email, password) {
        setLoadingAuth(true);

        await auth().signInWithEmailAndPassword(email, password) //Logando o usuário no firebase
        .then( async (value) => {
            let uid = value.user.uid;

            const userProfile =await firestore().collection('users')
            .doc(uid).get();

            let data = {
                uid: uid,
                name: userProfile.data().nome,
                email: value.user.email,
            };

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
        })
        .catch( (error) => {
            alert("Erro ao logar, verifique os dados e tente novamente!", error.message);
            setLoadingAuth(false);
        })
    }

    async function signOut(){
        await auth().signOut(); //Realizando o logout no firebase
        await AsyncStorage.removeItem('@authdevpost') //Limpando os dados persistidos do usuário no app
        .then( () => {
            setUser(null); //Setando o usuário como nulo na variável de estado
        })
        .catch( (error) => {
            alert("Não foi possivel deslogar, por favor, tente novamente!", error.message);
        })
    }

    async function storageUser(data) { //Persistindo os dados do usuário no App
        await AsyncStorage.setItem('@authdevpost', JSON.stringify(data));
    }

    return(
        <AuthContext.Provider
            value={{
                signed: !!user, signUp, signIn, signOut, loadingAuth, loading, user, setUser, storageUser //Expõe os dados para ser acessador dentro de toda a aplicação || "!!"" Converte o user em booleano 
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;