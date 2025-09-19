function defaultOpen() {
  console.log("Start loginLedger");

  let liKeypairString = localStorage.getItem("liKeypair");
  if(liKeypairString !== null) {
    let liKeypair = JSON.parse(liKeypairString);
    let pk = NostrTools.nip19.npubEncode(liKeypair.pk);
    document.getElementById("topNavLoginDataNpub").innerHTML = "npub: " + pk;
  }
  
  let liLedgerString = localStorage.getItem("liLedger");
  if(liLedgerString !== null) {
    let liLedger = JSON.parse(liLedgerString);
    let naddr = liLedger.naddr;
    document.getElementById("ledgerLoginInfo").innerHTML = "Currently used accounting ledger: " + naddr;
    document.getElementById("topNavLoginDataLedger").innerHTML = "ledger: " + naddr;
    document.getElementById("ledgerLoginInput").value = naddr;
  }
}

function logInLedger() {
  let feedback = "Not yet implemented.";
  document.getElementById("ledgerLoginInputFeedback").innerHTML = feedback;
  /*let sk = document.getElementById("npubLoginInput").value;
  try {
    let skDec = NostrTools.nip19.decode(sk);
    let skHex = NostrTools.utils.bytesToHex(skDec.data);
    console.log(sk);
    console.log(skDec);
    console.log(skHex);
    let pkHex = NostrTools.getPublicKey(skDec.data);
    let pk = NostrTools.nip19.npubEncode(pkHex);
    console.log(pkHex);
    console.log(pk);
    let keypair = { pk: pkHex, sk: skHex };
    let keypairString = JSON.stringify(keypair);
    localStorage.setItem("liKeypair", keypairString); 
    document.getElementById("npubLoginInfo").innerHTML = "Currently logged in: " + pk;
    document.getElementById("topNavLoginDataNpub").innerHTML = "npub: " + pk;
    document.getElementById("npubLoginInput").value = sk;
    let feedback = "Successfull log in.";
    document.getElementById("npubLoginInputFeedback").innerHTML = feedback;
  } catch (error) {
    let feedback = "Log In failed. Nsec not in correct format. " + error;
    document.getElementById("npubLoginInputFeedback").innerHTML = feedback;
  }*/
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
          acc_units: ["sat", "eur"],
          acc_accounts: [ 
            { id: "acc_0001", name: "Wallet" }, 
            { id: "acc_3001", name: "Inflows" }, 
            { id: "acc_4001", name: "Outflows" } 
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
