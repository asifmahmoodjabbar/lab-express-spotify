require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const { Router } = require("express");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const artist = req.query.artist;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      console.log(data.body);
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.id, { limit: 10, offset: 20 })
    .then((artistAlbums) => {
      res.render("albums", { albums: artistAlbums.body.items });
    })
    .catch((err) => console.log("The error while searching albums: ", err));
});

app.get("/tracks/:id", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.id, { limit: 5, offset: 1 })
    .then((albumsTracks) => {
      console.log("getting albums tracks ", albumsTracks.body.items);
      res.render("tracks", { tracks: albumsTracks.body.items });
    })
    .catch((err) => console.log("The error while searching tracks: ", err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
