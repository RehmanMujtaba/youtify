// components/ActionPage.js
import PlaylistSelector from 'components/playlistselector';

const ActionPage = ({ spotifyProfile, youtubeProfile, spotifyPlaylists, youtubePlaylists }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-slate-800">
        <PlaylistSelector
          spotifyPlaylists={spotifyPlaylists}
          youtubePlaylists={youtubePlaylists}
        />
    
    </div>
  );
};

export default ActionPage;
