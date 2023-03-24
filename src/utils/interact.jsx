import { pinJSONToIPFS } from "./pinata.js";

const contractABI = require("../Books.json");
const contractAddress = "0x92A93E00e8f0D5e68e5876369f37BCb78078391e";

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏻 Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>🦊 You must install Metamask.</p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          status: "👆🏻 Write a message in the text-field above.",
          address: addressArray[0],
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>🦊 You must install Metamask.</p>
        </span>
      ),
    };
  }
};

export const mintNFT = async (name, description, isbn, amount) => {
  // error handling
  if (
    name.trim() == "" ||
    description.trim() == "" ||
    isbn.trim() == "" ||
    amount.trim() == ""
  ) {
    return {
      success: false,
      status: "❗️Please make sure all fields are completed before minting.",
    };
  }

  // make metadata
  const metadata = new Object();
  metadata.name = name;
  metadata.description = description;
  metadata.isbn = isbn;

  // make pinata call
  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
    return {
      success: false,
      status: "😭 Something went wrong while uploading your tokenURI.",
    };
  }
  const tokenURI = pinataResponse.pinataUrl;

  // load smart contract
  window.contract = new ethers.Contract(contractAddress, contractABI);

  const transactionParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    data: window.contract.methods
      .mintNFT(window.ethereum.selectedAddress, tokenURI) // TODO need to change
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "✅ Check out your transaction on Etherscan: https://goerli.etherscan.io/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
};
