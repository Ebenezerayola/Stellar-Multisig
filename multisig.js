const {
  Networks,
  Server,
  TransactionBuilder,
  Operation,
  Keypair
} = require("stellar-sdk");
const { ade, emeka } = require("./accounts");

const server = new Server("https://horizon-testnet.stellar.org");

const setMultisigOnadeAccount = async () => {
  const extraSigner = {
    signer: {
      ed25519PublicKey: emeka.publicKey,
      weight: 1
    }
  };

  const thresholds = {
    masterWeight: 2, // master (ade) represents the account's private key
    lowThreshold: 2, // ade can sign on its own, but emeka can't
    medThreshold: 3, // ade and emeka both need to sign for payments or changes of trustlines
    highThreshold: 3 // same, for account merges and other account options
  };

  const txOptions = {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Networks.TESTNET
  };

  const adeAccount = await server.loadAccount(ade.publicKey);

  const multiSigTx = new TransactionBuilder(adeAccount, txOptions)
    .addOperation(Operation.setOptions(thresholds))
    .addOperation(Operation.setOptions(extraSigner))
    .setTimeout(0)
    .build();

  multiSigTx.sign(Keypair.fromSecret(ade.secret));

  await server.submitTransaction(multiSigTx);

  
};

setMultisigOnadeAccount()
  .then(() => {
    console.log("signed");
  })
  .catch(e => {
    console.error(e);
    throw e;
  });