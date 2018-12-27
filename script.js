//Welcome
//This project was completed using the SWAPI
//Non-commercial use only


//First, we'll create global constants to avoid repeat fetches
//Here's the master SWAPI object;
const SWAPI = {
	People:[],
	Planets:[],
	Starships:[],
	Vehicles:[],
	Species:[],
	Films:[]
};

//We'll use this array to hold the values of the promises
const SWAPIarr = [];

//Let's grab the information from the SWAPI

//Request from SWAPI server
const getSWAPI = async function(){
	 	return await Promise.all(urls.map(
		(array) => array.map(async function(url){
			try  {
			//Dedicated response variable
			const request = await fetch(`https://cors-anywhere9316.herokuapp.com/${url}`);
			//Dedicated data variable
			const response = await request.json();
			//Targeting object clusters
			const data = response.results;

			//Let's copy the response into our SWAPI arr
			SWAPIarr.push(data);

			return response.results;
			}
			catch(error){
				console.log(error);
			}
	})));
}
//Let's go ahead and call this function ^^^
getSWAPI();

//It has come to my attention that i'll need a lookup function to retrieve info that I need.
//Here it is-

const lookup = (link) => {
	if (link == undefined){ return "unknown"}
  
  const regExp = /https:\/\/swapi\.co\/api\/(\w+)\/(\d+)\//;
  const match = link.match(regExp);
  const section = match[1].replace(match[1][0],match[1][0].toUpperCase());

  const results = () => {
  	return SWAPI[section].filter((obj) => obj.url == link);
  }
  return results()[0].title || results()[0].name;
}

//Let's use Cardify to refine our data!
//We'll start by grabbing the "container" from the DOM
const container = document.querySelector('#container');

//You may have noticed an animation in the background;
//I've used cardify to procedurally create them:
const backgroundAnim = () =>{

	const animation = (amount, distance, distanceRate, delay, delayRate) =>{
	
		 for (let i = 1; i <= amount; i++){
		 	const rectangle = Card.div("anim-rectangleR", `rect${i}`);
		 	rectangle.style['animation-delay'] = `${delay}s`;
		 	rectangle.style.top = `${distance}px`;
		 	delay += delayRate;
		 	distance += distanceRate;
		 	container.append(rectangle);

		 }
	}
	return animation(16, 0, 40, 0, .25);
}
backgroundAnim();

//We also need a function to add the main section elements 
const addElements = (parent) => {
	//We're going to define each new Element to be added to "container"
	const define = {
		sectionFilms:Card.section("main",'Films' ,''),
		sectionPlanets:Card.section("main",'Planets' ,''),
		sectionStarships:Card.section("main",'Starships' ,''),
		sectionVehicles:Card.section("main",'Vehicles' , ''),
		sectionPeople:Card.section("main",'People' ,''),
		sectionSpecies:Card.section("main",'Species' ,'')
	}
	//Now lets loop through the definition object to finish adding them;
	//Also, throw in an h2 element linked to the main element's id
	for (props in define){

		define[props].append(Card.h("2","","",define[props].id));
		parent.append(define[props]);
	}
}
//We'll go ahead and call this ^^
addElements(container);

//Most Likely, we'll need to organize the cards differently in each section
//That means we'll probally need a card for each section 
	
	//Here's a looped function to create a few lists with our lookup data as text
	//I'll probobly have to use this for the rest of the cards, so i'll make it a global function
const divTrain = (h6text, listArray) => {
	const div = Card.div();
	const ul = Card.ul();
	listArray.map(item => {
		return ul.append(Card.li("","", lookup(item))); 
	});
	div.append(Card.h("6", "","", h6text));
	div.append(ul);
	return div;
} 

const cardFilms =  (obj) => {
	
	//Let's start by creating a few constants so we dont have to chain appends
	const base = Card.div("card", `film${obj.episode_id}`,"");
	const article = Card.article();
	
	const poster = () => {
		for (var i = 0; i < images.Episodes.length; i++){
			if (images.Episodes[i][0] == obj.episode_id){
			return images.Episodes[i][1];
			}
		}
	}



	base.append(Card.h("4","","",`Episode ${obj.episode_id}: ${obj.title}`));
	base.append(Card.small(obj.release_date));
	base.append(Card.img(poster(),"Poster", 350, 500));
	base.append(Card.p("","",`Directed by ${obj.director}`));
	base.append(Card.p("","",`Directed by ${obj.producer}`));
	base.append(Card.h("5","","","Featured"));
	base.append(Card.p("crawl",`crawl${obj.episode_id}`, obj.opening_crawl));
	article.append(divTrain("Characters", obj.characters));
	article.append(divTrain("Planets", obj.planets));
	article.append(divTrain("Vehicles", obj.vehicles));
	article.append(divTrain("Species", obj.species));
	article.append(divTrain("Starships", obj.starships));
	base.append(article);
	//And that's all for the basic film card.
	
	return base;
}

const cardPlanets = (obj) => {

	const base = Card.div("card", `planets${obj.name}`);
	const article = Card.article();

	base.append(Card.h("4","","", obj.name));
	base.append(Card.p("","", `Climate: ${obj.climate}`));
	base.append(Card.p("","", `Terrain: ${obj.terrain}`));
	base.append(Card.p("","", `Diameter: ${obj.diameter} km`));
	base.append(Card.p("","", `Gravity: ${obj.gravity}`));
	base.append(Card.p("","", `Rotation Period: ${obj.rotation_period}hrs`));
	base.append(Card.p("","", `Population: ${obj.population}`));
	base.append(Card.p("","", `Orbital Period: ${obj.orbital_period} RPs`));
	article.append(divTrain("Films", obj.films));
	article.append(divTrain("Residents", obj.residents));
	base.append(article);

	return base;
}

const cardStarhips = (obj) => {

	const base = Card.div("card", `starships${obj.name}`);
	const article = Card.article();

	base.append(Card.h("4","","", obj.name));
	base.append(Card.small(`${obj.model} by ${obj.manufacturer}`));
	base.append(Card.p("","", `Speed: ${obj.MGLT} Megalights, HD ${obj.hyperdrive_rating} @ ${obj.max_atmosphering_speed} km/hr`));
	base.append(Card.p("","", `Capacity: ${obj.cargo_capacity} kg`));
	base.append(Card.p("","", `Survival Capacity: ~${obj.consumables}`));
	base.append(Card.p("","", `Passenger Capacity: ${obj.passengers}`));
	base.append(Card.p("","", `Crew Capacity: ${obj.crew}`));
	base.append(Card.p("","", `Cost: ${obj.cost_in_credits} Credits`));
	article.append(divTrain("Films", obj.films));
	article.append(divTrain("Pilots", obj.pilots));
	base.append(article);

	return base;
}

const cardVehicles = (obj) => {

	const base = Card.div("card", `vehicles${obj.name}`);
	const article = Card.article();

	base.append(Card.h("4","","", obj.name));
	base.append(Card.small(`${obj.model} by ${obj.manufacturer}`));
	base.append(Card.p("","", `Class: ${obj.vehicle_class}`));
	base.append(Card.p("","", `Speed: ${obj.max_atmosphering_speed} km/hr`));
	base.append(Card.p("","", `Capacity: ${obj.cargo_capacity} kg`));
	base.append(Card.p("","", `Survival Capacity: ~${obj.consumables}`));
	base.append(Card.p("","", `Passenger Capacity: ${obj.passengers}`));
	base.append(Card.p("","", `Crew Capacity: ${obj.crew}`));
	base.append(Card.p("","", `Cost: ${obj.cost_in_credits} Credits`));
	article.append(divTrain("Films", obj.films));
	article.append(divTrain("Drivers", obj.pilots));
	base.append(article);

	return base;
}

const cardPeople = (obj) => {

	const base = Card.div("card", `people${obj.name}`);
	const article = Card.article();
	base.append(Card.h("4","","", obj.name));
	base.append(Card.p("","", `Born  ${obj.birth_year}`));
	base.append(Card.p("","", `Gender - ${obj.gender}`));
	base.append(Card.p("","", `Skin Color - ${obj.skin_color}`));
	base.append(Card.p("","", `Eye Color - ${obj.eye_color}`));
	base.append(Card.p("","", `Hair Color - ${obj.hair_color}`));
	base.append(Card.p("","", `Height - ${obj.height} cm`));
	base.append(Card.p("","", `Weight - ${obj.mass} kg`));
	base.append(Card.p("","", `Homeworld: ${lookup(obj.homeworld)}`));
	base.append(Card.p("","", `Species: ${lookup(obj.species[0])}`));
	article.append(divTrain("Films", obj.films));
	base.append(article);

	return base;
}

const cardSpecies = (obj) => {

	const base = Card.div("card", `people${obj.name}`);
	const article = Card.article();
	
	base.append(Card.h("4","","", obj.name));
	base.append(Card.p("","", `Classification: ${obj.classification}, ${obj.designation}`));
	base.append(Card.p("","", `Average Lifespan: ${obj.average_lifespan} years`));
	base.append(Card.p("","", `Average Height: ${obj.average_height} cm`));
	base.append(Card.p("","", `Skin Colors: ${obj.skin_colors}`));
	base.append(Card.p("","", `Eye Colors: ${obj.eye_colors}`));
	base.append(Card.p("","", `Hair Colors: ${obj.hair_colors}`));
	base.append(Card.p("","", `Homeworld: ${lookup(obj.homeworld)}`));
	base.append(Card.p("","", `Language: ${obj.language}`));
	article.append(divTrain("Films", obj.films));
	article.append(divTrain("Characters", obj.people));

	base.append(article);

	return base;


}


setTimeout(function(){
	
	//First, lets assign our global SWAPI obj its values. 
		 SWAPIarr.map((arr) => {
		if (arr[0].hasOwnProperty('height')){
			SWAPI.People.push(arr);
		}
		else if (arr[0].hasOwnProperty('gravity')){
			SWAPI.Planets.push(arr);
		}
		else if (arr[0].hasOwnProperty('starship_class')){
			SWAPI.Starships.push(arr);
		}
		else if (arr[0].hasOwnProperty('vehicle_class')){
			SWAPI.Vehicles.push(arr);
		}
		else if (arr[0].hasOwnProperty('designation')){
			SWAPI.Species.push(arr);
		}
		else if (arr[0].hasOwnProperty('title')){
			SWAPI.Films.push(arr);
		}
	});
	
	for (props in SWAPI){
		SWAPI[props] = SWAPI[props].reduce((a,b) => a.concat(b));
	}

	//Congrats!!! We now have a cached version of SWAPI!

	//I've created a quicksort equations just to return the movies in order
	const quickSort = (arr) => {
		let newArr = [];
		for (var i = 1; i < arr.length + 1; i++){
		 arr.map(obj => {
		 	if(obj.episode_id == i){
		 		newArr.push(obj)};
			});
		}

		 return newArr;		
	}
	
	//Let's Iterate them now 
	//These have to be loaded within the timeout, or else everything will return undefined and throw a billion errors
	//Note* I could definitly apply DRY standards, but for the sake of readability this is much more clear and concise;
	
	//Films
	const filmsArr = quickSort(SWAPI.Films);
	const filmsSection = document.querySelector('#Films');
	for (i = 0; i < filmsArr.length; i++){
		filmsSection.append(cardFilms(filmsArr[i]));
	}

	//Planets
	const planetsArr = SWAPI.Planets;
	const planetsSection = document.querySelector('#Planets');
	for (i = 0; i < planetsArr.length; i++){
		planetsSection.append(cardPlanets(planetsArr[i]));
	}

	//Starships
	const starshipsArr = SWAPI.Starships;
	const starshipsSection = document.querySelector('#Starships');
	for (i = 0; i < starshipsArr.length; i++){
		starshipsSection.append(cardStarhips(starshipsArr[i]));
	}

	//Vehicles
	const vehiclesArr = SWAPI.Vehicles;
	const vehiclesSection = document.querySelector('#Vehicles');
	for (i = 0; i < vehiclesArr.length; i++){
		vehiclesSection.append(cardVehicles(vehiclesArr[i]));
	}

	//People
	const peopleArr = SWAPI.People;
	const peopleSection = document.querySelector('#People');
	for (i = 0; i < peopleArr.length; i++){
		peopleSection.append(cardPeople(peopleArr[i]));
	}

	//Species
	const speciesArr = SWAPI.Species;
	const speciesSection = document.querySelector('#Species');
	for (i = 0; i < speciesArr.length; i++){
		speciesSection.append(cardSpecies(speciesArr[i]));
	}
}, 15000);
 



//Lets bind click events to the buttons
//In anticipation of multiple DOM lookups, i'll create an object.
const buttons = {
	filmsButton:document.querySelector('#bFilms'),
	planetsButton:document.querySelector('#bPlanets'),
	peopleButton:document.querySelector('#bPeople'),
	speciesButton:document.querySelector('#bSpecies'),
	vehiclesButton:document.querySelector('#bVehicles'),
	starshipsButton:document.querySelector('#bStarships')
}



function hide(){
	const elem = this.id.replace(this.id[0],"");
	const allSections = document.getElementsByTagName('section');
	const section = document.getElementById(elem);
	
	for (var i = 0; i < allSections.length; i++) {
	allSections[i].classList.add('hide');
	}
	section.classList.remove('hide');
}
for (eachButton in buttons){
	buttons[eachButton].addEventListener("click", hide);
}

//Here's some nice themed audio too :)
document.addEventListener("DOMContentLoaded", function(event) {

  });

