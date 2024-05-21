import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://arweave.net/HO4H544DqkLvV7RyW9ewIdRdDZ9MetUYa1wq6UHmUwE"     // Comes from the output of nft_image.ts
        const metadata = {
            name: "Rugy Balboa",
            symbol: "PAIN",
            description: "Yes pain, yes gain",
            image: image,
            attributes: [{
                training_mode: 'eveready',
                rarity: 'one and only',
                hard: 'harder',
                size: 'big enough'
            }],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: []
        };
        // Dress up the uri, load it with the metadata
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your stuffed image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();

// Your stuffed image URI:  https://arweave.net/lG6U90ilqfXtH0OraH-s-fgfugq2odd_ApUoHeqnZYI