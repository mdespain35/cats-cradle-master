
const searchRecipe = document.querySelector('.recipe-form');
const searchResult = document.querySelector('.search-result');
const recipeContainer = document.querySelector('.container');
const addBtn = document.querySelector('.add-btn');

let searchQuery = '';
const APP_key = 'JLBr5npPhV';
const baseURL = 'https://api.boardgameatlas.com/api/search?order_by=rank&ascending=false'; // Always sort by rank in descending order
console.log(recipeContainer);
searchRecipe.addEventListener('submit', (e) => {
	e.preventDefault();
	searchQuery = e.target.querySelector('input').value;
	fetchGames();
});

const fetchGames = async () => {
	try {
		const res = await fetch(
			`${baseURL}&name=${searchQuery}&fuzzy_match=true&limit=5&client_id=${APP_key}`
		);
		if (!res.ok) {
			throw new Error(res.status);
		}
		console.log(res);
		const data = await res.json();
		gameWidget(data.games);
		console.log(data);
	} catch (error) {
		console.log(error);
	}
};

const fetchGame = async () => {
	const newGameId = document.querySelector(".newGame:checked").value;
	try {
		const res = await fetch(
			`${baseURL}&ids=${newGameId}&client_id=${APP_key}`
		);
		if (!res.ok) {
			throw new Error(res.status);
		}
		console.log(res);
		const data = await res.json();
		confirmGame(data.games);
		console.log(data);
	} catch (error) {
		console.log(error);
	}
};

function gameWidget(results) {
	recipeContainer.classList.remove('initial');
	// establish empty recipe
	let viewRecipe = '';
	// loop through results and create recipe cards
	results.map((result) => {
		viewRecipe += `
		<div class="new-games-widget">
		<input type="radio" class="newGame" name="newGame" value="${result.id}">
		<label for="newGame">
			<img src="${result.thumb_url}" alt="<%= ${result.name} %>">
			<h2> ${result.name}</h2>
		</label>
	</div>
    `;
	});
	viewRecipe += `<button class="btn" type="button" onclick="fetchGame()">Add to Inventory</button>`;
	searchResult.innerHTML = viewRecipe;
}

function confirmGame(results) {
	let confirm = '';
	results.map((result) => {
		confirm += `
		<input type="hidden" name="title" value="${result.name}">
		<input type="hidden" name="description" value="${result.description_preview}">
		<input type="hidden" name="thumbnail" value="${result.thumb_url}">
		<input type="hidden" name="full" value="${result.image_url}">
		<input type="hidden" name="purchase" value="${result.official_url}">
		<h4 class="confirm-game-text">Confirm adding ${result.name} to inventory?</h4>
		<button class="btn" type="submit">Confirm</button>
		`;
	});
	searchResult.innerHTML = confirm;
}


function recipeCard(results) {
	recipeContainer.classList.remove('initial');
	// establish empty recipe
	let viewRecipe = '';
	// loop through results and create recipe cards
	results.map((result) => {
		viewRecipe += `
      <div class="card">
        <img src="${result.thumb_url}" alt="recipe image">
        <div class="titleBlock">
          <h2 class="title">${result.name}</h2>
		 
          <span><a class="view-btn" target="_blank" href="${result.official_url}">Purchase Here<ion-icon name="open"></ion-icon></a></span>
        </div>
        <span class="card-data">${result.description}</span>
      </div>
    `;
	});
	searchResult.innerHTML = viewRecipe;
} 