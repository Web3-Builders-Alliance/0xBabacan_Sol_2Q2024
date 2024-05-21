import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from '@solana/spl-token';
import wallet from "../wba-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Alternative: To create dummy keypair
// const keypair = Keypair.generate();

console.log(keypair.publicKey.toString());
// 6zSsBNBYMzofCVHvRW8FyQDQhb4EgM79zwq2ZfUUduxx

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        // Create a Mint Account address
        const mint = await createMint(
            connection,
            keypair,    //payer
            keypair.publicKey,  //mintAuthority
            null,       //freezeAuthority
            6           //decimals
        )
        console.log(`mint address is: ${mint.toBase58()}`);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()

//mint address is: 2vG9qWEG1VhBMTEBjA8isoGhMjRATt2uTiRQLHHxiJWz
