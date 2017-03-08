const GRILLE_Y = 30;
const GRILLE_X = 60;
var grille; //la grille dans laquelle se déplace Jacques
var cadre;
var gamezone;
var jacques; //le serpent :)

function main () {
	score=0;
	grille = new Array(GRILLE_X).fill(new Array(GRILLE_Y));
	cadre = document.getElementById('gamezone');
	gamezone = cadre.getContext("2d");
	//la gamezone fait la taille de la grille;
	cadre.style.width = GRILLE_X * 15 + "px";
	cadre.style.height = GRILLE_Y* 15 + "px";
	//dessinerGrille();
	//le bouton régles affiche les regles ou les cache.
	document.getElementById('rules').addEventListener('click', function () {
		if(document.getElementById('div_rules').style.display == "none"){
			document.getElementById('div_rules').style.display="block";
		}else {
			document.getElementById('div_rules').style.display="none";
		}

	});
	document.addEventListener('keydown', function(e) {bouger(e);});
	jacques = new serpent();
	placerPomme();
}

/**
 * dessine la grille sur le canvas, avec des cases de 15*15
 */
function dessinerGrille () {
	gamezone.strokeStyle="#000";
	for (var x = 0; x < GRILLE_X*15; x+=15) {
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
			if(jacques.tete.x-1 >= 0){
				jacques.tete.x--;
				jacques.tete.direction="GAUCHE";
				redraw();
				collisionPomme();
			}else {
				mourir();
			}
			break;

		case 90:
		case 38:
			//alert("vous allez en haut");

			if (jacques.tete.y-1 >= 0) {
				jacques.tete.y--;
				redraw();
				collisionPomme();
			}else {
				mourir();
			}
			break;

		case 68:
		case 39:
			//alert("vous allez à droite");

			if (jacques.tete.x+1 < GRILLE_X) {
				jacques.tete.x++;
				redraw();
				collisionPomme();
			}else {
				mourir();
			}
			break;

		case 83:
		case 40:
			//alert("vous allez en bas");
			if (jacques.tete.y-1 < GRILLE_Y) {
				jacques.tete.y++;
				redraw();
				collisionPomme();
			}else {
				mourir();
			}
			break;
		//default:
			//alert("utilisez ZQSD pour se déplacer");
	}
}

function Position(x, y, direction){
	this.x = x;
	this.y = y;
	this.direction = direction;


}
/**
 * @constructor serpent
 * crée un objet serpent
 */
function serpent(){
	this.tete = new Position(0,0,"DROITE");
	this.queue = new Position(0,0,"DROITE");
	this.taille = 1;
	this.score=0;
	this.positions = [];
	this.positions.push(this.tete);
	this.agrandir = function (){
		this.taille++;
		switch (this.queue.direction) {
			case "HAUT":
				this.positions.push(new Position(this.queue.x, this.queue.y+1, "HAUT"));
			break;

			case "DROITE":
				this.positions.push(new Position(this.queue.x-1, this.queue.y, "DROITE"));
			break;

			case "BAS":
				this.positions.push(new Position(this.queue.x, this.queue.y-1, "BAS"));
			break;

			case "GAUCHE":
				this.positions.push(new Position(this.queue.x+1, this.queue.y, "GAUCHE"));
			break;
		}
	}
}

/**
 * dessine le corps du serpent.
 * cette fonction est appelée à chaque mouvement du serpent.
 * @return {[type]} [description]
 */
function redraw() {
	gamezone.strokeStyle="#0F0";
	gamezone.fillStyle="#0F0";
	for (var truc of jacques.positions) {
		console.log(truc.x);
		console.log(truc.y);
		gamezone.strokeRect(truc.x*15, truc.y*15,15, 15);
	}
}


function placerPomme(){
	pommeY= Math.floor(Math.random() *GRILLE_Y);
	pommeX = Math.floor(Math.random() *GRILLE_X);
	console.log(pommeY);
	console.log(pommeX);
	grille[pommeX][pommeY] = "pomme";
	var imgPomme = document.getElementById('pom');
	gamezone.drawImage(imgPomme, pommeX*15, pommeY*15);
}


function collisionPomme(){
	if(grille[jacques.tete.x][jacques.tete.y] == "pomme"){
		grille[jacques.tete.x][jacques.tete.y] = false;
		jacques.score += 10;
		placerPomme();
		jacques.agrandir();
	}
}

function mourir () {
	alert("vous avez perdu");
	main();
}
