function defaultOpen() {
  console.log("Start login");
  setLoginData();
  let liLedgerString = localStorage.getItem("liLedger");
  if(liLedgerString !== null) {
    let liLedger = JSON.parse(liLedgerString);
    let ledgerEvent = liLedger.event;
    document.getElementById("ledgerView").innerHTML = "Ledger: <br><br>" + JSON.stringify(ledgerEvent);
  }
  setLedgerViewTable();
}

function setLedgerViewTable() {
  let liLedgerString = localStorage.getItem("liLedger");
  if(liLedgerString !== null) {
    let liLedger = JSON.parse(liLedgerString);
    let ledgerEvent = liLedger.event;
    document.getElementById("ledgerViewTable").innerHTML = 
      "<tr><th>Account Category</th><th>Account ID</th><th>Account Name</th>" +
      "<tr><td>Income</td><td>acc_0001</td><td>Renumeration</td>";
  }
}
