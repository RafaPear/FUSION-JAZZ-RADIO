const audioPlayer = document.getElementById('audioPlayer');
let socket;

// Connect to WebSocket server
function connectWebSocket() {
    socket = new WebSocket('ws://localhost:3000'); // Change 'localhost' to your server address

    socket.onmessage = function(event) {
        const message = JSON.parse(event.data);
        if (message.track) {
            audioPlayer.src = message.track;
            audioPlayer.play();
        }
    };

    socket.onclose = function() {
        console.log('WebSocket connection closed, reconnecting...');
        setTimeout(connectWebSocket, 3000); // Try to reconnect every 3 seconds
    };
}

// Initialize WebSocket connection
connectWebSocket();
