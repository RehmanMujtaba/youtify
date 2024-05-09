import axios from "axios";

export default async function handler(req, res) {
  try {
    const youtubeAccessToken = req.cookies.youtubeAccessToken;

    if (!youtubeAccessToken) {
      return res.status(401).json({ message: "Access token not found" });
    }

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlists",
      {
        params: {
          part: "snippet, contentDetails",
          mine: true,
        },
        headers: {
          Authorization: `Bearer ${youtubeAccessToken}`,
        },
      }
    );

    console.log(response.data.items);

    const youtubePlaylists = response.data.items.map((playlist) => ({
      id: playlist.id,
      name: playlist.snippet.title,
      description: playlist.snippet.description,
      image: playlist.snippet.thumbnails.default.url,
      total: playlist.contentDetails.itemCount
    }));

    res.status(200).json(youtubePlaylists);
  } catch (error) {
    console.error("Error fetching YouTube playlists:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
