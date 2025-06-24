// // export default function Component() {
// //     return(<div>
// //         <button style = {{padding : '10px 15px', fontWeight : '400', borderRadius : '15px', backgroundColor : "rgba(186, 167, 255, 0.5)"}}>Sign in with Trustlens</button>
// //         </div>)
// // }

// export default function Component() {
//   const openPopup = () => {
//     const width = 650;
//     const height = 600;
//     const left = (window.innerWidth - width) / 2;
//     const top = (window.innerHeight - height) / 2;

//     window.open(
//       "http://localhost:3000/middleware", // your backend route
//       "TrustlensAuthPopup", // popup window name
//       `width=${width},height=${height},top=${top},left=${left},resizable=no,toolbar=no,menubar=no,scrollbars=no,status=no`
//     );
//   };

//   return (
//     <div>
//       <button
//         onClick={openPopup}
//         style={{
//           padding: "10px 15px",
//           fontWeight: "400",
//           borderRadius: "15px",
//           backgroundColor: "rgba(186, 167, 255, 0.5)",
//         }}
//       >
//         Sign in with Trustlens
//       </button>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import CryptoJS from 'crypto-js';

function encryptObject(obj, password) {
  const jsonString = JSON.stringify(obj);
  const encrypted = CryptoJS.AES.encrypt(jsonString, password).toString();
  console.log(encrypted)
  return encrypted;
}


export default function Component({ apiKey, onAuthSuccess}) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "TRUSTLENS_AUTH_SUCCESS") {
        console.log("Received data from middleware:", event.data.data);
        
        // You can now do something with `event.data.data`, e.g. update state or call backend
        if(onAuthSuccess) {
          onAuthSuccess(encryptObject(event.data.data, apiKey))
        }
      }
    };

    window.addEventListener("message", handleMessage);
    
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const openPopup = () => {
    const width = 650;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    let popup = window.open(
      "http://localhost:3000/middleware",
      "TrustlensAuthPopup",
      `width=${width},height=${height},top=${top},left=${left},resizable=no,toolbar=no,menubar=no,scrollbars=no,status=no`
    );


    window.addEventListener("message", function handleReady(event) {
    if (
      event.origin === "http://localhost:3000" &&
      event.data?.ready &&
      popup
    ) {
      console.log("Popup is ready, sending apiKey...");
      popup.postMessage({ type: "TRUSTLENS_API", data: { apiKey: apiKey } }, "http://localhost:3000");

      console.log("📤 postMessage sent to popup");
    }
  });
    
  };
  const[img, setImg] = useState("");
  return (
    <div style = {{width : 'fit-content'}}>
      <button
        onClick={openPopup}
        style={{
          padding: "10px 15px",
          fontWeight: "400",
          borderRadius: "15px",
          backgroundColor: "rgba(186, 167, 255, 0.5)",
        }}
      >
        Sign in with Trustlens
      </button>
      {/* <img src = {img} alt = "image will appear"/> */}
    </div>
  );
}
