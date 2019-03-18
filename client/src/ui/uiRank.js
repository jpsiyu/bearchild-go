import React from 'react'
import macro from '../macro'
import axios from 'axios'

class UIRank extends React.Component {
    constructor() {
        super()
        this.onBtnBackClick = this.onBtnBackClick.bind(this)
        this.state = {
            fetchList: []
        }
    }

    liList() {
        const l = []
        const header = <li key='header'>
            <div className='liStar'><p>{'STAR'}</p></div>
            <p className='liUid'>{'UID'}</p>
            <p className='liScore'>{'SCORE'}</p>
            <p className='liLv'>{'LV'}</p>
        </li>
        l.push(header)

        let li
        let element
        for (let i = 0; i < this.state.fetchList.length; i++) {
            element = this.state.fetchList[i]
            li = <li key={i}>
                <div className='liStar'><p>{this.getStar(i)}</p></div>
                <p className='liUid'>{element.uid}</p>
                <p className='liScore'>{element.score}</p>
                <p className='liLv'>{element.lv}</p>
            </li>
            l.push(li)
        }
        return l
    }

    getStar(n) {
        switch (n) {
            case 0: return '✩✩✩'
            case 1: return '✩✩'
            case 2: return '✩'
            default: return n + 1
        }
    }

    onBtnBackClick() {
        window.g.uiMgr.hide(macro.UIRank)
    }

    componentDidMount() {
        axios.get('/rank/').then(response => {
            this.setState({
                fetchList: response.data
            })
        })
    }

    render() {
        return <div className='UIRank uiFull'>
            <div className='top'>
                <button onClick={this.onBtnBackClick} onTouchEnd={this.onBtnBackClick}>{'⏎'}</button>
            </div>
            <div className='title'>
                <h2>Ranking</h2>
            </div>
            <div className='rankList'>
                <ul>
                    {this.liList()}
                </ul>
            </div>
        </div>
    }
}

export default UIRank