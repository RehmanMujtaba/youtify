// spotify.js
import axios from "axios";

export default async function getPlaylist(req, res) {
    try {
      const { id } = req.query;
      const spotifyAccessToken = req.cookies.spotifyAccessToken;
  
      if (!spotifyAccessToken) {
        return res.status(401).json({ message: "Access token not found" });
      }
  
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${id}`,
        {
          headers: {
            Authorization: `Bearer ${spotifyAccessToken}`,
          },
        }
      );
  
      const playlist = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        image: response.data.images && response.data.images.length > 0
          ? response.data.images[0].url
          : null,
        tracks: response.data.tracks.length > 0 ? response.data.tracks.items.map((item) => ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists[0].name,
        })) : [],
      };
      
      res.status(200).json(playlist);
    } catch (error) {
      console.error("Error fetching Spotify playlist:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }