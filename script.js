let stream;
const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const startButton = document.getElementById('startButton');
const captureButton = document.getElementById('captureButton');
const stopButton = document.getElementById('stopButton');
const capturedPhotoContainer = document.getElementById('capturedPhotoContainer');
const capturedPhotoWrapper = document.getElementById('capturedPhotoWrapper');
const capturedPhoto = document.getElementById('capturedPhoto');
const backToCameraButton = document.getElementById('backToCameraButton');

// Function to start the camera
async function startCamera() {
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // For mobile browsers supporting "MediaDevices.getUserMedia()"
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
    } else {
      // For desktop browsers using the legacy "getUserMedia()"
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
    }
    
    videoElement.srcObject = stream;
    captureButton.disabled = false;
    stopButton.disabled = false;
    startButton.disabled = true;
  } catch (error) {
    console.error('Error accessing the camera:', error);
  }
}

// Function to capture a photo
function capturePhoto() {
  const context = canvasElement.getContext('2d');
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
  context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

  // Convert the captured photo to base64 data URL
  const imageDataUrl = canvasElement.toDataURL('image/png');

  // Display the captured photo in the container
  capturedPhoto.src = imageDataUrl;
  capturedPhotoWrapper.style.display = 'block';
  capturedPhotoContainer.style.display = 'block';

  // Hide the camera feed and buttons
  videoElement.style.display = 'none';
  captureButton.style.display = 'none';
  stopButton.style.display = 'none';
}

// Function to stop the camera
function stopCamera() {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    videoElement.srcObject = null;
    captureButton.disabled = true;
    stopButton.disabled = true;
    startButton.disabled = false;
  }

  // Hide the captured photo and show the camera feed and buttons
  capturedPhotoWrapper.style.display = 'none';
  capturedPhotoContainer.style.display = 'none';
  videoElement.style.display = 'block';
  captureButton.style.display = 'block';
  stopButton.style.display = 'block';
}

// Function to go back to the camera view
function backToCamera() {
  // Show the camera feed and buttons
  videoElement.style.display = 'block';
  captureButton.style.display = 'block';
  stopButton.style.display = 'block';

  // Hide the captured photo
  capturedPhotoWrapper.style.display = 'none';
  capturedPhotoContainer.style.display = 'none';
}

// Event listeners for the buttons
startButton.addEventListener('click', startCamera);
captureButton.addEventListener('click', capturePhoto);
stopButton.addEventListener('click', stopCamera);
backToCameraButton.addEventListener('click', backToCamera);
