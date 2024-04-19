async function getPhotographers() {
        
    return fetch('data/photographers.json')
    .then((res) => res.json())
}

async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();

        const locationParagraph = document.createElement('p');
        locationParagraph.textContent = `${photographer.city}, ${photographer.country}`;
        userCardDOM.appendChild(locationParagraph);


        const taglineParagraph = document.createElement('p');
        taglineParagraph.textContent = photographer.tagline;
        userCardDOM.appendChild(taglineParagraph);

        
        const priceParagraph = document.createElement('p');
        priceParagraph.textContent = `Price: ${photographer.price} €`;
        userCardDOM.appendChild(priceParagraph);

        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    const { photographers } = await getPhotographers();
    displayData(photographers);
}

init();