function defaultOpen() {
  console.log("Start ledger overview");
  setLoginData();
  setLedgerViewTable();
}

async function setLedgerViewTable() {
  let liLedgerString = localStorage.getItem("liLedger");
  let liKeypairString = localStorage.getItem("liKeypair");
  if(liLedgerString !== null && liKeypairString !== null) {
    try {
      document.getElementById("ledgerView").innerHTML = "Loading.";
      let liKeypair = JSON.parse(liKeypairString);
      let liLedger = JSON.parse(liLedgerString);
      let nAddrLedgerDec = NostrTools.nip19.decode(liLedger.naddr);
      console.log(nAddrLedgerDec);
      let ledgerEvent = await getLedgerEvent(nAddrLedgerDec, liKeypair.sk);
      console.log(ledgerEvent);
      let ledgerEventContent = JSON.parse(ledgerEvent.content);
      console.log(ledgerEventContent);
      let evLedgerAccounts = ledgerEventContent.acc_accounts;
      let evLedgerAccountCategories = ledgerEventContent.acc_account_categories;
      let evLedgerAccountants = ledgerEventContent.acc_accountants;
      let evLedgerAccountantCategories = ledgerEventContent.acc_accountant_categories;
      console.log(evLedgerAccounts);
      console.log(evLedgerAccountCategories);
      console.log(evLedgerAccountants);
      console.log(evLedgerAccountantCategories);
      let ledgerViewTableString = "<tr><th>Account Category</th><th>Account ID</th><th>Account Name</th></tr>";
      for (let i = 0; i < evLedgerAccounts.length; i++) {
        let hasCategory = false;
        for (let j = 0; j < evLedgerAccountCategories.length; j++) {
          if (evLedgerAccounts[i].parent_id == evLedgerAccountCategories[j].id) {
            ledgerViewTableString += "<tr><td>" + evLedgerAccountCategories[j].name + "</td>";
            hasCategory = true;
          }
        }
        if (!hasCategory) {
          ledgerViewTableString += "<tr><td>" + "- </td>";
        }
        ledgerViewTableString += "<td>" + evLedgerAccounts[i].id + "</td><td>" + evLedgerAccounts[i].name + "</td></tr>";
      }
      console.log(ledgerViewTableString);
      let ledgerMetadataString = "Ledger Name: " + ledgerEventContent.name + "<br><br>Accountants: ";
      for (let i = 0; i < evLedgerAccountants.length; i++) {
        npubAcc = NostrTools.nip19.npubEncode(ledgerEventContent.acc_accountants[i].pubkey);
        ledgerMetadataString += ledgerEventContent.acc_accountants[i].name + " (" + npubAcc.slice(0,8) + "..." + npubAcc.slice(-8);
        for (let j = 0; j < evLedgerAccountantCategories.length; j++) {
          if (evLedgerAccountants[i].parent_id == evLedgerAccountantCategories[j].id) {
            ledgerMetadataString += ", " + evLedgerAccountantCategories[j].name;
          }
        }
        ledgerMetadataString += ") ";
      }
      ledgerMetadataString += "<br><br>Accounting Units: " + ledgerEventContent.acc_units + "<br><br>Ledger accounts: <br>";
      console.log(ledgerMetadataString);
      document.getElementById("ledgerView").innerHTML = ledgerMetadataString;
      document.getElementById("ledgerViewTable").innerHTML = ledgerViewTableString;
    } catch (error) {
      document.getElementById("ledgerView").innerHTML = "Ledger loading failed: " + error;
    } 
  } else if (liLedgerString == null) {
    document.getElementById("ledgerView").innerHTML = "No Ledger selected.";
  } else if (liKeypairString == null) {
    document.getElementById("ledgerView").innerHTML = "No accountant logged in.";
  }
}
