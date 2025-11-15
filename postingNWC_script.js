function defaultOpen() {
  console.log("Start nwc posting");
  setLoginData();
  setNWCView();
}

async function connectNWCWallet() {
  console.log("Connect nwc Wallet");
  let liLedgerString = localStorage.getItem("liLedger");
  let liKeypairString = localStorage.getItem("liKeypair");
  if(liLedgerString !== null && liKeypairString !== null) {
    try {
      let nwcConnectionDataString = document.getElementById("connectNWCWalletInput").value;
      console.log("" + nwcConnectionDataString);
      let nwcConnectionData = NostrTools.nip47.parseConnectionString(nwcConnectionDataString);
      console.log(nwcConnectionData);
      let nwcInfoEvent = await getNwcInfoEvent(nwcConnectionData);
      console.log(nwcInfoEvent);
      let liNWCd = { connectionString: nwcConnectionDataString, connectionData: nwcConnectionData };
      let liNWCdString = JSON.stringify(liNWCd);
      localStorage.setItem("liNWC", liNWCdString);
      setNWCView();
      let feedback = "Succesfully connected nwc wallet.";
      document.getElementById("connectNWCWalletInputFeedback").innerHTML = feedback;
      console.log("Nwc wallet connected.");
    } catch (error) {
      console.log("Nwc wallet connection failed: " + error);
      let feedback = "NWC wallet connection failed: " + error;
      document.getElementById("connectNWCWalletInputFeedback").innerHTML = feedback;
    } 
  } else if (liLedgerString == null) {
      document.getElementById("connectNWCWalletInputFeedback").innerHTML = "Error: No Ledger selected.";
  } else if (liKeypairString == null) {
      document.getElementById("connectNWCWalletInputFeedback").innerHTML = "Error: No accountant logged in.";
  }
}

function setNWCView() {
  //Create data request
  const nwcRequestData = {
    tags: [
      ["L", "leaccountingnip"],
      ["p", "test"]
    ], 
    content: {
      name: "test"
    }   
  };
  /*let nwcRequest = NostrTools.finalizeEvent({
    kind: 37701,
    created_at: Math.floor(Date.now() / 1000),
    tags: nwcRequestData.tags,
    content: JSON.stringify(nwcRequestData.content),
  }, nwcConnectionData.secret);
  console.log(nwcRequest);*/
  let nwcBalance = "<br><b>Wallet Balance: </b><br><br>121.000 sats";
  document.getElementById("connectNWCWalletData").innerHTML = nwcBalance;
  console.log("NWC View set.");
}
