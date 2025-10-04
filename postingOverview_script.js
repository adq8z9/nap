function defaultOpen() {
  console.log("Start posting overview");
  setLoginData();
  setLedgerEntryViewTable();
}

async function setLedgerEntryViewTable() {
  let liLedgerString = localStorage.getItem("liLedger");
  if(liLedgerString !== null) {
    let liLedger = JSON.parse(liLedgerString);
    let ledgerEventId = liLedger.id;
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
    console.log(evLedgerAccountants);
    let ledgerEntryEventId = "bc8b420b35e0cfa1947d10db737fcd998b770bff7162e595c474f8bfe658bbd6";
    let ledgerEntryEvent = await getLedgerEntryEventDB(ledgerEntryEventId);
    console.log(ledgerEntryEvent);
    let ledgerEntryEventContent = JSON.parse(ledgerEntryEvent.content);
    console.log(ledgerEntryEventContent);
    let ledgerEntryViewTableString = "<tr><th>Posting ID</th><th>Accounting Date</th><th>Debit Account</th><th>Credit Account</th><th>Amount</th><th>Unit</th><th>Description</th><th>Accountant</th></tr>";
    ledgerEntryViewTableString += "<tr><td>" + ledgerEntryEvent.id + "</td><td>" + new Date(ledgerEntryEvent.created_at*1000) + "</td><td>" + ledgerEntryEventContent.debit_account + "</td><td>" + ledgerEntryEventContent.credit_account + "</td><td>" +  (ledgerEntryEventContent.acc_amount[0]*ledgerEntryEventContent.acc_amount[1]) + "</td><td>" + ledgerEntryEventContent.acc_amount[2] + "</td><td>" + ledgerEntryEventContent.description + "</td><td>" + NostrTools.nip19.npubEncode(ledgerEntryEvent.pubkey) + "</td></tr>";
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
    console.log(ledgerMetadataString);*/
    let ledgerEntryMetadataString = "";
    document.getElementById("ledgerEntryView").innerHTML = ledgerEntryMetadataString;
    document.getElementById("ledgerEntryViewTable").innerHTML = ledgerEntryViewTableString;
  }
}
