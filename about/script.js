
function show(a){
	if(document.getElementById(a).classList.contains("hide"))
		document.getElementById(a).classList.remove("hide");
	else
		document.getElementById(a).classList.add("hide");
}