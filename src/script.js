const tBodyArticle = document.getElementById("tBodyArticle");
const libelleArticle = document.getElementById("libelle-article");

document.addEventListener("DOMContentLoaded", async function() {
    let allArticles = []; // Store all articles here

    // Fonction pour afficher les articles dans le tableau
    function listArticles(articles) {
        tBodyArticle.innerHTML = '';

        articles.forEach(article => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="p-2 text-center">
                    <input type="checkbox" style="transform: scale(1.5);" data-id="${article.id}">
                </td>
                <td class="p-2">${article.libelle}</td>
                <td class="p-2">${article.prixunitaire}</td>
                <td class="p-2">${article.qtestock}</td>
            `;
            tBodyArticle.appendChild(row);
        });
    }

    // Fonction pour récupérer les articles depuis le serveur
    async function fetchArticles() {
        try {
            const response = await fetch('http://localhost:3000/article'); 
            const data = await response.json();
            allArticles = data; // Store all articles
            listArticles(data); // Display all articles initially
        } catch (error) {
            console.error('Erreur lors de la récupération des articles:', error);
        }
    }

    // Fonction pour filtrer les articles en fonction du libellé
    function filterArticles() {
        const filterValue = libelleArticle.value.toLowerCase();
        const filteredArticles = allArticles.filter(article =>
            article.libelle.toLowerCase().includes(filterValue)
        );
        listArticles(filteredArticles); // Display filtered articles
    }

    // Écouteur d'événement pour filtrer les articles lorsqu'on tape dans le champ de libellé
    libelleArticle.addEventListener('input', filterArticles);

    // Initial fetching of articles
    fetchArticles();
});
