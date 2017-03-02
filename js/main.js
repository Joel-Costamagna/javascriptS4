const GRILLE_Y = 60;
const GRILLE_X = 30;
const grille = [GRILLE_X][GRILLE_Y]; //la grille dans laquelle se déplace le serpent
var cadre;
var gamezone;
var serpent;
var position;

function main (arguments) {
	cadre = document.getElementById('gamezone');
	gamezone = cadre.getContext("2d");

	//le bouton régles affiche les regles ou les cache.
	document.getElementById('rules').addEventListener('click', function () {
		if(document.getElementById('div_rules').style.display == "none"){
			document.getElementById('div_rules').style.display="block";
		}else {
			document.getElementById('div_rules').style.display="none";
		}

	})

	document.addEventListener('keydown', function(e) {
				bouger(e);
	});

	position = {x: 0, y: 0};
	serpent = 
}


function bouger(event) {
	switch (event.keyCode) {
		case 81:
		case 37:
			//alert("vous allez à gauche");
			if(position.x-1 > 0){
				position.x--;
			}
			collisionPomme();
			break;

		case 90:
		case 38:
			//alert("vous allez en haut");
			if (position.y+1 < GRILLE_Y-1) {
				position.y++;
			}
			collisionPomme();
			break;

		case 68:
		case 39:
			//alert("vous allez à droite");
			if (position.x+1 < GRILLE_X-1) {
				position.x++;
			}
			collisionPomme();
			break;

		case 83:
		case 40:
			//alert("vous allez en bas");
			if (position.y-1 > 0) {
				position.y--;
			}
			collisionPomme();
			break;
		default:
			alert("utilisez ZQSD pour se déplacer");
	}
}


function redraw() {
}

function placerPomme(){
	var pomme.x = math.floor(Math.random() * (GRILLE_Y));
	var pommeX = math.floor(Math.random() * (GRILLE_X));
	grille[pommeX][pommeY]= "pomme";
}

function collisionPomme(){
	if(grille[position.x][position.y] == "pomme"){
		grille[position.x][position.y] = false;
		placerPomme();
		agrandirSerpent();
	}
}

function agrandirSerpent(direction){
	//TODO
	serpent.taille++;
	positionQueue
}

//tete = 10*10px et le corps