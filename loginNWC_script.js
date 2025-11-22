function defaultOpen() {
  console.log("Start nwc login");
  setLoginData();
  setLoginTextBoxes();
}

async function connectNWCWallet() {
  console.log("Connect nwc Wallet");
  let liLedgerString = localStorage.getItem("liLedger");
  let liKeypairString = localStorage.getItem("liKeypair");
  if(liLedgerString !== null && liKeypairString !== null) {
    try {
      document.getElementById("connectNWCWalletInputFeedback").innerHTML = "Loading.";
      let nwcConnectionDataString = document.getElementById("connectNWCWalletInput").value;
      console.log(nwcConnectionDataString);
      let nwcConnectionData = NostrTools.nip47.parseConnectionString(nwcConnectionDataString);
      console.log(nwcConnectionData);
      let nwcInfoEvent = await getNwcInfoEvent(nwcConnectionData);
      console.log(nwcInfoEvent);
      let liNWCd = { connectionString: nwcConnectionDataString, connectionData: nwcConnectionData, info: nwcInfoEvent };
      let liNWCdString = JSON.stringify(liNWCd);
      localStorage.setItem("liNWC", liNWCdString);
      setLoginTextBoxes();
      let feedback = "Succesfully connected nwc wallet.";
      document.getElementById("connectNWCWalletInputFeedback").innerHTML = feedback;
      console.log("Nwc wallet connected.");
    } catch (error) {
      console.log("Nwc wallet connection failed: " + error);
      let feedback = "NWC wallet connection failed: " + error;
      document.getElementById("connectNWCWalletInputFeedback").innerHTML = feedback;
    } 
  } else if (liKeypairString == null) {
      document.getElementById("connectNWCWalletInputFeedback").innerHTML = "Error: No accountant logged in.";
  } else if (liLedgerString == null) {
      document.getElementById("connectNWCWalletInputFeedback").innerHTML = "Error: No Ledger selected.";
  }
}

function setLoginTextBoxes() {
  let liNWCString = localStorage.getItem("liNWC");
  if(liNWCString !== null) {
    let liNWC = JSON.parse(liNWCString);
    document.getElementById("connectNWCWalletInfo").innerHTML = "Currently connected nwc wallet: " + liNWC.connectionData.pubkey;
    document.getElementById("connectNWCWalletInput").value = liNWC.connectionString;
    document.getElementById("connectNWCWalletInputFeedback").innerHTML = "";
  }
  console.log("LogInTextBoxes set.");
}
