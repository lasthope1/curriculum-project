import React from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function ErrorPage() {
  return (
    <div style={{width: '100%', height: '300px', position: 'relative'}}>
        <div style={styledDiv}>Sorry, your major is out of scope.</div>
        <div style={styledDiv2}>Please, contact to admin</div>
        <div style={styledIcon}>
            <ErrorOutlineIcon fontSize='inherit' color='inherit'/>
        </div>
    </div>
  )
}

export default ErrorPage

const styledDiv : object = {
    display: 'inline',
    position: 'absolute',
    top: '20%',
    left: '39.5%',
    color: '#EB4B4E',
    width: '500px',
    height: '50px',
    fontSize: '30px',
}

const styledDiv2 : object = {
    display: 'inline',
    position: 'absolute',
    top: '40%',
    left: '39.7%',
    color: '#000',
    width: '500px',
    height: '50px',
    fontSize: '20px',
}

const styledIcon : object = {
    display: 'inline',
    position: 'absolute',
    fontSize: '85px',
    top: '12%',
    left: '33%',
    color: '#ED5559'
}