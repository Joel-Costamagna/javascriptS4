const GRILLE_Y = 31; //nombre de lignes
const GRILLE_X = 60; //nombre de colonnes
const TAILLE_CASE = 15;

var grille;
var cadre;
var gamezone;
var jacques; //le serpent
var pommeX; //coord x de la pomme
var pommeY; //coord y de le pomme
var divScore;

/**
 * fonction main appelé UNIQUEMENT lors de la première session de jeu et qui init le plateau
 */
function main() {
	grille = new Array(GRILLE_X);
	for (var i = 0; i < grille.length; i++) {
		grille[i] = new Array(GRILLE_Y).fill(false);
	}
	cadre = document.getElementById('gamezone');
	gamezone = cadre.getContext("2d");
	divScore = document.getElementById('score');
	var divRules = document.getElementById('div_rules');
	divRules.style.display = "none";
	//la gamezone fait la taille de la grille;
	//cadre.style.width = GRILLE_X * TAILLE_CASE + "px";
	//cadre.style.height = GRILLE_Y * TAILLE_CASE + "px";

	dessinerGrille();
	//le bouton régles affiche les regles ou les cache.
	document.getElementById('rules').addEventListener('click', function () {
		if (divRules.style.display == "none") {
			divRules.style.display = "block";
		} else {
			divRules.style.display = "none";
		}
	});
	cadre.addEventListener('keydown', demarrer);
	cadre.addEventListener('click', demarrer);

}
/**
 * on démarre le jeu quand l'utilisateur clique sur la grille
 */

function demarrer() {
	jacques = new serpent();
	redraw();
	cadre.removeEventListener('keydown', demarrer);
	cadre.removeEventListener('click', demarrer);
	document.addEventListener('keydown', function (e) {
		bouger(e);
	});
	placerPomme();
	// pour faire bouger le serpent tout seul;
	setInterval(function (e) {
		bouger(e);
	}, jacques.VITESSE);
}

/**
 * fonction qui réinitialise le jeu LORSQUE LE JOUEUR A PERDU ! =/= de main
 *
 */
 function init() {
	effacerPomme(); //on efface la pomme
	placerPomme(); //on en replace une
	jacques = new serpent(); //on recreer un serpent
}

/**
 * dessine la grille sur le canvas, avec des cases de TAILLE_CASE*TAILLE_CASE
 */
 function dessinerGrille() {
 	effacer();
 	gamezone.strokeStyle = "#000";
 	for (var x = 0; x < GRILLE_X * 15; x += 15) {
 		gamezone.moveTo(x, 0);
 		gamezone.lineTo(x, GRILLE_Y * 15);
 	}

 	for (var y = 0; y < GRILLE_Y * 15; y += 15) {
 		gamezone.moveTo(0, y);
 		gamezone.lineTo(GRILLE_X * 15, y);
 	}
 	gamezone.stroke();
 }


 function bouger(event) {
 	var ancienneDirection = jacques.tete.direction;
 	var dir;
 	if (event == undefined) {
 		for (var corps of jacques.positions) {
 			dir = ancienneDirection;
 			switch(corps.direction){
 				case "HAUT":
 				if (jacques.tete.y - 1 > 0) {
						//jacques.tete.y--;
						corps.y--;
					} else {
						mourir();
					}

					break;
					case "BAS":
					if (jacques.tete.y - 1 < GRILLE_Y - 1) {
						//jacques.tete.y++;
						corps.y++;
						
					} else {
						mourir();
					}
					break;
					case "GAUCHE":
					if (jacques.tete.x - 1 > 0) {
						//jacques.tete.x--;
						corps.x--;
						
					} else {
						mourir();
					}
					break;
					case "DROITE":
					if (jacques.tete.x + 1 < GRILLE_X - 1) {
						//jacques.tete.x++;
						corps.x++;
					} else {
						mourir();
					}
					break;
				}
				ancienneDirection = corps.direction;
				corps.direction = dir;
			}
		} else {
			switch (event.keyCode) {
				case 27:
				alert("PAUSE");
				break;

				case 81:
				case 37:
				jacques.tete.direction = "GAUCHE";
				break;

				case 90:
				case 38:
				jacques.tete.direction = "HAUT";
				break;

				case 68:
				case 39:
				jacques.tete.direction = "DROITE";
				break;

				case 83:
				case 40:
				jacques.tete.direction = "BAS";
			}
		}
		collisionPomme();
		redraw();

	}

/**
 * chaque partie du corps (segmetn du serpent ) est une positon
 * @param {number} x         l'ordonnée
 * @param {number} y         l'abscisse
 * @param {String} direction la direction du serpentr
 * @constructor
 */
 function Position(x, y, direction, isTete) {
 	this.isTete = isTete;
 	this.x = x;
 	this.y = y;
	this.direction = direction; //direction dans lequel se dirige le point (haut, droite, bas, gauche)
}

/**
 * @constructor serpent
 * créer un objet serpent
 */
 function serpent() {
 	this.tete = new Position(0, 0, "DROITE", true);
	//this.queue = new Position(0, 0, "DROITE");
	this.taille = 1;
	this.SCORE = 0;
	this.VITESSE = 350; //la vitesse à laquelle va le serpent; pour aller plus vite, on décrémente la vitesse
	this.positions = [];

	this.positions.push(this.tete);

	//this.queue = this.positions[this.taille-1];

	this.agrandir = function () {
		var queue = this.positions[this.taille - 1]; //le tableau positions commence à 0 et la taille est à 1
		this.taille++;
		console.log(this.positions[0]);
		switch (queue.direction) {
			case "HAUT":
			this.positions.push(new Position(queue.x, queue.y + 1, "HAUT", false));
			console.log("haut++");
			break;

			case "DROITE":
			this.positions.push(new Position(queue.x - 1, queue.y, "DROITE", false));
			console.log("droit++");
			break;

			case "BAS":
			this.positions.push(new Position(queue.x, queue.y - 1, "BAS", false));
			console.log("bas++");
			break;

			case "GAUCHE":
			this.positions.push(new Position(queue.x + 1, queue.y, "GAUCHE", false));
			console.log("gauche++");
			break;
		}
	}
}

/**
 * dessine le corps du serpent.
 * cette fonction est appelée à chaque mouvement du serpent.
 * @return {void}
 */
 function redraw() {
 	var imgCorps = document.getElementById('corps');
	gamezone.strokeStyle = "black"; // couleur de la bordure;
	gamezone.fillStyle = "#0F0"; // couleur de l'interieur;

	dessinerGrille();
	for (var corps of jacques.positions) {
		if (corps.isTete) {
			gamezone.drawImage(document.getElementById('tete' + corps.direction), corps.x * 15, corps.y * 15);
		} else {
			//gamezone.strokeRect(corps.x * TAILLE_CASE, corps.y * TAILLE_CASE, TAILLE_CASE, TAILLE_CASE);
			//gamezone.fillRect(corps.x * TAILLE_CASE, corps.y * TAILLE_CASE, TAILLE_CASE, TAILLE_CASE);
			gamezone.drawImage(imgCorps, corps.x * TAILLE_CASE, corps.y * TAILLE_CASE);
		}
	}
}

/**
 * place une pomme sur le plateau
 * @return {void}
 */
 function placerPomme() {
	pommeY = Math.floor(Math.random() * GRILLE_Y); //x de la pomme choisi aléatoirement
	pommeX = Math.floor(Math.random() * GRILLE_X); //y de la pomme choisi aléatoirement
	grille[pommeX][pommeY] = "pomme";
	var imgPomme = document.getElementById('pom'); //on récupère l'image de la pomme
	gamezone.drawImage(imgPomme, pommeX * TAILLE_CASE, pommeY * TAILLE_CASE); //on dessine la pomme sur le canvas
}

/**
 * teste si le serpent est sur une case pomme.
 * @return {void }
 */
function collisionPomme() {
	if (grille[jacques.tete.x][jacques.tete.y] == "pomme") {
		grille[jacques.tete.x][jacques.tete.y] = false;
		jacques.SCORE += 10;
		if (jacques.VITESSE > 20) {
			jacques.VITESSE -= 20; //on accèlere;
		} //si on est à 20, c'est déjà très rapide !!!

		effacerPomme();
		placerPomme();
		jacques.agrandir();
		divScore.innerHTML = "Votre score est de : " + jacques.SCORE;
	}
}

function mourir() {
	alert("vous avez perdu");
	effacerPomme();
	init();
}

function effacerPomme() {
	grille[pommeX][pommeY] = false;
	gamezone.clearRect(pommeX * TAILLE_CASE, pommeY * TAILLE_CASE, TAILLE_CASE, TAILLE_CASE);
}

function effacer() {
	gamezone.beginPath();
	gamezone.clearRect(0, 0, GRILLE_X * TAILLE_CASE, GRILLE_Y * TAILLE_CASE);
	if (pommeX !== undefined && pommeY != undefined) { //si il y a une pomme, on la redessine
		var imgPomme = document.getElementById('pom'); //on récupère l'image de la pomme
		gamezone.drawImage(imgPomme, pommeX * TAILLE_CASE, pommeY * TAILLE_CASE); //on dessine la pomme sur le canvas
	}

}


function changerTheme(event) {

}
