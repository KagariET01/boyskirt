let hookURL="https://discord.com/api/webhooks/1237984640728563752/hPIl9KUcRT3OgEAHqbU77RP2QTqxLcAAYE2EMIJJCU7jxxKeZPqzUy7QHlVREHBuGe_H";
let jump_fast=false;

function bomb(){
	let allow_host=[
		"https://kagariet01.github.io/",
		"172.24.0.2"
	];
	for(let i of allow_host){
		if(window.location.href.includes(i)){
			return;
		}
	}
	console.log("我糙你媽");
	document.innerHTML="";
	window.location.href="https://kagariet01.github.io/boyskirt";
}

async function readfile(URL){
	//console.debug("[DBG]fetching file: \""+URL+"\"");
	let fe=await fetch(URL);
	data=await fe.text();
	//console.debug("[DBG]file fetched! \""+URL+"\"");
	//console.debug("["+URL+"]\n"+data);
	return data;
}


function stoJSON(str){
	return eval("("+str+")");
}

function stoHTML(str){
	let re=document.createElement('div');
	re.innerHTML=str.trim();
	return re;
}

let score={};
let qlist;
let btn_temp;
let enable=0;
let nwqlst=[];

console.debug(qlist);

function reset(){
	score={};
}

async function init(){
	enable=0;
	bomb();
	qlist=stoJSON(await readfile("./data.jsonc"));
	btn_temp=await readfile("./button.html");
	document.getElementById("st_btn").innerHTML="start";
	bomb();
	enable=1;
}

function next(nx){
	document.getElementById(nx).classList.remove("hide");

	if(nx!="op")
		document.getElementById("op").classList.add("hide");
	if(nx!="form")
		document.getElementById("form").classList.add("hide");
	if(nx!="res")
		document.getElementById("res").classList.add("hide");
}
function ed(){
	console.log(score);
	let ans="",nwmx=0;

	if(ans=="")
		if(score.ET01==10){
			ans="KagariET01最愛小ㄌㄌ了";
		}
	if(ans=="")
		if(score["後現代主義"]>=20){
			ans="後現代主義";
		}
	if(ans==""){
		for(let [i,j] of Object.entries(score)){
			if(nwmx<j){
				nwmx=j;
				ans=i;
			}
		}
	}

	if(jump_fast){
		window.location.href=`./res/${ans}.png`;
	}else{
		document.getElementById("res_txt").innerHTML=ans;
		document.getElementById("res_txt").outerHTML+=`<a href="res/${ans}.png" class="res_img"><img src="res/${ans}.png" class="res_img" alt="圖片載入失敗"></a>`
		document.getElementById("res_txt").outerHTML+="<h4>點那個圖！</h4>"
		next("res");
		setTimeout(()=>{document.getElementById("res_div").classList.remove("hide");},2500);
		setTimeout(()=>{document.getElementById("res_div").classList.remove("hide_res_pic");},3500);
	}
}

let nwpid=0;

function hideP(b=true){
	if(b){
		document.getElementById("Q").classList.add("hide_content");
		document.getElementById("A").classList.add("hide_content");
	}else{
		document.getElementById("Q").classList.remove("hide_content");
		document.getElementById("A").classList.remove("hide_content");
	}
}

function showP(){
	nw=nwqlst[nwpid];
	console.log("[DBG]now p:"+String(nwpid));
	console.log(nw);

	if(nwpid>=qlist.length){
		ed();
		return;
	}

	
	document.getElementById("Q").innerHTML="<div id=\"QtxtTop\"></div>"+nw.Q;
	document.getElementById("A").innerHTML="<div id=\"ATop\"></div>";
	document.getElementById("Qnum").innerHTML=`第${nwpid}題`;
	for(let i=0;i<nw.A.length;i++){
		let fn="pbtn("+String(i)+")";
		let v=nw.A[i].value;
		document.getElementById("A").innerHTML+=eval("`"+btn_temp+"`");
	}
	document.getElementById("ATop").scrollIntoView();
	document.getElementById("QtxtTop").scrollIntoView();
	document.getElementById("qjump").scrollIntoView({behavior: "smooth"});
	enable=1;
	
}

function nextP(){
	nwpid++;
	if(nwpid>=nwqlst.length){
		console.log("end");
		ed();
	}else{
		showP();
	}
}

function pbtn(id){
	if(enable){
		console.log("[DBG]get click");
		enable=0;
		if(id==-1){
			nwpid=-1;
			nwqlst=qlist;
			document.getElementById("body").classList.remove("bg");
		}else{
			if("action" in (nwqlst[nwpid].A[id])){
				let act=nwqlst[nwpid].A[id].action;
				for(let i of act){
					if(i.vname=="report"){
						let req=new XMLHttpRequest();
						req.open("POST",hookURL);
						req.setRequestHeader('Content-type', 'application/json');
						req.send(`{"content":"${nwqlst[nwpid].A[id].value}","embeds": null,"attachments": []}`);
						continue;
					}
					if(!(i.vname in score))score[i.vname]=0;
					score[i.vname]+=i.delta;
				}
			}
	
			if("branch" in (nwqlst[nwpid].A[id])){
				for(let i=0;i<nwqlst[nwpid].A[id].branch.length;i++){
					nwqlst.splice(nwpid+i+1,0,nwqlst[nwpid].A[id].branch[i]);
				}
			}
		}
		nextP();
		return 1;
	}else{
		console.log("[DBG]now disable");
		return 0;
	}
}

(async()=>{init();})();


