function defaultOpen() {
  console.log("Start loginAccount");
  setLoginData();
  let liKeypairString = localStorage.getItem("liKeypair");
  if(liKeypairString !== null) {
    let liKeypair = JSON.parse(liKeypairString);
    let npub = liKeypair.npub;
    let nsec = NostrTools.nip19.nsecEncode(NostrTools.utils.hexToBytes(liKeypair.sk));
    document.getElementById("npubLoginInfo").innerHTML = "Currently logged in: " + npub;
    document.getElementById("npubLoginInput").value = nsec;
  }
}

function logInNpub() {
  let sk = document.getElementById("npubLoginInput").value;
  try {
    let skDec = NostrTools.nip19.decode(sk);
    let skHex = NostrTools.utils.bytesToHex(skDec.data);
    console.log(sk);
    console.log(skDec);
    console.log(skHex);
    let pkHex = NostrTools.getPublicKey(skDec.data);
    let pk = NostrTools.nip19.npubEncode(pkHex);
    console.log(pkHex);
    console.log(pk);
    let keypair = { pk: pkHex, sk: skHex, npub: pk };
    let keypairString = JSON.stringify(keypair);
    localStorage.setItem("liKeypair", keypairString); 
    document.getElementById("npubLoginInfo").innerHTML = "Currently logged in: " + pk;
    document.getElementById("topNavLoginDataNpub").innerHTML = "npub: " + pk;
    document.getElementById("npubLoginInput").value = sk;
    let feedback = "Successfull log in.";
    document.getElementById("npubLoginInputFeedback").innerHTML = feedback;
  } catch (error) {
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
    console.log(pkHex);
    console.log(pk);
    let keypair = { pk: pkHex, sk: skHex, npub: pk };
    let keypairString = JSON.stringify(keypair);
    localStorage.setItem("liKeypair", keypairString); 
    document.getElementById("npubLoginInfo").innerHTML = "Currently logged in: " + pk;
    document.getElementById("topNavLoginDataNpub").innerHTML = "npub: " + pk;
    document.getElementById("npubLoginInput").value = sk;
    let feedback = "Successfull key generation and log in.<br>Public key: " + pk + "<br>Secret key: " + sk;
    document.getElementById("npubCreateLoginInputFeedback").innerHTML = feedback;
  } catch (error) {
    let feedback = "Key generation failed: " + error;
    document.getElementById("npubCreateLoginInputFeedback").innerHTML = feedback;
  }
}
