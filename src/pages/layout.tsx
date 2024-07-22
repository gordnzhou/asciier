import { useContext } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/app.module.css";
import { DarkModeContext } from "./_app";

// TODO: add dark mode 
export default function Layout({ children }: { children: React.ReactNode; }) {
    const { darkMode } = useContext(DarkModeContext);

    return (
        <div className={darkMode ? styles.appDark : styles.appLight}>
            <Navbar/>
            {children}
        </div>
    );
}