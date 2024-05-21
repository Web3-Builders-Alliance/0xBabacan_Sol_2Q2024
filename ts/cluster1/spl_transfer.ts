import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

const TOKEN_DECIMALS = 1_000_000;

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("2vG9qWEG1VhBMTEBjA8isoGhMjRATt2uTiRQLHHxiJWz");          // Comes from the output of spl_init.ts

// Recipient address
const to = new PublicKey("8NHMejceXrhRMHQpmLMM5cvveFiFBcB3RDceauVfqz9q");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const from_ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,    //payer
            mint,       //mint
            keypair.publicKey   //owner
        );

        // Get the token account of the toWallet address, and if it does not exist, create it
        const to_ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,    //payer
            mint,       //mint
            to          //owner
        );
        // Transfer newly minted tokens to the "toTokenAccount" we just created
        const tx = await transfer(
            connection,
            keypair,    //payer
            from_ata.address,   //source
            to_ata.address,     //destination
            keypair.publicKey,  //owner of the source ATA
            10 * TOKEN_DECIMALS  //decimals
            //100000
        );
        console.log(
            `Succesfully transfered! Transaction Here: https://explorer.solana.com/tx/${tx}?cluster=devnet`
        );
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
/*
Succesfully transfered! Transaction Here: https://explorer.solana.com/tx/2gQagi8qmmJ7rYQQfdjfmquwmBjwebVDJK49HQMAKixeGxnFQckr5TLwaE1hYYSLwWKD558PCHMAdkm11b4RpAaD?cluster=devnet
*/