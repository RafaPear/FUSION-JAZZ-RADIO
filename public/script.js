const audioPlayer = document.getElementById('audioPlayer');
let playlist = [];
let currentTrack = 0;

// Fetch the list of songs from the server
fetch('/songs')
  .then(response => response.json())
  .then(songs => {
    if (songs.length > 0) {
      playlist = songs;
      loadTrack(currentTrack);
    }
  });

// Load and play the current track
function loadTrack(index) {
  audioPlayer.src = `music/${playlist[index]}`;
  audioPlayer.play();
}

// Move to the next song when one ends
audioPlayer.addEventListener('ended', () => {
  currentTrack = (currentTrack + 1) % playlist.length;
  loadTrack(currentTrack);
});
