require("dotenv").config();
const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_SECRET;
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK(key, secret);
const fs = require("fs");
const readableStreamForFile = fs.createReadStream("./imgNFT.png");

const options = {
  pinataMetadata: {
    name: "AlyraNFT",
  },
  pinataOptions: {
    cidVersion: 0,
  },
};

pinata
  .pinFileToIPFS(readableStreamForFile, options)
  .then((result) => {
    console.log(result);
    const body = {
      description: "Un NFT tres beau pour Alyra",
      image: result.IpfsHash,
      name: "AlyraNFT",
    };

    pinata
      .pinJSONToIPFS(body, options)
      .then((json) => {
        console.log(json);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });

/*
  upload de fichier sur pinata iva script
  on uplaod le fichier et obtient un hash
  puis affiche le json correspondant

  node upload.js


  reponse :
  {
  IpfsHash: 'QmNzUkjiXzsKzPbLFeApU8EguGwNYvHa2voWHvsWK1P5M8',
  PinSize: 457338,
  Timestamp: '2023-11-14T22:17:16.465Z'
}
{
  IpfsHash: 'QmTz4jyfAGTMqEG3RAjvKHMnKf2f2phoTgpJq7rVswUP3V',
  PinSize: 128,
  Timestamp: '2023-11-14T22:17:18.005Z'
}
  */
