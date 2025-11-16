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
  } else if (event.kind != 37701 || event.pubkey != naddrLedger.data.pubkey || getIdentifier(event.tags) != naddrLedger.data.identifier) {
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

async function getNwcInfoEvent(nwcConnection) {
  const pool = new NostrTools.SimplePool();
  const relays = [ nwcConnection.relay ];
  console.log("Get nwc info event.");
  console.log("NWC request relays: " + relays);
  function authF(eventA) {
    console.log("Relay authentication.");
    return NostrTools.finalizeEvent(eventA, nwcConnection.secret);
  }
  const event = await pool.get(
    relays,
    {
      kinds: [13194],
      authors: [nwcConnection.pubkey]
    },
    { onauth : authF }
  );
  console.log('Event from Relay: ', event);
  if (event == null) { 
    throw "Event not found on relay."; 
  } else if (!NostrTools.verifyEvent(event)) {
    throw "Not valid event received from relay.";
  } else if (event.kind != 13194 || event.pubkey != nwcConnection.pubkey) {
    throw "Not correct event received from relay.";
  } else {
    return event; 
  }
}

async function requestNwcEvent(nwcRequestEv, nwcConnection) {
  const pool = new NostrTools.SimplePool();
  const relays = [ nwcConnection.relay ];
  console.log("Send nwc request event.");
  console.log("NWC request relays: " + relays);
  function authF(eventA) {
    console.log("Relay authentication.");
    return NostrTools.finalizeEvent(eventA, nwcConnection.secret);
  }
  await Promise.any(pool.publish(relays, nwcRequestEv, { onauth : authF }));
  /*const requEvent = await pool.get(
    relays,
    {
      ids: [nwcRequestEv.id],
      authors: [nwcRequestEv.pubkey],
      kinds: [13194]
    },
  );
  console.log('Request-Event from Relay: ', requEvent);*/
  /*console.log("Before delay");
  await delay(10);
  console.log("After delay");*/
  console.log("Receive nwc response event.");
  let respEvent = null; 
  await pool.subscribe(
    relays,
    {
      '#p': [nwcRequestEv.pubkey],
      '#e': [nwcRequestEv.id],
    },
    {
    onevent(event) {
      console.log('got event:', event);
      respEvent = event;
    }
  }
  );
  console.log("Before delay");
  await delay(2);
  console.log("After delay");
  console.log('Response-Event from Relay: ', respEvent);
  if(respEvent == null) { 
    throw "Error getting response from relay!"; 
  } else if (!NostrTools.verifyEvent(respEvent)) {
    throw "Not valid event received from relay.";
  } else {
    return respEvent;
  }
}

function delay(n) {
  return new Promise(function(resolve) {
    setTimeout(resolve, n * 1000);
  });
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
