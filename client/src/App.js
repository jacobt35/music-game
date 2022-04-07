import React, { useState, useEffect} from 'react'
import WebPlayback from './components/game'
import Login from './components/Login'
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/App.css'

function App() {
  
  const [token, setToken] = useState('')
  const [refresh, setRefresh] = useState('')

  useEffect(() => {

    async function getToken() {
      const response = await fetch('/auth/token')
      const tokens = await response.json();
      //console.log(tokens)
      if(tokens.access_token === undefined) {
        setToken('')
        setRefresh('')
      } else {
        setToken(tokens.access_token)
        // refresh only set if it has not been
        if (refresh === '') {
          setRefresh(tokens.refresh_token)
        }
      }
    }

    getToken()
  }, [])

  async function newToken() {
    const response = await fetch('/auth/refresh', {method: 'POST'})
    const tokens = await response.json()
    if (tokens.access_token !== undefined) {
      setToken(tokens.access_token)
    }
  } 

   return (
    <>
        { (token === '') ? <Login/> : <WebPlayback token={token} newToken = {newToken}/> }
    </>
  );
}

export default App;