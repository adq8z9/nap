function defaultOpen() {
  console.log("Start nwc login");
  setLoginData();
  setNWCView();
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

async function setNWCView() {
  let liLedgerString = localStorage.getItem("liLedger");
  let liKeypairString = localStorage.getItem("liKeypair");
  let liNWCString = localStorage.getItem("liNWC");
  if(liLedgerString !== null && liKeypairString !== null && liNWCString !== null) {
    try {
      let liNWC = JSON.parse(liNWCString);
      document.getElementById("connectNWCWalletInfo").innerHTML = "Currently connected nwc wallet: " + liNWC.connectionData.pubkey;
      document.getElementById("connectNWCWalletInput").value = liNWC.connectionString;
      document.getElementById("connectNWCWalletInputFeedback").innerHTML = "";
      //Create data request
      document.getElementById("connectNWCWalletData").innerHTML = "";
      document.getElementById("connectNWCWalletDataFeedback").innerHTML = "Loading.";
      const nwcRequestContent = {
        "method": "get_balance", 
        "params": {},
      };
      let conversationKey = NostrTools.nip44.getConversationKey(liNWC.connectionData.secret, liNWC.connectionData.pubkey);
      let nwcRequest = NostrTools.finalizeEvent({
        kind: 23194,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['encryption','nip44_v2'],['p', liNWC.connectionData.pubkey]],
        content: NostrTools.nip44.encrypt(JSON.stringify(nwcRequestContent), conversationKey)
      }, liNWC.connectionData.secret);
      console.log(nwcRequest);
      let nwcResponseEvent = await requestNwcEvent(nwcRequest, liNWC.connectionData);
      console.log(nwcResponseEvent);
      let responseContentDecrypted = NostrTools.nip44.decrypt(nwcResponseEvent.content, conversationKey);
      console.log(responseContentDecrypted);
      let response = JSON.parse(responseContentDecrypted);
      console.log(response);
      let nwcData = (response.result.balance/1000) + " sats";
      document.getElementById("connectNWCWalletDataFeedback").innerHTML = "";
      document.getElementById("connectNWCWalletData").innerHTML = nwcData;
      console.log("NWC View set.");
    } catch (error) {
      document.getElementById("connectNWCWalletDataFeedback").innerHTML = "Creating nwc wallet view failed: " + error;
    } 
  } else if (liLedgerString == null) {
    document.getElementById("connectNWCWalletData").innerHTML = "No Ledger selected.";
  } else if (liKeypairString == null) {
    document.getElementById("connectNWCWalletData").innerHTML = "No accountant logged in.";
  } else if (liNWCString == null) {
    document.getElementById("connectNWCWalletData").innerHTML = "No nwc wallet connected.";
  }
}
