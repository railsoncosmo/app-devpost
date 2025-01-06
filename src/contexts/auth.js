import React, { useState, createContext } from 'react';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext({});

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);

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
            setLoadingAuth(false);
        })
        .catch( (error) => {
            alert("Erro ao logar, verifique os dados e tente novamente!", error.message);
            setLoadingAuth(false);
        })
    }

    return(
        <AuthContext.Provider
            value={{
                signed: !!user, signUp, signIn, loadingAuth //Expõe os dados para ser acessador dentro de toda a aplicação || "!!"" Converte o user em booleano 
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;