
	var cube0 = $(".cube").cube({
		color: [
			"rgb(240,36,36)", //front red
			"rgb(16,150,16)", //right green
			"rgb(255,150,56)", //back orange
			"rgb(86,56,250)", //blue
			"rgb(250,250,56)", //up yellow
			"rgb(240,240,240)" //down white
		],
		animation: {
			delay: 500
		}
	});
	var cube = $(".cube").data("_cube");
	var options = cube.getOptions();  
	
	document.querySelector('#control').addEventListener("click", inputClick, false);
	function inputClick(e){
		options.animation.delay = 500;
       	var move = e.target.value;
		cube.execute(move);}
		
		
	function runContinuously(){
		options.animation.delay = 1000;
		var move= document.getElementById("run").value;
		cube.execute(move);}
		
	function getInitialStatus(){
		options.animation.delay = 100;
		var iniStatus = document.getElementById("ini").name;
		cube.execute(iniStatus);}
		
	function getInitialStatus2(){
		options.animation.delay = 100;
		var iniStatus = document.getElementById("ini2").name;
		cube.execute(iniStatus);}

	function getInitialStatus3(){
		options.animation.delay = 100;
		var iniStatus = document.getElementById("ini3").name;
		cube.execute(iniStatus);}
		
	function getInitialStatus4(){
		options.animation.delay = 100;
		var iniStatus = document.getElementById("ini4").name;
		cube.execute(iniStatus);}
		
	function getInitialStatus5(){
		options.animation.delay = 100;
		var iniStatus = document.getElementById("ini5").name;
		cube.execute(iniStatus);}		
		
	function refresh_the_page() {
    location.reload();}
		
	function messItUp(){
		var possible = ["U","u","R","r","D","d","L","l","F","f","B","b","M","E","S","X","Y","Z", "U'","u'","R'","r'","D'","d'","L'","l'","F'","f'","B'","b'","M'","E'","S'","X'","Y'","Z'","U2","u2","R2","r2","D2","d2","L2","l2","F2","f2","B2","b2","M2","E2","S2","X2","Y2","Z2"];
		var text="";
		for (var i = 0; i < 10; i++) {
			var randomInt = Math.floor(Math.random() * 45);
			text +=possible[randomInt];
			text +=" ";}
		options.animation.delay = 100;	
		cube.execute(text);
	//	document.getElementById('mess').innerHTML = text;
		}
	
	
	
