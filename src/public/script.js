function openWindow(url) {
    window.open(url, '_blank', 'width=500,height=500');
}

async function getSpotifyPlaylists() {
    const response = await fetch('/api/spotify/playlists');
    const playlists = await response.json();

    // Display the playlists in an unordered list
    const playlistListElement = document.getElementById('spotifyPlaylistList');
    playlistListElement.innerHTML = '';
    playlists.forEach(playlist => {
        const listItem = document.createElement('li');
        listItem.textContent = playlist.name;
        playlistListElement.appendChild(listItem);
    });
}