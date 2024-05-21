async function getPhotographers() {
  return fetch("data/photographers.json").then((res) => res.json());
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();

    const locationParagraph = document.createElement("h4");
    locationParagraph.textContent = `${photographer.city}, ${photographer.country}`;
    userCardDOM.appendChild(locationParagraph);

    const taglineParagraph = document.createElement("p");
    taglineParagraph.textContent = photographer.tagline;
    taglineParagraph.classList.add("p1");
    userCardDOM.appendChild(taglineParagraph);

    const priceParagraph = document.createElement("p");
    priceParagraph.textContent = `Price: ${photographer.price} €`;
    priceParagraph.classList.add("p2");
    userCardDOM.appendChild(priceParagraph);

    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  const { photographers } = await getPhotographers();
  displayData(photographers);

  // Ajout de la fonctionnalité de focus et de redirection pour le logo
  const homeLogo = document.getElementById('homeLogo');
  homeLogo.tabIndex = 0;
  homeLogo.setAttribute('role', 'button');
  homeLogo.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      window.location.href = 'index.html';
    }
  });
}

init();
