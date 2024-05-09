import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const youtubeAccessToken = req.cookies.youtubeAccessToken;
      const { playlistName, songs } = req.body;

      if (!youtubeAccessToken) {
        return res.status(401).json({ message: "Access token not found" });
      }

      // Create a new playlist
      const playlistResponse = await axios.post(
        "https://www.googleapis.com/youtube/v3/playlists?part=snippet%2Cstatus",
        {
          snippet: {
            title: playlistName,
            description: "Made by Youtify",
          },
          status: {
            privacyStatus: "private",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${youtubeAccessToken}`,
          },
        }
      );
      const playlistId = playlistResponse.data.id;

      // Iterate over each song and add them to the playlist
      for (const song of songs) {
        try {
          const searchResponse = await axios.get(
            "https://www.googleapis.com/youtube/v3/search",
            {
              params: {
                part: "snippet",
                maxResults: 1,
                q: `${song.name} by ${song.artist}`,
                type: "video",
              },
              headers: {
                Authorization: `Bearer ${youtubeAccessToken}`,
              },
            }
          );

          if (searchResponse.data.items.length > 0) {
            const videoId = searchResponse.data.items[0].id.videoId;

            await axios.post(
              "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",
              {
                snippet: {
                  playlistId: playlistId,
                  resourceId: {
                    kind: "youtube#video",
                    videoId: videoId,
                  },
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${youtubeAccessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );
          } else {
            console.log("No video found for: ", song.name);
          }
        } catch (error) {
          console.error(
            `Failed to add song ${song.name} to the playlist. Error: ${error}`
          );
          // Optionally continue to try to add the next songs
        }
      }

      // Optionally, send back some response to requester
      res
        .status(200)
        .json({ message: `Playlist created and populated successfully.` });
    } catch (error) {
      console.error("Error creating YouTube playlist:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // Existing code for GET request...
  }
}
