function defaultOpen() {
  document.getElementById("defaultOpen").click();

  let loggedinNpub = localStorage.getItem("liNpub");
  console.log(loggedinNpub);
  if(loggedinNpub !== null){
    document.getElementById("npub_right").innerHTML = loggedinNpub;
    document.getElementById("npubLoginInfo").innerHTML = "Currently logged in: " + loggedinNpub;
  }
}

function openView(evt, oView) {
  var mainDivs;
  
  mainDivs = document.getElementsByClassName("main");
  for (i = 0; i < mainDivs.length; i++) {
    mainDivs[i].style.display = "none";
  }
  menuPoints = document.getElementsByClassName("menu_point");
  for (i = 0; i < menuPoints.length; i++) {
    menuPoints[i].className = menuPoints[i].className.replace(" active", "");
  }

  document.getElementById(oView).style.display = "block";
  evt.currentTarget.className += " active";
}

function logInNpub() {
  let sk = NostrTools.generateSecretKey();
  console.log(sk);
  document.getElementById("npubLoginInput").value = sk;
  let pk = NostrTools.getPublicKey(sk);
  console.log(pk);
  localStorage.setItem("liNpub", pk);
  
  document.getElementById("npubLoginInfo").innerHTML = localStorage.getItem("liNpub");
  document.getElementById("npub_right").innerHTML = localStorage.getItem("liNpub");
  let feedback = "successfull log in";
  document.getElementById("npubLoginInputFeedback").innerHTML = feedback;
}
