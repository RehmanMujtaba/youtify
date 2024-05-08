import "tailwindcss/tailwind.css";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import HomePage from "components/home";
import PlaylistSelector from "components/playlistselector";
import ActionPage from "components/actionpage";

export default function IndexPage() {
  const router = useRouter();
  const [spotifyProfile, setSpotifyProfile] = useState(null);
  const [youtubeProfile, setYoutubeProfile] = useState(null);

  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);

  useEffect(() => {
    async function fetchSpotifyProfile() {
      try {
        const response = await axios.get("/api/user/spotify-profile");
        setSpotifyProfile(response.data);
      } catch (error) {
        console.error("Error fetching Spotify profile:", error.message);
      }
    }
    fetchSpotifyProfile();

    async function fetchSpotifyPlaylists() {
      try {
        const response = await axios.get("/api/playlist/spotify");
        setSpotifyPlaylists(response.data);
      } catch (error) {
        console.error("Error fetching Spotify playlists:", error);
      }
    }

    fetchSpotifyPlaylists();

    async function fetchYoutubeProfile() {
      try {
        const response = await axios.get("/api/user/youtube-profile");
        setYoutubeProfile(response.data);
      } catch (error) {
        console.error("Error fetching YouTube profile:", error.message);
      }
    }
    fetchYoutubeProfile();
  }, []);

  const handleSpotifyLogin = () => {
    return new Promise((resolve, reject) => {
      const popup = window.open(
        "/api/auth/spotify",
        "Spotify Login",
        "width=600,height=400"
      );
      if (!popup) {
        alert("Please allow popups to continue with Spotify login.");
        reject(new Error("Popup blocked"));
      } else {
        window.addEventListener('message', function(event) {
          if (event.origin !== window.location.origin) return;
          if (event.data === 'spotify_auth_success') {
            resolve('success');
          } else {
            reject(new Error('Authentication failed'));
          }
        }, false);
      }
    });
  };
  
  const handleYouTubeLogin = () => {
    return new Promise((resolve, reject) => {
      const popup = window.open(
        "/api/auth/youtube",
        "YouTube Login",
        "width=600,height=400"
      );
      if (!popup) {
        alert("Please allow popups to continue with YouTube login.");
        reject(new Error("Popup blocked"));
      } else {
        window.addEventListener('message', function(event) {
          if (event.origin !== window.location.origin) return;
          if (event.data === 'youtube_auth_success') {
            resolve('success');
          } else {
            reject(new Error('Authentication failed'));
          }
        }, false);
      }
    });
  };

  const handleSelectPlaylist = (playlistId) => {
    setSelectedPlaylist(playlistId);
  };

  return (
    <div className="min-h-screen min-w-screen bg-slate-800">
      <HomePage
        spotifyProfile={spotifyProfile}
        youtubeProfile={youtubeProfile}
        handleSpotifyLogin={handleSpotifyLogin}
        handleYouTubeLogin={handleYouTubeLogin}
      />
      {spotifyProfile && youtubeProfile && (
        <ActionPage
          spotifyProfile={spotifyProfile}
          youtubeProfile={youtubeProfile}
          spotifyPlaylists={spotifyPlaylists}
        />
      )}
    </div>
  );
}
