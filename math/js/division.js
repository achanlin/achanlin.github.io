	var n1;
	var n2;
	function randnum_int(min,max)
	{
		var num=Math.round(Math.random()*(max-min))+min;
		return num;
	}
	
    function check_it()
	{
		var vAnswer =document.getElementById("maths").answer.value;
		var nAnswer=parseInt(vAnswer);
		var mytext=document.getElementById("comments");
		var q_before=parseInt(document.getElementById("maths").questions.value);
		var r_before=parseInt(document.getElementById("maths").rights.value); 
		var w_before=parseInt(document.getElementById("maths").wrongs.value);
		var q_after=q_before+1;   
		var nCorrectAnswer=n1/n2;
		document.getElementById("correct_answer").value=nCorrectAnswer;
		document.getElementById("maths").questions.value=q_after;
    
		if (nAnswer==nCorrectAnswer){
			mytext.innerHTML="That is right!Good job!";
			var r_after=r_before+1;
			document.getElementById("maths").rights.value=r_after;}
		else {
			mytext.innerHTML="Oh,Oh! Wrong...." ;
			var w_after=w_before+1;
			document.getElementById("maths").wrongs.value=w_after;}
   }
    
	function finish()
	{
		var vq=document.getElementById("maths").questions.value;
		var vr=document.getElementById("maths").rights.value; 
		var vw=document.getElementById("maths").wrongs.value;
		var nq=parseInt(vq);
		var nr=parseInt(vr);
		
    	if (nq<=0) nq=1;
		
    	var nPer=Math.round(nr/nq*100);
		var sPer=nPer.toString();
		var myText=document.getElementById("comments");
		var s1="You have practiced  ";
		var s2="  questions. You have done  ";
		var s3="  questions right. That is ";
		var s4="% right. Great job!"
		var ss=s1.concat(vq,s2, vr,s3, sPer, s4) 
		myText.innerHTML=ss;
	} 
	function start_game()
	{
		document.getElementById("maths").questions.value="0";
		document.getElementById("maths").rights.value="0";
		document.getElementById("maths").wrongs.value="0";
		document.getElementById("maths").answer.value="";
		document.getElementById("maths").correct_answer.value ="";	
		n2=randnum_int(1,10);
		n1=n2*randnum_int(1,10);
		document.getElementById("maths").number1.value=n1;
		document.getElementById("maths").number2.value=n2;

	}
  
  
	function get_question()
	{
		n2=randnum_int(1,10);
		n1=n2*randnum_int(1,10);
		document.getElementById("maths").number1.value=n1;
		document.getElementById("maths").number2.value=n2;
		document.getElementById("maths").answer.value = "" ;
		document.getElementById("maths").correct_answer.value ="";
	}
  
  