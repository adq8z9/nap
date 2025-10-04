function defaultOpen() {
  console.log("Start posting overview");
  setLoginData();
  setLedgerEntryViewTable();
}

async function setLedgerEntryViewTable() {
  let liLedgerString = localStorage.getItem("liLedger");
  if(liLedgerString !== null) {
    let liLedger = JSON.parse(liLedgerString);
    /*let ledgerEventId = liLedger.id;
    console.log(ledgerEventId);
    let ledgerEvent = await getLedgerEventDB(ledgerEventId);
    console.log(ledgerEvent);
    let ledgerEventContent = JSON.parse(ledgerEvent.content);
    console.log(ledgerEventContent);
    let evLedgerAccounts = ledgerEventContent.acc_accounts;
    let evLedgerAccountCategories = ledgerEventContent.acc_account_categories;
    let evLedgerAccountants = ledgerEventContent.acc_accountants;
    console.log(evLedgerAccounts);
    console.log(evLedgerAccountCategories);
    console.log(evLedgerAccountants);*/
    let ledgerEntryViewTableString = "<tr><th>Posting ID</th><th>Accounting Date</th><th>Debit Account</th><th>Credit Account</th><th>Amount</th><th>Unit</th><th>Description</th></tr>";
    /*for (let i = 0; i < evLedgerAccounts.length; i++) {
      ledgerViewTableString += "<tr><td>" + evLedgerAccounts[i].id + "</td><td>" + evLedgerAccounts[i].name + "</td><td>";
      let hasCategory = false;
      for (let j = 0; j < evLedgerAccountCategories.length; j++) {
        console.l
        if (evLedgerAccounts[i].parent_id == evLedgerAccountCategories[j].id) {
          ledgerViewTableString += evLedgerAccountCategories[j].name + "</td></tr>";
          hasCategory = true;
        }
      }
      if (!hasCategory) {
        ledgerViewTableString += " " + "</td></tr>";
      }
    }
    console.log(ledgerViewTableString);
    let ledgerMetadataString = "Name: " + ledgerEventContent.name + "<br><br>Units: " + ledgerEventContent.acc_units + "<br><br>Accountants: ";
    for (let i = 0; i < evLedgerAccountants.length; i++) {
      ledgerMetadataString += NostrTools.nip19.npubEncode(ledgerEventContent.acc_accountants[i].p) + " ";
    }
    console.log(ledgerMetadataString);
    document.getElementById("ledgerView").innerHTML = ledgerMetadataString;*/
    document.getElementById("ledgerEntryViewTable").innerHTML = ledgerEntryViewTableString;
  }
}
