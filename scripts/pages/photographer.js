let maxLikes = 0;
let media = [];
let sortingOption = "popularity";
let mediaLiked = [];
let lightbox = null;

/**
 * Fonction pour récupérer les données d'un photographe à partir de son identifiant
 * @param {int} photographerId - L'identifiant du photographe
 * @returns {Promise} - Une promesse qui résout les données du photographe
 */
const fetchPhotographer = async (photographerId) => {
  return fetch("data/photographers.json")
    .then((res) => res.json())
    .then(({ photographers }) =>
      photographers.find((p) => p.id === photographerId)
    );
};

/**
 * Fonction pour récupérer les médias d'un photographe à partir de son identifiant
 * @param {int} photographerId - L'identifiant du photographe
 * @returns {Promise<Array>} - Une promesse qui résout avec une liste de médias
 */
const fetchMedia = async (photographerId) => {
  return fetch("data/photographers.json")
    .then((res) => res.json())
    .then(({ media }) =>
      media.filter((m) => m.photographerId === photographerId)
    );
};

/**
 * Fonction pour afficher les informations d'un photographe
 * @param {Object} photographer - Les données du photographe
 */
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

/**
 * Fonction pour afficher la galerie de médias
 * @param {Array} media - Une liste de médias à afficher
 */
const displayGallery = (media) => {
  console.log(lightbox);
  const gallery = document.querySelector("#gallery");
  gallery.innerHTML = "";
  lightbox.clearSlides();
  media.forEach((element, index) => {
    const mediaObj = new Media(element);
    const mediaDOM = mediaObj.getMediaDOM();
    mediaDOM.tabIndex = 0; // Ajout du tabindex pour rendre les médias focusables

    const mediaContainer = document.createElement("div");
    mediaContainer.classList.add("media-container");

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("info-container");

    const title = document.createElement("p");
    title.textContent = element.title;
    // Ajout du stopPropagation pour éviter l'ouverture du carrousel lors du clic sur le titre
    title.addEventListener("click", (event) => {
      event.stopPropagation(); // Empêche l'événement de se propager au conteneur de média
    });

    const likes = document.createElement("p");
    likes.classList.add("likes");
    likes.innerHTML = `${element.likes}`;
    // Ajout du stopPropagation pour éviter l'ouverture du carrousel lors du clic sur les likes
    likes.addEventListener("click", (event) => {
      event.stopPropagation(); // Empêche l'événement de se propager au conteneur de média
    });

    const heartMedia = document.createElement("i");
    heartMedia.classList.add("heart", "fa-heart");
    heartMedia.tabIndex = 0; // Ajout du tabindex pour rendre les cœurs focusables
    if (mediaLiked.includes(element.id)) {
      heartMedia.classList.add("heart-full", "fas");
    } else {
      heartMedia.classList.add("heart-empty", "far");
    }

    mediaContainer.addEventListener("click", () => {
      lightbox.open(index);
    });

    mediaDOM.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.stopPropagation();
        lightbox.open(index);
      }
    });

    heartMedia.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleLike(element, heartMedia, likes);
    });

    heartMedia.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.stopPropagation();
        toggleLike(element, heartMedia, likes);
      }
    });

    infoContainer.appendChild(title);
    infoContainer.appendChild(likes);
    infoContainer.appendChild(heartMedia);

    mediaContainer.appendChild(mediaDOM);
    mediaContainer.appendChild(infoContainer);

    gallery.appendChild(mediaContainer);
    lightbox.addSlide(element);
  });
};

/**
 * Fonction pour basculer le like d'un média
 * @param {Object} element - L'objet média
 * @param {HTMLElement} heartMedia - L'élément DOM du cœur
 * @param {HTMLElement} likes - L'élément DOM des likes
 */

const toggleLike = (element, heartMedia, likes) => {
  const isLiked = heartMedia.classList.contains("heart-full");

  // Mettre à jour le nombre de likes
  if (isLiked) {
    maxLikes -= 1;
    element.likes -= 1;
    mediaLiked = mediaLiked.filter((id) => id !== element.id);
  } else {
    maxLikes += 1;
    element.likes += 1;
    mediaLiked.push(element.id);
  }

  // Mettre à jour l'affichage
  likes.innerHTML = `${element.likes}`;
  displayTotalLikes(maxLikes);

  // Basculer la classe du cœur
  heartMedia.classList.toggle("heart-empty", isLiked);
  heartMedia.classList.toggle("heart-full", !isLiked);
  heartMedia.classList.toggle("far", isLiked);
  heartMedia.classList.toggle("fas", !isLiked);
};

/**
 * Fonction pour afficher le nombre total de likes
 * @param {number} totalLikes - Le nombre total de likes
 */
const displayTotalLikes = (totalLikes) => {
  const totalLikesElement = document.getElementById("totalLikes");
  totalLikesElement.textContent = `${totalLikes}`;
};

/**
 * Fonction pour calculer le nombre total de likes
 * @param {Array} media - Une liste de médias
 * @returns {number} - Le nombre total de likes
 */
const totalLikes = (media) => {
  let total = 0;
  media.forEach((element) => {
    total += element.likes;
  });
  return total;
};

/**
 * Fonction pour afficher la fenêtre d'informations
 * @param {number} totalLikes - Le nombre total de likes
 * @param {number} pricePerDay - Le prix par jour
 */
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

/**
 *Fonction pour afficher la modal
 */
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

  // Ajouter un écouteur d'événements pour fermer la modal lorsque la touche Échap est pressée
  document.addEventListener("keydown", closeModalOnEscape);

  // Ajouter un écouteur d'événements pour gérer la navigation cyclique
  modal.addEventListener("keydown", trapFocus);

  // Mettre le focus sur le champ "Prénom"
  document.getElementById("first_name").focus();

  // Ajouter un gestionnaire d'événements pour la touche "Entrée" sur la croix de fermeture
  const closeButton = document.querySelector(
    '.header-form img[onclick="closeModal()"]'
  );
  closeButton.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      closeModal();
    }
  });
}

/**
 *Fonction pour fermer la modal
 */
function closeModal() {
  modal.style.display = "none";
  // Retirer l'écouteur d'événements pour la touche Échap
  document.removeEventListener("keydown", closeModalOnEscape);

  // Retirer l'écouteur d'événements pour la navigation cyclique
  modal.removeEventListener("keydown", trapFocus);
}

/**
 * Fonction pour fermer la modal avec la touche Échap
 * @param {KeyboardEvent} event - L'événement clavier
 */
function closeModalOnEscape(event) {
  if (event.key === "Escape") {
    closeModal();
  }
}

/**
 * Fonction pour gérer la navigation cyclique dans la modal
 * @param {KeyboardEvent} event - L'événement clavier
 */

function trapFocus(event) {
  const focusableElements = modal.querySelectorAll(
    "input, textarea, button, img[onclick]"
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.key === "Tab") {
    if (event.shiftKey) {
      // Touche Maj+Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Touche Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
}

// Ajoutez un écouteur d'événements sur le bouton "Contactez-moi"
contactButton.addEventListener("click", displayModal);

// Écouteur d'événements pour le menu déroulant, triant et mettant à jour
// la galerie en fonction du critère sélectionné (popularité, titre, date).
document.getElementById("sorting").addEventListener("change", function () {
  sortMedia(this.value);
});

const sortMedia = (value) => {
  if (value === "popularity") {
    media.sort((a, b) => b.likes - a.likes);
    sortingOption = "popularity";
  } else if (value === "title") {
    media.sort((a, b) => a.title.localeCompare(b.title));
    sortingOption = "title";
  } else if (value === "date") {
    media.sort((a, b) => new Date(b.date) - new Date(a.date));
    sortingOption = "date";
  }
  displayGallery(media);
  displayTotalLikes(totalLikes(media));
};

// Ajout de la fonctionnalité de focus et de redirection pour le logo
const homeLogo = document.getElementById("homeLogo");
homeLogo.tabIndex = 0;
homeLogo.setAttribute("role", "button");
homeLogo.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    window.location.href = "index.html";
  }
});

/**
 * Fonction pour initialiser les événements du formulaire de contact
 */
const initContactEvent = () => {
  const contactForm = document.querySelector("#contact-form");
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("First Name: ", e.target.first_name.value);
    console.log("Last Name: ", e.target.last_name.value);
    console.log("Email: ", e.target.email.value);
    console.log("Message: ", e.target.message.value);
  });
};

/**
 * Fonction pour initialiser la page : récupère les médias et les informations du photographe, puis affiche la galerie et les informations
 */

const init = async () => {
  let params = new URL(document.location.toString()).searchParams;
  let id = params.get("id");
  media = await fetchMedia(parseInt(id));
  lightbox = new Lightbox();
  sortMedia("popularity");
  const photographer = await fetchPhotographer(parseInt(id));
  displayPhotographerInfo(photographer);
  maxLikes = totalLikes(media);
  displayTotalLikes(maxLikes);
  displayInfoWindow(maxLikes, photographer.price);
  initContactEvent();
};

/**
 *Appelle la fonction d'initialisation
 */
init();
