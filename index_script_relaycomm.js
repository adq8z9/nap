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
      kinds: [37701],
      '#d': [naddrLedger.data.identifier],
      authors: [naddrLedger.data.pubkey]
    },
    { onauth : authF }
  );
  console.log('Event from Relay: ', event);
  if (event == null) { 
    throw "Event not found on relay."; 
  } else if (!NostrTools.verifyEvent(event)) {
    throw "Not valid event received from relay.";
  } else if (event.kind != 37701 || event.pubkey != naddrLedger.data.pubkey) {
    throw "Not correct event received from relay.";
  } else {
    return event; 
  }
}

async function sendLedgerEvent(ledgerEvent, secK, relays) {
  const pool = new NostrTools.SimplePool();
  console.log("Send Ledger event.");
  function authF(eventA) {
    console.log("Relay authentication.");
    return NostrTools.finalizeEvent(eventA, secK);
  }
  await Promise.any(pool.publish(relays, ledgerEvent, { onauth : authF }));
  const event = await pool.get(
    relays,
    {
      ids: [ ledgerEvent.id ],
    },
  );
  console.log('Event from Relay: ', event);
  if(event == null) { 
    throw "Error when saving on relay!"; 
  } else if (!NostrTools.verifyEvent(event)) {
    throw "Not valid event received from relay.";
  } else if (event.id != ledgerEvent.id) {
    throw "Not correct event received from relay.";
  } else {
    return event;
  }
}

async function sendLedgerEntryEvent(leEvent, secK, relays) {
  const pool = new NostrTools.SimplePool();
  console.log("Send Ledger Entry event.");
  function authF(eventA) {
    console.log("Relay authentication.");
    return NostrTools.finalizeEvent(eventA, secK);
  }
  await Promise.any(pool.publish(relays, leEvent, { onauth : authF }));
  const event = await pool.get(
    relays,
    {
      ids: [ leEvent.id ],
    },
  );
  console.log('Event from Relay: ', event);
  if(event == null) { 
    throw "Error when saving on relay!"; 
  } else {
    return event;
  }
}
