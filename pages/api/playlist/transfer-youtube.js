import axios from "axios";

let playlistData = null;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const youtubeAccessToken = req.cookies.youtubeAccessToken;
      const { playlistName, songs } = req.body;
      if (!youtubeAccessToken) {
        return res.status(401).json({ message: "Access token not found" });
      }

      // Store the playlist data in memory
      playlistData = { playlistName, songs };

      res.status(200).json({ message: "Playlist data received" });
    } catch (error) {
      console.error("Error receiving playlist data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "GET") {
    if (!playlistData) {
      return res.status(400).json({ message: "No playlist data" });
    }

    const youtubeAccessToken = req.cookies.youtubeAccessToken;
    if (!youtubeAccessToken) {
      return res.status(401).json({ message: "Access token not found" });
    }

    try {
      // Create a new playlist
      const playlistResponse = await axios.post(
        "https://www.googleapis.com/youtube/v3/playlists?part=snippet%2Cstatus",
        {
          snippet: {
            title: playlistData.playlistName,
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

      // Set up Server-Sent Events
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      let completed = 0;

      // Iterate over each song and add them to the playlist
      for (const song of playlistData.songs) {
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

          // Send progress update
          completed++;
          res.write(`data: ${completed}\n\n`);
        } catch (error) {
          console.error(
            `Failed to add song ${song.name} to the playlist. Error: ${error}`
          );
        }
      }

      // TODO send list of failed songs back to client

      // Send final event
      res.write(
        "event: done\ndata: Playlist created and populated successfully.\n\n"
      );
      res.end();
    } catch (error) {
      console.error("Error creating YouTube playlist:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // Existing code for GET request...
  }
}
