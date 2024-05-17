class Media {

    constructor(mediaObject, options){
        if(mediaObject.image){
            this.media = new MediaImage(mediaObject, options)
        } else {
            this.media = new MediaVideo(mediaObject, options)
        }
    }

    getMediaDOM(){
        return  this.media.getMediaDOM()
    }

}

class MediaImage {

    constructor(media, options){
        this.media = media
        this.options = options
    }

    getMediaDOM(){
        const image = document.createElement('img')
        image.setAttribute('src', `assets/media/${this.media.photographerId}/${this.media.image}`)

        return image
    }
}

class MediaVideo {

    constructor(media, options){
        this.media = media
        this.options = options
    }

    getMediaDOM(){
        const video = document.createElement('video')
        const src = document.createElement('source')
        if(this.options && this.options.controls){
            video.setAttribute('controls', '')
        }
        src.setAttribute('src', `assets/media/${this.media.photographerId}/${this.media.video}`)
        video.appendChild(src)

        return video
    }
}