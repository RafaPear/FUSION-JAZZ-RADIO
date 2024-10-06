const audioPlayer = document.getElementById('audioPlayer');
const playlistDiv = document.getElementById('playlist');

// List of songs in the music folder
const songs = [
  "music/FUSION JAZZ.mp3",
  "music/JAZZ FUSION.mp3",
  "music/SOMETHIN FUNKY.mp3"
];

let currentTrackIndex = 0;

// Function to load and play a song
function loadTrack(index) {
  audioPlayer.src = songs[index];
  audioPlayer.play();
}

// Display playlist and set up click events
function setupPlaylist() {
  songs.forEach((song, index) => {
    const songName = song.split('/').pop(); // Get the file name
    const songElement = document.createElement('p');
    songElement.innerText = songName;
    songElement.style.cursor = 'pointer';
    songElement.onclick = () => loadTrack(index);
    playlistDiv.appendChild(songElement);
  });
}

// When a song ends, move to the next song
audioPlayer.addEventListener('ended', () => {
  currentTrackIndex = (currentTrackIndex + 1) % songs.length;
  loadTrack(currentTrackIndex);
});

// Load the first track on page load
loadTrack(currentTrackIndex);
setupPlaylist();
