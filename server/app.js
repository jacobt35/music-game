const express = require('express');
const axios = require('axios');
const path = require('path')
require("dotenv").config({path: '../config.env'})


let port = process.env.PORT || 5000

//let redirect = "&redirect_uri=http://localhost:3000/auth/callback"
let redirect = "&redirect_uri=https://playlist-game.herokuapp.com/callback"
//let redirect = `&redirect_uri=playlistgame.netlify.app/auth/callbac`

let spotify_client_id = process.env.SPOTIFY_CLIENT_ID
let spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET
let access_token=''
let refresh_token=''


let app = express()

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/auth/login', (req, res) => {
    // stuff to add on to authorize url
    let url = "?client_id=" + spotify_client_id
    url += "&response_type=code"
    url += redirect
    url += "&show_dialog=true"
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private"

    res.redirect('https://accounts.spotify.com/authorize/' + url)
})

app.get('/auth/callback', (req, res) => {
    let code = req.query.code
    let body = "grant_type=authorization_code"
    body += "&code=" + code
    body += redirect
    body += "&client_id=" + spotify_client_id
    body += "&client_secret=" + spotify_client_secret;

    axios({
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        data: body,
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type' : 'application/x-www-form-urlencoded'
          },
    }).then(tokens => {
          access_token = tokens.data.access_token
          refresh_token = tokens.data.refresh_token
          res.redirect('/')
      })
      .catch(err => console.log(err))

})

app.get('/auth/token', (req, res) => {
  res.json(
    {
      access_token: access_token,
      refresh_token: refresh_token 
    }
  )
})

app.post('/auth/refresh', (req, res) => {
    console.log('here')
    let body = "grant_type=refresh_token"
    body += `&refresh_token=${refresh_token}`

    axios({
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        data: body,
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type' : 'application/x-www-form-urlencoded'
          },
    }).then(token => access_token=token.data.access_token)
      .catch(err => console.log(err))
  })

    // All remaining requests return the React app, so it can handle routing.
    app.get('/*', function(request, response) {
      response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
    });


app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
