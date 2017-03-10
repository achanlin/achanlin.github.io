
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
	function refresh_the_page() {
    location.reload();
	}