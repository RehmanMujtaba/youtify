// components/PlaylistSelector.js
import {useState} from 'react';

const PlaylistSelector = ({ spotifyPlaylists, handleSelectPlaylist }) => {
    const [selectedPlaylist, setSelectedPlaylist] = useState("");

    return (
    <div className="flex flex-col items-center justify-center">
      <select
        className="border border-gray-300 rounded-md p-2 mb-4"
        value={selectedPlaylist}
        onChange={(e) => setSelectedPlaylist(e.target.value)}
      >
        <option value="">Select Playlist</option>
        {spotifyPlaylists.map((playlist) => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.name}
          </option>
        ))}
      </select>
      {selectedPlaylist && (
        <p className="text-lg font-semibold">
          You have selected: {spotifyPlaylists.find((playlist) => playlist.id === selectedPlaylist)?.name}
        </p>
      )}
    </div>
  );
};

export default PlaylistSelector;
