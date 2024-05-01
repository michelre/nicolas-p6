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

const displayGallery = (media) => {
  const gallery = document.querySelector("#gallery");
  media.forEach((element) => {
    const mediaObj = new Media(element);
    const mediaDOM = mediaObj.getMediaDOM();

    const mediaContainer = document.createElement("div");
    mediaContainer.classList.add("media-container");

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("info-container");

    const title = document.createElement("p");
    title.textContent = element.title;

    const likes = document.createElement("p");
    likes.innerHTML = `${element.likes} <i class="heart heart-empty far fa-heart"></i><i class="heart heart-full fas fa-heart hide"></i> `;

    likes.querySelector(".heart").addEventListener("click", () => {
      const emptyHeartIcon = likes.querySelector(".heart-empty");
      const filledHeartIcon = likes.querySelector(".heart-full");
      const emptyHeartOpacity = window.getComputedStyle(emptyHeartIcon).opacity;

      if (parseFloat(emptyHeartOpacity) !== 0) {
        emptyHeartIcon.style.opacity = "0";
        filledHeartIcon.style.opacity = "1";
        likes.childNodes[0].textContent =
          parseInt(likes.childNodes[0].textContent) + 1;
        element.likes++;
      } else {
        emptyHeartIcon.style.opacity = "1";
        filledHeartIcon.style.opacity = "0";
        if (parseInt(likes.childNodes[0].textContent) > 0) {
          likes.childNodes[0].textContent =
            parseInt(likes.childNodes[0].textContent) - 1;
          element.likes--;
        }
      }

      displayTotalLikes(totalLikes(media));
    });

    infoContainer.appendChild(title);
    infoContainer.appendChild(likes);

    mediaContainer.appendChild(mediaDOM);
    mediaContainer.appendChild(infoContainer);

    gallery.appendChild(mediaContainer);
  });
};

const displayTotalLikes = (totalLikes) => {
  const totalLikesElement = document.getElementById("totalLikes");
  totalLikesElement.innerHTML = `${totalLikes}`;
};

const totalLikes = (media) => {
  let total = 0;

  media.forEach((element) => {
    total += element.likes;
  });

  return total;
};

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

function displayModal() {
  // Vérifier si le nom du photographe a déjà été ajouté à la modal
  if (!photographerNameAdded) {
    // Récupérer l'ID du photographe depuis l'URL ou une autre source
    let params = new URL(document.location.toString()).searchParams;
    let photographerId = params.get("id");

    // Appeler fetchPhotographer pour récupérer les données du photographe
    fetchPhotographer(parseInt(photographerId))
      .then((photographer) => {
        // Créer un élément h3 pour afficher le nom du photographe
        const photographerNameElement = document.createElement("h3");
        // Ajouter le nom du photographe à l'élément h3
        photographerNameElement.textContent = photographer.name;

        // Récupérer le div avec la classe 'test'
        const testDiv = document.querySelector(".info-form");
        // Ajouter l'élément h3 à ce div
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

const init = async () => {
  let params = new URL(document.location.toString()).searchParams;
  let id = params.get("id");
  const media = await fetchMedia(parseInt(id));
  const photographer = await fetchPhotographer(parseInt(id));
  const totalLikesValue = totalLikes(media);
  const pricePerDayValue = photographer.price;
  displayGallery(media);
  displayPhotographerInfo(photographer);
  displayTotalLikes(totalLikesValue);
  displayInfoWindow(totalLikesValue, pricePerDayValue);
};

init();
