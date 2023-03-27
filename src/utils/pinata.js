// const key = import.meta.env.VITE_REACT_APP_PINATA_KEY;
// const secret = import.meta.env.VITE_REACT_APP_PINATA_SECRET;
const JWT =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmMDRiZmUwNC1hMGFiLTQ0ZmYtODFhZi01ZDI2YjI2ZWVlYTMiLCJlbWFpbCI6ImhlaGUxOTg4MTk4OEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZjQ2YWYyMjM1M2Q1MDIyOWMyNzMiLCJzY29wZWRLZXlTZWNyZXQiOiJhZDk3MTAxYzYyYzY0MzU1ZmQzNmRhZGU2OTE3YjZlYzI3M2RlMmM2NzIwYzQyMmY0YzU1ZmIxMDk3NTJiN2Y0IiwiaWF0IjoxNjc5NjQ1Mjk2fQ.IsX2qg8oCDgZ6zrkhIwkPD7M6mkGqdvHnKoh5d96abE";
import axios from "axios";

export const pinJSONToIPFS = async (jsonObject, fileName) => {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  const jsonBlob = new Blob([JSON.stringify(jsonObject)], {
    type: "application/json",
  });
  const formData = new FormData();
  formData.append("file", jsonBlob, fileName);

  const options = JSON.stringify({
    wrapWithDirectory: true,
  });
  formData.append("pinataOptions", options);

  return axios
    .post(url, formData, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        Authorization: JWT,
        // pinata_api_key: key,
        // pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      return {
        success: true,
        pinataUrl:
          "https://gateway.pinata.cloud/ipfs/" + response.data.ipfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};
