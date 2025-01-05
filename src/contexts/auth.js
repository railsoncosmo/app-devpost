import React, { useState, createContext } from 'react';

export const AuthContext = createContext({});

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    return(
        <AuthContext.Provider
            value={{
                signed: !!user //Expõe os dados para ser acessador dentro de toda a aplicação || "!!"" Converte o user em booleano 
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;