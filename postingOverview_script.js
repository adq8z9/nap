function defaultOpen() {
  console.log("Start posting overview");
  setLoginData();
  setPostingViewTextBoxes();
}

function setPostingViewTextBoxes() {
  let liLedgerString = localStorage.getItem("liLedger");
  let liKeypairString = localStorage.getItem("liKeypair");
  if(liLedgerString !== null && liKeypairString !== null) {
    document.getElementById("postingView").innerHTML = "Select filters:";
  } else if (liLedgerString == null) {
    document.getElementById("postingView").innerHTML = "No Ledger selected.";
  } else if (liKeypairString == null) {
    document.getElementById("postingView").innerHTML = "No accountant logged in.";
  }
}

async function createPostingsView() {
  let liLedgerString = localStorage.getItem("liLedger");
  let liKeypairString = localStorage.getItem("liKeypair");
  if(liLedgerString !== null && liKeypairString !== null) {
    document.getElementById("postingViewFeedback").innerHTML = "Loading.";
    document.getElementById("postingViewList").innerHTML = "<li>coffee</li>";
  /*let liLedgerString = localStorage.getItem("liLedger");
  if(liLedgerString !== null) {
  try {
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
    let ledgerEntryEvents = await getLedgerEntryEventsDB();
    console.log(ledgerEntryEvents);
    let ledgerEntryViewTableString = "<tr><th>Posting ID</th><th>Accounting Date</th><th>Debit Account</th><th>Credit Account</th><th>Amount</th><th>Unit</th><th>Description</th><th>Accountant</th></tr>";
    for (let i = 0; i < ledgerEntryEvents.length; i++) {
      let ledgerEntryEventContent = JSON.parse(ledgerEntryEvents[i].event.content);
      ledgerEntryViewTableString += "<tr><td>" + ledgerEntryEvents[i].event.id + "</td><td>" + new Date(ledgerEntryEvents[i].event.created_at*1000) + "</td><td>" + ledgerEntryEventContent.debit_account + "</td><td>" + ledgerEntryEventContent.credit_account + "</td><td>" +  (ledgerEntryEventContent.acc_amount[0]*ledgerEntryEventContent.acc_amount[1]) + "</td><td>" + ledgerEntryEventContent.acc_amount[2] + "</td><td>" + ledgerEntryEventContent.description + "</td><td>" + NostrTools.nip19.npubEncode(ledgerEntryEvents[i].event.pubkey) + "</td></tr>";
    }
    console.log(ledgerEntryViewTableString);
    let ledgerEntryMetadataString = "All ledger entries.";
    console.log(ledgerEntryMetadataString);
    document.getElementById("ledgerEntryView").innerHTML = ledgerEntryMetadataString;
    document.getElementById("ledgerEntryViewTable").innerHTML = ledgerEntryViewTableString;
  } catch (error) {
    console.log("Postings overview loading failed: " + error);
    let ledgerEntryFeedbackString = "Postings overview loading failed: " + error;
    document.getElementById("ledgerEntryView").innerHTML = ledgerEntryFeedbackString;
  }
  }
  */
  } else if (liLedgerString == null) {
    document.getElementById("postingViewFeedback").innerHTML = "No Ledger selected.";
    document.getElementById("postingViewList").innerHTML = "<li>...</li>";
  } else if (liKeypairString == null) {
    document.getElementById("postingViewFeedback").innerHTML = "No accountant logged in.";
    document.getElementById("postingViewList").innerHTML = "<li>...</li>";
  }
}
