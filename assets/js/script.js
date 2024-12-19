const video = document.getElementById('video');
const startButton = document.getElementById('start-recording');
const stopButton = document.getElementById('stop-recording');
const downloadButton = document.getElementById('download-video');

let mediaRecorder;
let recordedChunks = [];

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        console.log("Camera started successfully");

        mediaRecorder = new MediaRecorder(stream);
        console.log("MediaRecorder initialized");

        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
                console.log("Data available from MediaRecorder");
            }
        };

        mediaRecorder.onstop = () => {
            console.log("Recording stopped");
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'recorded-video.webm';
            downloadButton.onclick = () => a.click();
            downloadButton.disabled = false;
        };
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Camera access is required to use this feature.');
    }
}

startButton.addEventListener('click', () => {
    if (mediaRecorder) {
        recordedChunks = [];
        mediaRecorder.start();
        console.log("Recording started");
        startButton.disabled = true;
        stopButton.disabled = false;
        downloadButton.disabled = true;
    }
});

stopButton.addEventListener('click', () => {
    if (mediaRecorder) {
        mediaRecorder.stop();
        console.log("Recording stopped");
        startButton.disabled = false;
        stopButton.disabled = true;
    }
});

// Start the camera feed on page load
startCamera();
