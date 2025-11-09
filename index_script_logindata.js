function setLoginData() {
  let liKeypairString = localStorage.getItem("liKeypair");
  let liLedgerString = localStorage.getItem("liLedger");
  
  if(liKeypairString !== null && liLedgerString !== null) {
    let liKeypair = JSON.parse(liKeypairString);
    let liLedger = JSON.parse(liLedgerString);
    document.getElementById("topNavLoginDataNpub").innerHTML = "<b>accountant:</b> " + liLedger.accountantName + " (" + liKeypair.npubShort + ")";
    document.getElementById("topNavLoginDataLedger").innerHTML = "<b>ledger:</b> " + liLedger.ledgerName + " (" + liLedger.naddrShort + ")";
  } else if(liKeypairString !== null) {
    let liKeypair = JSON.parse(liKeypairString);
    document.getElementById("topNavLoginDataNpub").innerHTML = "<b>accountant:</b> " + liKeypair.npubShort;
  } else if(liLedgerString !== null) {
    let liLedger = JSON.parse(liLedgerString);
    document.getElementById("topNavLoginDataLedger").innerHTML = "<b>ledger:</b> " + liLedger.ledgerName + " (" + liLedger.naddrShort + ")";
  }
}
