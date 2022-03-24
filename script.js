// Global vars

var pattern = [3,4,5,4,3,3,3,4,4,4,3,2,2,3,4,5,4,3,3,3,3,4,4,3,4,5,1];
var progress  = 0;
var tonePlaying = false;
var volume = 0.5;
var gamePlaying = false;
var guessCounter = 0;


// Global constant
const clueHoldTime = 500;
const cluePauseTime = 333;
const nextClueWaitTime = 500;


function startGame() {
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("endBtn").classList.remove("hidden");
  // Initialize game variables
  progress = 0;
  gamePlaying = true;
  playClueSequence();
}
function stopGame() {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("endBtn").classList.add("hidden");
  
}
function lightButton(btn) {
  document.getElementById("button" + btn ).classList.add("lit")
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}



// Sound Synthesis Functions
const freqMap = {
  1: 523.251,
  2: 391.995,
  3: 329.628,
  4: 293.665,
  5: 261.626
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function playClueSequence(){
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");

}
function winGame() {
  stopGame();
  alert("Game Over. You won!");
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  // Correct guess
  if (pattern[guessCounter] == btn) {
    if (guessCounter == progress) {    
      if (progress == pattern.length - 1) {
        winGame();
      }
      else {
        progress++;
        playClueSequence();
      }
    }
    else {
      guessCounter++;
    }
  }
  else {
    loseGame();
  }
  
}
