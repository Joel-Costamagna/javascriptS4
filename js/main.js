const GRILLE_Y = 60;
const GRILLE_X = 30;
const grille = [GRILLE_X][GRILLE_Y]; //la grille dans laquelle se déplace le serpent
var cadre;
var gamezone;
var position;



function main () {
	cadre = document.getElementById('gamezone');
	gamezone = cadre.getContext("2d");
	//la gamezone fait la taille de la grille;
	cadre.style.width=GRILLE_X*15;
	cadre.style.height=GRILLE_Y*15;
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

	position = {x: 0, y: 0}; //la position de la tête du serpent

}

/**
 * dessine la grille sur le canvas, avec des cases de 15*15
 */
function dessinerGrille () {
	gamezone.strokeStyle="#000";
	for (var x = 0; x < GRILLE_X*15; x+=15) {
		console.log("ligneX");
		gamezone.moveTo(x, 0);
		gamezone.lineTo(x, GRILLE_Y*15);
	}

	for (var y = 0; y < GRILLE_Y*15; y+=15) {
		gamezone.moveTo(0, y);
		gamezone.lineTo(GRILLE_X*15, y);
	}
	gamezone.stroke();
}


function bouger(event) {
	switch (event.keyCode) {
		case 81:
		case 37:
			//alert("vous allez à gauche");
			if(position.x-1 > 0){
				position.x--;
			}
			break;

		case 90:
		case 38:
			//alert("vous allez en haut");
			if (position.y+1 < GRILLE_Y-1) {
				position.y++;
			}
			break;

		case 68:
		case 39:
			//alert("vous allez à droite");
			if (position.x+1 < GRILLE_X-1) {
				position.x++;
			}
			break;

		case 83:
		case 40:
			//alert("vous allez en bas");
			if (position.y-1 > 0) {
				position.y--;
			}
			break;
		default:
			alert("utilisez ZQSD pour se déplacer");
	}
}


function redraw() {

}

function placerPomme(){
	var pommeY = math.floor(Math.random() * (GRILLE_Y));
	var pommeX = math.floor(Math.random() * (GRILLE_X));
	grille[pommeX][pommeY]= "pomme";
}
