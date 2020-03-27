// Put variables in global scope to make them available to the browser console.
navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

if (navigator.getUserMedia) {
    navigator.getUserMedia({
            audio: true,
            video: {
                // width: { min: 1024, ideal: 1280, max: 1920 },
                /// height: { min: 776, ideal: 720, max: 1080 },
                facingMode: "environment"
            }
        },
        function(stream) {
            var video = document.querySelector('video');
            video.srcObject = stream;
            video.onloadedmetadata = function(e) {
                video.play();
            };
        },
        function(err) {
            console.log("The following error occurred: " + err.name);
        }
    );
} else {
    console.log("getUserMedia not supported");
}