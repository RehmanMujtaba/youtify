import axios from "axios";

let playlistData = null;
let __DEBUG__ = false;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { playlistName, songs } = req.body;

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

    const spotifyAccessToken = req.cookies.spotifyAccessToken;
    if (!spotifyAccessToken) {
      return res.status(401).json({ message: "Access token not found" });
    }

    try {
      // Get the current user's ID
      const meResponse = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
      });
      const userId = meResponse.data.id;

      // Create a new playlist
      const playlistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: `🧼${playlistData.playlistName}🧼`,
          description: "Created by Youtify",
          public: false,
        },
        {
          headers: {
            Authorization: `Bearer ${spotifyAccessToken}`,
            "Content-Type": "application/json",
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
            "https://api.spotify.com/v1/search",
            {
              params: {
                q: `${song.name} ${song.artist} clean edit`,
                type: "track",
              },
              headers: {
                Authorization: `Bearer ${spotifyAccessToken}`,
              },
            }
          );

          if (searchResponse.data.tracks.items.length == 0) continue;

          const cleanTrack = searchResponse.data.tracks.items.find(
            (item) => item.explicit === false
          );

          if (!__DEBUG__ && cleanTrack) {
            await axios.post(
              `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
              {
                uris: [cleanTrack.uri],
              },
              {
                headers: {
                  Authorization: `Bearer ${spotifyAccessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );
            
          } else {
            console.log("No track found for: ", song.name);
          }

          // Send progress update
          completed++;
          res.write(`data: ${completed}\n\n`);
          res.flush();
          console.log(completed)
        } catch (error) {
          console.error(
            `Failed to add song ${song.name} to the playlist. Error: ${error}\n`
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
      //   console.error("Error creating Spotify playlist:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
  }
}
