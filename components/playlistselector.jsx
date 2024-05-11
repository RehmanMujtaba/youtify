// components/PlaylistSelector.js
import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import axios from "axios";

const ColoredSwitch = styled(Switch)(({ theme, checked }) => ({
  width: 62,
  height: 34,
  padding: 7,
  color: checked ? "1DB954" : "red",
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {},
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor:
          theme.palette.mode === "dark" ? "#1DB954" : "lightslategray",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: checked ? "#1DB954" : "red",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark" ? "lightslategray" : "lightslategray",
    borderRadius: 20 / 2,
  },
}));

const PlaylistSelector = ({ spotifyPlaylists, youtubePlaylists }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isTransferToYouTube, setIsTransferToYouTube] = useState(false);
  const [playlistSongs, setPlaylistSongs] = useState(null);

  const handleSwitchChange = (event) => {
    setIsTransferToYouTube(event.target.checked);
    setPlaylistSongs(null);
  };

  const transferPlaylist = async () => {
    try {
      const response = await fetch(
        `/api/playlist/transfer-${isTransferToYouTube ? "youtube" : "spotify"}`,
        {
          method: "POST",
          body: JSON.stringify({
            playlistName: playlistSongs.name,
            songs: playlistSongs.tracks,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const eventSource = new EventSource(
        `/api/playlist/transfer-${isTransferToYouTube ? "youtube" : "spotify"}`
      );
      eventSource.onmessage = (event) => {
        const completed = parseInt(event.data, 10);
        console.log(
          `Transferred ${completed} out of ${playlistSongs.tracks.length} songs`
        );
        // Update UI with progress information
      };

      eventSource.addEventListener("done", (event) => {
        console.log("Transfer complete:", event.data);
        // Update UI to indicate that the transfer is complete
        eventSource.close();
      });

      eventSource.onerror = (error) => {
        console.error("Error transferring playlist:", error);
        // Handle error, update UI
      };
    } catch (error) {
      console.error("Error transferring playlist:", error);
    }
  };

  const cleanPlaylist = async () => {
    try {
      const response = await fetch(
        `/api/playlist/clean-${!isTransferToYouTube ? "youtube" : "spotify"}`,
        {
          method: "POST",
          body: JSON.stringify({
            playlistName: playlistSongs.name,
            songs: playlistSongs.tracks,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const eventSource = new EventSource(
        `/api/playlist/clean-${!isTransferToYouTube ? "youtube" : "spotify"}`
      );
      eventSource.onmessage = (event) => {
        const completed = parseInt(event.data, 10);
        console.log(
          `Transferred ${completed} out of ${playlistSongs.tracks.length} songs`
        );
        // Update UI with progress information
      };

      eventSource.addEventListener("done", (event) => {
        console.log("Transfer complete:", event.data);
        // Update UI to indicate that the transfer is complete
        eventSource.close();
      });

      eventSource.onerror = (error) => {
        console.error("Error transferring playlist:", error);
        // Handle error, update UI
      };
    } catch (error) {
      console.error("Error transferring playlist:", error);
    }
  };

  useEffect(() => {
    if (selectedPlaylist) {
      const fetchPlaylistSongs = async () => {
        try {
          const response = await axios.get(
            `/api/playlist/songs-${
              isTransferToYouTube ? "spotify" : "youtube"
            }?id=${selectedPlaylist}`
          );
          setPlaylistSongs(response.data);
        } catch (error) {
          console.error("Error fetching playlist songs:", error);
        }
      };

      fetchPlaylistSongs();
    }
  }, [selectedPlaylist]);

  const originPlaylists = isTransferToYouTube
    ? spotifyPlaylists
    : youtubePlaylists;

  const originSelector = (
    <div className="p-4 w-full bg-slate-700 rounded-lg shadow-2xl">
      <p className="bg-slate-900  text-gray-300 text-2xl  rounded-lg span-2  text-center font-bold mb-2 p-2">
        <span className="justify-center">
          <span className="">{"Select "}</span>
          <span
            className={` transition-all duration-500 ease-in-out transform md:hover:scale-x-95 md:hover:scale-y-105
                    ${
                      isTransferToYouTube
                        ? "text-spotify-green "
                        : "text-youtube-red"
                    }
                  `}
          >
            {isTransferToYouTube ? "Spotify " : "Youtube "}
          </span>
          <span>Playlist</span>
        </span>
      </p>
      <SimpleBar autoHide={false} style={{ maxHeight: 550 }}>
        <div className="flex m-2 flex-col gap-2">
          {originPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              title={playlist.name}
              className={`p-1 mr-2 rounded-md transition-all duration-500 ease-in-out transform hover:cursor-pointer md:hover:scale-x-95 md:hover:scale-y-105 ${
                selectedPlaylist === playlist.id
                  ? isTransferToYouTube
                    ? "bg-spotify-green "
                    : "bg-youtube-red"
                  : "bg-slate-800"
              }`}
              onClick={() => {
                if (selectedPlaylist && selectedPlaylist == playlist.id) {
                  setSelectedPlaylist(null);
                  return;
                }
                setSelectedPlaylist(playlist.id);
              }}
            >
              <div className="flex flex-row gap-4 justify-between">
                <div className="flex flex-col text-left">
                  <p
                    className={`text-left  ${
                      selectedPlaylist === playlist.id
                        ? "text-gray-900 font-bold"
                        : "text-gray-300 font-semibold"
                    } `}
                  >
                    {playlist.name}
                  </p>
                  <p className="text-left text-gray-300 font-light">
                    {playlist?.total} Tracks
                  </p>
                </div>
                {playlist.image ? (
                  <img
                    src={playlist.image}
                    alt={playlist.name}
                    className="w-16 h-16 object-cover rounded-sm"
                  />
                ) : (
                  <div className="w-16 h-16 object-cover rounded-md bg-slate-950"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </SimpleBar>
    </div>
  );

  return (
    <div className="flex flex-col content-start items-start justify-start p-4  md:w-7/12 lg:w-5/12 w-screen h-screen">
      <div className="flex flex-col items-center justify-center w-full mt-10 ">
        <div className="flex flex-row flex-grow w-full justify-center p-4">
          <div style={{ width: 55, height: 55 }}>
            <img
              src="YouTube_full-color_icon_(2017).svg.png"
              alt="YouTube"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <div className="self-center">
            <ColoredSwitch
              checked={isTransferToYouTube}
              onChange={handleSwitchChange}
              name="transferSwitch"
              inputProps={{ "aria-label": "Transfer switch" }}
            />
          </div>
          <div className="self-center" style={{ width: 45, height: 45 }}>
            <img
              src="Spotify_icon.svg.png"
              alt="Spotify"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>
        <div className="flex flex-col w-full items-center gap-6">
          {originSelector}

          <div className="flex flex-row w-full items-center gap-6">
            <button
              className={`w-full ${
                isTransferToYouTube
                  ? " bg-spotify-green hover:bg-green-700 disabled:bg-green-700"
                  : "bg-youtube-red hover:bg-red-700 disabled:bg-red-700"
              } font-bold text-white p-3 text-xl w-11/12 h-full justify-center align-middle items-center rounded-md disabled:opacity-40 hover:disabled:cursor-not-allowed disabled:text-gray-300 ${
                selectedPlaylist != null &&
                "transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              }`}
              onClick={() => {
                transferPlaylist();
              }}
              disabled={!selectedPlaylist}
              title={`Copy to ${isTransferToYouTube ? "Youtube" : "Spotify"}
`}
            >
              Copy to {isTransferToYouTube ? "Youtube" : "Spotify"}
            </button>
            <button
              className={`w-full ${
                isTransferToYouTube
                  ? " bg-spotify-green hover:bg-green-700 disabled:bg-green-700"
                  : "bg-youtube-red hover:bg-red-700 disabled:bg-red-700"
              } font-bold text-white p-3 text-xl w-11/12 h-full justify-center align-middle items-center rounded-md disabled:opacity-40 hover:disabled:cursor-not-allowed disabled:text-gray-300 ${
                selectedPlaylist != null &&
                "transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              }`}
              onClick={() => {
                cleanPlaylist();
              }}
              disabled={selectedPlaylist == null}
              title="Clean Playlist"
            >
              Clean Playlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistSelector;
