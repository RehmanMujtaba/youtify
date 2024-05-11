import { useState, useEffect } from "react";

const HomePage = ({
  handleSpotifyLogin,
  handleYouTubeLogin,
  spotifyProfile,
  youtubeProfile,
  isSpotifyLoggedIn,
  isYouTubeLoggedIn,
  setIsSpotifyLoggedIn,
  setIsYouTubeLoggedIn
}) => {

  useEffect(() => {
    if (isSpotifyLoggedIn && isYouTubeLoggedIn) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [isSpotifyLoggedIn, isYouTubeLoggedIn]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 shadow-xl">
      <div className="p-6 w-full h-screen overflow-auto  rounded-xl shadow-md flex flex-col items-center justify-center space-y-4">
        <div className="text-4xl font-bold text-white">Youtify</div>
        <div className="text-xl text-gray-400">
          All your playlist, all your platforms.
        </div>
        <div className="flex flex-col gap-4 md:w-1/4 min-w-72 w-4/5">
          {isSpotifyLoggedIn ? (
            <div className="flex flex-row justify-between rounded-lg bg-spotify-green shadow-md p-1 h-14">
              <div className="flex items-center justify-center h-full text-l font-semibold text-white">
                {spotifyProfile ? spotifyProfile.display_name : "Spotify Logged In"}
              </div>
              <img
                className="w-12 h-12 rounded-full"
                src={spotifyProfile?.images[1]?.url}
                alt="Profile Picture"
              />
            </div>
          ) : (
            <button
              className="bg-spotify-green w-full font-semibold hover:bg-green-700 text-white p-3 rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
              onClick={async () => {
                const spotifyLogin = await handleSpotifyLogin();
                console.log(spotifyLogin);
                if (spotifyLogin == "success") {
                  setIsSpotifyLoggedIn(true);
                }
              }}
            >
              Login with Spotify
            </button>
          )}

          {isYouTubeLoggedIn ? (
            <div className="flex flex-row justify-between rounded-lg bg-youtube-red shadow-md p-1 h-14">
              <div className="flex items-center justify-center h-full text-l font-semibold text-white">
                {youtubeProfile ? youtubeProfile.title : "Youtube Logged In"}
              </div>
              <img
                className="w-12 h-12 rounded-full"
                src={youtubeProfile?.thumbnails.default.url}
                alt="Profile Picture"
              />
            </div>
          ) : (
            <button
              className="bg-youtube-red hover:bg-red-700 w-full font-semibold text-white p-3 rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
              onClick={async () => {
                const youtubeLogin = await handleYouTubeLogin();
                console.log(youtubeLogin);
                if (youtubeLogin == "success") {
                  setIsYouTubeLoggedIn(true);
                }
              }}
            >
              Login with YouTube
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
