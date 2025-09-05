function defaultOpen() {
  console.log("Start login");
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
    let keypair = { pk: pkHex, sk: skHex };
    let keypairString = JSON.stringify(keypair);
    localStorage.setItem("liKeypair", keypairString); 
    document.getElementById("npubLoginInfo").innerHTML = "Currently logged in: " + pk;
    document.getElementById("topNavLoginDataNpub").innerHTML = "npub: " + pk;
    let feedback = "Successfull key generation and log in.<br>Secret key: " + sk;
    document.getElementById("npubCreateLoginInputFeedback").innerHTML = feedback;
  } catch (error) {
    let feedback = "Key generation failed: " + error;
    document.getElementById("npubCreateLoginInputFeedback").innerHTML = feedback;
  }
}
