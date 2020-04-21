const fs = require('fs');
const ytpl = require('ytpl');
const parse = require('url-parse');
const {getPlaylistId} = require('ytpl/lib/util');
const youtubedl = require('youtube-dl');
const argv = require('yargs').argv;

const PLAYLIST_REGEX = /^(PL|UU|LL|RD)[a-zA-Z0-9-_]{16,41}$/;

async function donwloadAsync(url, download_path = __dirname + '/mp3down/') {
    return new Promise((resolve, reject) => {
        youtubedl.exec(url, ['-x', '--audio-format', 'mp3', '-o', download_path + '%(title)s.%(ext)s'], {}, function(err, output) {
            if (err) {
                console.warn(err);
            }
            resolve(output? output.join('\n') : err);
        });
    });
}

async function donwloadMp3(items, path) {

    for await (let item of items){
        let check = await fs.existsSync(path + item.title + '.mp3');
        if(!check) {
            let success = await donwloadAsync(item.url_simple, path)
            success ? console.log(item.title + " successfully downloaded!"): console.log(item.title + " failed to download!")
        } else {
            console.log(item.title + " is already exists!")
        }
    }

    console.log("All the playlist donwloaded");
}

async function playlistDownload(ID, BASE_URL = __dirname + '/mp3down/') {

    let playlist = await ytpl(ID);

    let PLAYLIST_DOWNLOAD_PATH = BASE_URL + playlist.title + '/';
    fs.exists(PLAYLIST_DOWNLOAD_PATH, (result) => {
        if(result) { 
            donwloadMp3(playlist.items, PLAYLIST_DOWNLOAD_PATH);
            console.log("Already exist that playlist :: ", result);
            return;
        }
        fs.mkdir(PLAYLIST_DOWNLOAD_PATH, (result, err) => {
            if(err) {
                console.log("err :: ", err)
                return;
            };
            donwloadMp3(playlist.items, PLAYLIST_DOWNLOAD_PATH);
        });
    })
}

function downloadSingleVideo(id, output){
    console.log("Downloading ...")
    donwloadAsync('https://www.youtube.com/watch?v=' + id, output)
    .then((result, err) => {
        if(result) console.log("Successfully downloaded");
        else console.log("Failed to download")
    });
}
if(argv['h']){
    console.log('Usage: node index --playlist=ID --output="pat-to-download"')
    console.log('--playlist-id, --id or --url one of them must be provided');
    process.exit();
}

if(!(argv['id'] || argv['playlist-id'] || argv['url'])){
    console.log('Can`t run this program because lack of argument.')
    console.log('You can type -h.')
    process.exit();
}

if(argv.output && argv.output[argv.output.length-1] != '/'){
    argv.output = argv.output + '/';
}

if(argv['playlist-id']){
    
    if(PLAYLIST_REGEX.test(argv['playlist-id'])) playlistDownload(argv['playlist-id'], argv['output'])
    else console.log("--playlist-id argument is invalid!");

} else if(argv['url']){
    let url = parse(argv['url'], true);
    if(url.hostname === 'www.youtube.com'){
        getPlaylistId(argv['url'])
            .then(playlistId => playlistDownload(playlistId, argv['output']))
            .catch(err => {
                if(!url.query.v){
                    console.log("Your inputed URL is invalid!")
                }else{
                    downloadSingleVideo(url.query.v, argv['output'])
                }
            })
    }
} else {
    downloadSingleVideo(argv['id'], argv['output'])
}

