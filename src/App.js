import { useRef, useState } from "react";
import "./App.css";

import { AsciiPlayer } from "./AsciiPlayer";

const VALID_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

function App() {
    const [playing, setPlaying] = useState(true);
    const videoRef = useRef();

    const [charPixelWidth, setCharPixelWidth] = useState(5);
    const [highContrastMode,  setHighContrastMode] = useState(false);
    const [invertedMode, setInvertedMode] = useState(false);

    const handleFileInput = (event) => {
        let file = event.target.files[0];

        if (file === undefined) {
            return;
        }

        if (!VALID_VIDEO_TYPES.includes(file["type"])) {
            alert("Invalid File Type! Supported file types include: " + VALID_VIDEO_TYPES);
            return;
        }

        if ('requestVideoFrameCallback' in HTMLVideoElement.prototype === false) {
            alert('Unable to start as requestVideoFrameCallback is not supported :(');
            return;
        }

        videoRef.current.src = URL.createObjectURL(file);
    };

    const handlePixelWidthSlider = (event) => setCharPixelWidth(event.target.value);

    const handleHighContrastModeCheckBox = (event) => setHighContrastMode(!highContrastMode);

    const handleInvertedModeCheckbox = (event) => setInvertedMode(!invertedMode);

    const handleVideoPause = (event) => {
        if (videoRef.current && videoRef.paused !== playing) {
            setPlaying(videoRef.paused);
        }

        if (playing) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }

        setPlaying(!playing);
    };

    const handleVideoRestart = (event) => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
    };

    const handleVolumeChange = (event) => {
        if (videoRef.current) {
            videoRef.current.volume = event.target.value;
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>ASCIIer</h1>

                <div>
                <label htmlFor="fileInput">Choose Video File</label>
                    <input id="fileInput" type="file" onChange={handleFileInput}/>
                </div>

                <div>
                    <label htmlFor="charPixelWidthSlider">Char Pixel Width</label>
                    <input id="charPixelWidthSlider" type="range" min="1" max="10" value={charPixelWidth} onChange={handlePixelWidthSlider}/>

                    <label htmlFor="highContrastModeCheckbox">High Contrast Mode</label>
                    <input id="highContrastModeCheckbox" type="checkbox" defaultChecked={highContrastMode} onChange={handleHighContrastModeCheckBox}/>

                    <label htmlFor="invertedModeCheckbox">Inverted Mode</label>
                    <input id="invertedModeCheckbox" type="checkbox" defaultChecked={invertedMode} onChange={handleInvertedModeCheckbox}/>
                </div>

                <div>
                    <button onClick={handleVideoPause}>{playing ? "Pause" : "Continue"}</button>

                    <button onClick={handleVideoRestart}>Restart</button>

                    <label htmlFor="volumeSlider">Volume</label>
                    <input id="volumeSlider" type="range" min="0" max="1" step="0.1" onChange={handleVolumeChange}/>
                </div>

                <AsciiPlayer videoRef={videoRef} settings={{charPixelWidth, highContrastMode, invertedMode}}/>
            </header>     
        </div>
    );
}

export default App;
