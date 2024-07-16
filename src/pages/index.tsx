import { ChangeEvent, MouseEventHandler, useRef, useState } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ASCIIer",
    description: "Website for converting videos into animated ASCII art.",
};

import AsciiPlayer from "../components/AsciiPlayer";

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
    const [playing, setPlaying] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [pixelsPerChar, setPixelsPerChar] = useState(5);
    const [highContrastMode, setHighContrastMode] = useState(false);
    const [invertedMode, setInvertedMode] = useState(false);

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

        if (videoRef.current) {
            videoRef.current.src = URL.createObjectURL(file);
        }
    };

    const handleCharSizeSlider = (event: ChangeEvent<HTMLInputElement>) => {
        setPixelsPerChar(Number(event.target.value));
    };

    const handleHighContrastModeCheckBox = (
        _event: ChangeEvent<HTMLInputElement>,
    ) => {
        setHighContrastMode(!highContrastMode);
    };

    const handleInvertedModeCheckbox = (
        _event: ChangeEvent<HTMLInputElement>,
    ) => {
        setInvertedMode(!invertedMode);
    };

    const handleVideoPause: MouseEventHandler<HTMLButtonElement> = (
        _event: any,
    ) => {
        if (!videoRef.current) {
            return;
        }

        if (videoRef.current.paused !== playing) {
            setPlaying(videoRef.current.paused);
        }

        if (playing) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }

        setPlaying(!playing);
    };

    const handleVideoRestart: MouseEventHandler<HTMLButtonElement> = (
        _event: any,
    ) => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
    };

    const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            videoRef.current.volume = Number(event.target.value);
        }
    };

    return (
        <>
            <header>
                <h1>ASCIIer</h1>
            </header>
            
            <div>
                <label htmlFor="fileInput">Choose Video File</label>
                <input id="fileInput" type="file" onChange={handleFileInput}/>
            </div>

            <div>
                <label htmlFor="PixelsPerCharSlider">Pixels per Character</label>
                <input
                    id="PixelsPerCharSlider"
                    type="range"
                    min="1"
                    max="10"
                    value={pixelsPerChar}
                    onChange={handleCharSizeSlider}
                />

                <label htmlFor="highContrastModeCheckbox">High Contrast Mode</label>
                <input
                    id="highContrastModeCheckbox"
                    type="checkbox"
                    defaultChecked={highContrastMode}
                    onChange={handleHighContrastModeCheckBox}
                />

                <label htmlFor="invertedModeCheckbox">Inverted Mode</label>
                <input
                    id="invertedModeCheckbox"
                    type="checkbox"
                    defaultChecked={invertedMode}
                    onChange={handleInvertedModeCheckbox}
                />
            </div>

            <div>
                <button onClick={handleVideoPause}>{playing ? "Pause" : "Continue"}</button>

                <button onClick={handleVideoRestart}>Restart</button>

                <label htmlFor="volumeSlider">Volume</label>
                <input
                    id="volumeSlider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    onChange={handleVolumeChange}
                />
            </div>

            <AsciiPlayer
                videoRef={videoRef}
                settings={{
                    pixelsPerChar: pixelsPerChar,
                    highContrastMode,
                    invertedMode,
                }}
            />
        </>
    );
}

export default Home;
