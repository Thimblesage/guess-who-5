const QUESTIONS = [
  'Does your character wear <strong>GLASSES</strong> <span class="or">OR</span> have a <strong>TINY NOSE</strong>?',
  'Does your character have a <strong>BEARD</strong> <span class="or">OR</span> <strong>WHITE HAIR</strong>?',
  'Does your character have <strong>BLACK HAIR</strong> <span class="or">OR</span> <strong>ORANGE HAIR</strong>?',
  'Is your character a <strong>WOMAN</strong> <span class="or">OR</span> wearing a <strong>HAT</strong> <span class="or">OR</span> <strong>BALD</strong>?',
  'Does your character have a <strong>MOUSTACHE</strong> <span class="or">OR</span> is <strong>BALD</strong> <span class="or">OR</span> have <strong>YELLOW HAIR</strong>?'
];

const QUESTION_HELP = [
  '', '', '',
  'If ANY ONE of these is true, answer YES.',
  'If ANY ONE of these is true, answer YES.'
];

// Verified v2 five-question lookup. 1 = YES, 0 = NO.
const CHARACTERS = {
  '10101':'Alex',
  '01101':'Alfred',
  '11010':'Anita',
  '00110':'Anne',
  '00010':'Bernard',
  '01111':'Bill',
  '00001':'Charles',
  '10110':'Claire',
  '01001':'David',
  '00011':'Eric',
  '00100':'Frans',
  '01010':'George',
  '00111':'Herman',
  '10001':'Joe',
  '10010':'Maria',
  '00101':'Max',
  '11000':'Paul',
  '01000':'Peter',
  '01100':'Philip',
  '01011':'Richard',
  '00000':'Robert',
  '11011':'Sam',
  '10011':'Susan',
  '10111':'Tom'
};

const IMAGE_EXTENSIONS=['jpg','jpeg','png','webp'];
let answers=[];
let current=0;

const screens={
  start:document.getElementById('screen-start'),
  question:document.getElementById('screen-question'),
  result:document.getElementById('screen-result'),
  error:document.getElementById('screen-error')
};

function showScreen(name){
  Object.values(screens).forEach(s=>s.classList.remove('active'));
  screens[name].classList.add('active');
}

function renderQuestion(){
  document.getElementById('question-num').textContent=current+1;
  document.getElementById('progress-label').textContent=`${current+1} of ${QUESTIONS.length}`;
  document.getElementById('question-text').innerHTML=QUESTIONS[current];
  document.getElementById('question-help').textContent=QUESTION_HELP[current]||'';
  document.getElementById('back-btn').hidden=current===0;
  document.querySelectorAll('.progress span').forEach((el,i)=>el.classList.toggle('done',i<=current));
}

function startGame(){
  answers=[];
  current=0;
  showScreen('question');
  renderQuestion();
}

function answer(v){
  answers[current]=v?'1':'0';
  current++;
  if(current>=QUESTIONS.length) finish();
  else renderQuestion();
}

function finish(){
  const code=answers.join('');
  const name=CHARACTERS[code];
  if(!name){
    document.getElementById('error-code').textContent=toYN(code);
    showScreen('error');
    return;
  }
  document.getElementById('character-name').textContent=name;
  document.getElementById('answer-code').textContent=code.split('').map(x=>x==='1'?'Y':'N').join(' · ');
  loadCharacterImage(name);
  showScreen('result');
}

function toYN(code){
  return code.replaceAll('1','Y').replaceAll('0','N');
}

function goBack(){
  // From a result/error screen, return to Question 5 and remove that answer.
  if(current>=QUESTIONS.length){
    current=QUESTIONS.length-1;
    answers=answers.slice(0,current);
    showScreen('question');
    renderQuestion();
    return;
  }

  // While answering, step back one question and remove its previous answer.
  if(current>0){
    current--;
    answers=answers.slice(0,current);
    renderQuestion();
  }
}

function loadCharacterImage(name){
  const img=document.getElementById('character-image');
  const ph=document.getElementById('portrait-placeholder');
  img.hidden=true;
  ph.hidden=false;
  const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
  let i=0;
  function tryNext(){
    if(i>=IMAGE_EXTENSIONS.length)return;
    img.src=`images/${slug}.${IMAGE_EXTENSIONS[i++]}`;
  }
  img.onload=()=>{ph.hidden=true;img.hidden=false;};
  img.onerror=tryNext;
  tryNext();
}

document.getElementById('start-btn').addEventListener('click',startGame);
document.getElementById('again-btn').addEventListener('click',startGame);
document.getElementById('retry-btn').addEventListener('click',startGame);
document.getElementById('yes-btn').addEventListener('click',()=>answer(true));
document.getElementById('no-btn').addEventListener('click',()=>answer(false));
document.getElementById('back-btn').addEventListener('click',goBack);
document.getElementById('result-back-btn').addEventListener('click',goBack);
document.getElementById('error-back-btn').addEventListener('click',goBack);

// Keyboard shortcuts (desktop): Left Arrow = YES, Right Arrow = NO.
// Ignore held-key repeats so one press can never skip multiple questions.
document.addEventListener('keydown',(event)=>{
  if(event.repeat) return;
  if(!screens.question.classList.contains('active')) return;

  if(event.key==='ArrowLeft'){
    event.preventDefault();
    answer(true);
  }else if(event.key==='ArrowRight'){
    event.preventDefault();
    answer(false);
  }
});
