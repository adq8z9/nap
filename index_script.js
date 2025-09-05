function defaultOpen() {
  console.log("Start index");

  let liKeypairString = localStorage.getItem("liKeypair");
  if(liKeypairString !== null) {
    let liKeypair = JSON.parse(liKeypairString);
    let pk = NostrTools.nip19.npubEncode(liKeypair.pk);
    document.getElementById("topNavLoginDataNpub").innerHTML = "npub: " + pk;
  }
}
