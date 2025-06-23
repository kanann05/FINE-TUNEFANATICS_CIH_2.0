

import { Camera, Building2, Calendar, Mail, Phone, User, Users, TestTube } from "lucide-react";
import { useEffect, useRef, useState } from "react";


function getOS() {
  const userAgent = navigator.userAgent;

  if (userAgent.includes("Win")) return "Windows";
  if (userAgent.includes("Mac")) return "macOS";
  if (userAgent.includes("Linux")) return "Linux";
  if (/Android/.test(userAgent)) return "Android";
  if (/iPhone|iPad|iPod/.test(userAgent)) return "iOS";

  return "Unknown OS";
}
function getBrowser() {
  const userAgent = navigator.userAgent;

  if (/chrome|crios/i.test(userAgent)) return "Chrome";
  if (/firefox|fxios/i.test(userAgent)) return "Firefox";
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return "Safari";
  if (/edg/i.test(userAgent)) return "Edge";
  if (/opera|opr/i.test(userAgent)) return "Opera";

  return "Unknown Browser";
}

function getDeviceType() {
  const ua = navigator.userAgent;

  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) {
    if (/Tablet|iPad/i.test(ua)) {
      return "Tablet";
    }
    return "Mobile";
  }
  return "Desktop";
}


// console.log("Operating System:", getOS());
// console.log("Browser:", getBrowser());
// console.log('Device: ', getDeviceType())
let devEmail = "";

const icons = {
  basic: <Mail className="w-5 h-5 text-blue-500" />,
  personal: <User className="w-5 h-5 text-purple-500" />,
  business: <Building2 className="w-5 h-5 text-green-500" />,
};

interface final {
  id : string;
  name : string;
  purpose : string;
  icon : string;
  devEmail : string;
  userEmail : string;
  privacyPolicyUrl: string;
  dataCategories: string[];
  permissions: {
    name: string;
    status: 'Granted' | 'Denied';
  }[];
  

  timestamp : string;
  country : string;
  ip_address: string;
  browser: string;
  device_type: string;
  operating_system: string;
  successful: boolean;
  risk_level : string;
  location: {
    city: string;
    state: string | null;
    country_code: string;
  };
  
  app_color: string;


  accessFrequency : string;
}

const defaultFinalState: final = {
  id: '',
  name: '',
  purpose: '',
  icon: '',
  userEmail : '',
  devEmail : '',
  privacyPolicyUrl: '',
  dataCategories: [],
  permissions: [],

  timestamp: '',
  country: '',
  ip_address: '',
  browser: '',
  device_type: '',
  operating_system: '',
  successful: false,
  risk_level: '',
  location: {
    city: '',
    state: null,
    country_code: ''
  },

  app_color: '',
  accessFrequency: ''
};


const labels = {
  profilePhoto : "Profile Photo",
  email: "Email Address",
  name: "Full Name",
  phoneNumber: "Phone Number",
  dateOfBirth: "Date of Birth",
  gender: "Gender",
  physicalAddress : "Physical Address",
  mailingAddress : "Mailing Address",
  businessName : "Business Name",
  businessEmail : "Business Email",
  businessPhoneNumber : "Business Phone Number",
  numberOfEmployees : "Number of Employees",
  dateOfFoundation : "Date of foundation"
};
export default function Middleware() {
  useEffect(() => {window.opener.postMessage({ ready: true }, "http://localhost:3000");})
  
  let [apiKey, setApiKey] = useState("_8kcVjszOvp3");
window.addEventListener("message", (event) => {
  // console.log("Received event:", event);
  console.log(event.data.data.apiKey)
  let api = event.data.data.apiKey;
  // if(event.type)
  if (api) {
    // console.log("Received API Key:", api);
    setApiKey(api);
  } else {
    // console.warn("API key not found.");
  }
});
// const [apiKey, setApiKey] = useState("");
  const[found, setFound] = useState<boolean | null>(null);
  useEffect(() => {console.log(window)}, [])

  useEffect(() => {console.log(apiKey)}, [apiKey])
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [test, setTest] = useState("");

  const current = JSON.parse(localStorage.getItem('current') || '{}')
  const [step, setStep] = useState(1);
const [perms, setPerms] = useState<Record<string, string[]>>({});
  const [isEditing, setIsEditing] = useState(true);
  const [backData, setBackData] = useState<final>(defaultFinalState);
  const [devInfo, setDevInfo] = useState("");
  useEffect(() => {console.log(backData)}, [])

  

const [formData, setFormData] = useState({
    basic: {
      profilePhoto: null,
      accessToReadPost: false,
      email: '',
      name: ''
    },
    personal: {
      phoneNumber: '',
      physicalAddress: '',
      mailingAddress: '',
      dateOfBirth: '',
      gender: ''
    },
    business: {
      businessName: '',
      businessEmail: '',
      businessPhoneNumber: '',
      numberOfEmployees: '',
      dateOfFoundation: ''
    }
  });
const inputRef = useRef<HTMLInputElement>(null); 
  useEffect(() => {
    window.scrollTo(0, 0);

    let fn = async () => {
      const response = await fetch('http://localhost:5000/getPerms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "key": apiKey })
      });
      if(response.ok) {
        const res= await response.json();
        setPerms(res);
      }

      const response2 = await fetch('http://localhost:5000/getDevProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "key": apiKey })
      });
      if(response2.ok) {
        const res2= await response2.json();
        setDevInfo(res2);
        devEmail = res2.email;
        console.log(res2.email);
        console.log(devEmail)
      }
    }
    fn();
  }, [apiKey]);
  useEffect(() => {console.log(devInfo)}, [devInfo])
  useEffect(() => {window.scrollTo(0, 0); console.log(perms)}, [perms])


  useEffect(() => {
      let fn = async () => {
        const response= await fetch('http://localhost:5000/userProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"email" : current.email}),
      });
      if (response.ok) {
  const res = await response.json();
  const finalRes = res.user;

  // safely slice without mutating state
  if (finalRes.personal?.dateOfBirth) {
    finalRes.personal.dateOfBirth = finalRes.personal.dateOfBirth.slice(0, 10); // use 10, not 11
  }
  if (finalRes.business?.dateOfFoundation) {
    finalRes.business.dateOfFoundation = finalRes.business.dateOfFoundation.slice(0, 10);
  }

  setFormData({
    basic: finalRes.basic,
    personal: finalRes.personal,
    business: finalRes.business
  });
}

      }
      fn();
    }, [])

console.log(new Date().toLocaleString().replace(/[ ,]/g, '') + apiKey + current.email);


    useEffect(() => {console.log(formData)}, [formData])
    useEffect(() => {console.log(backData)}, [backData])
  // const openPopup = () => {
  //   const width = 500;
  //   const height = 600;
  //   const left = (window.innerWidth - width) / 2;
  //   const top = (window.innerHeight - height) / 2;

  //   window.open(
  //     "http://localhost:5000/authWindow", // your backend route
  //     "TrustlensAuthPopup", // popup window name
  //     `width=${width},height=${height},top=${top},left=${left},resizable=no,toolbar=no,menubar=no,scrollbars=no,status=no`
  //   );
  // };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    console.log(formData)
  };

  useEffect(() => {
    let fn = async () => {
      const response1 = await fetch('http://localhost:5000/signedUp', {

      method : 'POST',
      headers : {'Content-type' : 'application/json'},
      body : JSON.stringify({ "userEmail" :  current.email, "devEmail" : devEmail})
    }
    )
    console.log(current.email + "   " + devEmail)
    console.log("hello")

    if(response1.ok) {
      const res1 = await response1.json();
      console.log(res1)
      if(res1.found) {
        setFound(true);
      }
      else {
        setFound(false);
      }
    }
  }
  fn();

  }, [devEmail, current])

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('basic', 'profilePhoto', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }; 

  function One() {
    return(
      <div style = {{ justifyContent : 'center', alignItems : 'center', display : 'flex', flexDirection : 'column'}}>
      {found ? ("Login as :") : "Sign up as : "}
      <button
        onClick={ async () => {if(!found) {
          setStep(2);
        }
        else {
           {
            if (window.opener) {
        let newBackData = {};
        console.log("hello wassup");

           const response1 = await fetch('https://ipapi.co/json/', {

      method : 'GET',
      headers : {'Content-type' : 'application/json'}
    }
    )
    console.log("hello")

    if(response1.ok) {
      const res1 = await response1.json();
      console.log(res1) ;
      newBackData = {id : new Date().toLocaleString().replace(/[ ,]/g, '') + apiKey + current.email, userEmail : current.email, devEmail : devInfo.email, name : devInfo.name, purpose : devInfo.description, icon : devInfo.image, privacyPolicyUrl : devInfo.privacyPolicy, permissions : Object.values(perms).flat().map(((p) => ({"name" : p, "status" : "Granted"}))), dataCategories : Object.keys(perms), successful : true, risk_level : "Low", browser : getBrowser(), operating_system : getOS(), device_type : getDeviceType(), country : res1.country_name, ip_address : res1.ip, location : {"city" : res1.city, "state" : res1.region, "country_code" : res1.country_code}}
      setBackData((bd) => ({...bd, id : new Date().toLocaleString().replace(/[ ,]/g, '') + apiKey + current.email, userEmail : current.email, devEmail : devInfo.email, name : devInfo.name, purpose : devInfo.description, icon : devInfo.image, privacyPolicyUrl : devInfo.privacyPolicy, permissions : Object.values(perms).flat().map(((p) => ({"name" : p, "status" : "Granted"}))), dataCategories : Object.keys(perms), successful : true, risk_level : "Low", browser : getBrowser(), operating_system : getOS(), device_type : getDeviceType(), country : res1.country_name, ip_address : res1.ip, location : {"city" : res1.city, "state" : res1.region, "country_code" : res1.country_code}}))
    }
    
    console.log(backData);

    const response2= await fetch('http://localhost:5000/middleware', {
      method : 'POST',
      headers : {'Content-type' : 'application/json'},
      body : JSON.stringify(newBackData)
    })

    if(response2.ok) {
      const res2= await response2.json();
      console.log(res2)
    }
    else {
      console.log("bsdk")
    }
      window.opener.postMessage(
        {
          type: "TRUSTLENS_AUTH_SUCCESS",
          data: formData
        },
        "*"
      );
    }
    window.opener.postMessage(
        {
          type: "TRUSTLENS_AUTH_SUCCESS",
          data: formData
        },
        "*"
      );
    window.close(); }
        }
      }}
        style={{
          marginTop : '10px',
          padding: "10px 15px",
          fontWeight: "400",
          width : 'fit-content',
          borderRadius: "15px",
          backgroundColor: "rgba(186, 167, 255, 0.5)",
        }}
      >
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-purple-600">
                {localStorage.getItem("pfp") ? ( <img src = {localStorage.getItem('pfp') || ""} style = {{borderRadius : '1000px', aspectRatio : '1'}} />) : <h2>{localStorage.getItem('name')?.charAt(0).toUpperCase()}</h2>}
               
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{localStorage.getItem('name')}</p>
              <p className="text-xs text-gray-500 truncate">{JSON.parse(localStorage.getItem('current') || '{}').email}</p>
            </div>
          </div>
      </button>
      </div>
    );
  }

  

    const click = useRef<HTMLInputElement>(null);
  function Two() {
     useEffect(() => {
    scrollRef.current?.scrollTo(0, 0); // scrolls the container
  }, []);
    return(<div  ref={scrollRef}>
      <div>
     <div className="max-w-lg mx-auto space-y-6 p-6">
      {Object.entries(perms).map(([section, fields]) => fields.length > 0 ? (
        <div key={section} className="bg-white shadow-md rounded-xl p-5 space-y-4 border">
          <div className="flex items-center gap-3 mb-2">
            <div>{icons[section]}</div>
            <div>
              <h2 className="text-lg font-semibold capitalize">{section} Information</h2>
              <p className="text-sm text-gray-500">
                {section === "basic"
                  ? "Essential account details"
                  : section === "personal"
                  ? "Additional personal details"
                  : "Professional and business details"}
              </p>
            </div>
          </div>

          {fields.length > 0 ? (
            fields.map((field) => (field != "profilePhoto") && field != "email" ? (
              <div key={field} className="space-y-1">
                <label className="text-sm font-medium text-gray-700">{labels[field] || field}</label>
                <input id = {field} key = {field} ref={inputRef} autoFocus={test === field} onFocus = {() => setTest(field)}
                  type="text" value={formData[section][field] || ""}
                  onChange={(e) => handleInputChange(section, field, e.target.value)}
                  placeholder={`Enter ${labels[field] || field}`}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : field == 'email' ? (<div key={field} className="space-y-1">
                <label className="text-sm font-medium text-gray-700">{labels[field] || field}</label>
                <input readOnly id = {field} key = {field} ref={inputRef} autoFocus={test === field} onFocus = {() => setTest(field)}
                  type="text" value={formData[section][field] || ""}
                  onChange={(e) => handleInputChange(section, field, e.target.value)}
                  placeholder={`Enter ${labels[field] || field}`}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>) : (<div className="text-center">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full bg-purple-100 border-4 border-purple-300 flex items-center justify-center overflow-hidden">
            {<div onClick = {() => {console.log("hello"); click.current?.click()}}  className="relative inline-block">
                      <div className="w-32 h-32 rounded-full bg-purple-100 border-4 border-purple-300 flex items-center justify-center overflow-hidden">
                        {formData.basic.profilePhoto !== null? (
                          <img src={formData.basic.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-12 h-12 text-purple-400" />
                        )}
                      </div>
                      {isEditing && (
                        <label onClick = {() => {console.log("hello"); click.current?.click()}} className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700">
                          <Camera style = {{zIndex:'100'}} onClick = {() => {console.log("hello"); click.current?.click()}} className="w-4 h-4" />
                          <input
                            type="file" ref = {click}
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>}
          </div>
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700">
              <Camera className="w-4 h-4" />
            </label>
          )}
        </div>
      </div>))
          ) : (
            <div className="border border-dashed rounded-md p-4 text-center text-gray-500 text-sm">
              <p className="font-medium">No business fields configured yet</p>
              <p>Business Information permissions will appear here</p>
            </div>
          )}
        </div>
      ) : null)}
    </div>

      </div>
      <div style = {{display : 'flex',gap : '40px', position : 'relative', justifyContent : 'space-between', marginBottom : '20px'}}>
        <button
        onClick={() => {setStep(1)}}
        style={{
          padding: "5px 10px",
          fontWeight: "400",
          borderRadius: "10px",
          border:"2px solid rgb(95, 80, 146)",
        }}
      >
        Go Back
      </button>
      <button
       onClick={async () => {
            if (window.opener) {
        let newBackData = {};
        console.log("hello wassup");

           const response1 = await fetch('https://ipapi.co/json/', {

      method : 'GET',
      headers : {'Content-type' : 'application/json'}
    }
    )
    console.log("hello")

    if(response1.ok) {
      const res1 = await response1.json();
      console.log(res1) ;
      newBackData = {id : new Date().toLocaleString().replace(/[ ,]/g, '') + apiKey + current.email, userEmail : current.email, devEmail : devInfo.email, name : devInfo.name, purpose : devInfo.description, icon : devInfo.image, privacyPolicyUrl : devInfo.privacyPolicy, permissions : Object.values(perms).flat().map(((p) => ({"name" : p, "status" : "Granted"}))), dataCategories : Object.keys(perms), successful : true, risk_level : "Low", browser : getBrowser(), operating_system : getOS(), device_type : getDeviceType(), country : res1.country_name, ip_address : res1.ip, location : {"city" : res1.city, "state" : res1.region, "country_code" : res1.country_code}}
      setBackData((bd) => ({...bd, id : new Date().toLocaleString().replace(/[ ,]/g, '') + apiKey + current.email, userEmail : current.email, devEmail : devInfo.email, name : devInfo.name, purpose : devInfo.description, icon : devInfo.image, privacyPolicyUrl : devInfo.privacyPolicy, permissions : Object.values(perms).flat().map(((p) => ({"name" : p, "status" : "Granted"}))), dataCategories : Object.keys(perms), successful : true, risk_level : "Low", browser : getBrowser(), operating_system : getOS(), device_type : getDeviceType(), country : res1.country_name, ip_address : res1.ip, location : {"city" : res1.city, "state" : res1.region, "country_code" : res1.country_code}}))
    }
    
    console.log(backData);

    const response2= await fetch('http://localhost:5000/middleware', {
      method : 'POST',
      headers : {'Content-type' : 'application/json'},
      body : JSON.stringify(newBackData)
    })

    if(response2.ok) {
      const res2= await response2.json();
      console.log(res2)
    }
    else {
      console.log("bsdk")
    }

    const filtered = {};

for (const category in perms) {
  console.log(perms[category])
    for (const field of perms[category]) {
      filtered[field] = formData[category][field];
      // console.log(filtered);

    }
  }
  



    
      window.opener.postMessage(
        {
          type: "TRUSTLENS_AUTH_SUCCESS",
          data: filtered
        },
        "*"
      );
    }
    // window.opener.postMessage(
    //     {
    //       type: "TRUSTLENS_AUTH_SUCCESS",
    //       data: formData
    //     },
    //     "*"
    //   );
    window.close(); 
  }
    // if (window.opener) {
    //    const response1 = await fetch('https://ipapi.co/json/', {

    //   method : 'GET',
    //   headers : {'Content-type' : 'application/json'}
    // }
    // )
    // console.log("hello")

    // if(response1.ok) {
    //   const res1 = await response1.json();
    //   console.log(res1) ;
    //   setBackData((bd) => ({...bd, id : new Date().toLocaleString().replace(/[ ,]/g, '') + apiKey + current.email, userEmail : current.email, devEmail : devInfo.email, name : devInfo.name, purpose : devInfo.description, icon : devInfo.image, privacyPolicyUrl : devInfo.privacyPolicy, permissions : Object.values(perms).flat().map(((p) => ({"name" : p, "status" : "Granted"}))), dataCategories : Object.keys(perms), successful : true, risk_level : "Low", browser : getBrowser(), operating_system : getOS(), device_type : getDeviceType(), country : res1.country_name, ip_address : res1.ip, location : {"city" : res1.city, "state" : res1.region, "country_code" : res1.country_code}}))
    // }
    // console.log(backData);

    // const response2= await fetch('http://localhost:5000/middleware', {
    //   method : 'POST',
    //   headers : {'Content-type' : 'application/json'},
    //   body : JSON.stringify(backData)
    // })

    // if(response2.ok) {
    //   const res2= await response2.json();
    //   console.log(res2)
    // }
    // else {
    //   console.log("bsdk")
    // }
    //   window.opener.postMessage(
    //     {
    //       type: "TRUSTLENS_AUTH_SUCCESS",
    //       data: formData
    //     },
    //     "*"
    //   );
    // }
    // window.close(); // close the popup

    // const response1 = await fetch('https://ipapi.co/json/', {

    //   method : 'GET',
    //   headers : {'Content-type' : 'application/json'}
    // }
    // )
    // console.log("hello")

    // if(response1.ok) {
    //   const res1 = await response1.json();
    //   console.log(res1) 
    // }
  }
        style={{
          padding: "5px 10px",
          fontWeight: "400",
          borderRadius: "7px",
          backgroundColor: "rgba(186, 167, 255, 0.5)",
        }}
      >
        Confirm Access
      </button>

      
      </div>
    </div>)
  }
  return (
    <div style = {{minWidth : '500px', minHeight : '600px', justifyContent : 'center', alignItems : 'center', display : 'flex', flexDirection : 'column'}}>
      {step == 1 ? <One /> : <Two />}
    </div>
  );
}
