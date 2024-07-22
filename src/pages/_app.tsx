import type { AppProps } from "next/app";
import "../styles/global.css";
import Layout from "./layout";
import { Context, createContext, useState } from "react";

type DarkModeState = { 
    darkMode: boolean;
    toggleDarkMode: () => void;
};

export const DarkModeContext: Context<DarkModeState> = createContext<DarkModeState>({ 
    darkMode: true,
    toggleDarkMode: (): void => {},
});

export default function App({ Component, pageProps }: AppProps) {
    const [darkMode, setDarkMode] = useState(true);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };
    
    return (
        <DarkModeContext.Provider value={{darkMode, toggleDarkMode}}>
            <Layout>
                <Component {...pageProps}/>
            </Layout>
        </DarkModeContext.Provider>
    )
}