const button = document.getElementById("button");
const audioElement = document.getElementById("audio");
const text = document.getElementById("text");

//Disable/Enable Button
function toggleButton() {
  button.disabled = !button.disabled;
}

//Converting Speech to Text
const typingJoke = (joke, timeout) =>
  [...joke].map(
    (ch, i) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(joke.substring(0, i + 1));
        }, timeout * i);
      })
  );

//Passing Joke to VoiceRSS
function tellMe(joke) {
  VoiceRSS.speech({
    key: "c6335045100f481daec833cf10c237aa",
    src: joke,
    hl: "en-us",
    v: "Linda",
    r: 0,
    c: "mp3",
    f: "44khz_16bit_stereo",
    ssml: false,
  });
}

// getJoke from Joke API
async function getJoke() {
  let joke = "";
  const apiUrl =
    "https://sv443.net/jokeapi/v2/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist";
  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      if (data.setup) {
        joke = `${data.setup} ... ${data.delivery}`;
      } else {
        joke = data.joke;
      }
      //Text-to-Speech
      tellMe(joke);
      //Disable Button
      toggleButton();
      //Speech-to-Text
      typingJoke(joke, 70).forEach((promise) => {
        promise.then((portion) => {
          document.querySelector("span").innerText = portion;
        });
      });
    } else {
      alert("HTTP request failed!" + response.status);
    }
  } catch (err) {
    console.log("Whoops!Something went wrong", err);
  }
}

// Event Listeners
button.addEventListener("click", getJoke);
// audioElement.addEventListener("ended", toggleButton);
audioElement.addEventListener("ended",()=>{
  toggleButton();
  text.style.display = "none";
});
audioElement.addEventListener("play", () => {
  text.style.visibility = "visible";  
  if( text.style.display==="none"){
    text.style.display="block";
  }
});
