function defaultOpen() {
  console.log("Start loginLedger");
  setLoginData();
  setLoginTextBoxes();
}

async function logInLedger() {
  let liKeypairString = localStorage.getItem("liKeypair");
  if(liKeypairString !== null) {
    try {
      let liKeypair = JSON.parse(liKeypairString);
      let nAddrLedger = document.getElementById("ledgerLoginInput").value;
      let nAddrLedgerDec = NostrTools.nip19.decode(nAddrLedger);
      console.log(nAddrLedgerDec);
      let ledgerEvent = await getLedgerEvent(nAddrLedgerDec, liKeypair.sk);
      console.log(nAddrLedger);
      let nAddrLedgerShort = nAddrLedger.slice(0,8) + "..." + nAddrLedger.slice(-8);
      console.log(nAddrLedgerShort);
      console.log(ledgerEvent);
      ledgerEventContent = JSON.parse(ledgerEvent.content);
      let liLedger = { naddr: nAddrLedger, id: ledgerEvent.id, naddrShort: nAddrLedgerShort, ledgerName: ledgerEventContent.name, accountantName: getAccountantName(liKeypair.pk, ledgerEventContent) };
      let liLedgerString = JSON.stringify(liLedger);
      console.log(liLedgerString);
      localStorage.setItem("liLedger", liLedgerString);
      setLoginData();
      setLoginTextBoxes();
      let feedback = "Successfully selected ledger naddr. View Ledger under 'Accounting Ledger' in the main menu.<br>Naddr: " + nAddrLedger;
      document.getElementById("ledgerLoginInputFeedback").innerHTML = feedback;
      console.log("Successfully selected ledger naddr.");
    } catch (error) {
      console.log("Accounting ledger selection failed: " + error);
      let feedback = "Accounting ledger selection failed: " + error;
      document.getElementById("ledgerLoginInputFeedback").innerHTML = feedback;
    }
  } else {
    let feedback = "First log in a npub, before selecting a ledger event!";
    document.getElementById("ledgerLoginInputFeedback").innerHTML = feedback;
  }
}

async function createAndLogInLedger() {
  let liKeypairString = localStorage.getItem("liKeypair");
  if(liKeypairString !== null) {
    try {
      let liKeypair = JSON.parse(liKeypairString);
      //Create example ledger
      const d = "spal";
      const relays = ["wss://nap.nostr1.com"];
      const spalData = {
        tags: [
          ["-"],
          ["d", d],
          ["L", "leaccountingnip"],
          ["l", "ledger", "leaccountingnip"],
          ["r", relays[0]],
          ["p", liKeypair.pk]
        ], 
        content: {
          name: "Simple Personal Accounting Ledger", 
          acc_units: ["satoshi"],
          acc_account_categories: [
            { id: "acc_c_0", name: "Income" },
            { id: "acc_c_1", name: "Expense" },
            { id: "acc_c_2", name: "Asset" }
          ], 
          acc_accounts: [ 
            { id: "acc_0001", name: "Incoming Zaps", parent_id: "acc_c_0" },
            { id: "acc_0002", name: "Incoming Donations", parent_id: "acc_c_0" },
            { id: "acc_0003", name: "Sales", parent_id: "acc_c_0" },
            { id: "acc_0004", name: "Remuneration", parent_id: "acc_c_0" },
            { id: "acc_0005", name: "Own Deposit on Wallet", parent_id: "acc_c_0" },
            { id: "acc_1001", name: "Outgoing Zaps", parent_id: "acc_c_1" },
            { id: "acc_1002", name: "Outgoing Donations", parent_id: "acc_c_1" },
            { id: "acc_1003", name: "Purchases", parent_id: "acc_c_1" },
            { id: "acc_1004", name: "Payments", parent_id: "acc_c_1" },
            { id: "acc_1005", name: "Own Withdrawal from Wallet", parent_id: "acc_c_1" },
            { id: "acc_2001", name: "Wallet Balance", parent_id: "acc_c_2" }
          ],
          acc_accountant_categories: [
            { id: "acc_ac_1", name: "admin" }
          ],
          acc_accountants: [
            { id: "acc_a_1", name: "Le me", parent_id: "acc_ac_1", pubkey: liKeypair.pk }
          ]
        }   
      };
      let spal = NostrTools.finalizeEvent({
        kind: 37701,
        created_at: Math.floor(Date.now() / 1000),
        tags: spalData.tags,
        content: JSON.stringify(spalData.content),
      }, liKeypair.sk);
      console.log(spal);
      let event = await sendLedgerEvent(spal, liKeypair.sk, relays);
      let spalNaddr = NostrTools.nip19.naddrEncode( { "identifier": d, "relays": relays, "pubkey": spal.pubkey, "kind": spal.kind } );
      console.log(spalNaddr);
      let spalNaddrShort = spalNaddr.slice(0,8) + "..." + spalNaddr.slice(-8);
      console.log(spalNaddrShort);
      let liLedger = { naddr: spalNaddr, id: spal.id, naddrShort: spalNaddrShort, ledgerName: spalData.content.name, accountantName: getAccountantName(liKeypair.pk, spalData.content) };
      let liLedgerString = JSON.stringify(liLedger);
      console.log(liLedger);
      console.log(liLedgerString);
      localStorage.setItem("liLedger", liLedgerString);
      setLoginData();
      setLoginTextBoxes();
      let feedback = "Successfully created and selected simple example ledger naddr. View Ledger under 'Accounting Ledger' in the main menu.<br>Naddr: " + spalNaddr;
      document.getElementById("ledgerCreateLoginInputFeedback").innerHTML = feedback;
      console.log("Successfully created and selected ledger naddr.");
    } catch (error) {
      console.log("Accounting ledger generation and selection failed: " + error);
      let feedback = "Accounting ledger creation failed: " + error;
      document.getElementById("ledgerCreateLoginInputFeedback").innerHTML = feedback;
    }
  } else {
    console.log("No npub logged in.");
    let feedback = "First log in a npub, before creating a ledger event!";
    document.getElementById("ledgerCreateLoginInputFeedback").innerHTML = feedback;
  }
}

function getAccountantName(liPK, liLeventContent) {
  return "Le me";
}

function setLoginTextBoxes() {
  let liLedgerString = localStorage.getItem("liLedger");
  if(liLedgerString !== null) {
    let liLedger = JSON.parse(liLedgerString);
    let naddr = liLedger.naddr;
    document.getElementById("ledgerLoginInfo").innerHTML = "Currently used accounting ledger: " + naddr;
    document.getElementById("ledgerLoginInput").value = naddr;
  }
  console.log("LogInTextBoxes set.");
}
