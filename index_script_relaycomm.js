async function getLedgerEvent(naddrLedger, secK) {
  const pool = new NostrTools.SimplePool();
  const relays = naddrLedger.data.relays;
  console.log("Naddr relays: " + relays);
  console.log("Get Ledger event.");
  function authF(eventA) {
    console.log("Relay authentication.");
    return NostrTools.finalizeEvent(eventA, secK);
  }
  const event = await pool.get(
    relays,
    {
      kind: 37701,
      tags: [ ["d", naddrLedger.data.identifier] ],
      pubkey: naddrLedger.data.pubkey
    },
    { onauth : authF }
  );
  console.log('Event from Relay: ', event);
  if (event == null) { 
    throw "Event not found on relay."; 
  } else { 
    return event; 
  }
}
