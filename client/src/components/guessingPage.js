import React, {useState, useEffect} from 'react'
import Correct from './correct'
import Incorrect from './incorrect'
import '../CSS/Guessing.css'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'


const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}
function GuessingPage(props) {
    const [song, setSong] = useState(track)
    const [attempt, setAttempt] = useState(1)
    const [correct, setCorrect] = useState(false)
    const [over, setOver] = useState(false)
    const [oneTry,setOneTry] = useState(false)

    useEffect(() => {

        function getSong() {
            // when app loads
            if(song.name === "") {
                setSong(props.current_track)
            }
            // so nothing happens when correct changes
            if(props.current_track.name !== song.name) {
                setCorrect(false)
                setOver(false)
                setAttempt(1)
                setOneTry(false)
                setSong(props.current_track)
            }
        }
        getSong()
    }, [props.current_track])


    function checkAnswer() {
        let answer = document.getElementById('guess').value
        let attemptRow = document.getElementById(`guess${attempt.toString()}`)
        if (answer === '') {
                attemptRow.innerText = 'Skipped'
                setAttempt(attempt + 1)
        } else {
            attemptRow.innerText = answer
        }
        
        if (song.name.toLowerCase().includes(answer.toLowerCase()) && answer !== '') {
            if(attempt === 1) {
                //console.log('here 1 time')
                setOneTry(true)
            }
            setCorrect(true)
        } else {
            // song over
            if (attempt === 6) {
                setOver(true)
            }
            // wrong guess increase
            setAttempt(attempt + 1)
            props.incTime()
        }
    }

    function keyPressed(event) {
        if (event.key === 'Enter') {
            checkAnswer()
        }
    }

    return (
    over ?  <Incorrect song={song}/> :
    correct ? <Correct oneTry={oneTry} attempts={attempt} song={song} fullSong={props.fullSong}/> :
        <>
        <div className='guessTable'>
        <Table striped bordered hover variant="dark" size='sm'>
            <thead><tr><th>Guess the Song!</th></tr></thead>
            <tbody>
                <tr>
                <td id='guess1'>Guess 1</td>
                </tr>
                <tr>
                <td id='guess2'>Guess 2</td>
                </tr>
                <tr>
                <td id='guess3'>Guess 3</td>
                </tr>
                <tr>
                <td id='guess4'>Guess 4</td>
                </tr>
                <tr>
                <td id='guess5'>Guess 5</td>
                </tr>
                <tr>
                <td id='guess6'>Guess 6</td>
                </tr>
            </tbody>
        </Table>
        </div>
        <div className='answer'>
        <InputGroup className="mb-3" onKeyDown={keyPressed} size='med'>
            <Form.Control
              placeholder="Your guess!"
              aria-label="Your guess!"
              aria-describedby="basic-addon2"
              id='guess'
            />
            <Button id='answer' size='med' variant='dark' onClick={() => checkAnswer()}>Guess!</Button><br />
        </InputGroup>
        </div>
        </>
    )
}

export default GuessingPage