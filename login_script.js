function defaultOpen() {
  console.log("Start login");

  let liKeypairString = localStorage.getItem("liKeypair");
  if(liKeypairString !== null) {
    let liKeypair = JSON.parse(liKeypairString);
    let pk = NostrTools.nip19.npubEncode(liKeypair.pk);
    document.getElementById("topNavLoginDataNpub").innerHTML = "npub: " + pk;
  }

  let liLedgerString = localStorage.getItem("liLedger");
  if(liLedgerString !== null) {
    let liLedger = JSON.parse(liLedgerString);
    let naddr = liLedger.naddr;
    document.getElementById("topNavLoginDataLedger").innerHTML = "ledger: " + naddr;
  }
}
