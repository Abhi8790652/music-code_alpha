const songs = [

{
title:"Dreams",
artist:"Alex",
cover:"assets/images/cover1.jpg",
audio:"assets/songs/song1.mp3"
},

{
title:"Night Drive",
artist:"John",
cover:"assets/images/cover2.jpg",
audio:"assets/songs/song2.mp3"
},

{
title:"Summer Mood",
artist:"Emma",
cover:"assets/images/cover3.jpg",
audio:"assets/songs/song3.mp3"
},

{
title:"Sky Lights",
artist:"David",
cover:"assets/images/cover4.jpg",
audio:"assets/songs/song4.mp3"
},

{
title:"Forever",
artist:"Olivia",
cover:"assets/images/cover5.jpg",
audio:"assets/songs/song5.mp3"
}

];

const audio = document.getElementById("audio");

const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progressContainer");

const durationEl = document.getElementById("duration");
const currentTimeEl = document.getElementById("currentTime");

const volume = document.getElementById("volume");

const playlist = document.getElementById("playlist");

const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

let songIndex =
Number(localStorage.getItem("lastSong")) || 0;

let isPlaying = false;
let shuffle = false;
let repeat = false;

loadSong(songIndex);

function loadSong(index){

title.innerText=songs[index].title;
artist.innerText=songs[index].artist;
cover.src=songs[index].cover;

audio.src=songs[index].audio;

localStorage.setItem("lastSong",index);

highlightSong();
}

function playSong(){

setupVisualizer();

isPlaying = true;

audio.play();

playBtn.innerHTML =
'<i class="fas fa-pause"></i>';

cover.classList.add("rotate");
}
function pauseSong(){

isPlaying=false;

audio.pause();

playBtn.innerHTML=
'<i class="fas fa-play"></i>';

cover.classList.remove("rotate");
}

playBtn.addEventListener("click",()=>{

isPlaying ? pauseSong() : playSong();

});
searchBtn.addEventListener("click", async () => {

const query =
document.getElementById("search").value;

const response =
await fetch(
`http://localhost:3000/search?q=${query}`
);

const data =
await response.json();

console.log(data);

});
function nextSong(){

if(shuffle){

songIndex=
Math.floor(Math.random()*songs.length);

}
else{

songIndex++;

if(songIndex>=songs.length)
songIndex=0;

}

loadSong(songIndex);

playSong();
}

function prevSong(){

songIndex--;

if(songIndex<0)
songIndex=songs.length-1;

loadSong(songIndex);

playSong();
}

nextBtn.addEventListener("click",nextSong);
prevBtn.addEventListener("click",prevSong);

audio.addEventListener("timeupdate",updateProgress);

function updateProgress(e){

const {duration,currentTime}=e.srcElement;

const progressPercent=
(currentTime/duration)*100;

progress.style.width=
`${progressPercent}%`;

currentTimeEl.innerText=
formatTime(currentTime);

durationEl.innerText=
formatTime(duration);
}

function formatTime(time){

if(isNaN(time))
return "0:00";

const mins=Math.floor(time/60);

const secs=Math.floor(time%60)
.toString()
.padStart(2,"0");

return `${mins}:${secs}`;
}

progressContainer.addEventListener("click",(e)=>{

const width=
progressContainer.clientWidth;

const clickX=e.offsetX;

const duration=audio.duration;

audio.currentTime=
(clickX/width)*duration;

});

volume.addEventListener("input",(e)=>{

audio.volume=e.target.value;

});

audio.addEventListener("ended",()=>{

if(repeat){

audio.currentTime=0;
playSong();

}
else{

nextSong();

}

});

shuffleBtn.addEventListener("click",()=>{

shuffle=!shuffle;

shuffleBtn.style.color=
shuffle ? "#00e5ff" : "white";

});

repeatBtn.addEventListener("click",()=>{

repeat=!repeat;

repeatBtn.style.color=
repeat ? "#00e5ff" : "white";

});

songs.forEach((song,index)=>{

const li=document.createElement("li");

li.innerHTML=
`${song.title} - ${song.artist}`;

li.addEventListener("click",()=>{

songIndex=index;

loadSong(songIndex);

playSong();

});

playlist.appendChild(li);

});

function highlightSong(){

const items=
document.querySelectorAll("#playlist li");

items.forEach(item=>
item.classList.remove("active-song"));

if(items[songIndex]){

items[songIndex]
.classList.add("active-song");

}
}

document.addEventListener("keydown",(e)=>{

if(e.code==="Space"){

e.preventDefault();

isPlaying ? pauseSong() : playSong();

}

if(e.code==="ArrowRight"){

nextSong();

}

if(e.code==="ArrowLeft"){

prevSong();

}

});

document
.getElementById("favoriteBtn")
.addEventListener("click",(e)=>{

const icon=e.currentTarget.querySelector("i");

icon.classList.toggle("fas");
icon.classList.toggle("far");

});
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let audioContext;
let analyser;
let source;
let dataArray;

function setupVisualizer(){

    if(audioContext) return;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    source = audioContext.createMediaElementSource(audio);

    analyser = audioContext.createAnalyser();

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 128;

    const bufferLength = analyser.frequencyBinCount;

    dataArray = new Uint8Array(bufferLength);

    animateVisualizer();
}

function animateVisualizer(){

    requestAnimationFrame(animateVisualizer);

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0,0,canvas.width,canvas.height);

    const barWidth = (canvas.width / dataArray.length) * 1.8;

    let x = 0;

    for(let i=0;i<dataArray.length;i++){

        const barHeight = dataArray[i] * 0.35;

        const gradient = ctx.createLinearGradient(
            0,
            canvas.height,
            0,
            0
        );

        gradient.addColorStop(0,"#00e5ff");
        gradient.addColorStop(1,"#7c3aed");

        ctx.fillStyle = gradient;

        ctx.fillRect(
            x,
            canvas.height - barHeight,
            barWidth,
            barHeight
        );

        x += barWidth + 2;
    }
}