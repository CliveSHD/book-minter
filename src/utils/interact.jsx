import { pinJSONToIPFS, pinFileToIPFS } from "./pinata.js";
import { ethers } from "ethers";

import Books from "../Books.json";
const contractABI = Books.abi;
const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

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

export const mintNFT = async (file, name, description, isbn, amount) => {
  // error handling
  if (
    !file ||
    name.trim() == "" ||
    description.trim() == "" ||
    isbn.trim() == ""
  ) {
    return {
      success: false,
      status: "❗️Please make sure all fields are completed before minting.",
    };
  }

  const pinataFileResponse = await pinFileToIPFS(file);
  if (!pinataFileResponse.success) {
    return {
      success: false,
      status: "😭 Something went wrong while uploading your file.",
    };
  }

  // make metadata
  const metadata = new Object();
  metadata.name = name;
  metadata.description = description;
  metadata.isbn = isbn.replace(/-/g, "");
  metadata.file = pinataFileResponse.pinataUrl;

  // make pinata call
  const pinataResponse = await pinJSONToIPFS(metadata, `${isbn}.json`);
  if (!pinataResponse.success) {
    return {
      success: false,
      status: "😭 Something went wrong while uploading your tokenURI.",
    };
  }

  // load smart contract
  // window.contract = new ethers.Contract(contractAddress, contractABI);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  // Test
  console.log(pinataResponse.pinataUrl);

  try {
    const tx = await contract.mint(
      parseInt(isbn),
      amount,
      pinataResponse.pinataUrl
    );

    const receipt = await tx.wait();

    console.log("Transaction mined:", receipt);

    console.log(await contract.uri(123));
    return {
      success: true,
      status:
        "✅ Check out your transaction on Etherscan: https://goerli.etherscan.io/tx/" +
        receipt.transactionHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
};
