const fs = require('fs');
const ytpl = require('ytpl');
const youtubedl = require('youtube-dl');
const argv = require('yargs').argv;


async function donwloadMp3(items, path) {
    console.log(path);

    for await (let item of items){
        let check = await fs.existsSync(path + item.title + '.mp3');
        console.log("check:: ", check);
        if(!check) {
            let success = await donwloadAsync(item.url_simple, path)
            success ? console.log(item.title + " successfully downloaded!"): console.log(item.title + " failed to download!")
        } else {
            console.log(item.title + " is already exists!")
        }
    }

    console.log("All the playlist donwloaded");
}

async function donwloadAsync(url, download_path = '/home/daornit2/projects/youtube-downloader/mp3down/') {
    return new Promise((resolve, reject) => {
        youtubedl.exec(url, ['-x', '--audio-format', 'mp3', '-o', download_path + '%(title)s.%(ext)s'], {}, function(err, output) {
            if (err) {
                console.warn(err);
            }
            resolve(output? output.join('\n') : err);
        });
    });
}

async function playlistDownload(ID, BASE_URL = '/home/daornit2/projects/youtube-downloader/mp3down/') {

    let playlist = await ytpl(ID);
    console.log("playlist:: ", playlist)

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

if(argv['h']){
    console.log('Usage: node index --playlist=ID --output="pat-to-download"')
    console.log('--playlist-id or --id one of them must be provided');
    process.exit();
}

if(!(argv['id'] || argv['playlist-id'])){
    console.log('Can`t run this program because lack of argument.')
    console.log('You can type -h.')
    process.exit();
}

if(argv.output && argv.output[argv.output.length-1] != '/'){
    argv.output = argv.output + '/';
    console.log(argv.output);
}

if(argv['playlist-id']){
    playlistDownload(argv['playlist-id'], argv['output'])
} else {
    console.log("Downloading ...")
    donwloadAsync('https://www.youtube.com/watch?v=' + argv['id'], argv['output'])
    .then((result, err) => {
        if(result) console.log("Successfully downloaded");
        else console.log("Failed to download")
    });
}