import axios from 'axios'
import pjson from '../../package.json'

const musicConfig = {
    'bg.mp3': { loop: true },
    'win.mp3': { loop: false },
    'lose.mp3': { loop: false },
    'click.wav': { loop: false },
}

class GameAudio {
    constructor() {
        this.active = true
        this.buffers = {}
        this.musics = {}
        this.clips = {}

        this.loadedNum = 0
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext
            this.ac = new window.AudioContext()
        } catch (e) {
            console.log('Error', 'Not Support Web Audio API')
        }
    }

    loadAll(callback) {
        const keys = Object.keys(musicConfig)
        keys.forEach(name => {
            this.loadMusic(name, () => {
                this.loadedNum++
                if (this.loadedNum === keys.length) {
                    console.log('load audio finish')
                    callback()
                }
            })
        })
    }

    loadMusic(name, success) {
        axios.get(`/static/music/${name}`, { responseType: 'arraybuffer', cache: false }).then(response => {
            this.ac.decodeAudioData(response.data,
                (buffer) => {
                    this.buffers[name] = buffer
                    if (success) success()
                },
                () => { console.log('Load Music Buff Error') }
            )
        }).catch( error => {
            console.log('Error', error)
        })
    }

    createSource(buffer) {
        const source = this.ac.createBufferSource()
        source.buffer = buffer
        const gainNode = this.ac.createGain()
        source.connect(gainNode)
        gainNode.connect(this.ac.destination)
        return { source, gainNode }
    }

    play(name) {
        if(!this.active) return
        const cfg = musicConfig[name]
        if (!cfg) return
        if (cfg.loop)
            this.playMusic(name)
        else
            this.playClip(name)
    }

    playMusic(name) {
        let music = this.musics[name]
        if (!music) {
            const buffer = this.buffers[name]
            if (!buffer) return
            music = this.createSource(buffer)
            this.musics[name] = music
            music.source.loop = true
            music.gainNode.gain.value = 0.5
            music.source.start()
        } else {
            music.gainNode.connect(this.ac.destination)
        }
    }

    playClip(name) {
        const buffer = this.buffers[name]
        if (!buffer) return
        const clip = this.createSource(buffer)
        this.clips[name] = clip
        clip.gainNode.gain.value = 0.8
        clip.source.start()
    }

    pause(name) {
        let music = this.musics[name]
        if (!music) return
        music.gainNode.disconnect()
    }
}

export default GameAudio