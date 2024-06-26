import axios from "axios";

let playlistData = null;

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
      const meResponse = await axios
        .get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${spotifyAccessToken}`,
          },
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
        });
      const userId = meResponse.data.id;

      // Create a new playlist
      const playlistResponse = await axios
        .post(
          `https://api.spotify.com/v1/users/${userId}/playlists`,
          {
            name: `${playlistData.playlistName}`,
            description: "Created by Youtify",
            public: false,
          },
          {
            headers: {
              Authorization: `Bearer ${spotifyAccessToken}`,
              "Content-Type": "application/json",
            },
          }
        )
        .catch(function (error) {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
        });
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
                q: `${song.name.replace('video', '')} ${song.artist.replace('VEVO', '')}`,                type: "track",
                limit: 1,
              },
              headers: {
                Authorization: `Bearer ${spotifyAccessToken}`,
              },
            }
          );

          if (searchResponse.data.tracks.items.length > 0) {
            const trackUri = searchResponse.data.tracks.items[0].uri;

            await axios.post(
              `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
              {
                uris: [trackUri],
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
      //   console.error("Error creating Spotify playlist:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // Existing code for GET request...
  }
}
