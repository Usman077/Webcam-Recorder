// refrancing 
const live = document.getElementById('live');
const recorded = document.getElementById('Recorded');
const startCam = document.getElementById('Start');
const play = document.getElementById('Play');
const record = document.getElementById('Record');
const download = document.getElementById('Download');
const Close = document.getElementById('Stop');



// constraints  and start action
startCam.addEventListener('click',async()=>{
    const constraints = {
    audio:true,
     video:{  facingMode: "user", 
     width: { min: 640, ideal: 1280, max: 1920 },
     height: { min: 480, ideal: 720, max: 1080 } 
      
     }
}
console.log('Using media constraints:', constraints);
await init(constraints);
Close.disabled= false;
record.disabled= false;

})

//  accessing user media
async function init(constraints) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handleSuccess(stream);
    } catch (e) {
      console.error('navigator.getUserMedia error:', e);
         }
  }

// if no error cause then we will start take video
function handleSuccess(stream){
     window.stream = stream;
    live.srcObject=stream;

 }

// Make the live strem stop
 Close.addEventListener('click',()=>{
  
   handleSuccess(null);
   play.disabled = true;
   download.disabled = true;
   record.disabled= true;
   
  
})



// record button accessing
 record.addEventListener('click', () => {
    if (record.textContent === 'Record') {
      startRecording();
      
    } else {
      stopRecording();
      record.textContent = 'Record';
      play.disabled = false;
      download.disabled = false;
    
    }
  });

  // function to start recording
let mediaRecorder;
let recordedBlobs;

  function startRecording(){
    recordedBlobs = [];
  let options = {mimeType: 'video/webm;codecs=vp9,opus'};
  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
   
    return;
  }
 
  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  Record.textContent = 'Stop Recording';
  play.disabled = true;
  download.disabled = true;
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);

  }
  function handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  }
  
  function stopRecording() {
    mediaRecorder.stop();
    play.style.visibility = "visible";
    download.style.visibility = "visible";
  }



  // playing the recorded video
  play.addEventListener('click', () => {
    const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
    recorded.src = null;
    recorded.srcObject = null;
    recorded.src = window.URL.createObjectURL(superBuffer);
    recorded.controls = true;
    recorded.play();
  });





  download.addEventListener('click', () => {
    const blob = new Blob(recordedBlobs, {type: 'video/mp4'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.mp4';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  });