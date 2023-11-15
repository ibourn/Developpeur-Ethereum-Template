/*
setup de pinata => login => api key

test connexion en cli :
curl --request GET --url https://api.pinata.cloud/data/testAuthentication --header 'accept: application/json' --header 'authorization: Bearer L_PINATA_JWT_ICI'

GATEWAY_ACCESS = https://aqua-solid-lark-269.mypinata.cloud



*/

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const JWT = PINATA_JWT;

const pinFileToIPFS = async () => {
  const formData = new FormData();
  const src = "path/to/file.png";

  const file = fs.createReadStream(src);
  formData.append("file", file);

  const pinataMetadata = JSON.stringify({
    name: "File name",
  });
  formData.append("pinataMetadata", pinataMetadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", pinataOptions);

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};
pinFileToIPFS();
