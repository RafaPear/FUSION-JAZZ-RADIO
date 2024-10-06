const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Define the directory where your songs are stored
const musicDir = path.join(__dirname, 'public', 'music');
let currentTrackIndex = 0;
let playlist = [];
let clients = [];

// WebSocket Server
const wss = new WebSocket.Server({ noServer: true });

// Load playlist (mp3 files from music folder)
function loadPlaylist() {
    playlist = fs.readdirSync(musicDir).filter(file => path.extname(file) === '.mp3');
    if (playlist.length === 0) {
        console.error('No music files found in the "music" directory.');
    }
}

// Broadcast the current track to all clients
function broadcastCurrentTrack() {
    const currentTrack = playlist[currentTrackIndex];
    const trackPath = `/music/${currentTrack}`;

    clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ track: trackPath }));
        }
    });
}

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve songs dynamically
app.get('/songs', (req, res) => {
    res.json(playlist);
});

// Move to the next song in the playlist and broadcast
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    broadcastCurrentTrack();
}

// Handle WebSocket connections
wss.on('connection', (ws) => {
    // Add new client to clients array
    clients.push(ws);

    // Immediately send the current track to the new client
    const currentTrack = playlist[currentTrackIndex];
    ws.send(JSON.stringify({ track: `/music/${currentTrack}` }));

    // Remove client when disconnected
    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });
});

// Server upgrade to handle WebSocket connections
app.server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    loadPlaylist();
    broadcastCurrentTrack();
    setInterval(nextTrack, 30 * 1000); // Play next track every 30 seconds (adjust as needed)
});

app.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
