const mealsEl = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav-meals");
const mealPopup = document.getElementById("meal-popup");
const popupCloseBtn = document.getElementById("close-popup");
const mealInfoEl = document.getElementById("meal-info");
const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
  const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  
  const respData = await resp.json();
  const randomMeal = respData.meals[0];

  addMeal(randomMeal, true);
} 

async function getMealById(id) {
  const resp = await 

  fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);

  const respData = await resp.json();
  const meal = respData.meals[0];
  return meal;
}

async function getMealsBySearch(term) {
  const resp = await 
  fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);

  const respData = await resp.json();
  const meals = respData.meals;

  console.log(meals);

  return meals;
}

function addMeal(mealData, random = false) {

  console.log(mealData);

  const meal = document.createElement("div");
  meal.classList.add("meal");
  
  meal.innerHTML = `
    <div class="meal-header">
      ${ 
        random 
          ? `        
      <span class="random">
        Random Recipe
      </span>` 
        : ""
      }
      <img 
      src="${mealData.strMealThumb}" 
      alt="${mealData.strMeal}">

    </div>

    <div class="meal-body">
      <h4>${mealData.strMeal}</h4>
      <button class="fav-btn" onclick="">
        <img src="images/heart-black.png" 
        alt="">

      </button>
    </div>
  `;

  const btn = meal.querySelector(".meal-body .fav-btn");
    btn.addEventListener("click", () => {
     if(btn.classList.contains("active")) {
        removeMealLS(mealData.idMeal);
        btn.classList.remove("active");
     } else {
       addMealLS(mealData.idMeal);
       btn.classList.add("active");
     }
     fetchFavMeals();
    });



  meal.addEventListener("click", () => {
    showMealInfo(mealData);
  });

  mealsEl.appendChild(meal);
}
// meal id section
function addMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem("mealIds", JSON.stringify
  ([...mealIds, mealId]));
}
function removeMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem(
    "mealIds", 
    JSON.stringify(mealIds.filter((id) => id !== mealId)));
}
function getMealsLS() {
  const mealIds = JSON.parse(localStorage.
    getItem("mealIds"));

  console.log(mealIds);

  return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals () {
  // clean the container - updates after select
  favoriteContainer.innerHTML = "";
  const mealIds = getMealsLS();

  const meals = [];

  for(let img = 0; img<mealIds.length; img++) {
    const mealId = mealIds[img];

    meal = await getMealById(mealId);
    
    addMealFav(meal); 
  }
  console.log(meals);
}
// add them to the screen 

// add to fav list
function addMealFav(mealData) {

  console.log(mealData);
  const favMeal = document.createElement("li");
  
  favMeal.innerHTML = `
<img 
    src="${mealData.strMealThumb}" 
    alt="${mealData.strMeal}">
    <span>${mealData.strMeal}</span>
    <button class="clear"><img 
    src="images/x.svg"
    alt="">
    </button>

  `;

  const btn = favMeal.querySelector(".clear");
  
  btn.addEventListener("click", () => {
    removeMealLS(mealData.idMeal);

    fetchFavMeals();
  });
  favoriteContainer.appendChild(favMeal);
}

function showMealInfo(mealData) {
  // clean it up
  mealInfoEl.innerHTML = '';
  
  // update the meal info
  const mealEl = document.createElement("div");

  mealEl.innerHTML = `
  <h1>${mealData.strMeal}</h1>
  <img 
  src="${mealData.strMealThumb}" 
  alt="${mealData.strMeal}">  
  <p>${mealData.strInstructions}</p>
  <li>${mealData.strIngredient1} / ${mealData.strMeasure1}</li>
  <li>${mealData.strIngredient2} / ${mealData.strMeasure2}</li>
  <li>${mealData.strIngredient3} / ${mealData.strMeasure3}</li>
  <li>${mealData.strIngredient4} / ${mealData.strMeasure4}</li>
  <li>${mealData.strIngredient5} / ${mealData.strMeasure5}</li>
  <li>${mealData.strIngredient6} / ${mealData.strMeasure6}</li>
  <li>${mealData.strIngredient7} / ${mealData.strMeasure7}</li>
  <li>${mealData.strIngredient8} / ${mealData.strMeasure8}</li>
  <li>${mealData.strIngredient9} / ${mealData.strMeasure9}</li>
  <li>${mealData.strIngredient10} / ${mealData.strMeasure10}</li>
  `

  mealInfoEl.appendChild(mealEl);

  // this should show popup
  mealPopup.classList.remove("hidden");

}


// Search
searchBtn.addEventListener("click", async () => {
  // clean container
  mealsEl.innerHTML = "";

  const search = searchTerm.value;

  console.log(await getMealsBySearch(search));

  const meals = await getMealsBySearch(search);

  if (meals) {
    meals.forEach((meal) => {
      addMeal(meal);
    });
  }
});

// Popup close
popupCloseBtn.addEventListener("click", () => {
  mealPopup.classList.add("hidden");
});

// Meal Info
