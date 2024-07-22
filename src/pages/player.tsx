import { useContext, useState, ChangeEvent, MouseEventHandler, useRef, useEffect } from "react";
import AsciiPlayer from "../components/AsciiPlayer";
import { DarkModeContext } from "./_app";
import { useRouter } from "next/router";

// TODO: 
// - ASCII Player
// - Settings Bar
//     - High Contrast Mode Checkbox
//     - Pixels per Character Slider
//     - Pause, Restart, Volume Slider
const Player = () => {
    const router = useRouter();

    const videoRef = useRef<HTMLVideoElement>(null);
    
    const { darkMode } = useContext(DarkModeContext);

    const [playing, setPlaying] = useState(true);

    const [pixelsPerChar, setPixelsPerChar] = useState(5);
    const [highContrastMode, setHighContrastMode] = useState(false);

    useEffect(() => {
        if (typeof router.query.data !== "string") {
            console.error("No video data found!")
            return;    
        }

        const data = JSON.parse(router.query.data);

        if (videoRef.current) {
            videoRef.current.src = data
        } else {
            console.error("videoData recieved before videoRef has been initialized")
        }
    }, [])
    
    const handleCharSizeSlider = (event: ChangeEvent<HTMLInputElement>) => {
        setPixelsPerChar(Number(event.target.value));
    };

    const handleHighContrastModeCheckBox = (
        _event: ChangeEvent<HTMLInputElement>,
    ) => {
        setHighContrastMode(!highContrastMode);
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
            <h2>Player</h2>

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
                    highContrastMode: highContrastMode,
                    invertedMode: !darkMode,
                }}
            />
        </>
    );
};

export default Player