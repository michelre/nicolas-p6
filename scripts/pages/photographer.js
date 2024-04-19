
const fetchPhotographer = async(photographerId) => {
    return fetch('data/photographers.json')
        .then((res) => res.json())
        .then(({photographers}) => photographers.find(p => p.id === photographerId));   
};


const fetchMedia = async (photographerId) => {
    return fetch('data/photographers.json')
        .then((res) => res.json())
        .then(({media}) => media.filter(m => m.photographerId === photographerId));
};


const displayGallery = (media) => {
    const gallery = document.querySelector('#gallery');
    media.forEach(element => {
        const media = new Media(element);
        gallery.appendChild(media.getMediaDOM());
    });
};



const displayPhotographerInfo = (photographer) => {
    const header = document.querySelector('.photograph-header');

    
    const name = document.createElement('h2');
    name.textContent = photographer.name;
    header.appendChild(name);

    const location = document.createElement('p');
    location.textContent = `${photographer.city}, ${photographer.country}`;
    header.appendChild(location);

  
    const tagline = document.createElement('p');
    tagline.textContent = photographer.tagline;
    header.appendChild(tagline);

    const img = document.createElement('img');
    img.src = `assets/photographers/${photographer.portrait}`;
    img.alt = photographer.name;
    header.appendChild(img);

   
    const comma = document.createElement('span');
    comma.textContent = ', ';
    location.appendChild(comma);
};

const init = async () => {
    let params = new URL(document.location.toString()).searchParams;
    let id = params.get("id");
    const media = await fetchMedia(parseInt(id));
    const photographer = await fetchPhotographer(parseInt(id));
    displayGallery(media); 
    displayPhotographerInfo(photographer); 
    console.log(media, photographer);
};


init();
