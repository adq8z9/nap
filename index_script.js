function defaultOpen() {
  document.getElementById("defaultOpen").click();

  setLoginData();
  setNewLedgerTemplate();
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

function sendNewLedgerEvent() {
  let nleString = document.getElementById("newledgerInput").value;
  console.log(nleString);
  try {
    let nle = JSON.parse(nleString);
    console.log(nle);
    let feedback = "Successfully sent. Naddr is: tbd (please copy for log in)";
    document.getElementById("sendNewLedgerFeedback").innerHTML = feedback;
  } catch (error) {
    let feedback = "Send failed. " + error;
    document.getElementById("sendNewLedgerFeedback").innerHTML = feedback;
  }
}

function logInNpub() {
  let sk = document.getElementById("npubLoginInput").value;
  try {
    let skDec = NostrTools.nip19.decode(sk);
    document.getElementById("npubLoginInput").value = sk;
    let pk = NostrTools.getPublicKey(skDec.data);
    let pkEnc = NostrTools.nip19.npubEncode(pk);
    localStorage.setItem("liPubkey", pk);
    localStorage.setItem("liSeckey", skDec.data);
    document.getElementById("npubLoginInfo").innerHTML = "Currently logged in: " + NostrTools.nip19.npubEncode(localStorage.getItem("liPubkey"));
    document.getElementById("npub_right").innerHTML = NostrTools.nip19.npubEncode(localStorage.getItem("liPubkey"));
    let feedback = "Successfull log in.";
    document.getElementById("npubLoginInputFeedback").innerHTML = feedback;
  } catch (error) {
    let feedback = "Log In failed. Nsec not in correct format. " + error;
    document.getElementById("npubLoginInputFeedback").innerHTML = feedback;
  }
}

function setNewLedgerTemplate() {
  const text = '{"tags" : [ [ "d" , "input d value (id)"], [ "r" , "input relay for accounting work, for several include additional r-lines"], [ "server" , "input (bloowsom) file storage relay for accounting work, for several include additional server-lines"], [ "p" , "include pubkey of people who should be allowed to book on ledger, for several include additional p-lines"] ], "content" : { "name" : "name of acc ledger", "description" : "description of ledger", "acc_units" : [ "allow unit code for entries, optional more with ," ], "acc_account_categories": [ { "id" : "ledger account category id", "name": "string of ledger account category name ", "description" : "description of ledger account category", "parent_id" : ["ledger account category id of parent category", "..."] } ], "acc_accounts": [ { "id" : "ledger account id", "name" : "string of ledger account name", "description" : "description of ledger account", "parent_id" : [ "ledger account category id of parent category", "..."] } ], "acc_mvt_type_categories" : [ { "id": "ledger movement type category id", "name" : "string of ledger movement type category name", "description": "description of ledger movement type category", "parent_id" : ["ledger movement type category id of parent category", "..."] } ], "acc_mvt_types" : [ { "id" : "ledger movement type id", "name": "string of ledger movement type name", "description": "description of ledger movement type", "parent_id": [ "ledger movement type category id of parent category", "..."] } ], "acc_partner_categories" : [ { "id" : "ledger accounting partner category id", "name" : "string of ledger accounting partner category name", "description" : "description of ledger accounting partner category", "parent_id" : [ "ledger accounting partner category id of parent category>", "..."] } ], "acc_partners" : [ { "id" : "ledger accounting partner id", "name" : "string of ledger accounting partner name", "description": "description of ledger accounting partner", "parent_id" : [ "ledger accounting partner category id of parent category", "..."] } ], "acc_roles" : [ { "id" : "ledger accounting role id", "name" : "string of ledger accounting role name>", "description" : "description of ledger accounting role", "Allowed_acc" : ["allowed laccounts ids to book on for acc_role", "..."], "Allowed_mvt" : ["allowed lmvt_types ids to book on for acc_role", "..."], "Allowed_par" : ["allowed acc partner ids to book on for acc role", "..."] } ], "accountants" : [ ["pubkey", "accounting role id"] ] } }';
  const newLedgerTemplate = JSON.parse(text);  
  const newLedgerTemplateString = JSON.stringify(newLedgerTemplate);
  document.getElementById("newledgerInput").innerHTML = newLedgerTemplateString;
}

function setLoginData() {
  let loggedinPubkey = localStorage.getItem("liPubkey");
  if(loggedinPubkey !== null){
    document.getElementById("npub_right").innerHTML = NostrTools.nip19.npubEncode(loggedinPubkey);
    document.getElementById("npubLoginInfo").innerHTML = "Currently logged in: " + NostrTools.nip19.npubEncode(loggedinPubkey);
  }
}
