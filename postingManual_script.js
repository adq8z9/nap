function defaultOpen() {
  console.log("Start login");
  setLoginData();
  setInputBoxes();
}

async function createAndPostManualLedgerEntry() {
  console.log("Start create and post manual ledger entry.");
  let liKeypairString = localStorage.getItem("liKeypair");
  let liLedgerString = localStorage.getItem("liLedger");
  if(liKeypairString !== null && liLedgerString !== null) {
    try {
      let liKeypair = JSON.parse(liKeypairString);
      let liLedger = JSON.parse(liLedgerString);
      let nAddrLedgerDec = NostrTools.nip19.decode(liLedger.naddr);
      console.log(nAddrLedgerDec);
      const relays = nAddrLedgerDec.data.relays;
      console.log(relays);
      let debitAccount = document.getElementById("debit_account").value.split("-")[0];
      let debitAccountLabel = "account:" + debitAccount;
      let creditAccount = document.getElementById("credit_account").value.split("-")[0];
      let creditAccountLabel = "account:" + creditAccount;
      let accountingAmount = Number(document.getElementById("accounting_amount").value);
      let accountingUnit = document.getElementById("accounting_unit").value;
      let accountingDate = document.getElementById("accounting_date").value;
      let accountingTimestamp = Math.floor(Date.parse(accountingDate)/1000);
      console.log(accountingTimestamp);
      let accountingDescription = document.getElementById("accounting_description").value;
      let nAddrLedgerRef = "" + nAddrLedgerDec.data.kind + ":" + nAddrLedgerDec.data.pubkey + ":" + nAddrLedgerDec.data.identifier + "";
      const ledgerEntryData = {
        tags: [
          ["-"],
          ["A", nAddrLedgerRef],
          ["L", nAddrLedgerRef],
          ["l", debitAccountLabel, nAddrLedgerRef],
          ["l", creditAccountLabel, nAddrLedgerRef],
          ["L", "leaccountingnip"],
          ["l", "ledgerentry", "leaccountingnip"],
          ["published_at", Math.floor(Date.now() / 1000).toString()]
        ], 
        content: {
          debit_account: debitAccount,
          credit_account: creditAccount,
          acc_amount: [accountingAmount, 1, accountingUnit],
          description: accountingDescription
        }   
      };
      console.log(ledgerEntryData);
      console.log(ledgerEntryData.tags);
      console.log(JSON.stringify(ledgerEntryData.content));
      let leEvent = NostrTools.finalizeEvent({
        kind: 7701,
        created_at: accountingTimestamp,
        tags: ledgerEntryData.tags,
        content: JSON.stringify(ledgerEntryData.content),
      }, liKeypair.sk);
      console.log(leEvent);
      let event = await sendLedgerEntryEvent(leEvent, liKeypair.sk, relays);
      saveLedgerEntryEventDB(leEvent);
      let feedback = "Successfully created and posted manual ledger entry. View Entry under 'Ledger Postings' -> 'Overview postings' in the main menu."
      document.getElementById("manualPostingCreateFeedback").innerHTML = feedback;
      document.getElementById("manualPostingCreateFeedback2").innerHTML = feedback;
      console.log("Successfully created and posted ledger entry.");
    } catch (error) {
      console.log("Accounting ledger generation and selection failed: " + error);
      let feedback = "Accounting ledger creation failed: " + error;
      document.getElementById("manualPostingCreateFeedback").innerHTML = feedback;
      document.getElementById("manualPostingCreateFeedback2").innerHTML = feedback;
    }
  } else {
    console.log("No log in data.");
    let feedback = "Error posting ledger entry. No log in data.data. Log in first.";
    document.getElementById("manualPostingCreateFeedback").innerHTML = feedback;
    document.getElementById("manualPostingCreateFeedback2").innerHTML = feedback;
  }
}

async function setInputBoxes() {
  let liKeypairString = localStorage.getItem("liKeypair");
  let liLedgerString = localStorage.getItem("liLedger");
  if(liKeypairString !== null && liLedgerString !== null) {
    let feedback = ""
    document.getElementById("manualPostingCreateFeedback").innerHTML = feedback;
    let liLedger = JSON.parse(liLedgerString);
    let ledgerEventId = liLedger.id;
    console.log(ledgerEventId);
    let ledgerEvent = await getLedgerEventDB(ledgerEventId);
    console.log(ledgerEvent);
    let ledgerEventContent = JSON.parse(ledgerEvent.content);
    console.log(ledgerEventContent);
    let evLedgerAccounts = ledgerEventContent.acc_accounts;
    let evLedgerAccountCategories = ledgerEventContent.acc_account_categories;
    console.log(evLedgerAccounts);
    console.log(evLedgerAccountCategories);
    let accountOptions = "";
    for (let i = 0; i < evLedgerAccounts.length; i++) {
      accountOptions += "<option>" + evLedgerAccounts[i].id + "- " + evLedgerAccounts[i].name + " - ";
      let hasCategory = false;
      for (let j = 0; j < evLedgerAccountCategories.length; j++) {
        console.l
        if (evLedgerAccounts[i].parent_id == evLedgerAccountCategories[j].id) {
          accountOptions += evLedgerAccountCategories[j].name + "</option>";
          hasCategory = true;
        }
      }
      if (!hasCategory) {
        ledgerViewTableString += " " + "</option>";
      }
    }
    console.log(accountOptions);
    let accountingUnits = "";
    let evLedgerUnits = ledgerEventContent.acc_units;
    console.log(evLedgerUnits);
    for (let i = 0; i < evLedgerUnits.length; i++) {
      accountingUnits += "<option>" + evLedgerUnits[i] + "</option>";
    }
    document.getElementById("debit_account").innerHTML = accountOptions;
    document.getElementById("credit_account").innerHTML = accountOptions;
    document.getElementById("accounting_unit").innerHTML = accountingUnits;
    console.log("Set Input Boxes.");
  } else {
    let feedback = "No log in data. Log in first.";
    document.getElementById("manualPostingCreateFeedback").innerHTML = feedback;
    console.log("Set Input Boxes.");
  }
}
