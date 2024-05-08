// components/ActionPage.js
import PlaylistSelector from 'components/playlistselector';

const ActionPage = ({ spotifyProfile, youtubeProfile, spotifyPlaylists }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-8">Select Spotify Playlist</h1>
        <PlaylistSelector
          spotifyPlaylists={spotifyPlaylists}
          handleSelectPlaylist={() => {}}
        />
      </div>
      {spotifyProfile && youtubeProfile ? (
        <div className="flex flex-row mt-6">
          <div className="bg-white p-4 rounded-lg shadow-lg mr-4">
            <h2 className="text-2xl font-bold mb-2">Spotify Profile</h2>
            <p className="mb-1">
              <strong>Name:</strong> {spotifyProfile.display_name}
            </p>
            <img
              className="mt-4 rounded w-32 h-32 object-cover"
              src={spotifyProfile.images[1]?.url}
              alt="Profile Thumbnail"
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2">YouTube Profile</h2>
            <p className="mb-1">
              <strong>Name:</strong> {youtubeProfile.title}
            </p>
            <img
              className="mt-4 rounded w-32 h-32 object-cover"
              src={youtubeProfile.thumbnails.default.url}
              alt="Profile Thumbnail"
            />
          </div>
        </div>
      ) : (
        <p className="mt-6 text-red-500">
          Please log in to both Spotify and YouTube
        </p>
      )}
    </div>
  );
};

export default ActionPage;
