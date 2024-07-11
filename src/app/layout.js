import '../styles.css';

export const metadata = {
    title: 'ASCIIer',
    description: "Website for converting videos into animated ASCII art."
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <noscript>You need to enable JavaScript to run this app.</noscript>
                <div id="root">{children}</div>
            </body>
        </html>
    )
}