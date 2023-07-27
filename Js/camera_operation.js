// Move the declarations outside of the function to make them global variables
let text_content = document.getElementById('note-writting');
let content = document.querySelector('.content');
let paragraph = null;
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
    } else if (navigator.getUserMedia) {
      // For desktop browsers using the legacy "getUserMedia()"
      stream = await navigator.getUserMedia({ video: true });
    } else {
      throw new Error('Camera access not supported');
    }

    videoElement.srcObject = stream;
    captureButton.disabled = false;
    stopButton.disabled = false;
    startButton.disabled = true;

    // Hide the "Start Camera" button after the camera is started
    const startCameraButton = document.getElementById('startCameraButton');
    startCameraButton.style.display = 'none';
  } catch (error) {
    console.error('Error accessing the camera:', error);
  }
}

// Add event listener to the "Start Camera" button
const startCameraButton = document.getElementById('startCameraButton');
startCameraButton.addEventListener('click', startCamera);

// Function to capture a photo from the phone camera
function capturePhotoFromCamera() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.capture = 'camera';

  fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        // Create an image element to display the captured photo
        const capturedImage = document.createElement('img');
        capturedImage.src = reader.result;

        // Append the captured photo to the content div
        content.appendChild(capturedImage);
      };
      reader.readAsDataURL(file);
    }
  });

  fileInput.click();
}

// Function to capture a photo
function capturePhoto() {
    const context = canvasElement.getContext('2d');
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    // Convert the captured photo to base64 data URL
    const imageDataUrl = canvasElement.toDataURL('image/png');

    // Create an image element to display the captured photo
    const capturedImage = document.createElement('img');
    capturedImage.src = imageDataUrl;

    // Append the captured photo to the content div
    content.appendChild(capturedImage);

    // Hide the camera feed and buttons
    videoElement.style.display = 'none';
    captureButton.style.display = 'none';
    stopButton.style.display = 'none';
    backToCameraButton.style.display = 'block';
    stopCamera();
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
    videoElement.style.display = 'block';
    captureButton.style.display = 'block';
    stopButton.style.display = 'block';
    backToCameraButton.style.display = 'none';

    // Hide the captured photo
    const capturedImages = document.querySelectorAll('.content img');
    capturedImages.forEach(img => img.remove());
}

// Event listeners for the buttons
startButton.addEventListener('click', startCamera);
captureButton.addEventListener('click', capturePhoto);
stopButton.addEventListener('click', stopCamera);
backToCameraButton.addEventListener('click', backToCamera);

// Function to start the camera from phone camera button
function startCameraFromCameraButton() {
  capturePhotoFromCamera();
}
