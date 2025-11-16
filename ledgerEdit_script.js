function defaultOpen() {
  console.log("Start ledger edit");
  setLoginData();
  setLedgerEditTable();
}

async function editAndSaveLedger() {
  let liLedgerString = localStorage.getItem("liLedger");
  let liKeypairString = localStorage.getItem("liKeypair");
  if(liLedgerString !== null && liKeypairString !== null) {
    try {
      let liKeypair = JSON.parse(liKeypairString);
      let liLedger = JSON.parse(liLedgerString);
      let nAddrLedgerDec = NostrTools.nip19.decode(liLedger.naddr);
      console.log(nAddrLedgerDec);
      let ledgerEvent = await getLedgerEvent(nAddrLedgerDec, liKeypair.sk);
      console.log(ledgerEvent);
      let ledgerEventContent = JSON.parse(ledgerEvent.content);
      console.log(ledgerEventContent);
      /*let evLedgerAccounts = ledgerEventContent.acc_accounts;
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
        let hasCategory = false;
        for (let j = 0; j < evLedgerAccountantCategories.length; j++) {
          if (evLedgerAccountants[i].parent_id == evLedgerAccountantCategories[j].id) {
            ledgerMetadataString += ", " + evLedgerAccountantCategories[j].name + ") ";
            hasCategory = true;
          }
        }
        if (!hasCategory) {
          ledgerMetadataString += ") ";
        }
      }
      ledgerMetadataString += "<br><br>Accounting Units: " + ledgerEventContent.acc_units + "<br><br>Ledger accounts: <br>";
      console.log(ledgerMetadataString);*/
      let newName = document.getElementById("ledger_name").value;
      console.log(newName);
      ledgerEventContent.name = newName;
      let editLedgerEvent = NostrTools.finalizeEvent({
        kind: 37701,
        created_at: Math.floor(Date.now() / 1000),
        tags: ledgerEvent.tags,
        content: JSON.stringify(ledgerEventContent),
      }, liKeypair.sk);
      console.log(editLedgerEvent);
      let relays = nAddrLedgerDec.data.relays;
      let event = await sendLedgerEvent(editLedgerEvent, liKeypair.sk, relays);
      /*let newNaddr = NostrTools.nip19.naddrEncode( { "identifier": d, "relays": relays, "pubkey": spal.pubkey, "kind": spal.kind } );
      console.log(spalNaddr);
      let spalNaddrShort = spalNaddr.slice(0,8) + "..." + spalNaddr.slice(-8);
      console.log(spalNaddrShort);*/
      let liLedger2 = { naddr: liLedger.naddr, id: liLedger.naddr, naddrShort: liLedger.naddrShort, ledgerName: newName, accountantName: liLedger.accountantName };
      let liLedgerString2 = JSON.stringify(liLedger2);
      console.log(liLedger2);
      console.log(liLedgerString2);
      localStorage.setItem("liLedger", liLedgerString2);
      setLoginData();
      setLedgerEditTable();
      let feedback = "Accounting ledger successfully edited and saved.";
      document.getElementById("editAndSaveFeedback2").innerHTML = feedback;
      console.log("Accounting ledger successfully edited and saved.");
    } catch (error) {
      document.getElementById("editAndSaveFeedback2").innerHTML = "Error when editing and saving edited ledger: " + error;
    } 
  } else if (liLedgerString == null) {
    document.getElementById("editAndSaveFeedback2").innerHTML = "No Ledger selected.";
  } else if (liKeypairString == null) {
    document.getElementById("editAndSaveFeedback2").innerHTML = "No accountant logged in.";
  }
}

async function setLedgerEditTable() {
  let liLedgerString = localStorage.getItem("liLedger");
  let liKeypairString = localStorage.getItem("liKeypair");
  if(liLedgerString !== null && liKeypairString !== null) {
    try {
      document.getElementById("ledgerEdit").innerHTML = "Loading.";
      let liKeypair = JSON.parse(liKeypairString);
      let liLedger = JSON.parse(liLedgerString);
      let nAddrLedgerDec = NostrTools.nip19.decode(liLedger.naddr);
      console.log(nAddrLedgerDec);
      let ledgerEvent = await getLedgerEvent(nAddrLedgerDec, liKeypair.sk);
      console.log(ledgerEvent);
      let ledgerEventContent = JSON.parse(ledgerEvent.content);
      console.log(ledgerEventContent);
      /*let evLedgerAccounts = ledgerEventContent.acc_accounts;
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
        let hasCategory = false;
        for (let j = 0; j < evLedgerAccountantCategories.length; j++) {
          if (evLedgerAccountants[i].parent_id == evLedgerAccountantCategories[j].id) {
            ledgerMetadataString += ", " + evLedgerAccountantCategories[j].name + ") ";
            hasCategory = true;
          }
        }
        if (!hasCategory) {
          ledgerMetadataString += ") ";
        }
      }
      ledgerMetadataString += "<br><br>Accounting Units: " + ledgerEventContent.acc_units + "<br><br>Ledger accounts: <br>";
      console.log(ledgerMetadataString);*/
      document.getElementById("ledgerEdit").innerHTML = "";
      document.getElementById("ledger_name").value = ledgerEventContent.name;
    } catch (error) {
      document.getElementById("editAndSaveFeedback").innerHTML = "Ledger loading failed: " + error;
    } 
  } else if (liLedgerString == null) {
    document.getElementById("ledgerEdit").innerHTML = "No Ledger selected.";
  } else if (liKeypairString == null) {
    document.getElementById("ledgerEdit").innerHTML = "No accountant logged in.";
  }
}
