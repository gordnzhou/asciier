import { ChangeEvent, useContext } from 'react';
import { DarkModeContext } from '../pages/_app';
import { Pacifico } from 'next/font/google'
import Link from 'next/link';


const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });
// TODO: 
// - ASCIIER logo (links to landing page)
// - link to github repo, 
// - Dark Mode toggle (affects invertedMode in AsciiPlayer)
const Navbar = ({}) => {
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext)

    const handleInvertedModeCheckbox = (
        _event: ChangeEvent<HTMLInputElement>,
    ) => {
        toggleDarkMode()
    };
    
    return (
        <nav>
            <h1 className={pacifico.className}><b>ASCIIer</b></h1>
            <ul>
                <li>
                    <Link href="/">Video to ASCII</Link>
                </li>
                <li>
                    <Link href="/about">About</Link>
                </li>
            </ul>

            <label htmlFor="darkModeCheckbox">Dark Mode</label>
            <input
                id="darkModeCheckbox"
                type="checkbox"
                defaultChecked={darkMode}
                onChange={handleInvertedModeCheckbox}
            />
            
            <a href="https://github.com/gordnzhou/asciier" target="_blank">Link</a>
        </nav>
    );
};

export default Navbar