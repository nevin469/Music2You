//Selecting all required tags and elements

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".image-area img"),
musicName = wrapper.querySelector(".song-desc .Name"),
musicAuthor = wrapper.querySelector(".song-desc .Author"),
mainAudio = wrapper.querySelector("#main-audio"), 
playPauseBtn = wrapper.querySelector(".pause"),
playNextBtn = wrapper.querySelector("#next"),
playPrevBtn = wrapper.querySelector("#prev"),
progressArea = wrapper.querySelector(".song-duration"),
progressBar = wrapper.querySelector(".progress-area"),
musicList = wrapper.querySelector(".music-list");
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");


let musicIndex = 1;

window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
    playingNow();
})

//load music function
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb -1 ].Name;
    musicAuthor.innerText = allMusic[indexNumb -1 ].Author;
    musicImg.src = `images/${allMusic[indexNumb -1 ].img}`;
    mainAudio.src = `music/${allMusic[indexNumb -1 ].src}.mp3`;
}

//Play Music Function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.play();
}

//Pause Music Function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.pause();
}

playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

//Play NextBtn function
function nextMusic(){
    musicIndex++;
    //If music index is greater than total arrays in music.js
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

playNextBtn.addEventListener("click", ()=>{
    nextMusic();

});

//Play PrevBtn
function prevMusic(){
    musicIndex--;
    //If music index is less than total arrays in music.js
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

playPrevBtn.addEventListener("click", ()=>{
    prevMusic();

});

let musicCurrentTime = wrapper.querySelector(".current"),
musicDuration = wrapper.querySelector(".duration");

//Updating the progress bar based on song duration and song timer
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    //Updating total song length
    mainAudio.addEventListener("loadeddata", ()=>{
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            totalSec = `0${totalSec}`;//Adding an extra zero for 2 decimal places
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    })
        //update song Timer
        let currentMin = Math.floor(currentTime / 60);
        let currentSec = Math.floor(currentTime % 60);
        if(currentSec < 10){
            currentSec = `0${currentSec}`;//Adding an extra zero for 2 decimal places
        }
        musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});


//Creating a clickable progress bar
progressArea.addEventListener("click", (e)=>{
    let progressWidthval = progressArea.clientWidth;
    let clickedOffSetx = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetx / progressWidthval) * songDuration;
    playMusic();
});

//Creating next, loop and shuffle buttons
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{

    let getText = repeatBtn.innerText;

    switch(getText){
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Playlist looped once");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playlist shuffled");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            playingNow();
            break;
    }
});

//If a song ends
mainAudio.addEventListener("ended", ()=>{//Creating a button that has 3 functionalities which are next song, loop and shuffle

    let getText = repeatBtn.innerText;

    switch(getText){
        case "repeat":
            nextMusic();//Plays the next song 
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;//Song starts back at 0:00
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
                
            }while(musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            break;
    }

});

//Creating my show and hide buttons
showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=>{
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++){//Created a function to display all songs from music.js
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].Name}</span>
                        <p>${allMusic[i].Author}</p>
                        <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>
                        <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                    </div>
                    
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            totalSec = `0${totalSec}`;//Adding an extra zero for 2 decimal places
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;

        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });

}

const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){//Creating a function that plays the song when clicking on music list
    for (let j = 0; j < allLiTags.length; j++){

        let audioTag = allLiTags[j].querySelector(".audio-duration");

        if(allLiTags[j].classList.contains("playing") ){
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");//Showing song duration on music list
            audioTag.innerText = adDuration;
        }

        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");//Creating a class called playing
            audioTag.innerText = "Playing";
        }
    
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
    
}
//Making the music list clickable so that you can switch to any song based on which song is clicked
function clicked(element){
    
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
