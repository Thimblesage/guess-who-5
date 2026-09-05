const QUESTIONS=["Does your character wear glasses OR have a moustache?", "Is exactly ONE of these true: black hair OR short hair?", "Does your character have white hair OR a large nose?", "Is your character bald OR wearing a hat?", "Is your character bald OR do they have a large mouth?"];
const QUESTION_HELP=["", "YES if exactly one is true. NO if both are true or neither is true.", "", "", ""];
const CHARACTERS={"10001": "Alex", "10000": "Alfred", "00000": "Anita", "00100": "Anne", "01110": "Bernard", "00011": "Bill", "11001": "Charles", "11010": "Claire", "01001": "David", "01011": "Eric", "01000": "Frans", "01111": "George", "00111": "Herman", "11000": "Joe", "00010": "Maria", "10101": "Max", "11100": "Paul", "01101": "Peter", "00001": "Philip", "10011": "Richard", "01100": "Robert", "10111": "Sam", "00101": "Susan", "11011": "Tom"};
const IMAGE_EXTENSIONS=["jpg","jpeg","png","webp"];
let answers=[];let current=0;

const screens={
 start:document.getElementById("screen-start"),
 question:document.getElementById("screen-question"),
 result:document.getElementById("screen-result"),
 error:document.getElementById("screen-error")
};

function showScreen(name){
 Object.values(screens).forEach(s=>s.classList.remove("active"));
 screens[name].classList.add("active");
}

function renderQuestion(){
 document.getElementById("question-num").textContent=current+1;
 document.getElementById("progress-label").textContent=`${current+1} of ${QUESTIONS.length}`;
 document.getElementById("question-text").textContent=QUESTIONS[current];
 document.getElementById("question-help").textContent=QUESTION_HELP[current]||"";
 document.querySelectorAll(".progress span").forEach((el,i)=>el.classList.toggle("done",i<=current));
}

function startGame(){
 answers=[];current=0;showScreen("question");renderQuestion();
}

function answer(v){
 answers[current]=v?"1":"0";
 current++;
 if(current>=QUESTIONS.length) finish(); else renderQuestion();
}

function finish(){
 const code=answers.join("");
 const name=CHARACTERS[code];
 if(!name){
   document.getElementById("error-code").textContent=code.replaceAll("1","Y").replaceAll("0","N");
   showScreen("error"); return;
 }
 document.getElementById("character-name").textContent=name;
 document.getElementById("answer-code").textContent=code.split("").map(x=>x==="1"?"Y":"N").join(" · ");
 loadCharacterImage(name);
 showScreen("result");
}

function loadCharacterImage(name){
 const img=document.getElementById("character-image");
 const ph=document.getElementById("portrait-placeholder");
 img.hidden=true;ph.hidden=false;
 const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,"-");
 let i=0;
 function tryNext(){
   if(i>=IMAGE_EXTENSIONS.length)return;
   img.src=`images/${slug}.${IMAGE_EXTENSIONS[i++]}`;
 }
 img.onload=()=>{ph.hidden=true;img.hidden=false;};
 img.onerror=tryNext;
 tryNext();
}

document.getElementById("start-btn").addEventListener("click",startGame);
document.getElementById("again-btn").addEventListener("click",startGame);
document.getElementById("retry-btn").addEventListener("click",startGame);
document.getElementById("yes-btn").addEventListener("click",()=>answer(true));
document.getElementById("no-btn").addEventListener("click",()=>answer(false));
document.getElementById("back-btn").addEventListener("click",()=>{
 if(current===0){showScreen("start");return;}
 current--;answers=answers.slice(0,current);renderQuestion();
});
