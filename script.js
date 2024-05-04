
async function readfile(URL){//傳入網址，回傳該檔案內容
	console.debug("[DBG]fetching file: \""+URL+"\"");
	let fe=await fetch(URL);
	data=await fe.text();
	console.debug("[DBG]file fetched! \""+URL+"\"");
	console.debug("["+URL+"]\n"+data);
	return data;
}


function stoJSON(str){
	return eval("("+str+")");
}

function stoHTML(str){//將字串轉換成HTML
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

async function init(){//初始化
	enable=0;
	qlist=stoJSON(await readfile("./data.jsonc"));
	btn_temp=await readfile("./button.html");
	enable=1
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
			ans="開發者KagariET01最喜歡的自由主義"
		}
	if(ans=="")
		if(score["後現代主義"]>=20){
			ans="後現代主義";
		}
	if(ans==""){
		
	}
	

	
	if(ans==""){
		for(let [i,j] of Object.entries(score)){
			if(nwmx<j){
				nwmx=j;
				ans=i;
			}
		}
	}
	document.getElementById("res_txt").innerHTML=ans;
	next("res");
	setTimeout(()=>{document.getElementById("res_div").classList.remove("hide");},2500);
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
	console.log("[DBG]now p:"+String(nwpid))
	console.log(nw)

	if(nwpid>=qlist.length){
		ed();
		return;
	}

	
	// console.log("nw: "+String(nw));
	document.getElementById("Q").innerHTML=nw.Q;
	document.getElementById("A").innerHTML="";
	for(let i=0;i<nw.A.length;i++){
		let fn="pbtn("+String(i)+")";
		let v=nw.A[i].value;
		document.getElementById("A").innerHTML+=eval("`"+btn_temp+"`");
	}
	//setTimeout(() => hideP(0), 250);
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
		console.log("[DBG]get click")
		enable=0;
		//hideP(1);
		if(id==-1){
			nwpid=-1;
			nwqlst=qlist;
		}else{
			if("action" in (nwqlst[nwpid].A[id])){
				let act=nwqlst[nwpid].A[id].action
				for(let i of act){
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
		console.log("[DBG]now disable")
		return 0;
	}
}

(async()=>{init();})()

