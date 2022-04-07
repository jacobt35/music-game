import React, {useEffect, useState} from 'react';


function Correct(props) {
    // page to show when user gets a correct answer
    useEffect(() => {
        let incorrectSongs = localStorage.getItem('playlist_incorrect')
        // back to a json object
        let songs = JSON.parse(incorrectSongs)
        let song = {
            artists: props.song.artists,
            title: props.song.name,
            attemtps: props.attempts
        }
        // use as key
        let numWrong = parseInt(localStorage.getItem('total_incorrect'))
        // numCorrect: song
        songs[numWrong] = song
        localStorage.setItem('playlist_correct', JSON.stringify(songs))
        localStorage.setItem('total_correct', (numWrong += 1).toString())
    }, [])


    return (
        <>
        <div>
           <h1>You got the song wrong</h1>
        </div>
        <div>
            <p>The song was <strong><em>{props.song.name}</em></strong> by <strong><em>{props.song.artists[0].name}</em></strong></p>
        </div>
        </>
    )

}

export default Correct