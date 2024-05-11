import axios from "axios";

export default async function getPlaylist(req, res) {
  try {
    const { id } = req.query;
    const youtubeAccessToken = req.cookies.youtubeAccessToken;

    if (!youtubeAccessToken) {
      return res.status(401).json({ message: "Access token not found" });
    }

    let nextPageToken;
    let items = [];

    do {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems`,
        {
          params: {
            part: "snippet",
            playlistId: id,
            maxResults: 50,
            pageToken: nextPageToken,
          },
          headers: {
            Authorization: `Bearer ${youtubeAccessToken}`,
          },
        }
      );

      items = items.concat(response.data.items);
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    const titleResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlists?id=${id}`,
      {
        params: {
          part: "snippet",          
        },
        headers: {
          Authorization: `Bearer ${youtubeAccessToken}`,
        },
      }
    );

    const playlist = {
      id: id,
      name: titleResponse.data.items[0].snippet.title,
      description: titleResponse.data.items[0].snippet.description,
      image: items[0]?.snippet?.thumbnails?.default?.url || 'default-image-url',
      tracks: items.length > 0 ? items.map((item, index) => ({
        id: item.snippet.resourceId.videoId,
        name: item.snippet.title,
        artist: item.snippet.channelTitle,
        index: index,
      })) : [],
    };

    res.status(200).json(playlist);
  } catch (error) {
    console.error("Error fetching YouTube playlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}