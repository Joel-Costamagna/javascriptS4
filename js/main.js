const GRILLE_Y = 30; //nombre de lignes
const GRILLE_X = 60; //nombre de colonnes
const TAILLE_CASE = 15;

var grille;
var cadre;
var gamezone;
var jacques; //le serpent
var fruit;
var divScore;
var GAMELOOP;
var TIMER;
var duree;

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
	document.getElementById('Theme').addEventListener('change', changerTheme);
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
	GAMELOOP = setInterval(function (e) {
		bouger(e);
	}, jacques.VITESSE);
	duree = 0;
	TIMER = setInterval(changerTemps, 1000);
}

/**
 * fonction qui réinitialise le jeu LORSQUE LE JOUEUR A PERDU ! =/= de main
 *
 */
 function init() {
	effacerPomme(); //on efface la pomme
	placerPomme(); //on en replace une
	jacques = new serpent(); //on recreer un serpent
	//reset de la vitesse;
	clearInterval(GAMELOOP);
	GAMELOOP = setInterval(function (e) {
		bouger(e);
	}, jacques.VITESSE);
	duree=0;

}

/**
 * dessine la grille sur le canvas, avec des cases de TAILLE_CASE*TAILLE_CASE
 */
 function dessinerGrille() {
 	effacer();
 	gamezone.strokeStyle = "#000";
 	for (var x = 0; x < GRILLE_X * TAILLE_CASE; x += TAILLE_CASE) {
 		gamezone.moveTo(x, 0);
 		gamezone.lineTo(x, GRILLE_Y * TAILLE_CASE);
 	}

 	for (var y = 0; y < GRILLE_Y * TAILLE_CASE; y += TAILLE_CASE) {
 		gamezone.moveTo(0, y);
 		gamezone.lineTo(GRILLE_X * TAILLE_CASE, y);
 	}
 	gamezone.stroke();
 }


 function bouger(event) {
 	var ancienneDirection = jacques.tete.direction;
 	var dir;
 	if (event == undefined) {
		//console.log("tete : "+jacques.tete.x + " , "+jacques.tete.y);
		for (var corps of jacques.positions) {
			dir = ancienneDirection;
			switch (corps.direction) {
				case "HAUT":
				if (jacques.tete.y > 0) {
						//jacques.tete.y--;
						corps.y--;
					} else {
						mourir();
					}

					break;
					case "BAS":
					if (jacques.tete.y + 1 < GRILLE_Y) {
						//jacques.tete.y++;
						corps.y++;

					} else {
						mourir();
					}
					break;
					case "GAUCHE":
					if (jacques.tete.x > 0) {
						//jacques.tete.x--;
						corps.x--;

					} else {
						mourir();
					}
					break;
					case "DROITE":
					if (jacques.tete.x + 1 < GRILLE_X) {
						//jacques.tete.x++;
						corps.x++;
					} else {
						mourir();
					}
					break;
				}
				ancienneDirection = corps.direction;
				corps.direction = dir;
			//on place serpent dans les cases ou il y a le serpent, pour gérer les collisions avec le corps.
			if (grille[corps.x][corps.y] != "pomme" && corps.isTete == false) {
				grille[corps.x][corps.y] = "serpent";
			}
		}
	} else {
		switch (event.keyCode) {
			case 27:
			pause();
			finPause();
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
	collisionCorps();
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
	divScore.innerHTML = "votre score est de : " + this.SCORE;
	this.VITESSE = 300; //la vitesse à laquelle va le serpent; pour aller plus vite, on décrémente la vitesse
	this.positions = [];

	this.positions.push(this.tete);

	//this.queue = this.positions[this.taille-1];

	this.agrandir = function () {
		var queue = this.positions[this.taille - 1]; //le tableau positions commence à 0 et la taille est à 1
		this.taille++;
		switch (queue.direction) {
			case "HAUT":
			this.positions.push(new Position(queue.x, queue.y + 1, "HAUT", false));
			break;

			case "DROITE":
			this.positions.push(new Position(queue.x - 1, queue.y, "DROITE", false));
			break;

			case "BAS":
			this.positions.push(new Position(queue.x, queue.y - 1, "BAS", false));
			break;

			case "GAUCHE":
			this.positions.push(new Position(queue.x + 1, queue.y, "GAUCHE", false));
			break;
		}
	}
}

/**
 * @constructor pomme
 *
 */
 function pomme(){
 	this.x = Math.floor(Math.random() * GRILLE_X);
 	this.y = Math.floor(Math.random() * GRILLE_Y);
	if(Math.random() > 0.7){ // on a 30% de chance qu la pomme soit un bonus;
		this.txt = "grossepomme";
		this.img = document.getElementById('grossepom');
	}else {
		this.txt = "pomme";
		this.img = document.getElementById('pom');
	}
}


/**
 * dessine le corps du serpent.
 * cette fonction est appelée à chaque mouvement du serpent.
 * @return {void}
 */
 function redraw() {
 	var imgCorps = document.getElementById('corps');
 	dessinerGrille();
 	for (var corps of jacques.positions) {
 		if (corps.isTete) {
 			gamezone.drawImage(document.getElementById('tete' + corps.direction), corps.x * TAILLE_CASE, corps.y * TAILLE_CASE);
 		} else {
 			gamezone.drawImage(imgCorps, corps.x * TAILLE_CASE, corps.y * TAILLE_CASE);
 		}
 	}
 }

/**
 * place une pomme sur le plateau
 * @return {void}
 */
 function placerPomme() {
 	fruit = new pomme();
 	grille[fruit.x][fruit.y] = fruit.txt;
	gamezone.drawImage(fruit.img, fruit.x * TAILLE_CASE, fruit.y * TAILLE_CASE); //on dessine la pomme sur le canvas
}

/**
 * teste si le serpent est sur une case pomme.
 * @return {void }
 */
 function collisionPomme() {
 	if (grille[jacques.tete.x][jacques.tete.y] == "pomme") {
 		console.log("pomme");
 		jacques.SCORE += 10;
 		if (jacques.VITESSE > 30) {
			jacques.VITESSE -= 20; //on accèlere;
			clearInterval(GAMELOOP);
			GAMELOOP = setInterval(function (e) {
				bouger(e);
			}, jacques.VITESSE);
			jacques.agrandir();
			effacerPomme();
			placerPomme();
		}
	} else if (grille[jacques.tete.x][jacques.tete.y] == "grossepomme") {
		console.log("grosse pomme");
		jacques.score += 50;
		if(jacques.VITESSE > 60) {
			jacques.vitesse -= 50;
			GAMELOOP = setInterval(function (e) {
				bouger(e);
			}, jacques.VITESSE);
			//on agrandit de 3 fois;
			jacques.agrandir();
			jacques.agrandir();
			jacques.agrandir();
			effacerPomme();
			placerPomme();
		}
	}
	divScore.innerHTML = "Votre score est de : " + jacques.SCORE;
}


function collisionCorps() {
	if (grille[jacques.tete.x][jacques.tete.y] == "serpent") {
		mourir();
	}
}


function mourir() {
	alert("vous avez perdu");
	init();
}

function effacerPomme() {
	grille[fruit.x][fruit.y] = false;
	gamezone.clearRect(fruit.x * TAILLE_CASE, fruit.y * TAILLE_CASE, TAILLE_CASE, TAILLE_CASE);
}

function effacer() {
	gamezone.beginPath();
	gamezone.clearRect(0, 0, GRILLE_X * TAILLE_CASE, GRILLE_Y * TAILLE_CASE);
	for (var i = 0; i < grille.length; i++) {
		grille[i] = new Array(GRILLE_Y).fill(false);
	}
	if (fruit !== undefined && fruit.x !== undefined && fruit.y !== undefined) { //si il y avait une pomme, on la redessine
		grille[fruit.x][fruit.y] = fruit.txt;
		gamezone.drawImage(fruit.img, fruit.x * TAILLE_CASE, fruit.y * TAILLE_CASE); //on dessine la pomme sur le canvas
	}
}


function changerTheme(event) {
	//TODO : changer la couleur.
	console.log("thème changé");
	switch (document.getElementById('Theme').value) {
		case "BLUE":
		document.body.style.background = "RGBA(46, 140, 207, 1.00)";
		cadre.style.boxShadow = "0 0 40px rgb(207,112,44)";
			//cadre.style.background = "grey";
			document.body.style.color = "black";
			break;
			case "RED":
			document.body.style.background = "rgb(115,52,52)";
			cadre.style.boxShadow = "0 0 40px rgb(52,115,115)";
			//cadre.style.background = "grey";
			document.body.style.color = "black";
			break;
			case "SOLARIZED":
			document.body.style.background = "#002b36";
			cadre.style.boxShadow = "0 0 40px #cb4b16";
			//cadre.style.background = "grey";
			document.body.style.color = "#93a1a1";
			break;
			case "CLAIR":
			document.body.style.background = "lightgrey";
			cadre.style.boxShadow = "0 0 40px red";
			//cadre.style.background = "grey";
			document.body.style.color = "black";
			break;
			default:
			document.body.style.background = "RGBA(38, 50, 56, 1.00)";
			document.body.style.color = "white";
			cadre.style.boxShadow = "0 0 40px green";
			break;
		}
	}

	function changerTemps() {
	duree += 1000; //comme la fonction est appelée toute les secondes, on ajoute 1 à chaque appel.
	var date = new Date(duree);
	document.getElementById('temps')
	.innerHTML = "Vous jouez depuis " + date.getMinutes() + "m " + date.getSeconds() + "s";
}

function pause () {
	alert("c'est l'heure du café ? ");
	clearInterval(TIMER);
}

function finPause () {
	//on reprend le timer;
	TIMER = setInterval( changerTemps, 1000);
}
