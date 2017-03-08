const GRILLE_Y = 30; //taille des colonnes de la grille
const GRILLE_X = 60; //taille des lignes de la grilee
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
	//la gamezone fait la taille de la grille;
	cadre.style.width = GRILLE_X * 15 + "px";
	cadre.style.height = GRILLE_Y * 15 + "px";

	dessinerGrille();
	//le bouton régles affiche les regles ou les cache.
	document.getElementById('rules').addEventListener('click', function() {
		if (document.getElementById('div_rules').style.display == "none") {
			document.getElementById('div_rules').style.display = "block";
		} else {
			document.getElementById('div_rules').style.display = "none";
		}
	});
	document.addEventListener('keydown', demarrer);
	document.addEventListener('click', demarrer);

}
/**
 * on démarre le jeu quand l'utilisateur clique sur la grille
 */
function demarrer(){
	document.removeEventListener('keydown',demarrer);
	document.removeEventListener('click',demarrer);
	document.addEventListener('keydown', function(e) {
		bouger(e);
	});
	jacques = new serpent();
	placerPomme();
	setInterval(function(e) {
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
 * dessine la grille sur le canvas, avec des cases de 15*15
 */
function dessinerGrille() {
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
	if (event == undefined) {
		switch (jacques.tete.direction) {
			case "HAUT":
				if (jacques.tete.y - 1 > 0) {
					jacques.tete.y--;
				} else {
					mourir();
				}
				break;
			case "BAS":
				if (jacques.tete.y - 1 < GRILLE_Y - 1) {
					jacques.tete.y++;
				} else {
					mourir();
				}
				break;
			case "GAUCHE":
				if (jacques.tete.x - 1 > 0) {
					jacques.tete.x--;
					jacques.tete.direction = "GAUCHE";
				} else {
					mourir();
				}
				break;
			default:
				if (jacques.tete.x + 1 < GRILLE_X - 1) {

					jacques.tete.x++;
				} else {
					mourir();
				}
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
function Position(x, y, direction) {
	this.x = x;
	this.y = y;
	this.direction = direction; //direction dans lequel se dirige le point (haut, droite, bas, gauche)
}

/**
 * @constructor serpent
 * créer un objet serpent
 */
function serpent() {
	this.tete = new Position(0, 0, "DROITE");
	this.queue = new Position(0, 0, "DROITE");
	this.taille = 1;
	this.SCORE = 0;
	this.VITESSE = 300; //la vitesse à laquelle va le serpent; pour aller plus vite, on décrémente la vitesse
	this.positions = [];
	this.positions.push(this.tete);
	this.agrandir = function() {
		this.taille++;
		switch (this.queue.direction) {
			case "HAUT":
				this.positions.push(new Position(this.queue.x, this.queue.y + 1, "HAUT"));
				break;

			case "DROITE":
				this.positions.push(new Position(this.queue.x - 1, this.queue.y, "DROITE"));
				break;

			case "BAS":
				this.positions.push(new Position(this.queue.x, this.queue.y - 1, "BAS"));
				break;

			case "GAUCHE":
				this.positions.push(new Position(this.queue.x + 1, this.queue.y, "GAUCHE"));
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
	gamezone.strokeStyle = "black"; // couleur de la bordure;
	gamezone.fillStyle = "#0F0"; // couleur de l'interieur;
	for (var corps of jacques.positions) {
		gamezone.strokeRect(corps.x * 15, corps.y * 15, 15, 15);
		gamezone.fillRect(corps.x * 15, corps.y * 15, 15, 15);
	}
}

/**
 * place une pomme sur le plateau
 * @return {void}
 */
function placerPomme() {
	pommeY = Math.floor(Math.random() * GRILLE_Y); //x de la pomme choisi aléatoirement
	pommeX = Math.floor(Math.random() * GRILLE_X); //y de la pomme choisi aléatoirement
	console.log("Pomme X: " + pommeX + " Pomme Y: " + pommeY);
	grille[pommeX][pommeY] = "pomme"; //FIXME: crée "pomme" dans tout pommeX à l'index pommeY
	var imgPomme = document.getElementById('pom'); //on récupère l'image de la pomme
	gamezone.drawImage(imgPomme, pommeX * 15, pommeY * 15); //on dessine la pomme sur le canvas
}

/**
 * teste si le serpent est sur une case pomme.
 * @return {void }
 */
function collisionPomme() {
	//console.log("la case " + jacques.tete.x + "," + jacques.tete.y + " contient " + grille[jacques.tete.x][jacques.tete.y]);
	if (grille[jacques.tete.x][jacques.tete.y] == "pomme") {
		console.log("x = " + jacques.tete.x);
		console.log("y = " + jacques.tete.y);
		grille[jacques.tete.x][jacques.tete.y] = false;
		jacques.SCORE += 10;
		jacques.VITESSE-=10;
		effacerPomme();
		placerPomme();
		jacques.agrandir();
		divScore.innerHTML = "Votre score est de : " + jacques.score;
	}
}

function mourir() {
	alert("vous avez perdu");
	effacerPomme();
	init();
}

function effacerPomme() {
	grille[pommeX][pommeY] = false;
	gamezone.clearRect(pommeX * 15, pommeY * 15, 15, 15);
}
