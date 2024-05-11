let maxLikes = 0;
let media = []
let sortingOption = 'popularity'
let mediaLiked = []
let idx = 0;

// Fonction pour récupérer les données d'un photographe à partir de son identifiant
const fetchPhotographer = async (photographerId) => {
  return fetch("data/photographers.json")
    .then((res) => res.json())
    .then(({ photographers }) =>
      photographers.find((p) => p.id === photographerId)
    );
};

// Fonction pour récupérer les médias d'un photographe à partir de son identifiant
const fetchMedia = async (photographerId) => {
  return fetch("data/photographers.json")
    .then((res) => res.json())
    .then(({ media }) =>
      media.filter((m) => m.photographerId === photographerId)
    );
};

// Fonction pour afficher les informations d'un photographe
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

// Fonction pour afficher la galerie de médias
const displayGallery = (media) => {
  const gallery = document.querySelector("#gallery");
  gallery.innerHTML = ""; 
  media.forEach((element, index) => {
    const mediaObj = new Media(element);
    const mediaDOM = mediaObj.getMediaDOM();

    const mediaContainer = document.createElement("div");
    mediaContainer.classList.add("media-container");

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("info-container");

    const title = document.createElement("p");
    title.textContent = element.title;

    const likes = document.createElement("p");
    likes.classList.add('likes')
    likes.innerHTML = `${element.likes}`;

    const heartMedia = document.createElement('i')
    heartMedia.classList.add('heart', 'fa-heart')
    if(mediaLiked.includes(element.id)){
      heartMedia.classList.add("heart-full", "fas")  
    } else {
      heartMedia.classList.add("heart-empty", "far")
    }

    mediaContainer.addEventListener("click", () => {
       openLightbox(index)
    })
  

    heartMedia.addEventListener("click", () => {

      if(heartMedia.classList.contains('heart-empty')){
        maxLikes += 1
        element.likes += 1
        mediaLiked.push(element.id)      
      } else {
        maxLikes -= 1
        element.likes -= 1
        mediaLiked = mediaLiked.filter(id => id !== element.id)
      }

      likes.innerHTML = `${element.likes}`;
      displayTotalLikes(maxLikes)

      heartMedia.classList.toggle('heart-empty')
      heartMedia.classList.toggle('heart-full')
      heartMedia.classList.toggle('far')
      heartMedia.classList.toggle('fas')

      if(sortingOption == 'popularity') {
        sortMedia('popularity')
      }
    });

    infoContainer.appendChild(title);
    infoContainer.appendChild(likes);
    infoContainer.appendChild(heartMedia);

    mediaContainer.appendChild(mediaDOM);
    mediaContainer.appendChild(infoContainer);

    gallery.appendChild(mediaContainer);
    addSlide(element)
  });
};

// Fonction pour afficher le nombre total de likes
const displayTotalLikes = (totalLikes) => {
  const totalLikesElement = document.getElementById("totalLikes");
  totalLikesElement.textContent = `${totalLikes}`;
};

// Fonction pour calculer le nombre total de likes
const totalLikes = (media) => {
  let total = 0;
  media.forEach((element) => {
    total += element.likes;
  });
  return total;
};

// Fonction pour afficher la fenêtre d'informations
const displayInfoWindow = (totalLikes, pricePerDay) => {
  const infoWindow = document.getElementById("infoWindow");
  const totalLikesElement = document.getElementById("totalLikes");
  const pricePerDayElement = document.getElementById("pricePerDay");

  totalLikesElement.textContent = totalLikes;
  pricePerDayElement.textContent = `${pricePerDay}€ / jour`;

  infoWindow.style.display = "block";
};

const contactButton = document.querySelector(".contact_button");
const modal = document.getElementById("contact_modal");

// Variable pour suivre si le nom du photographe a déjà été ajouté à la modal
let photographerNameAdded = false;

// Fonction pour afficher la modal
function displayModal() {
  // Vérifier si le nom du photographe a déjà été ajouté à la modal
  if (!photographerNameAdded) {
    // Récupérer l'ID du photographe depuis l'URL ou une autre source
    let params = new URL(document.location.toString()).searchParams;
    let photographerId = params.get("id");

    // Appeler fetchPhotographer pour récupérer les données du photographe
    fetchPhotographer(parseInt(photographerId))
      .then((photographer) => {
        const photographerNameElement = document.createElement("h3");

        photographerNameElement.textContent = photographer.name;

        const testDiv = document.querySelector(".info-form");

        testDiv.appendChild(photographerNameElement);

        // Mettre à jour la variable pour indiquer que le nom du photographe a été ajouté
        photographerNameAdded = true;
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données du photographe :",
          error
        );
      });
  }

  // Afficher la modal
  modal.style.display = "block";
}

// Fonction pour fermer la modal
function closeModal() {
  modal.style.display = "none";
}

// Ajoutez un écouteur d'événements sur le bouton "Contactez-moi"
contactButton.addEventListener("click", displayModal);

// Écouteur d'événements pour le menu déroulant, triant et mettant à jour
// la galerie en fonction du critère sélectionné (popularité, titre, date).
document.getElementById("sorting").addEventListener("change", function () {
  
  sortMedia(this.value)
    
});

const sortMedia = (value) => {
  if (value === "popularity") {
    media.sort((a, b) => b.likes - a.likes);
    sortingOption = 'popularity'
  } else if (value === "title") {
    media.sort((a, b) => a.title.localeCompare(b.title));
    sortingOption = 'title'
  } else if (value === "date") {
    media.sort((a, b) => new Date(b.date) - new Date(a.date));
    sortingOption = 'date'
  }
  displayGallery(media);
  displayTotalLikes(totalLikes(media));
}

const openLightbox = (index) => {
  idx = index 
  const carousel = document.querySelector('.carousel')
  carousel.style.display = 'block'
  changeSlide()
}

const closeLightbox = () => {
  const carousel = document.querySelector('.carousel')
  const overlay = document.querySelector('.overlay')
  overlay.addEventListener('click', () => {
    carousel.style.display = 'none'
  })
}

const changeSlide = () => {
  const slider = document.querySelector('.slider')    
  const slide = document.querySelector('.slide');
  const slideWidth = slide.getBoundingClientRect().width
  slider.style.transform = `translateX(-${idx * slideWidth}px)`
}

const addSlide = (media) => {
  const slider = document.querySelector('.slider')
  const slide = document.createElement('li')
  slide.classList.add('slide')
  
  const title = document.createElement('p')
  title.innerHTML = media.title

  slide.appendChild(title)
  slider.appendChild(slide)
}

const lightboxEvents = () => {
  const btnPrev = document.querySelector('.btn.prev')
  const btnNext = document.querySelector('.btn.next')
  const slides = document.querySelectorAll('.slide')

  btnNext.addEventListener('click', () => {
    if(idx == slides.length - 1){
      idx = 0
    } else {
      idx += 1
    }    
    changeSlide()
  })

  btnPrev.addEventListener('click', () => {
    if(idx == 0){
      idx = slides.length - 1
    } else {
      idx -= 1
    }  
    changeSlide()
  })


}

// Initialisation : récupère les médias et les informations du photographe et affiche la galerie ainsi que les informations
const init = async () => {
  let params = new URL(document.location.toString()).searchParams;
  let id = params.get("id");
  media = await fetchMedia(parseInt(id));
  sortMedia('popularity')
  const photographer = await fetchPhotographer(parseInt(id));
  displayGallery(media);
  displayPhotographerInfo(photographer);
  maxLikes = totalLikes(media)
  displayTotalLikes(maxLikes);

  displayInfoWindow(maxLikes, photographer.price);
  lightboxEvents()
  closeLightbox()
};

// Appelle la fonction d'initialisation
init();