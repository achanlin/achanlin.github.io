
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
		
	function runContinuously1(){
		options.animation.delay = 1000;
		var move= document.getElementById("run1").value;
		cube.execute(move);}	
		
	function runContinuously2(){
		options.animation.delay = 1000;
		var move= document.getElementById("run2").value;
		cube.execute(move);}	
	
	function runContinuously3(){
		options.animation.delay = 1000;
		var move= document.getElementById("run3").value;
		cube.execute(move);}
		
	function runContinuously4(){
		options.animation.delay = 1000;
		var move= document.getElementById("run4").value;
		cube.execute(move);}
		
	function runContinuously5(){
		options.animation.delay = 1000;
		var move= document.getElementById("run5").value;
		cube.execute(move);}	
		
	function runContinuously6(){
		options.animation.delay = 1000;
		var move= document.getElementById("run6").value;
		cube.execute(move);}	
	
	function getInitialStatus(){
		options.animation.delay = 100;
		var iniStatus = document.getElementById("ini").name;
		cube.execute(iniStatus);}
		
	function getInitialStatus1(){
		options.animation.delay = 100;
		var iniStatus = document.getElementById("ini1").name;
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
			
	function getInitialStatus6(){
		options.animation.delay = 100;
		var iniStatus = document.getElementById("ini6").name;
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
	}
	
	function messItUpF44(){//e, m, s are two rows or columns.
		var possible = ["U","R","D","L","F","B","m","e","s","X","Y","Z", "U'","R'","D'","L'","F'","B'","m'","e'","s'","X'","Y'","Z'","U2","R2","D2","L2","F2","B2","m2","e2","s2","X2","Y2","Z2"];

		var text="";
		for (var i = 0; i < 35; i++) {
			var randomInt = Math.floor(Math.random() * 100);
			text +=possible[randomInt];
			text +=" ";}
		options.animation.delay = 100;	
	cube.execute(text);
	}
	
	function messItUpF55(){ //if use the other 5x5js file, the E, M,S takes three rows or columns, so it basically a 3x3 cube. It was not used.
		var possible = ["U","R","D","L","F","B","M","E","S","X","Y","Z", "U'","R'","D'","L'","F'","B'","M'","E'","S'","X'","Y'","Z'","U2","R2","D2","L2","F2","B2","M2","E2","S2","X2","Y2","Z2"];

		var text="";
		for (var i = 0; i < 15; i++) {
			var randomInt = Math.floor(Math.random() * 100);
			text +=possible[randomInt];
			text +=" ";}
		options.animation.delay = 100;	
	cube.execute(text);
	//	document.getElementById('mess').innerHTML = text;
	}
	
	
	
