import React from 'react'
import ReactDOM from 'react-dom'
import MainScene from './mainScene'

class Entry extends React.Component {
    render() {
        return <MainScene />
    }
}

ReactDOM.render(<Entry />, document.getElementById('game'))