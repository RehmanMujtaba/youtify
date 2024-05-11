import axios from "axios";

export default async function handler(req, res) {
  try {
    console.log("Fetching Spotify playlists...");
    const spotifyAccessToken = req.cookies.spotifyAccessToken;

    if (!spotifyAccessToken) {
      return res.status(401).json({ message: "Access token not found" });
    }

    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
      }
    );

    const spotifyPlaylists = response.data.items.map((playlist, index) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      image:
        playlist.images && playlist.images.length > 0
          ? playlist.images[0].url
          : null,
      total: playlist.tracks.total,
      index: index,
    }));

    res.status(200).json(spotifyPlaylists);
  } catch (error) {
    console.error("Error fetching Spotify playlists:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
