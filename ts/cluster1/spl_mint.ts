import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../wba-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("2vG9qWEG1VhBMTEBjA8isoGhMjRATt2uTiRQLHHxiJWz");     // Comes from the output of spl_init.ts

(async () => {
    try {
      // Create an ATA
      const ata = await getOrCreateAssociatedTokenAccount(
        connection,
        keypair,    //payer
        mint,       //mint
        keypair.publicKey   //owner
      );
      console.log(`Your ata is: ${ata.address.toBase58()}`);
  
      // Mint tokens to ATA
      const mintTx = await mintTo(
        connection,
        keypair,    //payer
        mint,       //mint
        ata.address,//destination
        keypair.publicKey,      //authority
        1001n * token_decimals  //amount
      );
      console.log(`Your mint txid: ${mintTx}`);
    } catch (error) {
      console.log(`Oops, something went wrong: ${error}`);
    }
  })();

//Your ata is: Fd8GpBFXmLZLEHnJH2HVKHsRrPRXxm2zutXBcQ8WUMeV
//Your mint txid: 617iEJxBxcF2gm5yX1LMEVt2gf5tmhpScFnbjZpWKj1dDH5BpvHDUSzAK6NKAPpd6HwGP7n52t7ydy9QeXXvM6mf