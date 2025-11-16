function defaultOpen() {
  console.log("Start loginAccount");
  setLoginData();
  setLoginTextBoxes();
}

function logInNpub() {
  let sk = document.getElementById("npubLoginInput").value;
  try {
    let skDec = NostrTools.nip19.decode(sk);
    let skHex = NostrTools.utils.bytesToHex(skDec.data);
    console.log(skDec);
    console.log(skHex);
    console.log(sk);
    let pkHex = NostrTools.getPublicKey(skDec.data);
    let pk = NostrTools.nip19.npubEncode(pkHex);
    let pkShort = pk.slice(0,8) + "..." + pk.slice(-8);
    console.log(pkHex);
    console.log(pk);
    console.log(pkShort);
    let keypair = { pk: pkHex, sk: skHex, npub: pk, npubShort: pkShort };
    let keypairString = JSON.stringify(keypair);
    localStorage.setItem("liKeypair", keypairString); 
    console.log("Keypair saved.");
    setLoginData();
    setLoginTextBoxes();
    let feedback = "Successfull log in.";
    document.getElementById("npubLoginInputFeedback").innerHTML = feedback;
    console.log("Successfull log in.");
  } catch (error) {
    console.log("Log in failed: " + error);
    let feedback = "Log In failed. Nsec not in correct format. " + error;
    document.getElementById("npubLoginInputFeedback").innerHTML = feedback;
  }
}

function createAndLogInNpub() {
  try {
    let skDec = NostrTools.generateSecretKey();
    let skHex = NostrTools.utils.bytesToHex(skDec);
    let sk = NostrTools.nip19.nsecEncode(skDec);
    console.log(skDec);
    console.log(skHex);
    console.log(sk);
    let pkHex = NostrTools.getPublicKey(skDec);
    let pk = NostrTools.nip19.npubEncode(pkHex);
    let pkShort = pk.slice(0,8) + "..." + pk.slice(-8);
    console.log(pkHex);
    console.log(pk);
    console.log(pkShort);
    let keypair = { pk: pkHex, sk: skHex, npub: pk, npubShort: pkShort };
    let keypairString = JSON.stringify(keypair);
    localStorage.setItem("liKeypair", keypairString); 
    console.log("Keypair saved.");
    setLoginData();
    setLoginTextBoxes();
    let feedback = "Successfull key generation and log in.<br>Public key: " + pk + "<br>Secret key: " + sk;
    document.getElementById("npubCreateLoginInputFeedback").innerHTML = feedback;
    console.log("Successfull key generation and log in.");
  } catch (error) {
    console.log("Key generation and log in failed: " + error);
    let feedback = "Key generation failed: " + error;
    document.getElementById("npubCreateLoginInputFeedback").innerHTML = feedback;
  }
}

function setLoginTextBoxes() {
  let liKeypairString = localStorage.getItem("liKeypair");
  if(liKeypairString !== null) {
    let liKeypair = JSON.parse(liKeypairString);
    let npub = liKeypair.npub;
    let nsec = NostrTools.nip19.nsecEncode(NostrTools.utils.hexToBytes(liKeypair.sk));
    document.getElementById("npubLoginInfo").innerHTML = "Currently logged in: " + npub;
    document.getElementById("npubLoginInput").value = nsec;
    document.getElementById("npubLoginInputFeedback").innerHTML = "";
    document.getElementById("npubCreateLoginInputFeedback").innerHTML = "";
  }
  console.log("LoginTextBoxes set.");
}
