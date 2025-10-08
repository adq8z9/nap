function setLoginData() {
  let liKeypairString = localStorage.getItem("liKeypair");
  if(liKeypairString !== null) {
    let liKeypair = JSON.parse(liKeypairString);
    let npub = liKeypair.npub;
    document.getElementById("topNavLoginDataNpub").innerHTML = "accountant: " + npub;
  }

  let liLedgerString = localStorage.getItem("liLedger");
  if(liLedgerString !== null) {
    let liLedger = JSON.parse(liLedgerString);
    let naddr = liLedger.naddr;
    document.getElementById("topNavLoginDataLedger").innerHTML = "ledger: " + naddr;
  }
}
