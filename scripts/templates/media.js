class Media {

    constructor(mediaObject){
        if(mediaObject.image){
            this.media = new MediaImage(mediaObject)
        } else {
            this.media = new MediaVideo(mediaObject)
        }
    }

    getMediaDOM(){
        return  this.media.getMediaDOM()
    }

}

class MediaImage {

    constructor(media){
        this.media = media
    }

    getMediaDOM(){
        const image = document.createElement('img')
        image.setAttribute('src', `assets/media/${this.media.photographerId}/${this.media.image}`)

        return image
    }
}

class MediaVideo {

    constructor(media){
        this.media = media
    }

    getMediaDOM(){
        const video = document.createElement('video')
        const src = document.createElement('source')
        video.setAttribute('controls', '')
        src.setAttribute('src', `assets/media/${this.media.photographerId}/${this.media.video}`)
        video.appendChild(src)

        return video
    }
}