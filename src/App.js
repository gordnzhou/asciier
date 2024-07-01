import { useEffect, useRef, useState } from "react";
import "./App.css";

import { AsciiPlayer } from "./AsciiPlayer";

const VALID_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

function App() {
    const videoRef = useRef();

    const [frameSkip, setFrameSkip] = useState(1);
    const [charPixelWidth, setCharPixelWidth] = useState(5);

    const handleFileInput = (event) => {
        let file = event.target.files[0];

        if (VALID_VIDEO_TYPES.includes(file["type"])) {

            if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
                videoRef.current.src = URL.createObjectURL(file);
            } else {
                console.error('requestVideoFrameCallback is not supported... unable to play')
            }
        } else {
            alert("Invalid File Type! " + file["type"]);
        }
    };
    

    return (
        <div className="App">
            <header className="App-header">
                <h1>ASCIIer</h1>

                <label htmlFor="fileInput">Choose Video File</label>
                <input id="fileInput" type="file" onChange={handleFileInput}/>

                <video ref={videoRef} autoPlay style={{ display: "none"}}/>
                <AsciiPlayer videoRef={videoRef} charPixelWidth={charPixelWidth} frameSkip={frameSkip}/>

                <label htmlFor="charPixelWidth">Char Pixel Width</label>
                <input id="charPixelWidth" type="range" min="1" max="10" value={charPixelWidth} onChange={(event) => setCharPixelWidth(event.target.value)}/>

                <label htmlFor="frameSkip">Frame Skip</label>
                <input id="frameSkip" type="range" min="1" max="5" value={frameSkip} onChange={(event) => setFrameSkip(event.target.value)}/>
            </header>     
        </div>
    );
}

export default App;
