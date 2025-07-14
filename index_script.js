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
/*
function logInNpub() {
  let sk = document.getElementById("npubLoginInput").value;
  try {
    let skDec = NostrTools.nip19.decode(sk);
    let skHex = NostrTools.utils.bytesToHex(skDec.data);
    console.log(sk);
    console.log(skDec);
    console.log(skHex);
    document.getElementById("npubLoginInput").value = sk;
    let pk = NostrTools.getPublicKey(skDec.data);
    let pkEnc = NostrTools.nip19.npubEncode(pk);
    console.log(pk);
    console.log(pkEnc);
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
*/
function createAndLogInNpub() {
  try {
    let skDec = NostrTools.generateSecretKey();
    let skHex = NostrTools.utils.bytesToHex(skDec);
    let sk = NostrTools.nip19.nsecEncode(skDec);
    console.log(skDec);
    console.log(skHex);
    console.log(sk);
    let pk = NostrTools.getPublicKey(skDec);
    let pkEnc = NostrTools.nip19.npubEncode(pk);
    console.log(pk);
    console.log(pkEnc);
    localStorage.setItem("liPubkey", pk);
    localStorage.setItem("liSeckey", skHex);
    document.getElementById("npubLoginInfo").innerHTML = "Currently logged in: " + NostrTools.nip19.npubEncode(localStorage.getItem("liPubkey"));
    document.getElementById("npub_right").innerHTML = NostrTools.nip19.npubEncode(localStorage.getItem("liPubkey"));
    let feedback = "Successfull key generation and log in.";
    document.getElementById("npubCreateLoginInputFeedback").innerHTML = feedback;
  } catch (error) {
    let feedback = "Key generation failed: " + error;
    document.getElementById("npubCreateLoginInputFeedback").innerHTML = feedback;
  }
}
/*
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
*/
async function createAndLogInLedger() {
  try {
    const d = "SELV";
    const relays = ["ws://dummy.relay"];
    const sELVData = {
      tags: [
        ["d", "SELV"],
        ["r", relays[0]],
        ["p", localStorage.getItem("liPubkey")]
      ], 
      content: {
        name: "Simple Example Ledger Event", 
        acc_units: ["sat", "eur"],
        acc_accounts: [ 
          { id: "acc_0001", name: "Wallet" }, 
          { id: "acc_3001", name: "Inflows" }, 
          { id: "acc_4001", name: "Outflows" } 
        ],
        acc_accountants: [
          { p: localStorage.getItem("liPubkey") }
        ]
      }   
    };
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
    console.log(sELVNaddr);
    let selvATag = sELV.kind + ":" + sELV.pubkey + ":" + d;
    console.log(selvATag);
    /*
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
    */
    localStorage.setItem("liLedgerNaddr", sELVNaddr);
    localStorage.setItem("liLedger", sELVString);
    localStorage.setItem("liLedgerATag", selvATag);
    document.getElementById("ledgerLoginInfo").innerHTML = "Currently used accounting ledger: " + localStorage.getItem("liLedgerNaddr");
    document.getElementById("ledger_right").innerHTML = localStorage.getItem("liLedgerNaddr");
    setLoginData();
    let feedback = "Successfully created and selected simple example ledger. View ledger under Menu-point 'Ledger'.";
    document.getElementById("ledgerCreateLoginInputFeedback").innerHTML = feedback;
  } catch (error) {
    let feedback = "Simple example event creation failed: " + error;
    document.getElementById("ledgerCreateLoginInputFeedback").innerHTML = feedback;
  }
  try {
    const postingData1 = {
      tags: [
        ["A", localStorage.getItem("liLedgerATag")],
        ["I", "accounting:fan:acc_0001"],
        ["I", "accounting:fan:acc_3001"]
      ], 
      content: {
         debit_account: "acc_0001",
         credit_account: "acc_3001",
         acc_amount: [20000, 1, "sat"],
         description: "General income booking"
      }   
    };
    let sk = localStorage.getItem("liSeckey");
    let postingE1 = NostrTools.finalizeEvent({
      kind: 7701,
      created_at: Math.floor(new Date(2025, 6, 15) / 1000),
      tags: postingData1.tags,
      content: JSON.stringify(postingData1.content),
    }, sk);
    console.log(postingE1);
    let isGood1 = NostrTools.verifyEvent(postingE1);
    console.log(isGood1);
    let postingE1String = JSON.stringify(postingE1);

    const postingData2 = {
      tags: [
        ["A", localStorage.getItem("liLedgerATag")],
        ["I", "accounting:fan:acc_4001"],
        ["I", "accounting:fan:acc_0001"]
      ], 
      content: {
         debit_account: "acc_4001",
         credit_account: "acc_0001",
         acc_amount: [5000, 1, "sat"],
         description: "Restaurant"
      }   
    }
    let postingE2 = NostrTools.finalizeEvent({
      kind: 7701,
      created_at: Math.floor(new Date(2025, 6, 16) / 1000),
      tags: postingData2.tags,
      content: JSON.stringify(postingData2.content),
    }, sk);
    console.log(postingE2);
    let isGood2 = NostrTools.verifyEvent(postingE2);
    console.log(isGood2);
    let postingE2String = JSON.stringify(postingE2);

    const postingData3 = {
      tags: [
        ["A", localStorage.getItem("liLedgerATag")],
        ["I", "accounting:fan:acc_4001"],
        ["I", "accounting:fan:acc_0001"]
      ], 
      content: {
         debit_account: "acc_4001",
         credit_account: "acc_0001",
         acc_amount: [1000, 1, "sat"],
         description: "Newspaper"
      }   
    }
    let postingE3 = NostrTools.finalizeEvent({
      kind: 7701,
      created_at: Math.floor(new Date(2025, 6, 17) / 1000),
      tags: postingData3.tags,
      content: JSON.stringify(postingData3.content),
    }, sk);
    console.log(postingE3);
    let isGood3 = NostrTools.verifyEvent(postingE3);
    console.log(isGood3);
    let postingE3String = JSON.stringify(postingE3);

    
    localStorage.setItem("posting1", postingE1String);
    localStorage.setItem("posting2", postingE2String);
    localStorage.setItem("posting3", postingE3String);
    setLoginData();
    let feedback = "Successfully created and selected simple example ledger. View ledger under Menu-point 'Ledger'.<br>Example postings succesfully created. View under Menu-point 'Ledger Postings'.";
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
      for (v in loggedinLedgerDataContent.acc_units) {
        accUnits += loggedinLedgerDataContent.acc_units[v] + "<br>";
      }
      document.getElementById("ledgerUnitsText").innerHTML = accUnits;
      let accounts = "";
      for (v in loggedinLedgerDataContent.acc_accounts) {
        accounts += "id: " + loggedinLedgerDataContent.acc_accounts[v]["id"] + " -> " + "name: " + loggedinLedgerDataContent.acc_accounts[v]["name"] + "<br>";
      }
      document.getElementById("ledgerAccountsText").innerHTML = accounts;
      let accountants = "";
      for (v in loggedinLedgerDataContent.acc_accountants) {
        accountants += NostrTools.nip19.npubEncode(loggedinLedgerDataContent.acc_accountants[v]["p"]) + "<br>";
      }
      document.getElementById("ledgerAccountantsText").innerHTML = accountants;
      let feedback = "";
      document.getElementById("ledgerInfoText").innerHTML = feedback;
    } catch (error) {
      let feedback = "Error loading selected Ledger-Event: " + error;
      document.getElementById("ledgerInfoText").innerHTML = feedback;
    }
  }
  let postingData1String = localStorage.getItem("posting1");
  let postingData2String = localStorage.getItem("posting2");
  let postingData3String = localStorage.getItem("posting3");
  if(postingData1String !== null && postingData2String !== null && postingData3String !== null) {
    try {
      let postingData1 = JSON.parse(postingData1String);
      let postingData2 = JSON.parse(postingData2String);
      let postingData3 = JSON.parse(postingData3String);
      let postingData1Content = JSON.parse(postingData1.content);
      let postingData2Content = JSON.parse(postingData2.content);
      let postingData3Content = JSON.parse(postingData3.content);
      document.getElementById("postingsOverviewText").innerHTML = "Debit: " + postingData1Content.debit_account + ", Credit: " + postingData1Content.credit_account + ", Amount: " + postingData1Content.acc_amount[0] + " " + postingData1Content.acc_amount[2] + ", Description: " + postingData1Content.description + "<br>" + "Debit: " + postingData2Content.debit_account + ", Credit: " + postingData2Content.credit_account + ", Amount: " + postingData2Content.acc_amount[0] + " " + postingData2Content.acc_amount[2] + ", Description: " + postingData2Content.description + "<br>" + "Debit: " + postingData3Content.debit_account + ", Credit: " + postingData3Content.credit_account + ", Amount: " + postingData3Content.acc_amount[0] + " " + postingData3Content.acc_amount[2] + ", Description: " + postingData3Content.description + "<br>";
  
      let feedback = "";
      document.getElementById("postingsInfoText").innerHTML = feedback;
    } catch (error) {
      let feedback = "Error loading Posting-Events: " + error;
      document.getElementById("postingsInfoText").innerHTML = feedback;
    }
  }
}
