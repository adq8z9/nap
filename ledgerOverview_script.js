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
      document.getElementById("ledgerView").innerHTML = "";
      document.getElementById("ledgerViewFeedback").innerHTML = "Loading.";
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
      let evLedgerAccountCategoryTree = getLedgerAccountCategoryTree(evLedgerAccountCategories);
      let ledgerViewListString = "";
      if (evLedgerAccountCategoryTree.length == 0) {
        for (let i = 0; i < evLedgerAccounts.length; i++) {
          ledgerViewListString += "<li>" + evLedgerAccounts[i].id + " - " + evLedgerAccounts[i].name + "</li>";
        }
      } else {
        for (let i = 0; i < evLedgerAccountCategoryTree.length; i++) {
          ledgerViewListString += "<li>" + evLedgerAccountCategoryTree[i].root.name + "<ul>";
          for (let m = 0; m < evLedgerAccounts.length; m++) {
            for (let n = 0; n < evLedgerAccounts[m].parent_id.length; n++) {
              if (evLedgerAccounts[m].parent_id[n] == evLedgerAccountCategoryTree[i].root.id) {
                ledgerViewListString += "<li>" + evLedgerAccounts[m].id + " - " + evLedgerAccounts[m].name + "</li>";
              }
            }
          }
          let roundNumber = 0;
          ledgerViewListString += setCategoryLeafsList(evLedgerAccountCategoryTree[i].leafs, evLedgerAccounts, roundNumber);
          ledgerViewListString += "</ul></li>";
        }
      }
      console.log(ledgerViewListString);
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
      document.getElementById("ledgerViewFeedback").innerHTML = "";
      document.getElementById("ledgerView").innerHTML = ledgerMetadataString;
      document.getElementById("ledgerViewList").innerHTML = ledgerViewListString;
    } catch (error) {
      document.getElementById("ledgerViewFeedback").innerHTML = "Ledger loading failed: " + error;
    } 
  } else if (liLedgerString == null) {
    document.getElementById("ledgerView").innerHTML = "No Ledger selected.";
  } else if (liKeypairString == null) {
    document.getElementById("ledgerView").innerHTML = "No accountant logged in.";
  }
}

function setCategoryLeafsList(categoryLeafs, accounts, round) {
  let leafsListString = "";
  if (round > 5) {
    return leafsListString;
  }
  for (let i = 0; i < categoryLeafs.length; i++) {
    leafsListString += "<li>" + categoryLeafs[i].root.name + "<ul>";
    for (let m = 0; m < accounts.length; m++) {
      for (let n = 0; n < accounts[m].parent_id.length; n++) {
        if (accounts[m].parent_id[n] == categoryLeafs[i].root.id) {
          leafsListString += "<li>" + accounts[m].id + " - " + accounts[m].name + "</li>";
        }
      }
    }
    let roundNumber = round + 1;
    leafsListString += setCategoryLeafsList(categoryLeafs[i].leafs, roundNumber);
    leafsListString += "</ul></li>";
  }
  return leafsListString;
}
