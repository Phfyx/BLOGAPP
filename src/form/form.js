import { openModal } from "../assets/javascripts/modal";
import { URL_API } from "../utils";
import "./form.scss";

const form = document.querySelector("form");
const errorContainer = document.getElementById("errors");
const cancelBtn = document.querySelector(".btn-secondary");

let articleId;

const initForm = async () => {
  const params = new URL(location.href);
  articleId = params.searchParams.get("id");

  if (articleId) {
    const response = await fetch(`${URL_API}/${articleId}`);
    if (response.status < 300) {
      const article = await response.json();
      fillForm(article);
    }
  }
};      

initForm();

const fillForm = (article) => {
  const formFields = form.querySelectorAll("input, select, textarea");
  formFields.forEach(field => {
    field.value = article[field.name]
  })
}

cancelBtn.addEventListener("click", async () => {
  const answer = await openModal("Etes vous sur de vouloir annuler ?")
  if (answer){
    location.assign("/");
  }
  
});

//Form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const entries = formData.entries();
  const article = Object.fromEntries(entries);

  if (formIsValid(article)) {
    const json = JSON.stringify(article);
    let response;

    if(articleId){
      //Update
      response = await fetch(`${URL_API}/${articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: json,
      });
    }else{
      //Création
      response = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json,
      });
    }
    if (response.status < 300) {
      location.assign("/index.html");
    }
  }
});

const formIsValid = (article) => {
  let errors = [];
  if (!article.author || !article.title || !article.content) {
    errors.push("Vous devez renseigner tous les champs !");
  }

  if (article.title.length < 5) {
    errors.push("Le titre doit faire plus de 5 caractéres");
  }

  if (errors.length) {
    let errorHtml = "";

    errors.forEach((error) => {
      errorHtml += `<li>${error}</li>`;
    });

    errorContainer.innerHTML = errorHtml;
    return false;
  } else {
    errorContainer.innerHTML = "";
    return true;
  }
};
