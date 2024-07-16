import { ChangeEvent, RefObject, useEffect, useRef, useState } from "react";

/// biggest MAX_PIXEL_AREA you can choose
const MAX_PIXEL_AREA_LIMIT = 50000;

// TODO: 
// - refactor useEffect into util
// - extract non-conditional CSS
// - make ASCII_CHARS and MAX_PIXEL_AREA non constant arguments to startAnimation
const ASCII_CHARS = [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@"];
const WIDTH_SCALE_FACTOR = 1.8;
const MAX_PIXEL_AREA = 50000;

type PlayerSettings = {
    pixelsPerChar: number;
    highContrastMode: boolean;
    invertedMode: boolean;
};

const AsciiPlayer = ({
    videoRef,
    settings,
}: {
    videoRef: RefObject<HTMLVideoElement>;
    settings: PlayerSettings;
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const preRef = useRef<HTMLPreElement>(null);

    const [dimensions, setDimensions] = useState([0, 0]);
    const [asciiFrame, setAsciiFrame] = useState("");
    const [fontSize, setFontSize] = useState(10);
    const [hideLeft, setHideLeft] = useState(0);

    useEffect(() => {
        let handle: number | null = null;
        let videoRefCopy = videoRef.current;

        if (!(videoRef.current && preRef.current && canvasRef.current)) {
            return;
        }

        if (handle && videoRefCopy) {
            videoRefCopy.cancelVideoFrameCallback(handle);
        }

        if (videoRef.current.readyState) {
            startAnimation(videoRef.current, canvasRef.current, preRef.current, settings);
        } else {
            videoRef.current.onloadedmetadata = () => {
                if (!(videoRef.current && canvasRef.current && preRef.current)) {
                    return;
                }

                startAnimation(videoRef.current, canvasRef.current, preRef.current, settings);
            };
        }

        function startAnimation(
            video: HTMLVideoElement, 
            canvas: HTMLCanvasElement,
            pre: HTMLPreElement,
            { pixelsPerChar, highContrastMode, invertedMode }: PlayerSettings,
        ) {
            const ctx = canvas.getContext("2d", { willReadFrequently: true});
            if (!ctx) {
                return;
            }

            if (invertedMode) {
                ASCII_CHARS.reverse();
            }

            const base_width = video.videoWidth * WIDTH_SCALE_FACTOR;
            const base_height = video.videoHeight;
            const max_width = Math.sqrt((MAX_PIXEL_AREA * base_width) / base_height);
            const max_height = Math.sqrt((MAX_PIXEL_AREA * base_height) / base_width);
            const width = Math.floor(Math.min(base_width / pixelsPerChar, max_width));
            const height = Math.floor(Math.min(base_height / pixelsPerChar, max_height));
            canvas.width = width;
            canvas.height = height;

            setFontSize(video.videoHeight / height);

            const updateASCII = () => {
                ctx.drawImage(video, 0, 0, width, height);

                const imageData = ctx.getImageData(0, 0, width, height);

                if (imageData.colorSpace === "srgb") {
                    let imageASCII: string[] = [];

                    for (let i = 0; i < imageData.data.length; i += 4) {
                        let r = imageData.data[i + 1];
                        let g = imageData.data[i + 2];
                        let b = imageData.data[i + 3];

                        // Based on how rgb is converted to greyscale on NTSC
                        const grey_norm = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

                        const ascii_char = highContrastMode
                            ? ASCII_CHARS[Math.round(((ASCII_CHARS.length - 1) >> 1) * (1 + Math.cbrt(2 * grey_norm - 1)),)]
                            : ASCII_CHARS[Math.round(grey_norm * (ASCII_CHARS.length - 1))];

                        imageASCII.push(ascii_char);

                        if ((i / 4 + 1) % width === 0) {
                            imageASCII.push("\n");
                        }
                    }

                    setAsciiFrame(imageASCII.join(""));

                    if (pre.offsetWidth > 0 && pre.offsetHeight > 0) {
                        setDimensions([pre.offsetWidth, pre.offsetHeight]);
                    }
                } else {
                    console.error("Unsupported Colour Space: " + imageData.colorSpace);
                }

                handle = video.requestVideoFrameCallback(updateASCII);
            };

            handle = video.requestVideoFrameCallback(updateASCII);
        }

        return () => {
            if (videoRefCopy && handle) {
                videoRefCopy.cancelVideoFrameCallback(handle);
            }
        };
    }, [videoRef, settings]);

    const handleHideLeftSlider = (event: ChangeEvent<HTMLInputElement>) => {
        setHideLeft(Number(event.target.value));
    };

    return (
        <>
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div style={{ position: "relative" }}>
                <video
                    ref={videoRef}
                    autoPlay
                    style={{
                        width: `${dimensions[0]}px`,
                        height: `${dimensions[1]}px`,
                    }}
                />
                <pre
                    ref={preRef}
                    style={{
                        backgroundColor: settings.invertedMode
                            ? "white"
                            : "black",
                        color: settings.invertedMode ? "black" : "white",
                        fontSize: `${fontSize}px`,
                        textAlign: "left",
                        margin: "0",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        clipPath: `inset(0 0 0 ${hideLeft}%)`,
                    }}
                >
                    <b>{asciiFrame}</b>
                </pre>
            </div>
            <input
                type="range"
                min="0"
                max="100"
                value={hideLeft}
                onChange={handleHideLeftSlider}
                style={{
                    width: `${dimensions[0]}px`,
                    display: dimensions[0] > 0 ? "inherit" : "none",
                }}
            />
        </>
    );
};

export default AsciiPlayer
