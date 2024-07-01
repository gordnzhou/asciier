import { useEffect, useRef, useState } from "react";

export const AsciiPlayer = ({ videoRef, frameSkip, charPixelWidth }) => {
    const canvasRef = useRef();

    const [asciiFrame, setAsciiFrame] = useState('');
    const [fontSize, setFontSize] = useState(10);

    useEffect(() => {
        let handle;  

        if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {  
                playAnimation(frameSkip, charPixelWidth)
            };
        };

        const playAnimation = (frameSkip, charPixelWidth) => {
            const video = videoRef.current;
    
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            
            const ASCII_CHARS = [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@"];
            const WIDTH_SCALE_FACTOR = 1.5;
            const MAX_PIXEL_AREA = 50000;
    
            const base_width = video.videoWidth * WIDTH_SCALE_FACTOR;
            const base_height = video.videoHeight;
            const max_width = Math.sqrt(MAX_PIXEL_AREA * base_width / base_height);
            const max_height = Math.sqrt(MAX_PIXEL_AREA * base_height / base_width);
            const width = Math.floor(Math.min(base_width / charPixelWidth, max_width));
            const height = Math.floor(Math.min(base_height / charPixelWidth, max_height));
            canvas.width = width;
            canvas.height = height;
    
            let currentFrame = 0;
    
            setFontSize(base_width / width);
    
            const updateASCII = () => {
                if (currentFrame % frameSkip === 0) {
    
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
    
                            const ascii_char = ASCII_CHARS[Math.round(grey_norm * (ASCII_CHARS.length - 1))];
                            
                            imageASCII.push(ascii_char);
    
                            if (((i / 4) + 1) % width === 0) {
                                imageASCII.push('\n');
                            }
                        }
    
                        setAsciiFrame(imageASCII.join(''));
                    } else {
                        console.error("unsupported colourSpace: " + imageData.colorSpace);
                    }
                }
    
                currentFrame += 1;
    
                video.requestVideoFrameCallback(updateASCII);
            }
    
            return video.requestVideoFrameCallback(updateASCII);
        }

        return () => {
            if (videoRef.current && handle !== undefined) {
                videoRef.current.cancelVideoFrameCallback(handle);
            }
        };
    }, [videoRef, frameSkip, charPixelWidth]);

    return (
        <>
            <canvas ref={canvasRef} autoPlay style={{ display: "none"}}/>
            <pre style={{color: "white", fontSize: `${fontSize}px`, textAlign: "left"}}>{asciiFrame}</pre>
        </>
    )
}