function defaultOpen() {
  console.log("Start login");

  let liKeypairString = localStorage.getItem("liKeypair");
  if(liKeypairString !== null) {
    let liKeypair = JSON.parse(liKeypairString);
    let pk = NostrTools.nip19.npubEncode(liKeypair.pk);
    let sk = NostrTools.nip19.nsecEncode(NostrTools.utils.hexToBytes(liKeypair.sk));
    document.getElementById("topNavLoginDataNpub").innerHTML = "npub: " + pk;
  }
}
