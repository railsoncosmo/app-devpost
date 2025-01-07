import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import { AuthContext } from '../contexts/auth';

function Routes() {

    const { signed, loading } = useContext(AuthContext);

    if(loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#36393f' }}>
                <ActivityIndicator size={50} color="#e52246" />
            </View>
        )
    }

    return (

        signed ? <AppRoutes /> : <AuthRoutes />
        //Se o usuário estiver logado, mostra o AppRoutes, se não, mostra o AuthRoutes.

    )
}

export default Routes;