const solanaWeb3 = require("@solana/web3.js");
const path = require("path");
const fs = require("fs");
const prompts = require("prompts");

const _textQuestion = async ({ question }) => {
  const { value } = await prompts({
    type: "text",
    name: "value",
    message: question,
  });

  return value;
};

const _numberQuestion = async ({ question }) => {
  const { value } = await prompts({
    type: "number",
    name: "value",
    message: question,
    validate: (value) =>
      value > 1000 * 10 ? `Không nhập số lượng quá 10.000` : true,
  });

  return value;
};

const _byteArrayToHexString = (byteArray) => {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
};

setImmediate(async () => {
  const fileName = await _textQuestion({
    question: "Nhập tên file để lưu ví: ",
  });

  const outputFile = path.join(
    __dirname,
    `wallet-${fileName}-${new Date().getTime()}.txt`
  );

  const numberOfWallet = await _numberQuestion({
    question: "Nhập số lượng ví cần tạo: ",
  });

  for (const [index, value] of [...Array(numberOfWallet).keys()].entries()) {
    const keyPair = solanaWeb3.Keypair.generate();

    const address = keyPair.publicKey.toString();

    const privateKey = _byteArrayToHexString(keyPair.secretKey);

    if (address.length > 0) {
      console.log(
        `[${index + 1}/${numberOfWallet}] Tạo thành công ví ${address}`
      );

      fs.appendFileSync(outputFile, `${address}|${privateKey}\n`);
    }
  }
});
