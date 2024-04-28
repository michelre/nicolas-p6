const fetchPhotographer = async (photographerId) => {
  return fetch("data/photographers.json")
    .then((res) => res.json())
    .then(({ photographers }) =>
      photographers.find((p) => p.id === photographerId)
    );
};

const fetchMedia = async (photographerId) => {
  return fetch("data/photographers.json")
    .then((res) => res.json())
    .then(({ media }) =>
      media.filter((m) => m.photographerId === photographerId)
    );
};

const displayGallery = (media) => {
    const gallery = document.querySelector("#gallery");
    media.forEach((element) => {
      const mediaObj = new Media(element);
      const mediaDOM = mediaObj.getMediaDOM();
  
      
      const title = document.createElement("p");
      title.textContent = element.title;
  
      
      const likes = document.createElement("p");
      likes.textContent = `${element.likes} likes`;
  
      
      mediaDOM.appendChild(title);
      mediaDOM.appendChild(likes);
      gallery.appendChild(mediaDOM);
    });
  };

const displayPhotographerInfo = (photographer) => {
  const header = document.querySelector(".photograph-header");
  const namePhotographer = document.querySelector("#namePhotographer");
  

  const name = document.createElement("h2");
  name.textContent = photographer.name;
  namePhotographer.appendChild(name);
  
  
  const location = document.createElement("h3");
  location.textContent = `${photographer.city}, ${photographer.country}`;
  namePhotographer.appendChild(location);

  const tagline = document.createElement("p");
  tagline.textContent = photographer.tagline;
  namePhotographer.appendChild(tagline);
  

  const img = document.createElement("img");
  img.src = `assets/photographers/${photographer.portrait}`;
  img.alt = photographer.name;
  header.appendChild(img);
  
};

const displayTotalLikes = (totalLikes) => {
  console.log(totalLikes);
  // HTML de la barre du bas
};

const totalLikes = (media) => {
  return media.reduce((acc, m) => m.likes + acc, 0);
};

const init = async () => {
  let params = new URL(document.location.toString()).searchParams;
  let id = params.get("id");
  const media = await fetchMedia(parseInt(id));
  const photographer = await fetchPhotographer(parseInt(id));
  displayGallery(media);
  displayPhotographerInfo(photographer);
  displayTotalLikes(totalLikes(media));
  console.log(media, photographer);
};

init();
