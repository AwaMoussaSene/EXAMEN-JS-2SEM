
const tBodyArticle = document.getElementById("tBodyArticle");
const tBodySelectedArticles = document.getElementById("tBodySelectedArticles");
const libelleArticle = document.getElementById("libelle-article");
let allArticles = [];
let selectedArticles = [];

document.addEventListener("DOMContentLoaded", async function() {
    async function fetchArticles() {
        try {
            const response = await fetch('http://localhost:3000/articles');
            const data = await response.json();
            console.log('Articles reçus:', data); // Vérifiez les données
            allArticles = data;
            listArticles(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des articles:', error);
        }
    }

    function listArticles(articles) {
        if (!tBodyArticle) return; // Vérifier si tBodyArticle est présent
        tBodyArticle.innerHTML = '';
        articles.forEach(article => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="p-2 text-center">
                    <input type="checkbox" style="transform: scale(1.5);" data-id="${article.id}" class="article-checkbox">
                </td>
                <td class="p-2">${article.libelle}</td>
                <td class="p-2">${article.prixunitaire.toFixed(2)}</td>
                <td class="p-2">${article.qtestock}</td>
            `;
            tBodyArticle.appendChild(row);
        });
        addCheckboxEventListeners(); // Ajouter des écouteurs d'événements aux cases à cocher
    }

    function addCheckboxEventListeners() {
        const checkboxes = document.querySelectorAll('.article-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const articleId = parseInt(this.dataset.id);
                const article = allArticles.find(a => a.id === articleId);
                if (this.checked) {
                    selectedArticles.push({ ...article, quantity: 1 }); // Ajouter l'article avec une quantité initiale de 1
                } else {
                    selectedArticles = selectedArticles.filter(a => a.id !== articleId);
                }
                console.log('Articles sélectionnés:', selectedArticles); // Vérifiez les articles sélectionnés
                listSelectedArticles();
            });
        });
    }

    function listSelectedArticles() {
        if (!tBodySelectedArticles) return; // Vérifier si tBodySelectedArticles est présent
        tBodySelectedArticles.innerHTML = '';
        selectedArticles.forEach(article => {
            const totalAmount = (article.prixunitaire * article.quantity).toFixed(2);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="p-2">${article.libelle}</td>
                <td class="p-2">${article.prixunitaire.toFixed(2)}</td>
                <td class="p-2">
                    <div class="flex items-center justify-center">
                        <button class="px-2 py-1 bg-gray-200 rounded-l" onclick="updateQuantity(${article.id}, -1)">-</button>
                        <input type="text" value="${article.quantity}" class="w-12 text-center border-t border-b" readonly>
                        <button class="px-2 py-1 bg-gray-200 rounded-r" onclick="updateQuantity(${article.id}, 1)">+</button>
                    </div>
                </td>
                <td class="p-2">${totalAmount}</td>
                <td><button class="text-red-500" onclick="removeArticle(${article.id})">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </td>
            `;
            tBodySelectedArticles.appendChild(row);
        });
    }

    window.updateQuantity = function(id, change) {
        const article = selectedArticles.find(a => a.id === id);
        if (article) {
            article.quantity = Math.max(article.quantity + change, 1); // Quantité minimale de 1
            console.log('Quantité mise à jour pour l\'article:', article); // Vérifiez la quantité
            listSelectedArticles();
        }
    }

    window.removeArticle = function(id) {
        selectedArticles = selectedArticles.filter(a => a.id !== id);
        document.querySelector(`input[data-id="${id}"]`).checked = false; // Désélectionner l'article
        console.log('Article supprimé:', id); // Vérifiez l'article supprimé
        listSelectedArticles();
    }

    libelleArticle.addEventListener('input', function() {
        const filterValue = libelleArticle.value.toLowerCase();
        const filteredArticles = allArticles.filter(article =>
            article.libelle.toLowerCase().includes(filterValue)
        );
        listArticles(filteredArticles);
    });

    fetchArticles();
});
