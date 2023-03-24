import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "./utils/interact";

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

  useEffect(() => {
    getCurrentWalletConnected().then((result) => {
      setWallet(result.address);
      setStatus(result.status);
    });

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChange", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏻 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(<p>🦊 You must install Metamask.</p>);
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    // TODO
  };

  return (
    <div>
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">📚 Book Minter</h1>
      <p>
        Simply upload your book file and add information, then press "Mint."
      </p>
      <form>
        <h2>Upload your book file: </h2>
        <input type="file" accept=".epub" />

        <h2>Name: </h2>
        <input
          type="text"
          placeholder="An amazing book."
          onChange={(event) => setName(event.target.value)}
        />

        <h2>Description: </h2>
        <input
          type="text"
          placeholder="Talk about the content in this book."
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint Book
      </button>
      <p id="status">{status}</p>
    </div>
  );
};

export default Minter;
