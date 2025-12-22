import { createContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut,
    updateProfile,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.config";

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) =>
        createUserWithEmailAndPassword(auth, email, password);

    const loginUser = (email, password) =>
        signInWithEmailAndPassword(auth, email, password);

    const googleLogin = () => signInWithPopup(auth, googleProvider);

    const updateUserProfile = (name, photoURL) =>
        updateProfile(auth.currentUser, { displayName: name, photoURL });

    const logout = async () => {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
            method: "POST",
            credentials: "include",
        });
        return signOut(auth);
    };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            try {
                if (currentUser?.email) {
                    await fetch(`${import.meta.env.VITE_BACKEND_URL}/jwt`, {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ email: currentUser.email }),
                    });
                } else {
                    await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
                        method: "POST",
                        credentials: "include",
                    });
                }
            } catch (err) {
                console.log(err)
            }

            setLoading(false);
        });

        return () => unsub();
    }, []);

    const authInfo = {
        user,
        loading,
        createUser,
        loginUser,
        googleLogin,
        updateUserProfile,
        logout,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
