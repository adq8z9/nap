function defaultOpen() {
  document.getElementById("defaultOpen").click();

  setLoginData();
}

function openView(evt, oView) {
  var mainDivs;
  
  mainDivs = document.getElementsByClassName("main");
  for (i = 0; i < mainDivs.length; i++) {
    mainDivs[i].style.display = "none";
  }
  menuPoints = document.getElementsByClassName("menu_point");
  for (i = 0; i < menuPoints.length; i++) {
    menuPoints[i].className = menuPoints[i].className.replace(" active", "");
  }

  document.getElementById(oView).style.display = "block";
  evt.currentTarget.className += " active";
}

function logInNpub() {
  let sk = document.getElementById("npubLoginInput").value;
  try {
    let skDec = NostrTools.nip19.decode(sk);
    let skHex = NostrTools.utils.bytesToHex(skDec.data);
    document.getElementById("npubLoginInput").value = sk;
    let pk = NostrTools.getPublicKey(skDec.data);
    let pkEnc = NostrTools.nip19.npubEncode(pk);
    localStorage.setItem("liPubkey", pk);
    localStorage.setItem("liSeckey", skHex);
    document.getElementById("npubLoginInfo").innerHTML = "Currently logged in: " + NostrTools.nip19.npubEncode(localStorage.getItem("liPubkey"));
    document.getElementById("npub_right").innerHTML = NostrTools.nip19.npubEncode(localStorage.getItem("liPubkey"));
    let feedback = "Successfull log in.";
    document.getElementById("npubLoginInputFeedback").innerHTML = feedback;
  } catch (error) {
    let feedback = "Log In failed. Nsec not in correct format. " + error;
    document.getElementById("npubLoginInputFeedback").innerHTML = feedback;
  }
}

async function logInLedger() {
  let nAddrLedger = document.getElementById("ledgerLoginInput").value;
  try {
    let nAddrLedgerDec = NostrTools.nip19.decode(nAddrLedger);
    
    //get event from Relay
    const pool = new NostrTools.SimplePool();
    const relays = nAddrLedgerDec.data.relays;
    const event = await pool.get(
      relays,
      {
        kind: nAddrLedgerDec.data.kind,
        tags: [ ["d", nAddrLedgerDec.data.identifier] ],
        pubkey: nAddrLedgerDec.data.pubkey
      },
      );
    console.log('it exists indeed on this relay:', event);
    if(event == null) { throw "Event not found on Relay!"; }
    let isGood = NostrTools.verifyEvent(event);
    console.log(isGood);
    if (!isGood) { throw "Event does not match signature!"; }
    
    let eventString = JSON.stringify(event);
    localStorage.setItem("liLedgerNaddr", nAddrLedger);
    localStorage.setItem("liLedger", eventString);
    setLoginData();
    let feedback = "Successfully selected accounting ledger. View ledger under Menu-point 'Ledger'.";
    document.getElementById("ledgerLoginInputFeedback").innerHTML = feedback;
  } catch (error) {
    let feedback = "Accounting ledger selection failed: " + error;
    document.getElementById("ledgerLoginInputFeedback").innerHTML = feedback;
  }
}

async function createAndLogInLedger() {
  try {
    const d = "SELV";
    const relays = ["wss://relay.damus.io"];
    const sELVData = {
      tags: [
        ["d", "SELV"],
        ["r", relays[0]],
        ["p", localStorage.getItem("liPubkey")]
      ], 
      content: {
        name: "Simple Example Ledger Event", 
        acc_unit: ["BTC", "EUR"],
        acc_accounts: [ 
          { id: "acc_0001", name: "Wallet" }, 
          { id: "acc_3001", name: "Inflows" }, 
          { id: "acc_4001", name: "Outflows" } 
        ],
        accountants: [
          { p: localStorage.getItem("liPubkey") }
        ]
      }   
    }
    let sk = localStorage.getItem("liSeckey");
    let sELV = NostrTools.finalizeEvent({
      kind: 37701,
      created_at: Math.floor(Date.now() / 1000),
      tags: sELVData.tags,
      content: JSON.stringify(sELVData.content),
    }, sk);
    console.log(sELV);
    let isGood = NostrTools.verifyEvent(sELV);
    console.log(isGood);
    let sELVString = JSON.stringify(sELV);
    let sELVNaddr = NostrTools.nip19.naddrEncode( { "identifier": d, "relays": relays, "pubkey": sELV.pubkey, "kind": sELV.kind } );
    
    //send event to Relay
    const pool = new NostrTools.SimplePool();
    await Promise.any(pool.publish(relays, sELV));
    const event = await pool.get(
      relays,
      {
        ids: [ sELV.id ],
      },
     );
    console.log('it exists on this relay:', event);
    if(event == null) { throw "Error when saving on relay!"; }

    localStorage.setItem("liLedgerNaddr", sELVNaddr);
    localStorage.setItem("liLedger", sELVString);
    document.getElementById("ledgerLoginInfo").innerHTML = "Currently used accounting ledger: " + localStorage.getItem("liLedgerNaddr");
    document.getElementById("ledger_right").innerHTML = localStorage.getItem("liLedgerNaddr");
    let feedback = "Successfully created and selected simple example ledger. View ledger under Menu-point 'Ledger'.";
    document.getElementById("ledgerCreateLoginInputFeedback").innerHTML = feedback;
  } catch (error) {
    let feedback = "Simple example event creation failed: " + error;
    document.getElementById("ledgerCreateLoginInputFeedback").innerHTML = feedback;
  }
}

function setLoginData() {
  let loggedinPubkey = localStorage.getItem("liPubkey");
  if(loggedinPubkey !== null){
    document.getElementById("npub_right").innerHTML = NostrTools.nip19.npubEncode(loggedinPubkey);
    document.getElementById("npubLoginInfo").innerHTML = "Currently logged in: " + NostrTools.nip19.npubEncode(loggedinPubkey);
  }
  let loggedinNaddr = localStorage.getItem("liLedgerNaddr");
  if(loggedinNaddr !== null){
    document.getElementById("ledgerLoginInfo").innerHTML = "Currently used accounting ledger: " + loggedinNaddr;
    document.getElementById("ledger_right").innerHTML = loggedinNaddr;
  }
  let loggedinLedgerDataString = localStorage.getItem("liLedger");
  if(loggedinLedgerDataString !== null) {
    try {
      let loggedinLedgerData = JSON.parse(loggedinLedgerDataString);
      let loggedinLedgerDataContent = JSON.parse(loggedinLedgerData.content);
      document.getElementById("ledgerNameText").innerHTML = loggedinLedgerDataContent.name;
      let relays = "";
      for (v in loggedinLedgerData.tags) {
        if(loggedinLedgerData.tags[v][0] == "r") { relays += loggedinLedgerData.tags[v][1] + "<br>"; }
      }    
      document.getElementById("ledgerRelaysText").innerHTML = relays;
      let accUnits = "";
      for (v in loggedinLedgerDataContent.acc_unit) {
        accUnits += loggedinLedgerDataContent.acc_unit[v] + "<br>";
      }
      document.getElementById("ledgerUnitsText").innerHTML = accUnits;
      let accounts = "";
      for (v in loggedinLedgerDataContent.acc_accounts) {
        accounts += "id: " + loggedinLedgerDataContent.acc_accounts[v]["id"] + " -> " + "name: " + loggedinLedgerDataContent.acc_accounts[v]["name"] + "<br>";
      }
      document.getElementById("ledgerAccountsText").innerHTML = accounts;
      let accountants = "";
      for (v in loggedinLedgerDataContent.accountants) {
        accountants += NostrTools.nip19.npubEncode(loggedinLedgerDataContent.accountants[v]["p"]) + "<br>";
      }
      document.getElementById("ledgerAccountantsText").innerHTML = accountants;
      let feedback = "";
      document.getElementById("ledgerInfoText").innerHTML = feedback;
    } catch (error) {
      let feedback = "Error loading selected Ledger-Event: " + error;
      document.getElementById("ledgerInfoText").innerHTML = feedback;
    }
  }
}
