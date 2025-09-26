function defaultOpen() {
  console.log("Start login");
  setLoginData();
  setLedgerViewTable();
}

function setLedgerViewTable() {
  let liLedgerString = localStorage.getItem("liLedger");
  if(liLedgerString !== null) {
    let liLedger = JSON.parse(liLedgerString);
    let ledgerEvent = liLedger.event;
    document.getElementById("ledgerView").innerHTML = "Ledger Meta-Data";
    document.getElementById("ledgerViewTable").innerHTML = 
      "<tr><th>Account Category</th><th>Account ID</th><th>Account Name</th></tr>" +
      "<tr><td>Income</td><td>acc_0001</td><td>Renumeration</td></tr>";
  }
}
