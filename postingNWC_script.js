function defaultOpen() {
  console.log("Start nwc posting");
  setLoginData();
  setLoginTextBoxes();
}

function connectNWCWallet() {
  console.log("Connect nwc Wallet");
  try {
    let nwcConnectionDataString = document.getElementById("connectNWCWalletInput").value;
    console.log("" + nwcConnectionDataString);
    let nwcConnectionData = NostrTools.nip47.parseConnectionString(nwcConnectionDataString);
    console.log(nwcConnectionData);
    console.log("Nwc wallet connected.");
  } catch (error) {
    console.log("Nwc wallet connection failed: " + error);
    let feedback = "NWC wallet connection failed: " + error;
    document.getElementById("connectNWCWalletInputFeedback").innerHTML = feedback;
  }
}

function setLoginTextBoxes() {
  console.log("LogInTextBoxes set.");
}
