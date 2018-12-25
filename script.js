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

//SWAPI URLs
const urls = [
['https://swapi.co/api/people/', 'https://swapi.co/api/people/?page=2','https://swapi.co/api/people/?page=3','https://swapi.co/api/people/?page=4','https://swapi.co/api/people/?page=5','https://swapi.co/api/people/?page=6','https://swapi.co/api/people/?page=7','https://swapi.co/api/people/?page=8','https://swapi.co/api/people/?page=9'],
['https://swapi.co/api/planets/','https://swapi.co/api/planets/?page=2','https://swapi.co/api/planets/?page=3','https://swapi.co/api/planets/?page=4','https://swapi.co/api/planets/?page=5','https://swapi.co/api/planets/?page=6','https://swapi.co/api/planets/?page=7'],
['https://swapi.co/api/films/'],
['https://swapi.co/api/starships/','https://swapi.co/api/starships/?page=2','https://swapi.co/api/starships/?page=3','https://swapi.co/api/starships/?page=4'],
['https://swapi.co/api/vehicles/','https://swapi.co/api/vehicles/?page=2','https://swapi.co/api/vehicles/?page=3','https://swapi.co/api/vehicles/?page=4'],
['https://swapi.co/api/species/','https://swapi.co/api/species/?page=2','https://swapi.co/api/species/?page=3','https://swapi.co/api/species/?page=4']];

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
  
  const regExp = /https:\/\/swapi\.co\/api\/(\w+)\/(\d+)\//;
  const match = link.match(regExp);
  const section = match[1].replace(match[1][0],match[1][0].toUpperCase());

  const results = () => {
  	return SWAPI[section].filter((obj) => obj.url == link);
  }
  return results()[0].name;
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


	base.append(Card.h("4","","",`Episode ${obj.episode_id}: ${obj.title}`));
	base.append(Card.small(obj.release_date));
	base.append(Card.img("#","Poster"));
	base.append(Card.p("","",`Directed by ${obj.director}`));
	base.append(Card.p("","",`Directed by ${obj.producer}`));
	base.append(Card.h("5","","","Featured"));
	base.append(Card.p("",`crawl${obj.episode_id}`, obj.opening_crawl));
	article.append(divTrain("People", obj.characters));
	article.append(divTrain("Planets", obj.planets));
	article.append(divTrain("Vehicles", obj.vehicles));
	article.append(divTrain("Species", obj.species));
	article.append(divTrain("Starships", obj.starships));
	base.append(article);
	//And that's all for the basic film card.
	
	return base;
}

const cardPlanets = (obj) => {

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

	//console.log(SWAPI);
	//Congrats!!! We now have a cached version of SWAPI!

	//Let's Iterate them now 
	//Note* I could definitly apply DRY standards, but for the sake of readability this is much more clear and concise;
	
	//Films
	const filmsArr = SWAPI.Films;
	const filmsSection = document.querySelector('#Films');
	for (i = 0; i < filmsArr.length; i++){
		filmsSection.append(cardFilms(filmsArr[i]));
	}

	//Planets
	const planetsArr = SWAPI.Planets;
	const planetsSection = document.querySelector('#Planets');
	for (i = 0; i < planetsArr.length; i++){
		planetsSection.append();
	}

	//Starships
	const starshipsArr = SWAPI.Starships;
	const starshipsSection = document.querySelector('#Starships');
	for (i = 0; i < starshipsArr.length; i++){
		starshipsSection.append();
	}

	//Vehicles
	const vehiclesArr = SWAPI.Vehicles;
	const vehiclesSection = document.querySelector('#Vehicles');
	for (i = 0; i < vehiclesArr.length; i++){
		vehiclesSection.append();
	}

	const peopleArr = SWAPI.People;
	const peopleSection = document.querySelector('#People');
	for (i = 0; i < peopleArr.length; i++){
		peopleSection.append();
	}

	const speciesArr = SWAPI.Species;
	const speciesSection = document.querySelector('#Species');
	for (i = 0; i < speciesArr.length; i++){
		speciesSection.append();
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

