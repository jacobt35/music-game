import React, { useState, useEffect } from 'react';
import Guess from './guessingPage'
import Button from 'react-bootstrap/Button'
import '../CSS/Game.css'

const track = {
    name: "",
    uri: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

function WebPlayback(props) {

const [player, setPlayer] = useState(undefined);
const [deviceID, setID] = useState('')
const [is_paused, setPaused] = useState(false);
const [is_active, setActive] = useState(false);
const [current_track, setTrack] = useState(track);
const [time, setTime] = useState(1000)
//const [restarting, setRestarting] = useState(false)

    // if one is null both are null
    //localStorage.clear()
    if (localStorage.getItem('playlist_correct') === null) {
       // // console.log('here in locallllll')
        localStorage.setItem('playlist_correct', JSON.stringify({}))
        localStorage.setItem('playlist_incorrect', JSON.stringify({}))
        localStorage.setItem('total_correct', 0)
    }

    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
    
        document.body.appendChild(script);
    
        window.onSpotifyWebPlaybackSDKReady = () => {
    
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });
    
            setPlayer(player);

            player.on('authentication_error', ({ message }) => {
                // lets get a new token
                props.newToken()
                window.location.reload()
                // console.error('Failed to authenticate', message);
              });

    
            player.addListener('ready', ({ device_id }) => {
                setID(device_id)
                // console.log('Ready with Device ID', device_id);
            });
    
            player.addListener('not_ready', ({ device_id }) => {
                // console.log('Device ID has gone offline', device_id);
            });
    
    
            player.connect();

            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
            
            
                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });
            
            }));
    
        };
    }, []);


    function guessTimer() {
        player.togglePlay();
        // automatically pause and go to the begining
        setTimeout(() => player.togglePlay(), time)
        // go back to beggining of the song
        player.seek(0)
    }

    function incTime() {
        // console.log('increasing time and time is ' + time)
        switch(time){
            case 1000: setTime(3000)
                    break;
            case 3000: setTime(7000)
                    break;
            case 7000: setTime(12000)
                    break;
            case 12000: setTime(17000)
                    break;
            case 17000: setTime(22000)
                    break;
            default: setTime(1000);
        }
    }

    

    // try to use web api to pause
    function restart() {
    player.nextTrack().then(res => {
        fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceID}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.token}`
         },
        }).then(res => {
            // console.log(res)
            setTime(1000)
            //setRestarting(true)
        })
          .catch(err =>  console.log(err))
        })
    }

    function playFull() {
        // console.log('here')
        player.togglePlay()
    }



   return (
    <>
    <Guess current_track={current_track} incTime={incTime} fullSong={playFull}/>
      <div class='playback'>
        <Button className='play' id='play-btn'variant='dark' size='med' onClick={() => guessTimer()}>
            Play
        </Button>{' '}

         <Button variant='dark' size='med' onClick={() => { restart() }} >
             Next Song
         </Button>{' '}
      </div>
 </>
 
)

   }
export default WebPlayback