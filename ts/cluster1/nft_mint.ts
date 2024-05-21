import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../wba-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    // Create an NFT by using your stuffed image
    let tx = createNft(umi, {
        mint: mint,
        name: "Rugy Balboa",
        symbol: "PAIN",
        uri: "https://arweave.net/lG6U90ilqfXtH0OraH-s-fgfugq2odd_ApUoHeqnZYI",
        sellerFeeBasisPoints: percentAmount(5)
    })
    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();

/*
Succesfully Minted! Check out your TX here:
https://explorer.solana.com/tx/517WNEXDPA1qxXxuKZteAcMMiMUvLXQwGKiznoSxbqqy5CCttSWWMMJU2LZf4NSe8VyqxR1twh8Sh6m6Ubraj1DK?cluster=devnet
Mint Address:  C85KkHihRvKipVcPcM18q1cpQYnj6YPLbkNZ8s23nyjd
*/