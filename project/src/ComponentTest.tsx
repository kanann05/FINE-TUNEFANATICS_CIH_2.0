



import { useEffect, useState } from "react";
import Component from './Component'
import CryptoJS from 'crypto-js';


export default function ComponentTest() {
  const api = "7XXltVsZTnpf"
  
  function handleAuth(data) {
     const bytes = CryptoJS.AES.decrypt(data, api);
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  
  // Handle invalid decryption
  if (!decryptedString) {
    throw new Error("Decryption failed. Possibly wrong password or corrupted data.");
  }
  console.log(JSON.parse(decryptedString))
  }
  return (
    <div style = {{width : 'fit-content'}}>
      <Component apiKey = {"7XXltVsZTnpf"} onAuthSuccess={handleAuth}/>
    </div>
  );
}
