import { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { useRouter } from 'next/router';
import axios from 'axios'; 

export default function IndexPage() {
  const router = useRouter();
  const [spotifyProfile, setSpotifyProfile] = useState(null);
  const [youtubeProfile, setYoutubeProfile] = useState(null);

  useEffect(() => {
    // Fetch Spotify profile when component mounts
    async function fetchSpotifyProfile() {
      try {
        const response = await axios.get('/api/user/spotify-profile');
        setSpotifyProfile(response.data);
      } catch (error) {
        console.error('Error fetching Spotify profile:', error.message);
      }
    }
    fetchSpotifyProfile();

    // Fetch YouTube profile when component mounts
    async function fetchYoutubeProfile() {
      try {
        const response = await axios.get('/api/user/youtube-profile');
        setYoutubeProfile(response.data);
      } catch (error) {
        console.error('Error fetching YouTube profile:', error.message);
      }
    }
    fetchYoutubeProfile();
  }, []); // Run once when component mounts

  const handleSpotifyLogin = () => {
    router.push('/api/auth/spotify');
  };

  const handleYouTubeLogin = () => {
    router.push('/api/auth/youtube');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-8">Playlist Copy</h1>
      <div className="space-x-4 mb-8">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          onClick={handleSpotifyLogin}
        >
          Login with Spotify
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          onClick={handleYouTubeLogin}
        >
          Login with YouTube
        </button>
      </div>

      {spotifyProfile && (
        <div>
          <h2 className="text-xl font-semibold">Spotify Profile</h2>
          <p>Name: {spotifyProfile.display_name}</p>
          <p>Email: {spotifyProfile.email}</p>
          {/* Add more profile information as needed */}
        </div>
      )}

      {youtubeProfile && (
        <div>
          <h2 className="text-xl font-semibold">YouTube Profile</h2>
          <p>Name: {youtubeProfile.name}</p>
          <p>Email: {youtubeProfile.email}</p>
          {/* Add more profile information as needed */}
        </div>
      )}
    </div>
  );
}
