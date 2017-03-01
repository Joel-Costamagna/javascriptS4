function main (arguments) {

	var cadre = document.getElementById('gamezone');
	var gamezone = cadre.getContext("2d");
	document.getElementById('rules').addEventListener('click', function () {
		alert("c'est trés simple : ");
	})

	document.addEventListener('keydown', function(e, gamezone) {
				bouger(e, gamezone);
	});


}

function bouger(event) {
	switch (event.keyCode) {
		case 81:
		case 37:
			//gauche
			alert("vous allez à gauche");
			break;

		case 90:
		case 38:
			//haut
			alert("vous allez en haut");
			break;

		case 68:
		case 39:
			//droite
			alert("vous allez à droite");
			break;

		case 83:
		case 40:
			//bas
			alert("vous allez en bas");
			break;
		default:
			alert("utilisez ZQSD pour se déplacer");
	}
}
