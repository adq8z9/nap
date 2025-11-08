function setLoginData() {
  let liKeypairString = localStorage.getItem("liKeypair");
  let liLedgerString = localStorage.getItem("liLedger");
  
  if(liKeypairString !== null && liLedgerString !== null) {
    let liKeypair = JSON.parse(liKeypairString);
    let liLedger = JSON.parse(liLedgerString);
    document.getElementById("topNavLoginDataNpub").innerHTML = "accountant: " + liLedger.accountantName + " (" + liKeypair.npubShort + ")";
    document.getElementById("topNavLoginDataLedger").innerHTML = "ledger: " + liLedger.ledgerName + " (" + liLedger.naddrShort + ")";
  } else if(liKeypairString !== null) {
    let liKeypair = JSON.parse(liKeypairString);
    document.getElementById("topNavLoginDataNpub").innerHTML = "accountant: " + liKeypair.npubShort;
  } else if(liLedgerString !== null) {
    let liLedger = JSON.parse(liLedgerString);
    document.getElementById("topNavLoginDataLedger").innerHTML = "ledger: " + liLedger.ledgerName + " (" + liLedger.naddrShort + ")";
  }
}
