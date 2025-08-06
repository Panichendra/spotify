const currentSong=new Audio(); 
let songs; 
let currFolder;
async function getSongs(folder)
{
    currFolder = folder;

    let a = await fetch("/songs/songs.json");    
    let data = await a.json();
    songs = data[folder] || [];

    let artist;
    switch (folder) {
        case "def": artist = "-"; break;
        case "monica":
        case "ani":
        case "devara": artist = "Anirudh Ravichander"; break;
        case "kub":
        case "pushpa":
        case "devi": artist = "Devi Sri Prasad"; break;
        case "OG":
        case "thaman": artist = "Thaman S"; break;
        default: artist = "Unknown Artist";
    }

    let sli = document.querySelector("#slist");
    sli.innerHTML = "";
    for (const i of songs) {
        sli.innerHTML += `
         <li datafile="${i}">
            <img class="musicimg" src="music.svg" alt="micon">
            <div class="info">
                <div id="soname">${i.replaceAll("%20", "").replace(".mp3", "")}</div>
                <div>${artist}</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img src="spotifyplay.svg" width="30px" alt="play">
            </div>
        </li>`;
    }

    Array.from(document.querySelector("#slist").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener('click', () => {
            playMusic(e.getAttribute("datafile"));
        });
    });
}



function playMusic(track,pause=false)
{   
    currentSong.src=`/songs/${currFolder}/`+track;
    if(!pause){

        currentSong.play();
    }
    document.querySelector(".songinfo").innerHTML=track.replaceAll("%20","").replaceAll(".mp3","");
    document.querySelector(".songtime").innerHTML="00:00 / 00:00";

    
    
    
}




function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function main()
{   
   

     await getSongs("def");
    
     currentSong.src=`/songs/${currFolder}/`+songs[0];
     playMusic(songs[0],true);

     const play=document.body.querySelector("#play");
    play.addEventListener('click',()=>{//note--> here play is id of play button so it can be directly used
        if(currentSong.paused)
        {
            currentSong.play();
             play.src="pause.svg";
        }
        else{
            currentSong.pause();
            play.src="play.svg";
        }
    });

    currentSong.addEventListener("timeupdate",()=>{

        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;

        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";

    });

    document.querySelector(".seekbar").addEventListener('click',(e)=>{
        let perc=(e.offsetX/e.target.getBoundingClientRect().width)*100;

        document.querySelector(".circle").style.left=perc+"%";

        currentSong.currentTime=(perc*currentSong.duration)/100
    });

    document.querySelector(".hamburger").addEventListener('click',()=>{

        document.querySelector(".left").style.left=0;
    
    });

    document.querySelector(".cross").addEventListener('click',()=>{
        document.querySelector(".left").style.left=-100+"%";
    })

  prev.addEventListener("click", () => {
    let currentFile = decodeURIComponent(currentSong.src.split("/").pop());
    let index = songs.indexOf(currentFile);
    if (index > 0) {
        playMusic(songs[index - 1]);
    }
  });

  next.addEventListener("click", () => {
    let currentFile = decodeURIComponent(currentSong.src.split("/").pop());
    let index = songs.indexOf(currentFile);
    if (index < songs.length - 1) {
        playMusic(songs[index + 1]);
    }
  });
  

document.querySelector(".range").addEventListener("change",(e)=>{
    
    currentSong.volume=parseInt(e.target.value)/100; //to change volume
    if(currentSong.volume==0)
    {
        document.querySelector(".vol").src="muted.svg";
    }
    else{
        document.querySelector(".vol").src="volume.svg";
    }
})

document.querySelector(".vol").addEventListener('click',(e)=>{
    
    if(e.target.src.includes("volume.svg"))
    {
        e.target.src="muted.svg";
        
        currentSong.volume=0;
    }
    else
    {
        e.target.src="volume.svg";
        currentSong.volume=0.10;
        document.querySelector(".range").value = 10;
    }
});

    // Select all cards, not just one
document.querySelectorAll(".card").forEach(e => {
    // console.log(e); 
    e.addEventListener('click', async () => {
        // Use the actual data-folder attribute
        await getSongs(e.dataset.folder);
        // console.log(songs);
        
    });
});


document.querySelector(".homesvg").addEventListener('click',async ()=>{
   await getSongs("def");
});


const searchInput = document.querySelector('.cont1 > input');
searchInput.addEventListener('input', function () {
    const query = this.value.trim().toLowerCase();
    let sli = document.querySelector("#slist");
    sli.innerHTML = "";

    
    const filtered = songs.filter(song =>
        song.replaceAll("%20", "").replace(".mp3", "").toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        sli.innerHTML = `<li>Not available</li>`;
    } else {
        for (const i of filtered) {
            sli.innerHTML += `
                <li datafile="${i}">
                    <img class="musicimg" src="music.svg" alt="micon">
                    <div class="info">
                        <div id="soname">${i.replaceAll("%20", "").replace(".mp3", "")}</div>
                        <div>${currFolder === "def" ? "-" : document.querySelector(".info div:last-child")?.textContent || ""}</div>
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <img src="spotifyplay.svg" width="30px" alt="play">
                    </div>
                </li>
            `;
        }
        
        Array.from(sli.getElementsByTagName("li")).forEach((e) => {
            e.addEventListener('click', () => {
                playMusic(e.getAttribute("datafile", true));
            });
        });
    }
});

}
main(); 