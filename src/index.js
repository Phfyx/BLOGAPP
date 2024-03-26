import { openModal } from "./assets/javascripts/modal";
import "./index.scss";
import { URL_API } from "./utils";

const articlesContainer = document.querySelector(".articles-container");
const categoriesContainer = document.querySelector(".categories");
const selectElement = document.querySelector("select");
let filter;
let articles;
let sortBy = "desc";

selectElement.addEventListener("change", (event) => {
  sortBy = selectElement.value;
  fetchArticles();
});

const fetchArticles = async () => {
  try {
    const response = await fetch(`${URL_API}?sort=${sortBy}`);
    articles = await response.json();

    if (articles.length) {
      createArticles();
      const categoriesArray = createMenuArticles();
      displayMenuCategories(categoriesArray);
    } else {
      articlesContainer.innerHTML = "Pas d'articles !";
      categoriesContainer.innerHTML = "Pas de categories ! ";
    }
  } catch (error) {
    console.log(error);
  }
};

fetchArticles();

const createArticles = () => {
  const articlesDOM = articles
    .filter((article) => {
      if (filter) {
        return article.category === filter;
      }
      return true;
    })
    .map((article) => {
      const articleNode = document.createElement("div");
      articleNode.classList.add("article");

      articleNode.innerHTML = `<img src=${
        article.image.slice(0, 4) == "http"
          ? article.image
          : "assets/image/default_profile.png"
      } alt="Profile image">
        <h2>${article.title}</h2>
        <p class="article-author">${article.author} - <span>${new Date(
        article.createdAt
      ).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}</span></p>
        <p class="article-content">${article.content}</p>
        <div class="article-actions">
          <button class="btn btn-danger" data-id= ${
            article._id
          }>Supprimer</button>
          <button class="btn btn-primary" data-id= ${
            article._id
          }>Editer</button>
        </div>`;
      return articleNode;
    });
  articlesContainer.innerHTML = "";
  articlesContainer.append(...articlesDOM);

  const deleteBtns = articlesContainer.querySelectorAll(".btn-danger");
  const editBtns = articlesContainer.querySelectorAll(".btn-primary");

  deleteBtns.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const answer = await openModal("Etes vous sur de vouloir supprimer votre article ?");

      if (answer) {
        try {
          const articleId = event.target.dataset.id;
          const response = await fetch(`${URL_API}/${articleId}`, {
            method: "DELETE",
          });
          fetchArticles();
        } catch (error) {
          console.log(error);
        }
      }
    });
  });

  editBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
      const articleId = event.target.dataset.id;
      location.assign(`/form.html?id=${articleId}`);
    });
  });
};

const createMenuArticles = () => {
  const categories = articles.reduce((acc, article) => {
    if (acc[article.category]) {
      acc[article.category]++;
    } else {
      acc[article.category] = 1;
    }
    return acc;
  }, {});
  return Object.keys(categories).map((cat) => [cat, categories[cat]]);
};

const displayMenuCategories = (categoriesArray) => {
  const liElements = categoriesArray.map((categoryElement) => {
    const li = document.createElement("li");
    li.innerHTML = `${categoryElement[0]}(<strong>${categoryElement[1]}</strong>)`;
    li.addEventListener("click", (event) => {
      liElements.forEach((liElement) =>
        liElement.classList.remove("active-category")
      );
      if (filter === categoryElement[0]) {
        filter = null;
      } else {
        li.classList.add("active-category");
        filter = categoryElement[0];
      }

      createArticles();
    });
    return li;
  });
  categoriesContainer.innerHTML = "";
  categoriesContainer.append(...liElements);
};
