function defaultOpen() {
  console.log("Start loginLedger");
  setLoginData();
  let liLedgerString = localStorage.getItem("liLedger");
  if(liLedgerString !== null) {
    let liLedger = JSON.parse(liLedgerString);
    let naddr = liLedger.naddr;
    document.getElementById("ledgerLoginInfo").innerHTML = "Currently used accounting ledger: " + naddr;
    document.getElementById("ledgerLoginInput").value = naddr;
  }
}

async function logInLedger() {
  let liKeypairString = localStorage.getItem("liKeypair");
  if(liKeypairString !== null) {
    try {
      let liKeypair = JSON.parse(liKeypairString);
      let nAddrLedger = document.getElementById("ledgerLoginInput").value;
      let nAddrLedgerDec = NostrTools.nip19.decode(nAddrLedger);
      console.log(nAddrLedgerDec);
      //get event from Relay
      const pool = new NostrTools.SimplePool();
      const relays = nAddrLedgerDec.data.relays;
      function authF(eventA) {
        return NostrTools.finalizeEvent(eventA, liKeypair.sk);
      }
      const event = await pool.get(
        relays,
        {
          kind: 37701,
          tags: [ ["d", nAddrLedgerDec.data.identifier] ],
          pubkey: nAddrLedgerDec.data.pubkey
        },
        { onauth : authF }
      );
      console.log('it exists indeed on this relay: ', event);
      if (event == null) { throw "Event not found on relay."; }
      //save
      console.log(nAddrLedger);
      let liLedger = { naddr: nAddrLedger, event: event }
      let liLedgerString = JSON.stringify(liLedger);
      localStorage.setItem("liLedger", liLedgerString);
      saveLedgerDataIndexDB(event);
      document.getElementById("ledgerLoginInfo").innerHTML = "Currently used accounting ledger: " + nAddrLedger;
      document.getElementById("topNavLoginDataLedger").innerHTML = "ledger: " + nAddrLedger;
      document.getElementById("ledgerLoginInput").value = nAddrLedger;
      let feedback = "Successfully selected ledger naddr. View Ledger under 'Accounting Ledger' in the main menu.<br>Naddr: " + nAddrLedger;
      document.getElementById("ledgerLoginInputFeedback").innerHTML = feedback;
    } catch (error) {
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
      const relays = ["wss://personal.relays.land"];
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
          acc_units: ["sat"],
          acc_account_categories: [
            { id: "acc_c_0", name: "Income" },
            { id: "acc_c_1", name: "Expense" }
          ], 
          acc_accounts: [ 
            { id: "acc_0001", name: "Remuneration", parent_id: "acc_c_0" },
            { id: "acc_0002", name: "Incoming Zaps", parent_id: "acc_c_0" },
            { id: "acc_0003", name: "Incoming Donations", parent_id: "acc_c_0" },
            { id: "acc_0004", name: "Sales", parent_id: "acc_c_0" },
            { id: "acc_0005", name: "Own Deposit on Wallet", parent_id: "acc_c_0" },
            { id: "acc_1001", name: "Payments", parent_id: "acc_c_1" },
            { id: "acc_1002", name: "Outgoing Zaps", parent_id: "acc_c_1" },
            { id: "acc_1003", name: "Outgoing Donations", parent_id: "acc_c_1" },
            { id: "acc_1004", name: "Purchases", parent_id: "acc_c_1" },
            { id: "acc_1005", name: "Own Withdrawal from Wallet", parent_id: "acc_c_1" }
          ],
          acc_accountants: [
            { p: liKeypair.pk }
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
      //send example event to default Relay
      const pool = new NostrTools.SimplePool();
      function authF(eventA) {
        return NostrTools.finalizeEvent(eventA, liKeypair.sk);
      }
      await Promise.any(pool.publish(relays, spal, { onauth : authF }));
      const event = await pool.get(
        relays,
        {
          ids: [ spal.id ],
        },
       );
      console.log('it exists on this relay:', event);
      if(event == null) { throw "Error when saving on relay!"; }
      //save
      let spalNaddr = NostrTools.nip19.naddrEncode( { "identifier": d, "relays": relays, "pubkey": spal.pubkey, "kind": spal.kind } );
      console.log(spalNaddr);
      let liLedger = { naddr: spalNaddr, event: spal }
      let liLedgerString = JSON.stringify(liLedger);
      localStorage.setItem("liLedger", liLedgerString);
      saveLedgerDataIndexDB(spal);
      document.getElementById("ledgerLoginInfo").innerHTML = "Currently used accounting ledger: " + spalNaddr;
      document.getElementById("topNavLoginDataLedger").innerHTML = "ledger: " + spalNaddr;
      document.getElementById("ledgerLoginInput").value = spalNaddr;
      let feedback = "Successfully created and selected simple example ledger naddr. View Ledger under 'Accounting Ledger' in the main menu.<br>Naddr: " + spalNaddr;
      document.getElementById("ledgerCreateLoginInputFeedback").innerHTML = feedback;
    } catch (error) {
      let feedback = "Accounting ledger creation failed: " + error;
      document.getElementById("ledgerCreateLoginInputFeedback").innerHTML = feedback;
    }
  } else {
    let feedback = "First log in a npub, before creating a ledger event!";
    document.getElementById("ledgerCreateLoginInputFeedback").innerHTML = feedback;
  }
}

function saveLedgerDataIndexDB(ledgerEvent) {
  var db;
  var request = window.indexedDB.open("Ledger", 3);
  request.onerror = ReqEvent => {
    console.error("IndexDB open error: " + ReqEvent.target.errorCode);
  };
  request.onsuccess = ReqEvent => {
    db = ReqEvent.target.result;
    console.log("IndexDB open success");
    let txn = db.transaction("ledger_accounts", "readwrite");
    let ledger_accounts_ost = txn.objectStore("ledger_accounts");
    let evContent = JSON.parse(ledgerEvent.content);
    console.log(evContent);
    let evLedgerAccounts = evContent.acc_accounts;
    let evLedgerAccountCategories = evContent.acc_account_categories;
    console.log(evLedgerAccounts);
    console.log(evLedgerAccountCategories);
    for (let i = 0; i < evLedgerAccounts.length; i++) {
      let acc1 = {
        id: evLedgerAccounts[i].id,
        name: evLedgerAccounts[i].name,
        parent_id: evLedgerAccounts[i].parent_id
      };
      let requestT = ledger_accounts_ost.put(acc1);
      requestT.onsuccess = function() { 
        console.log("Ledger account saved", requestT.result);
      };
      requestT.onerror = function() {
        console.log("Database Transaction-Error: ", requestT.error);
      };  
    }
    txn.oncomplete = function() {
      console.log("Transaction is complete.");
    };
    let txn2 = db.transaction("ledger_account_categories", "readwrite");
    let ledger_accounts_ost2 = txn2.objectStore("ledger_account_categories");
    for (let i = 0; i < evLedgerAccountCategories.length; i++) {
      let acc2 = {
        id: evLedgerAccountCategories[i].id,
        name: evLedgerAccountCategories[i].name,
        parent_id: ""
      };
      let requestT2 = ledger_accounts_ost2.put(acc2);
      requestT2.onsuccess = function() { 
        console.log("Ledger account category saved", requestT2.result);
      };
      requestT2.onerror = function() {
        console.log("Database Transaction-Error: ", requestT2.error);
      };  
    }
    txn2.oncomplete = function() {
      console.log("Transaction is complete.");
    };
    let txn3 = db.transaction("ledger_metadata", "readwrite");
    let ledger_accounts_ost3 = txn3.objectStore("ledger_metadata");
      let ledMeta = {
        id: "metadata",
        name: evContent.name,
        units: evContent.acc_units,
        accountants: evContent.acc_accountants
      };
      let requestT3 = ledger_accounts_ost3.put(ledMeta);
      requestT3.onsuccess = function() { 
        console.log("Ledger account category saved", requestT3.result);
      };
      requestT3.onerror = function() {
        console.log("Database Transaction-Error: ", requestT3.error);
      };  
    txn3.oncomplete = function() {
      console.log("Transaction is complete.");
    };
  };
  request.onupgradeneeded = function(ReqEvent) {
    db = request.result;
    if (!db.objectStoreNames.contains("ledger_accounts", {keyPath: "id"})) {
      db.createObjectStore("ledger_accounts", {keyPath: "id"});
    }
    if (!db.objectStoreNames.contains("ledger_account_categories", {keyPath: "id"})) {
      db.createObjectStore("ledger_account_categories", {keyPath: "id"});
    }
    if (!db.objectStoreNames.contains("ledger_metadata", {keyPath: "id"})) {
      db.createObjectStore("ledger_metadata", {keyPath: "id"});
    }
    console.log("Database initialize success.");
  };
}
