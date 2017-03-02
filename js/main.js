const GRILLE_Y = 60;
const GRILLE_X = 30;
const grille = [GRILLE_X][GRILLE_Y]; //la grille dans laquelle se déplace le serpent
var cadre;
var gamezone;
var serpent;
var position;



function main () {
	cadre = document.getElementById('gamezone');
	gamezone = cadre.getContext("2d");
	//la gamezone fait la taille de la grille;
	let x = GRILLE_X*15;
	let y = GRILLE_Y*15;
	console.log(x);
	console.log(x.toString());
	cadre.style.width = x.toString();
	cadre.style.height = y.toString();
	dessinerGrille();
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
}

/**
 * dessine la grille sur le canvas, avec des cases de 15*15
 */
function dessinerGrille () {
	gamezone.strokeStyle="#000";
	for (var x = 0; x < GRILLE_X*15; x+=15) {
		gamezone.moveTo(x, 0);
		gamezone.lineTo(x, GRILLE_X*15);
	}

	for (var y = 0; y < GRILLE_Y*15; y+=15) {
		gamezone.moveTo(0, y);
		gamezone.lineTo(GRILLE_Y*15, y);
	}
	gamezone.stroke();
}


function bouger(event) {
	switch (event.keyCode) {
		case 81:
		case 37:
			//alert("vous allez à gauche");
			if(Serpent.tete.x-1 > 0){
				Serpent.tete.x--;
				Serpent.tete.direction="GAUCHE";
			}else {
				mourir();
			}
			collisionPomme();
			break;

		case 90:
		case 38:
			//alert("vous allez en haut");
			if (Serpent.tete.y+1 < GRILLE_Y-1) {
				Serpent.tete.y++;
			}else {
				mourir();
			}
			collisionPomme();
			break;

		case 68:
		case 39:
			//alert("vous allez à droite");
			if (Serpent.tete.x+1 < GRILLE_X-1) {
				Serpent.tete.x++;
			}else {
				mourir();
			}
			collisionPomme();
			break;

		case 83:
		case 40:
			//alert("vous allez en bas");
			if (position.tete.y-1 > 0) {
				position.tete.y--;
			}else {
				mourir();
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
	pomme.y = math.floor(Math.random() * (GRILLE_Y));
	pomme.x = math.floor(Math.random() * (GRILLE_X));
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
	//positionQueue
}

function mourir () {
	alert("vous avez perdu");
	main();
}
