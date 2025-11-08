function setLoginData() {
  let liKeypairString = localStorage.getItem("liKeypair");
  if(liKeypairString !== null) {
    let liKeypair = JSON.parse(liKeypairString);
    let npubShort = liKeypair.npubShort;
    document.getElementById("topNavLoginDataNpub").innerHTML = "accountant: " + npub;
  }

  let liLedgerString = localStorage.getItem("liLedger");
  if(liLedgerString !== null) {
    let liLedger = JSON.parse(liLedgerString);
    let naddrShort = liLedger.naddrShort;
    document.getElementById("topNavLoginDataLedger").innerHTML = "ledger: " + naddrShort;
  }
}
