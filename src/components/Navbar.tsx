import { ChangeEvent, useContext } from 'react';
import { Pacifico } from 'next/font/google';
import clsx from 'clsx';
import Link from 'next/link';
import { FaGithub } from "react-icons/fa";
import { FormControlLabel, Switch } from '@mui/material';

import { DarkModeContext } from '../pages/_app';
import styles from '../styles/navbar.module.css';


const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

const Navbar = ({}) => {
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext)

    const handleInvertedModeCheckbox = (
        _event: ChangeEvent<HTMLInputElement>,
    ) => {
        toggleDarkMode()
    };
    
    return (
        <nav className={clsx(styles.navContainer, darkMode ? styles.navContainerDark : styles.navContainerLight)}>
            <h1 className={clsx(pacifico.className, styles.navLogo)}>
                <Link href="/">ASCIIer</Link>
            </h1>

            <div className={styles.centerContainer}>
                <Link href="/" className={clsx(styles.linkText, darkMode ? styles.linkTextDark : styles.linkTextLight)}>
                    Video to ASCII
                </Link>
                <Link href="/about" className={clsx(styles.linkText, darkMode ? styles.linkTextDark : styles.linkTextLight)}>
                    About
                </Link>
            </div>

            <div className={styles.rightContainer}>
                <FormControlLabel
                    label={(darkMode ? "Dark" : "Light") + " Theme"}
                    control={<Switch checked={darkMode} onChange={handleInvertedModeCheckbox}/>}  
                />  
                <a className={styles.ghLogo} href="https://github.com/gordnzhou/asciier" target="_blank"><FaGithub/></a>
            </div>
        </nav>
    );
};

export default Navbar