const fetchPhotographer = async(photographerId) => {
    return fetch('data/photographers.json')
        .then((res) => res.json())
        .then(({photographers}) => photographers.find(p => p.id === photographerId))
}

const fetchMedia = async (photographerId) => {
    return fetch('data/photographers.json')
        .then((res) => res.json())
        .then(({media}) => media.filter(m => m.photographerId === photographerId))
}

const displayGallery = (media) => {
    const gallery = document.querySelector('#gallery')
    media.forEach(element => {
        const media = new Media(element)
        gallery.appendChild(media.getMediaDOM())
    });
}

const init = async () => {
    let params = new URL(document.location.toString()).searchParams;
    let id = params.get("id");
    const media = await fetchMedia(parseInt(id))
    const photographer = await fetchPhotographer(parseInt(id))
    displayGallery(media)
    //console.log(media, photographer)
}

init()