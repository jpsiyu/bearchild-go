const setCookie = (name, value, exdays=365) => {
    const d = new Date()
    d.setTime(d.getTime() + exdays * 24 * 3600 * 1000)
    const expires = `expires=${d.toUTCString()}`
    document.cookie = `${name}=${value};${expires};path=/`
}

const getCookie = (cname) => {
    const name = `${cname}=`
    const ca = document.cookie.split(';')
    let c
    for(let i = 0; i < ca.length; i++){
        c = ca[i]
        while(c.charAt(0) == ' '){
            c = c.substring(1)
        }
        if(c.indexOf(name) == 0){
            return c.substring(name.length, c.length)
        }
    }
    return ''
}

export default {setCookie, getCookie}