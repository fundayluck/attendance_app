import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const localData = localStorage.getItem("auth");
        return localData ? JSON.parse(localData) : {};
    });
    useEffect(() => {
        localStorage.setItem("auth", JSON.stringify(auth));
    }, [auth]);
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;