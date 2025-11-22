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

function getIdentifier(tags) {
  try {
    for (let i = 0; i < tags.length; i++) {
      if (tags[i][0] == 'd') {
        return tags[i][1];
      }
    }
    return null;
  } catch (error) {
    throw "Ledger Event not in correct format.";
  }
}

function getLedgerAccountCategoryTree(accountCategories) {
  try {
    let accountCategoryTree = [];
    let j = 0;
    for (let i = 0; i < accountCategories.length; i++) {
      if (accountCategories[i].parent_id == null || accountCategories[i].parent_id.length == 0) {
        let root_category = { root: accountCategories[i], leafs: [] };
        let roundNumber = 0;
        root_category.leafs = setCategoryLeafs(accountCategories[i], accountCategories, roundNumber);
        accountCategoryTree[j] = root_category;
        j = j + 1;
      }
    }
    console.log(accountCategoryTree);
    return accountCategoryTree;
  } catch (error) {
    throw "Ledger Event not in correct format.";
  }
}

function setCategoryLeafs(rootCategory, categories, round) {
  let categoryLeafs = [];
  if (round > 5) {
    return categoryLeafs;
  }
  let k = 0;
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].parent_id == null || categories[i].parent_id.length == 0) {
    } else {
      for (j = 0; j < categories[i].parent_id.length; j++) {
        if (categories[i].parent_id[j] == rootCategory.id) {
          let leaf_root_category = { root: categories[i], leafs: [] };
          let roundNumber = round + 1;
          leaf_root_category.leafs = setCategoryLeafs(categories[i], categories, roundNumber);
          categoryLeafs[k] = leaf_root_category;
          k = k + 1;
        }
      }
    }
  }
  return categoryLeafs;
}
