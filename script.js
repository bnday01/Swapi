//Welcome
//This project was completed using the SWAPI
//Non-commercial use only


//First, we'll create global objects to avoid repeat fetches
const SWAPI = {
	People:[],
	Planets:[],
	Starships:[],
	Vehicles:[],
	Species:[],
	Films:[]
};

//We'll use this to hold the values of the promises
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
//Let's go ahaead and call this function ^^^
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

//Lets start refining data!
//We'll start by grabbing the "container" from the DOM

const container = document.querySelector('#container');

//Now, let's create a function that creates HTML elements for our containter

const newElement = (tag, attr, id,text) => {
	const element = document.createElement(tag);
	const textNode = document.createTextNode(text);
	element.appendChild(textNode);
	//Ternary statements to prevent 'undefined' attributes
	(attr) ? element.className = attr : null;
	(id) ? element.id = id : null;
	return element;
}

//We also need a function to add the elements 
const addElements = (parent) => {
	//We're going to define each new Element to be added to "container"
	const define = {
		sectionFilms:newElement("section","main",'Films' ,''),
		sectionPlanets:newElement("section","main",'Planets' ,''),
		sectionStarships:newElement("section","main",'Starships' ,''),
		sectionVehicles:newElement("section","main",'Vehicles' , ''),
		sectionPeople:newElement("section","main",'People' ,''),
		sectionSpecies:newElement("section","main",'Species' ,'')
	}
	//Now lets loop through the definition object to finish adding them;
	//Also, throw in an h2 element linked to the main element's id
	for (props in define){

		define[props].appendChild(newElement("h2","","",define[props].id));
		parent.appendChild(define[props]);
	}
}
//We'll go ahead and call this ^^
addElements(container);

//At this point we're going to need some type of card element to hold all this data nicely
//Most Likely, we'll need to organize the cards differently in each section
//That means we'll probally need a card for each section 

//

const cardFilms =  (obj) => {
	
	//Let's start by creating each element we need
	//Note* For clarity, these elements have been created in the order they need to be appended
	const base = newElement("div","card", `film${obj.episode_id}`,"");
	const h4 = () => {
		const h4text = `Episode ${obj.episode_id}: ${obj.title}`;
		return newElement("h4", "", "", h4text);
	}
	const small = newElement("small","","", `${obj.release_date}`);
	const img = () => { 
		const elem = newElement("img","","","");
		//Here's a placeholder for a future loop through image links
		elem.currentSrc = "#";
		elem.alt = "Poster";
		return elem;
	}
	const pDirector = newElement("p","","",`Directed by ${obj.director}`);
	const pProducer = newElement("p","","",`Produced by ${obj.producer}`);
	const h5 = newElement("h5","","", "Featured");
	//We have a few more elements, but some are double nested so let's do that now.
	const article = newElement("article", "","","");
	

	const divTrain = (h6text, listArray) => {
		const div = newElement("div","","","");
		const h6 = newElement("h6", "","", h6text);
		const ul = newElement("ul","","","");
		listArray.map(item => {
			return ul.appendChild(newElement("li","","", lookup(item))); 
		});
		div.appendChild(h6);
		div.appendChild(ul);
	
		return div;
	} 


	const pCrawl = newElement("p","",`crawl${obj.episode_id}`, obj.opening_crawl);
	//And that's all for the basic film card.
	//Time to put everything together and return one element.

	base.appendChild(h4());
	base.appendChild(small);
	base.appendChild(img());
	base.appendChild(pDirector);
	base.appendChild(pProducer);
	base.appendChild(h5);
	base.appendChild(pCrawl);
	article.appendChild(divTrain("People", obj.characters));
	article.appendChild(divTrain("Planets", obj.planets));
	article.appendChild(divTrain("Vehicles", obj.vehicles));
	article.appendChild(divTrain("Species", obj.species));
	article.appendChild(divTrain("Starships", obj.starships));
	base.appendChild(article);

	
	return base;
}

//Now That we have a card, lets look at how iterate it.
//At some point, I'll probobally have to iterate all of them. So for now, lets continue making cards.
const buttons = {
	filmsButton:document.querySelector('#bFilms'),
	planetsButton:document.querySelector('#bPlanets'),
	peopleButton:document.querySelector('#bPeople'),
	speciesButton:document.querySelector('#bSpecies'),
	vehiclesButton:document.querySelector('#bVehicles'),
	starshipsButton:document.querySelector('#bStarships'),
}

const sectionGroup = {

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


	const filmsArr = SWAPI.Films;
	const filmsSection = document.querySelector('#Films');
	for (i = 0; i < filmsArr.length; i++){
	filmsSection.appendChild(cardFilms(filmsArr[i]));
	}

}, 15000);
 



	//Lets bind this to a click event for the films button
	//In anticipation of multiple DOM lookups, ill create an object.

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

