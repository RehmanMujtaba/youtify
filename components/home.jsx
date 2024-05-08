import { useState, useEffect } from "react";

const HomePage = ({ handleSpotifyLogin, handleYouTubeLogin, spotifyProfile, youtubeProfile  }) => {
  const [isSpotifyLoggedIn, setIsSpotifyLoggedIn] = useState(false);
  const [isYouTubeLoggedIn, setIsYouTubeLoggedIn] = useState(false);

  useEffect(() => {
    if (isSpotifyLoggedIn && isYouTubeLoggedIn) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [isSpotifyLoggedIn, isYouTubeLoggedIn]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900">
      <div className="p-6 w-full h-screen overflow-auto  rounded-xl shadow-md flex flex-col items-center justify-center space-y-4">
        <div className="text-4xl font-bold text-white">Youtify</div>
        <div className="text-xl text-gray-400">
          Your playlist, on all your platforms
        </div>
        <div className="mt-6 flex flex-col gap-4">
          {isSpotifyLoggedIn ? (
            <div className="text-lg text-center text-green-500">Spotify Logged in as {spotifyProfile.display_name}</div>
          ) : (
            <button
              className="bg-green-700 w-full hover:bg-green-600 text-white px-4 py-2 rounded-md mr-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
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
            <div className="text-lg text-center text-red-500">Youtube Logged in as {youtubeProfile.title} </div>
          ) : (
            <button
              className="bg-red-700 hover:bg-red-600 w-full text-white px-4 py-2 rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
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
