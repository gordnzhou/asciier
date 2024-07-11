import { useRef, useState } from "react";
import "./App.css";

import { AsciiPlayer } from "./AsciiPlayer";

const VALID_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

/*  TODO: 

Top bar 
- ASCIIER logo (links to landing page)
- link to github repo, 
- Dark Mode toggle (affects invertedMode)

PAGES
Landing Page
- Asciier Logo
- option to converted from file or Youtube video link (FUTURE?: from shared link)
    - Drag and Drop Area for file selection
    - Text Field for Youtube link 
- form to select: 
    - Max Pixel Area textbox (max 50000)
    - Width Scale Factor
    - Font Select

Video Player Page
- ASCII Player
- Settings Bar
    - High Contrast Mode Checkbox
    - Pixels per Character Slider
    - Pause, Restart, Volume Slider
- horizontal slider below ASCII player for showing part original vid to the left, ASCII to its right
*/

function App() {
    const [playing, setPlaying] = useState(true);
    const videoRef = useRef();

    const [pixelsPerChar, setPixelsPerChar] = useState(5);
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

    const handleCharSizeSlider = (event) => setPixelsPerChar(event.target.value);

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
                    <label htmlFor="PixelsPerCharSlider">Pixels per Character</label>
                    <input id="PixelsPerCharSlider" type="range" min="1" max="10" value={pixelsPerChar} onChange={handleCharSizeSlider}/>

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

                <AsciiPlayer videoRef={videoRef} settings={{pixelsPerChar: pixelsPerChar, highContrastMode, invertedMode}}/>
            </header>     
        </div>
    );
}

export default App;
