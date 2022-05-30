const {
    Networks,
    Server,
    TransactionBuilder,
    Operation,
    Keypair,
    Asset
  } = require("stellar-sdk");
  const { ade, emeka } = require("./accounts");
  
  const server = new Server("https://horizon-testnet.stellar.org");
  
  const adePaymentToemeka = async () => {
    const txOptions = {
      fee: await server.fetchBaseFee(),
      networkPassphrase: Networks.TESTNET
    };
  
    const adeAccount = await server.loadAccount(ade.publicKey);
  
    const paymentTx = new TransactionBuilder(adeAccount, txOptions)
      .addOperation(
        Operation.payment({
          amount: "1000",
          asset: Asset.native(),
          destination: emeka.publicKey
        })
      )
      .setTimeout(0)
      .build();
  
    paymentTx.sign(Keypair.fromSecret(ade.secret));
    paymentTx.sign(Keypair.fromSecret(emeka.secret));
  
    await server.submitTransaction(paymentTx);
  };
  
  adePaymentToemeka()
    .then(() => {
      console.log("Transaction complete");
    })
    .catch(e => {
      console.log(e.response.data.extras.result_codes);
    });