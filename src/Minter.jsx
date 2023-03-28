import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
} from "./utils/interact";
import {
  Button,
  Input,
  Textarea,
  Stack,
  Heading,
  Container,
} from "@chakra-ui/react";

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ISBN, setISBN] = useState("");
  const [file, setFile] = useState();

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

  const fileUploader = (event) => {
    setFile(event.target.files[0]);
  };

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    const { status } = await mintNFT(file, name, description, ISBN, 100);
    setStatus(status);
  };

  return (
    <Container maxW="xl">
      <Stack spacing={3}>
        <Button id="walletButton" onClick={connectWalletPressed}>
          {walletAddress.length > 0 ? (
            "Connected: " +
            String(walletAddress).substring(0, 6) +
            "..." +
            String(walletAddress).substring(38)
          ) : (
            <span>Connect Wallet</span>
          )}
        </Button>

        <br></br>
        <Heading id="title">📚 Book Minter</Heading>
        <p>
          Simply upload your book file and add information, then press "Mint
          Book."
        </p>
        <form>
          <Stack spacing={3}>
            <Heading size="md">Upload Your Book File: </Heading>
            <Input
              type="file"
              onChange={fileUploader}
              accept=".epub"
              variant="flushed"
            />

            <Heading size="md">Book Name: </Heading>
            <Input
              type="text"
              placeholder="An amazing book."
              onChange={(event) => setName(event.target.value)}
            />

            <Heading size="md">Description: </Heading>
            <Textarea
              placeholder="Talk about the content in this book."
              onChange={(event) => setDescription(event.target.value)}
            />

            <Heading size="md">ISBN: </Heading>
            <Input
              type="text"
              placeholder="ISBN number of this book."
              onChange={(event) => setISBN(event.target.value)}
            />
          </Stack>
        </form>
        <Button id="mintButton" onClick={onMintPressed} colorScheme="teal">
          Mint Book
        </Button>
        <p id="status">{status}</p>
      </Stack>
    </Container>
  );
};

export default Minter;
