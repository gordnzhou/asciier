import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import styles from "../styles/app.module.css";

export default function Layout({ children }: { children: React.ReactNode; }) {
    return (
        <div className={styles.app}>
            <Navbar/>
            {children}
            <Footer/>
        </div>
    );
}