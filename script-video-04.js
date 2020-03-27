/*window.addEventListener("DOMContentLoaded", function() {
    var video = document.getElementById('video');
    var localStream = null;
    var errBack = function(e) {
        console.log('Opps.. no se puede utilizar la cámara', e);
    };

    // Solicitar acceso a la cámara
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
        });
    } else if (navigator.getUserMedia) { // Standard
        navigator.getUserMedia({ video: true }, function(stream) {
            video.src = stream;
            video.play();
            localStream = stream;
        }, errBack);
    } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
        navigator.webkitGetUserMedia({ video: true }, function(stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
            localStream = stream;
        }, errBack);
    } else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
        navigator.mozGetUserMedia({ video: true }, function(stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
            localStream = stream;
        }, errBack);
    }
}, false);
 */
window.addEventListener("DOMContentLoaded", function() {
    var video = document.getElementById('video');
    var localStream = null;
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var errBack = function(e) {
        console.log('Opps.. no se puede utilizar la cámara', e);
    };

    let vd = {
        audio: false,
        video: {
            width: { min: 1024, ideal: 1280, max: 1920 },
            height: { min: 776, ideal: 720, max: 1080 },
            facingMode: "environment"
        }
    };
    //environment//user
    // Solicitar acceso a la cámara
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(vd).then(function(stream) {
            //video.src = window.URL.createObjectURL(stream);
            video.srcObject = stream;
            video.play();
        });
    } else if (navigator.getUserMedia) { // Standard
        navigator.getUserMedia(vd, function(stream) {
            //video.src = stream;
            video.srcObject = stream;
            video.play();
            localStream = stream;
        }, errBack);
    } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
        navigator.webkitGetUserMedia(vd, function(stream) {
            //video.src = window.URL.createObjectURL(stream);
            video.srcObject = stream;
            video.play();
            localStream = stream;
        }, errBack);
    } else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
        navigator.mozGetUserMedia(vd, function(stream) {
            // video.src = window.URL.createObjectURL(stream);
            video.srcObject = stream;
            video.play();
            localStream = stream;
        }, errBack);
    }

    document.getElementById('tomar').addEventListener('click', function() {
        context.drawImage(video, 0, 0, 480, 360);
    });
}, false);

// esto funcionará solamente si tienen una etiqueta button o similar con el id "detener".
document.getElementById('detener').addEventListener('click', function() {
    video.src = '';
    video.pause();
    localStream.getVideoTracks()[0].stop();
});

document.getElementById('tomar').addEventListener('click', function() {
    context.drawImage(video, 0, 0, 480, 360);
    var c = document.getElementById('contenido');
    c.innerText = canvas.toDataURL();
});