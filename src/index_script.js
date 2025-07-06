function defaultOpen() {
  document.getElementById("defaultOpen").click();

  let loggedinNpub = localStorage.getItem("liNpub");
  console.log(loggedinNpub);
  if(loggedinNpub !== null){
    document.getElementById("npub_right").innerHTML = "User Name tbd<br>" + loggedinNpub;
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
  let sk = document.getElementById("npubLoginInput").value;
  console.log(sk);
  try {
    let skDec = NostrTools.nip19.decode(sk);
    console.log(skDec);
    document.getElementById("npubLoginInput").value = sk;
    let pk = NostrTools.getPublicKey(skDec.data);
    console.log(pk);
    let pkEnc = NostrTools.nip19.npubEncode(pk);
    console.log(pkDec);
    localStorage.setItem("liNpub", pkEnc);
    localStorage.setItem("liNsec", skDec.data);
    document.getElementById("npubLoginInfo").innerHTML = "Currently logged in: " + localStorage.getItem("liNpub");
    document.getElementById("npub_right").innerHTML = "User Name tbd<br>" + localStorage.getItem("liNpub");
    let feedback = "Successfull log in.";
    document.getElementById("npubLoginInputFeedback").innerHTML = feedback;
  } catch (error) {
    console.error(error);
    let feedback = "Log In failed. Nsec not in correct format.";
    document.getElementById("npubLoginInputFeedback").innerHTML = feedback;
  }
}
