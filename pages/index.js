import "tailwindcss/tailwind.css";

import { useState, useEffect, use } from "react";
import axios from "axios";

import HomePage from "components/home";
import ActionPage from "components/actionpage";
import PlaylistSelector from "components/playlistselector";

export default function IndexPage() {
  const [spotifyProfile, setSpotifyProfile] = useState(null);
  const [youtubeProfile, setYoutubeProfile] = useState(null);

  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);
  const [youtubePlaylists, setYoutubePlaylists] = useState([]);

  const [isSpotifyLoggedIn, setIsSpotifyLoggedIn] = useState(false);
  const [isYouTubeLoggedIn, setIsYouTubeLoggedIn] = useState(false);

  useEffect(() => {
    async function checkSpotify() {
      try {
        const response = await fetch("/api/auth/isLoggedIn?service=spotify");
        if (response.status === 200) {
          setIsSpotifyLoggedIn(false);
          setIsSpotifyLoggedIn(true);
        } else {
          setIsSpotifyLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking Spotify login status:", error);
      }
    }

    async function checkYouTube() {
      try {
        const response = await fetch("/api/auth/isLoggedIn?service=youtube");
        if (response.status === 200) {
          setIsYouTubeLoggedIn(true);
        } else {
          setIsYouTubeLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking YouTube login status:", error);
      }
    }

    checkSpotify();
    checkYouTube();
  }, []);

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
  }, [isSpotifyLoggedIn]);

  useEffect(() => {
    async function fetchYoutubeProfile() {
      try {
        const response = await axios.get("/api/user/youtube-profile");
        setYoutubeProfile(response.data);
      } catch (error) {
        console.error("Error fetching YouTube profile:", error.message);
      }
    }
    fetchYoutubeProfile();

    async function fetchYoutubePlaylists() {
      try {
        const response = await axios.get("/api/playlist/youtube");
        setYoutubePlaylists(response.data);
      } catch (error) {
        console.error("Error fetching YouTube playlists:", error);
      }
    }
    fetchYoutubePlaylists();
  }, [isYouTubeLoggedIn]);

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
        window.addEventListener(
          "message",
          function (event) {
            if (event.origin !== window.location.origin) return;
            if (event.data === "spotify_auth_success") {
              resolve("success");
            }
          },
          false
        );
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
        window.addEventListener(
          "message",
          function (event) {
            if (event.origin !== window.location.origin) return;
            if (event.data === "youtube_auth_success") {
              resolve("success");
            }
          },
          false
        );
      }
    });
  };

  const handleSelectPlaylist = (playlistId) => {
    setSelectedPlaylist(playlistId);
  };

  return (
    <div className="min-h-screen min-w-screen bg-slate-800">
      <HomePage
        key={spotifyProfile + youtubeProfile}
        spotifyProfile={spotifyProfile}
        youtubeProfile={youtubeProfile}
        handleSpotifyLogin={handleSpotifyLogin}
        handleYouTubeLogin={handleYouTubeLogin}
        isSpotifyLoggedIn={isSpotifyLoggedIn}
        isYouTubeLoggedIn={isYouTubeLoggedIn}
        setIsSpotifyLoggedIn={setIsSpotifyLoggedIn}
        setIsYouTubeLoggedIn={setIsYouTubeLoggedIn}
      />
      {spotifyProfile && youtubeProfile && (
        <PlaylistSelector
          spotifyPlaylists={spotifyPlaylists}
          youtubePlaylists={youtubePlaylists}
        />
      )}
    </div>
  );
}
