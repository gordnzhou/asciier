import { ChangeEvent } from "react";
import { LOGO } from '../utils/logo';
import { Metadata } from "next";
import { useRouter } from "next/router";

export const metadata: Metadata = {
    title: "ASCIIer",
    description: "Website for converting videos into animated ASCII art.",
};

const VALID_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

// TODO: 
// - Big ASCIIer title
// - option to converted from file or Youtube video link (FUTURE?: from shared link)
//     - Drag and Drop Area for file selection
//     - Text Field for Youtube link 
// - form to select: 
//     - Max Pixel Area textbox (max 50000)
//     - Width Scale Factor
//     - Font Select
const Home = () => {
    const router = useRouter();

    const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files === null) {
            return;
        }

        let file = event.target.files[0];

        if (file === undefined) {
            return;
        }

        /// TODO: change error handling away from alerts
        if (!VALID_VIDEO_TYPES.includes(file["type"])) {
            alert("Invalid File Type! Supported file types include: " + VALID_VIDEO_TYPES);
            return;
        }

        if ("requestVideoFrameCallback" in HTMLVideoElement.prototype === false) {
            alert("Unable to start as requestVideoFrameCallback is not supported :(");
            return;
        }

        router.push({
            pathname: '/player',
            query: { data: JSON.stringify(URL.createObjectURL(file)) }
        });
    };

    return (
        <>
            <header>
                <pre style={{ fontSize: "4px" }}><b>{LOGO}</b></pre>
                <h3>Convert your videos to animated ASCII art.</h3>
            </header>
            
            <div>
                <label htmlFor="fileInput">Choose Video File</label>
                <input id="fileInput" type="file" onChange={handleFileInput}/>
            </div>
        </>
    );
}

export default Home;
