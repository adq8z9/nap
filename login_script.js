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
    let keypair = { pk: pkhex, sk: skHex };
    localStorage.setItem("liKeypair", keypair); 
    //document.getElementById("npubLoginInfo").innerHTML = "Currently logged in: " + NostrTools.nip19.npubEncode(localStorage.getItem("liKeypair"));
    //document.getElementById("npub_right").innerHTML = NostrTools.nip19.npubEncode(localStorage.getItem("liPubkey"));
    //let feedback = "Successfull key generation and log in.\nSecret key: " + NostrTools.nip19.npubEncode(localStorage.getItem("liKeypair");
    //document.getElementById("npubCreateLoginInputFeedback").innerHTML = feedback;
  } catch (error) {
    let feedback = "Key generation failed: " + error;
    document.getElementById("npubCreateLoginInputFeedback").innerHTML = feedback;
  }
}
