async function refreshData() {
  let liKeypairString = localStorage.getItem("liKeypair");
  let liLedgerString = localStorage.getItem("liLedger");
  if(liKeypairString !== null && liLedgerString !== null) {
    try {
      let liKeypair = JSON.parse(liKeypairString);
      let liLedger = JSON.parse(liLedgerString);
      let nAddrLedger = liLedger.naddr;
      let nAddrLedgerDec = NostrTools.nip19.decode(nAddrLedger);
      console.log(nAddrLedgerDec);
      let ledgerEvent = await getLedgerEvent(nAddrLedgerDec, liKeypair.sk);
      console.log(nAddrLedger);
      console.log(ledgerEvent);
      let liLedgerNeu = { naddr: nAddrLedger, id: ledgerEvent.id };
      let liLedgerStringNew = JSON.stringify(liLedger);
      console.log(liLedgerStringNew);
      localStorage.setItem("liLedger", liLedgerStringNew);
      let lE = await saveLedgerEventDB(ledgerEvent);
      setLoginData();
      let feedback = "Successfully refreshed data.";
      document.getElementById("refreshDataFeedback").innerHTML = feedback;
      console.log("Successfully refreshed data.");
    } catch (error) {
      console.log("Refresh of data failed: " + error);
      let feedback = "Refresh of data failed: " + error;
      document.getElementById("refreshDataFeedback").innerHTML = feedback;
    }
  } else {
    let feedback = "First log in a accountant and ledger, before loading data!";
    document.getElementById("refreshDataFeedback").innerHTML = feedback;
  }
}

