import { useEffect, useRef, useState } from "react";
import "./App.css";

const VALID_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

function App() {
    const videoRef = useRef();
    const canvasRef = useRef();

    const [asciiFrame, setAsciiFrame] = useState('');
    const [fontSize, setFontSize] = useState(10);

    const playAnimation = (charPixelWidth, frameSkip) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        const ASCII_CHARS = [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@"];
        const WIDTH_SCALE_FACTOR = 1.8;
        const MAX_PIXEL_AREA = 50000;

        const base_width = videoRef.current.videoWidth * WIDTH_SCALE_FACTOR;
        const base_height = videoRef.current.videoHeight;
        const max_width = Math.floor(Math.sqrt(MAX_PIXEL_AREA * base_width / base_height));
        const max_height = Math.floor(Math.sqrt(MAX_PIXEL_AREA * base_height / base_width));
        const width = Math.min(base_width, max_width);
        const height = Math.min(base_height / charPixelWidth, max_height);
        canvas.width = width;
        canvas.height = height;

        let currentFrame = 0;

        const updateASCII = () => {
            if (currentFrame % frameSkip === 0) {

                ctx.drawImage(videoRef.current, 0, 0, width, height);

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

                    setFontSize(base_width / width);
                    setAsciiFrame(imageASCII.join(''));
                } else {
                    console.error("unsupported colourSpace: " + imageData.colorSpace);
                }
            }

            currentFrame += 1;

            videoRef.current.requestVideoFrameCallback(updateASCII);
        }

        videoRef.current.requestVideoFrameCallback(updateASCII);
    }

    const handleFileInput = (event) => {
        let file = event.target.files[0];

        if (VALID_VIDEO_TYPES.includes(file["type"])) {

            if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
                const url = URL.createObjectURL(file);
                videoRef.current.src = url;

                videoRef.current.onloadedmetadata = () => {  
                    // TODO: make these configurable
                    const frameSkip = 1;
                    const charPixelWidth = 1; 

                    playAnimation(charPixelWidth, frameSkip);
                };
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
                ASCIIer

                <p className="App-p">
                    Currently a work in progress...
                </p>

                <input type="file" onChange={handleFileInput}/>   
                <video ref={videoRef} autoPlay style={{ display: "none"}}/>
                <canvas ref={canvasRef} autoPlay style={{ display: "none"}}/>
                <pre style={{color: "white", fontSize: `${fontSize}px`, textAlign: "left"}}>{asciiFrame}</pre>
            </header>     
        </div>
    );
}

export default App;
