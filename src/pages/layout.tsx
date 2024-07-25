import { useContext } from "react";
import clsx from "clsx";
import { Libre_Franklin } from 'next/font/google'

import { DarkModeContext } from "./_app";
import Navbar from "../components/Navbar";
import styles from "../styles/app.module.css";

const mavenPro = Libre_Franklin({ weight: "400", subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode; }) {
    const { darkMode } = useContext(DarkModeContext);

    return (
        <div className={clsx(mavenPro.className, styles.app, darkMode ? styles.appDark : styles.appLight)}>
            <Navbar/>
            {children}
        </div>
    );
}