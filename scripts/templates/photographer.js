function photographerTemplate(data) {
    const { name, portrait, id } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const a = document.createElement('a')
        a.setAttribute('href', `photographer.html?id=${id}`)
        const article = document.createElement( 'article' );
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
        article.appendChild(img);
        article.appendChild(h2);
        a.appendChild(article)
        return (a);
    }
    return { name, picture, getUserCardDOM }
}