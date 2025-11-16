function getAccountantByPubkey(sPK, lEventContent) {
  try {
    for (let i = 0; i < lEventContent.acc_accountants.length; i++) {
      if (lEventContent.acc_accountants[i].pubkey == sPK) {
        return lEventContent.acc_accountants[i];
      }
    }
    return null;
  } catch (error) {
    throw "Ledger Event not in correct format.";
  }
}
