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
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [isTransferToSpotify, setIsTransferToSpotify] = useState(false);
  const [playlistSongs, setPlaylistSongs] = useState(null);

  const handleSwitchChange = (event) => {
    setIsTransferToSpotify(event.target.checked);
    setSelectedPlaylist("");
    setPlaylistSongs(null);
  };

  const transferYoutubePlaylist = async () => {
    try {
      const response = await fetch("/api/playlist/transfer-youtube", {
        method: "POST",
        body: JSON.stringify({
          playlistName: playlistSongs.name,
          songs: playlistSongs.tracks,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const eventSource = new EventSource("/api/playlist/transfer-youtube");
t
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
              isTransferToSpotify ? "spotify" : "youtube"
            }?id=${selectedPlaylist}`
          );
          setPlaylistSongs(response.data);
        } catch (error) {
          console.error("Error fetching playlist songs:", error);
        }
      };

      fetchPlaylistSongs();
    }
  }, [selectedPlaylist, isTransferToSpotify]);

  const originPlaylists = isTransferToSpotify
    ? spotifyPlaylists
    : youtubePlaylists;

  const originSelector = (
    <div className="p-4 w-full bg-slate-700 rounded-lg shadow-2xl">
      <h2 className="bg-slate-900 text-2xl  rounded-lg p-2 text-gray-300 text-center font-bold mb-2">
        Select {isTransferToSpotify ? "Spotify" : "Youtube"} Playlist
      </h2>
      <SimpleBar>
        <div className="flex m-2 flex-col gap-2">
          {originPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className={`p-1 rounded-md transition-all duration-500 ease-in-out transform md:hover:scale-x-95 md:hover:scale-y-105 ${
                selectedPlaylist === playlist.id
                  ? isTransferToSpotify
                    ? "bg-spotify-green "
                    : "bg-youtube-red"
                  : "bg-slate-800"
              }`}
              onClick={() => {
                if (selectedPlaylist && selectedPlaylist == playlist.id) {
                  setSelectedPlaylist("");
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
                        ? "text-gray-900"
                        : "text-gray-300"
                    } font-semibold`}
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
                    className="w-16 h-16 object-cover rounded-md"
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
    <div className="flex flex-col content-start items-start justify-start p-4  md:w-7/12 w-screen h-screen">
      <div className="flex flex-col items-center justify-center w-full mt-10 ">
        <div className="p-4">
          <ColoredSwitch
            checked={isTransferToSpotify}
            onChange={handleSwitchChange}
            name="transferSwitch"
            inputProps={{ "aria-label": "Transfer switch" }}
          />
        </div>
        <div className="flex flex-col w-full items-center gap-6">
          {originSelector}
          <button
            className={`w-full ${
              isTransferToSpotify
                ? " bg-spotify-green hover:bg-green-700 "
                : "bg-youtube-red hover:bg-red-700"
            } font-bold text-white p-3 text-xl w-11/12 justify-center align-middle items-center rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105`}
            onClick={() => {
              if (isTransferToSpotify) {
                transferYoutubePlaylist();
              }
            }}
            disabled={!selectedPlaylist}
          >
            Copy to {isTransferToSpotify ? "Youtube" : "Spotify"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistSelector;
