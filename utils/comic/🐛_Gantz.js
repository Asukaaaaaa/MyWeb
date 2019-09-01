const fs = require('fs')
const http = require('https')
const events = require('events')

const cheer = require('cheerio')

const _url = 'https://www.manhuadb.com'
const options = {
    headers: {
        //':authority': 'www.manhuadb.com',
        //':method': 'GET',
        //':path': '/manhua/138',
        //':scheme': 'https',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        'accept-language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en-US;q=0.7,en;q=0.6',
        'cookie': 'PHPSESSID=f408s7ijlnomiv7itftm6n3dg4; Hm_lvt_b09a6e73b4faec9edd5935dc45604b5b=1563900511; _ga=GA1.2.348943058.1563900511; _gid=GA1.2.2057888616.1563900511; Hm_lpvt_b09a6e73b4faec9edd5935dc45604b5b=1564163739',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3864.0 Safari/537.36',
    }
}

const emitter = new events.EventEmitter()

const grab = (url, type) => {
    return new Promise((resolve, reject) => {
        http.get(_url + url, options, res => {
            let data = ''
            type === 'img' && res.setEncoding('binary')
            res.on('data', chunk => data += chunk)
            res.on('end', () => {
                !type && (data = cheer.load(data))
                resolve(data)
            })
        })
    })
}

const getImg = (url, book, page) => {
    return grab(url, 'img').then(data => {
        fs.writeFile(`./gantz/${book}/${page}.jpg`, data, 'binary', e => e && console.log(e))
    })
}
/*
const images = []
for (let i = 1; i < 38; ++i)
    images.push([])*/

const images = JSON.parse(fs.readFileSync('🐛.json', 'utf-8'))
/*
grab('/manhua/138').then($ => {
    books = $('#comic-book-list > #58 > ol > li > a')
    emitter.emit('grab-book', books, 1)
})

emitter.on('grab-book', (books, finished) => {
    grab(books[finished].attribs.href).then($ => {
        const tasks = []
        $('body > div > div:nth-child(4) > nav > div > div > #page-selector > option').map((j, v) => tasks.push(grab(v.attribs.value).then($ => {
            images[finished][j] = $('#all > div > div.text-center > img').attr('src')
        })))
        Promise.all(tasks).then(v => {
            console.log(`grab book.${finished} over.`)
            fs.writeFile('🐛.json', JSON.stringify(images), e => console.log('grab-over', e))
            if (finished < 2)
                emitter.emit('grab-book', books, finished + 1)
            else
                emitter.emit('grab-over')
        })
    })
})

emitter.on('grab-over', () => {
    fs.writeFile('🐛.json', JSON.stringify(images), e => console.log('grab-over', e))
    emitter.emit('grab-img', 0)
})*/

emitter.on('grab-img', finished => {
    Promise.all(images[finished].map((v, i) => getImg(v, finished + 1, i + 1))).then(v => {
        console.log(`grab book.${finished} pages over.`)
        finished < 36 && emitter.emit('grab-img', finished + 1)
    })
})

emitter.emit('grab-img', 32)