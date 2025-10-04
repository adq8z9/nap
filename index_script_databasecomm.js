function saveLedgerEventDB(ledgerEvent) {
  var db;
  var request = window.indexedDB.open("Nap", 3);
  request.onerror = ReqEvent => {
    console.log("IndexDB open error: " + ReqEvent.target.errorCode);
    throw "IndexDB open error: " + ReqEvent.target.errorCode;
  };
  request.onsuccess = ReqEvent => {
    db = ReqEvent.target.result;
    console.log("IndexDB open success");
    let txn = db.transaction("ledger_events", "readwrite");
    let ledger_accounts_ost = txn.objectStore("ledger_events");
    console.log(ledgerEvent);
    let ledgerEvEntry = {
        id: ledgerEvent.id,
        event: ledgerEvent
    };
    let requestT = ledger_accounts_ost.put(ledgerEvEntry);
    requestT.onsuccess = function() { 
      console.log("Ledger event saved in DB: ", requestT.result);
    };
    requestT.onerror = function() {
      console.log("Ledger event Database Transaction-Error: " + requestT.error);
      throw "Ledger event Database Transaction-Error: " + requestT.error;
    };  
    txn.oncomplete = function() {
      console.log("Ledger event Database Transaction is complete.");
    };
  };
  request.onupgradeneeded = function(ReqEvent) {
    db = request.result;
    if (!db.objectStoreNames.contains("ledger_events", {keyPath: "id"})) {
      db.createObjectStore("ledger_events", {keyPath: "id"});
    }
    console.log("Database initialize success.");
  };
}

function saveLedgerEntryEventDB(leEvent) {
  var db;
  var request = window.indexedDB.open("Nap", 3);
  request.onerror = ReqEvent => {
    console.log("IndexDB open error: " + ReqEvent.target.errorCode);
    throw "IndexDB open error: " + ReqEvent.target.errorCode;
  };
  request.onsuccess = ReqEvent => {
    db = ReqEvent.target.result;
    console.log("IndexDB open success");
    let txn = db.transaction("ledger_entry_events", "readwrite");
    let ledger_accounts_ost = txn.objectStore("ledger_entry_events");
    console.log(leEvent);
    let ledgerEntryEvEntry = {
        id: leEvent.id,
        event: leEvent
    };
    let requestT = ledger_accounts_ost.put(ledgerEntryEvEntry);
    requestT.onsuccess = function() { 
      console.log("Ledger entry event saved in DB: ", requestT.result);
    };
    requestT.onerror = function() {
      console.log("Ledger entry event Database Transaction-Error: " + requestT.error);
      throw "Ledger entry event Database Transaction-Error: " + requestT.error;
    };  
    txn.oncomplete = function() {
      console.log("Ledger entry event Database Transaction is complete.");
    };
  };
  request.onupgradeneeded = function(ReqEvent) {
    db = request.result;
    if (!db.objectStoreNames.contains("ledger_events", {keyPath: "id"})) {
      db.createObjectStore("ledger_events", {keyPath: "id"});
    }
    if (!db.objectStoreNames.contains("ledger_entry_events", {keyPath: "id"})) {
      db.createObjectStore("ledger_entry_events", {keyPath: "id"});
    }
    console.log("Database initialize success.");
  };
}

function getLedgerEventDB(ledgerEventId) {
  return new Promise((resolve, reject) => {
    var db;
    var request = window.indexedDB.open("Nap", 3);
    console.log("getLedgerEventDB");
    request.onerror = ReqEvent => {  
      console.log("IndexDB open error: " + ReqEvent.target.errorCode);
      throw "IndexDB open error: " + ReqEvent.target.errorCode;
    };
    request.onsuccess = ReqEvent => {
      db = ReqEvent.target.result;
      console.log("IndexDB open success");
      let txn = db.transaction("ledger_events", "readwrite");
      let ledger_accounts_ost = txn.objectStore("ledger_events");
      console.log(ledgerEventId);
      let requestT = ledger_accounts_ost.get(ledgerEventId);
      requestT.onsuccess = function() { 
        console.log("Ledger event retrieved from DB: ", requestT.result);
        let ledgerEvent = requestT.result.event;
        console.log(ledgerEvent);
        return resolve(ledgerEvent);
      };
      requestT.onerror = function() {
        console.log("Ledger event Database Transaction-Error: " + requestT.error);
        throw "Ledger event Database Transaction-Error: " + requestT.error;
      };  
      txn.oncomplete = function() {
        console.log("Ledger event Database Transaction is complete.");
      };
    };
    request.onupgradeneeded = function(ReqEvent) {
      db = request.result;
      if (!db.objectStoreNames.contains("ledger_events", {keyPath: "id"})) {
        db.createObjectStore("ledger_events", {keyPath: "id"});
      }
      console.log("Database initialize success.");
    };
  });
}
