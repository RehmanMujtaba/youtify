import axios from 'axios';

export default async function handler(req, res) {
  const { service } = req.query;

  try {
    if (service == "spotify") {
      const spotifyAccessToken = req.cookies.spotifyAccessToken;
      if (!spotifyAccessToken) {
        return res.status(401).json({ message: "Access token not found" });
      }

      try {
        await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${spotifyAccessToken}`,
          },
        });
      } catch (error) {
        return res.status(401).json({ message: "Access token is invalid or expired" });
      }
    }

    if (service == "youtube") {
      const youtubeAccessToken = req.cookies.youtubeAccessToken;
      if (!youtubeAccessToken) {
        return res.status(401).json({ message: "Access token not found" });
      }

      try {
        await axios.get('https://www.googleapis.com/youtube/v3/channels?part=id&mine=true', {
          headers: {
            Authorization: `Bearer ${youtubeAccessToken}`,
          },
        });
      } catch (error) {
        return res.status(401).json({ message: "Access token is invalid or expired" });
      }
    }

    res.status(200).json({ message: "Logged in" });
  } catch (error) {
    console.error("Error checking login status:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}