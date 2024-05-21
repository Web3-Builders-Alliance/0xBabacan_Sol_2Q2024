import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";

// Define our Mint address
const mint = publicKey("2vG9qWEG1VhBMTEBjA8isoGhMjRATt2uTiRQLHHxiJWz")  // Comes from the output of spl_init.ts

// https://github.com/Web3-Builders-Alliance/cohort-helper/tree/main/BonusResources/umi
// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

(async () => {
    try {
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint,
            mintAuthority: signer,
        };

        let data: DataV2Args = {
            name: "Solana Starter",
            symbol: "SOS",
            uri: "",
            sellerFeeBasisPoints: 500,
            creators: null,
            collection: null,
            uses: null,
        };

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null,
        };

        let tx = createMetadataAccountV3(
            umi, {
            ...accounts,
            ...args,
        });

        let result = await tx.sendAndConfirm(umi).then(r => r.signature.toString());
        /* Equivalent to
        const signedTransaction = await tx.buildAndSign(umi);
        const signature = await umi.rpc.sendTransaction(signedTransaction);
        const confirmResult = await umi.rpc.confirmTransaction(signature, {
            strategy: { type: 'blockhash', ...(await umi.rpc.getLatestBlockhash()) }
        });
        */
        console.log(result);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
/*
7,204,167,217,38,1,252,37,237,1,202,126,211,224,181,76,106,25,201,17,74,24,212,92,61,252,94,190,102,169,211,92,181,23,192,107,121,228,10,25,81,67,210,140,52,127,49,170,48,149,71,98,87,74,51,245,87,101,59,140,55,240,86,15
*/