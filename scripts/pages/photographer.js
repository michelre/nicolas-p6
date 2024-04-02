const fetchPhotographer = async(photographerId) => {
    return fetch('../../data/photographers.json')
        .then((res) => res.json())
        .then(({photographers}) => photographers.find(p => p.id === photographerId))
}

const fetchMedia = async (photographerId) => {
    return fetch('../../data/photographers.json')
        .then((res) => res.json())
        .then(({media}) => media.filter(m => m.photographerId === photographerId))
}

const init = async () => {
    let params = new URL(document.location.toString()).searchParams;
    let id = params.get("id");
    const media = await fetchMedia(parseInt(id))
    const photographer = await fetchPhotographer(parseInt(id))
    console.log(media, photographer)
}

init()