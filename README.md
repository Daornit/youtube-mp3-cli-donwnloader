# Youtube playlist mp3 аар татах.

Node.js ашиглан бичсэн апп. Зорилго playlist татахад нэг нэгээр нь биш шууд татах хялбарчлах. Туршсан үйлдлийн систем Ubuntu.

### Ажлуулах заавар

#### Урьдчилан суулгасан байх шаардлагатай программууд
**youtube-dl, ffmpeg** 2 ийг суулгасан байх шаардлагатай.

```console
sudo snap install youtube-dl
sudo snap install ffmpeg
```
#### Татах
```console
git clone https://github.com/Daornit/youtube-mp3-cli-donwnloader.git
cd youtube-mp3-cli-donwnloader
```
#### Ажлуулах
```console
npm install
node index.js
```

### Анхаарах зүйлс 
Программ нь 3 нь төрлийн аргаар mp3 форматаар youtube сайтаас татах болно. 
1. --playlist-id='Тухайн playlist ийн id'
2. --id='Тухайн бичлэгны id'
3. --url='YOUTUBE URL' хэрвээ playlist ийн url бол шууд playlist ийг татна хэрвээ ганц бичлэгнийх бол тухайн бичлэгийг л татна.
4. --output='path-to-donwload' татах замаа зааж өгч болно. ЖН: output='c:/users/USERNAME/Downloads'

1-3 доторх аль нэг праметерт утга оноогоогүй бол программ ажиллахгүй. 4 дээрх output дээр утга өгөөгүй бол тухайн ажлуулсан фолдертоо mp3 фолдер үүсгээд татаж эхлэнэ.