import { useEffect, useRef, useState } from "react";


/// biggest MAX_PIXEL_AREA you can choose
const MAX_PIXEL_AREA_LIMIT = 50000;

/// TODO: make these constants configurable
const ASCII_CHARS = [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@"];
const WIDTH_SCALE_FACTOR = 1.8; 
const MAX_PIXEL_AREA = 50000;

export const AsciiPlayer = ({ videoRef, settings }) => {
    const canvasRef = useRef();
    const preRef = useRef();

    // dimensions = [width, height]
    const [dimensions, setDimensions] = useState([0, 0]);
    const [asciiFrame, setAsciiFrame] = useState('');
    const [fontSize, setFontSize] = useState(10);

    const [show, setShow] = useState(true);

    useEffect(() => {
        let handle;
        let videoRefCopy = videoRef.current;  

        if (videoRef.current) {
            if (handle !== undefined) {
                videoRefCopy.cancelVideoFrameCallback(handle);
            }

            if (videoRef.current.readyState > 0) {
                playAnimation(settings);
            } else {
                videoRef.current.onloadedmetadata = () => { 
                    playAnimation(settings);
                };
            }
        };

        function playAnimation(settings) {
            const pixelsPerChar = settings.pixelsPerChar;
            const highContrastMode = settings.highContrastMode;
            const invertedMode = settings.invertedMode;

            const video = videoRef.current;
    
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            if (invertedMode) {
                ASCII_CHARS.reverse();
            }
    
            const base_width = video.videoWidth * WIDTH_SCALE_FACTOR;
            const base_height = video.videoHeight;
            const max_width = Math.sqrt(MAX_PIXEL_AREA * base_width / base_height);
            const max_height = Math.sqrt(MAX_PIXEL_AREA * base_height / base_width);
            const width = Math.floor(Math.min(base_width / pixelsPerChar, max_width));
            const height = Math.floor(Math.min(base_height / pixelsPerChar, max_height));
            canvas.width = width;
            canvas.height = height;

            setFontSize(video.videoHeight / height);

            const updateASCII = () => {
                ctx.drawImage(video, 0, 0, width, height);
    
                const imageData = ctx.getImageData(0, 0, width, height);

                if (imageData.colorSpace === 'srgb') {
                    let imageASCII = [];

                    for (let i = 0; i < imageData.data.length; i += 4) {
                        let r = imageData.data[i + 1];
                        let g = imageData.data[i + 2];
                        let b = imageData.data[i + 3];

                        // Based on how rgb is converted to greyscale on NTSC
                        const grey_norm = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                        
                        const ascii_char = highContrastMode ? 
                            ASCII_CHARS[Math.round(((ASCII_CHARS.length - 1) >> 1) * (1 + Math.cbrt(2 * grey_norm - 1)))] :
                            ASCII_CHARS[Math.round(grey_norm * (ASCII_CHARS.length - 1))];

                        imageASCII.push(ascii_char);

                        if (((i / 4) + 1) % width === 0) {
                            imageASCII.push('\n');
                        }
                    }

                    setAsciiFrame(imageASCII.join(''));

                    if (preRef.current.offsetWidth > 0 && preRef.current.offsetHeight > 0) {
                        setDimensions([preRef.current.offsetWidth, preRef.current.offsetHeight]);
                    }
                } else {
                    console.error("Unsupported Colour Space: " + imageData.colorSpace);
                }
    
                handle = video.requestVideoFrameCallback(updateASCII);
            }

            handle = video.requestVideoFrameCallback(updateASCII);
        }

        return () => {
            if (videoRefCopy && handle !== undefined) {
                videoRefCopy.cancelVideoFrameCallback(handle);
            }
        };
    }, [videoRef, settings]);

    return (
        <>
            <button onClick={(event) => setShow(!show)}>SHOW?</button>

            <canvas ref={canvasRef} autoPlay style={{ display: "none" }}/>

            <div style={{ position: 'relative' }}>
                <video ref={videoRef} autoPlay style={{ 
                    width: `${dimensions[0]}px`, 
                    height: `${dimensions[1]}px`,
                }}/>
                <pre ref={preRef} style={{
                    display: show ? "block" : "none",
                    backgroundColor: settings.invertedMode ? "white" : "black",
                    color: settings.invertedMode ? "black" : "white", 
                    fontSize: `${fontSize}px`, 
                    textAlign: "left",
                    margin: "0",
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}><b>{asciiFrame}</b></pre>
            </div>
        </>
    )
}