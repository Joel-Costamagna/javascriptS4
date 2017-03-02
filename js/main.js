const GRILLE_Y = 60;
const GRILLE_X = 30;
const grille = [GRILLE_X][GRILLE_Y]; //la grille dans laquelle se déplace le serpent
var cadre;
var gamezone;
var serpent;

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
	serpent = new Serpent();
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

function Position(x, y, direction){
	this.x = x;
	this.y = y;
	this.direction = direction;
}

function Serpent(){
	this.tete = new Position(0,0,"DROITE");
	this.queue = new Position(0,0,"DROITE");
	this.taille = 1;
	this.positions = [];
	this.positions.push(this.tete);
}

function redraw() {
}

function placerPomme(){
	var pommeY = math.floor(Math.random() * (GRILLE_Y));
	var pommeX = math.floor(Math.random() * (GRILLE_X));
	grille[pommeX][pommeY]= "pomme";
}

function collisionPomme(){
	if(grille[serpent.tete.x][serpent.tete.y] == "pomme"){
		grille[serpent.tete.x][serpent.tete.y] = false;
		placerPomme();
		agrandirSerpent();
	}
}

function agrandirSerpent(direction){
	serpent.taille++;	
	switch (serpent.queue.direction) {
		case "HAUT":
			serpent.positions.push(new Position(serpent.queue.x, serpent.queue.y-1, "HAUT"));
		break;

		case "DROITE":
			serpent.positions.push(new Position(serpent.queue.x-1, serpent.queue.y, "DROITE"));
		break;

		case "BAS":
			serpent.positions.push(new Position(serpent.queue.x, serpent.queue.y+1, "BAS"));
		break;

		case "GAUCHE":
			serpent.positions.push(new Position(serpent.queue.x+1, serpent.queue.y, "GAUCHE"));
		break;
	}
}

//tete = 10*10px et le corps