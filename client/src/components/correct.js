import React, {useEffect, useState} from 'react';
import '../CSS/Correct.css'


function Correct(props) {
    // page to show when user gets a correct answer
    useEffect(() => {
        let correctSongs = localStorage.getItem('playlist_correct')
        // back to a json object
        let songs = JSON.parse(correctSongs)
        let song = {
            artists: props.song.artists,
            title: props.song.name,
            attemtps: props.attempts
        }
        // use as key
        let numCorrect = parseInt(localStorage.getItem('total_correct'))
        // numCorrect: song
        songs[numCorrect] = song
        localStorage.setItem('playlist_correct', JSON.stringify(songs))
        localStorage.setItem('total_correct', (numCorrect += 1).toString())
    }, [])


    //document.getElementById('play-btn').addEventListener('click', props.fullSong)

    return (
        
        props.oneTry ? 
        <div>
            <p>Congrats you correctly guessed <strong><em>{props.song.name}</em></strong> by <strong><em>{props.song.artists[0].name}</em></strong> in 1 guess!!!!</p>
        </div> :
       <div><p>Congrats you correctly guessed <strong><em>{props.song.name}</em></strong> by <strong><em>{props.song.artists[0].name}</em></strong> in {props.attempts} guesses!!!!</p></div>
       
    )

}

export default Correct