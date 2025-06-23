import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Shield, User, Activity, Bell, Lock, Clock, Key, Smartphone, AlertTriangle, Check } from 'lucide-react';

export default function Security() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [bs, setBs] = useState<string []>(["www.youtube.com", "www.tiktok.com"]);
  const [filter, setFilter] = useState("All")
  const [viewBS, setViewBS]  = useState(false);
  let [bsInput, setBSInput] = useState("");
  let [ttViz, setTTViz] = useState(false);
  let [ttViz2, setTTViz2] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);


  function isSafe(website: string): boolean {
    console.log(website    + "     " + bs[0])
    console.log(website.includes(bs[0]))
  return !bs.some(site => website.includes(site));
}



  let [logs, setLogs] = useState([]);
  const current = JSON.parse(localStorage.getItem('current') || '{}')
  const fetchLogs = async () => {
    const result = await fetch('http://localhost:5000/getLogs', {
      method : 'POST',
      headers : {'Content-type' : 'application/json'},
      body : JSON.stringify({ email : current.email})
    })
    if(result.ok) {
      let res = await result.json();
      setLogs(res);
    }
    setTimeout(() => {
 fetchLogs();
}, 5000); // time in milliseconds (2000ms = 2 seconds)

  }

  useEffect(() => {
    fetchLogs();
    
  }, [])
  useEffect(() => {console.log(bs)}, [bs])
  const sidebarItems = [
    { icon: Activity, label: 'Dashboard', path: '/user/dashboard' },
    { icon: User, label: 'Profile', path: '/user/profile' },
    { icon: Shield, label: 'Connected Apps', path: '/user/connected-apps' },
    { icon: Clock, label: 'Activity Logs', path: '/user/activity-logs' },
    { icon: Lock, label: 'Security', path: '/user/security' }
  ];

  const securityItems = [
    {
      title: 'Password',
      description: 'Last changed 3 months ago',
      status: 'warning',
      action: 'Change Password'
    },
    {
      title: 'Two-Factor Authentication',
      description: twoFactorEnabled ? 'Enabled via SMS' : 'Not enabled',
      status: twoFactorEnabled ? 'success' : 'danger',
      action: twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'
    },
    {
      title: 'Login Notifications',
      description: 'Get notified of new sign-ins',
      status: 'success',
      action: 'Configure'
    }
  ];

  const recentSessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'San Francisco, CA',
      ip: '192.168.1.100',
      lastActive: '30 minutes ago',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'San Francisco, CA',
      ip: '10.0.0.50',
      lastActive: '2 days ago',
      current: false
    }
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
  <div className="space-y-8">
    
    {/* Header */}
    <div style={{ display: 'flex', flexDirection: 'row', width: '70vw', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Security</h1>
        <p className="text-gray-600 mt-2">Check if any website is fetching from shady sites.</p>
      </div>
      <div style={{ display: 'flex', gap: '25px' }}>
        <button onClick={() => setFilter("All")} style={{ backgroundColor: filter == 'All' ? 'rgba(101, 102, 193, 0.22)' : 'transparent', padding: '10px 10px', borderRadius: '5px', border: filter == 'All' ? '1px solid black' : '1px solid rgba(0, 0, 0 , 0.5)' }}>All</button>
        <button onClick={() => setFilter("Blacklisted API Calls")} style={{ backgroundColor: filter == 'Blacklisted API Calls' ? 'rgba(101, 102, 193, 0.22)' : 'transparent', border: filter == 'Blacklisted API Calls' ? '1px solid black' : '1px solid rgba(0, 0, 0 , 0.5)', padding: '10px 10px', borderRadius: '5px' }}>Blacklisted API Calls</button>
      </div>
    </div>

    {/* ➕ Add blacklist input */}
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <input
        value={bsInput}
        onChange={(e) => setBSInput(e.target.value)}
        style={{ borderRadius: '5px', height: '35px', width: '250px', paddingLeft: '10px', border: '1px solid black' }}
        placeholder="Enter site to be blacklisted"
      />
      <button onClick={() => {if(bsInput.length >= 5) {setBs((bs) => [...bs, bsInput]); setBSInput("")}
      else {
        alert('Invalid URL');
      }
    }} style={{ backgroundColor: '#8E22CE', color: 'white', padding: '10px 10px', borderRadius: '5px', marginRight : '420px' }}>Add a site to be blacklisted</button>
      <button onClick={() => setViewBS(!viewBS)} style={{ backgroundColor: '#8E22CE', color: 'white', padding: '10px 10px', borderRadius: '5px' }}>
        {viewBS ? "Hide Blacklisted Sites" : "View Blacklisted Sites"}
      </button>
    </div>

    {/* 🧾 Show blacklist */}
    {viewBS && (
      <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid rgb(63, 63, 157)', padding: '10px', backgroundColor: 'rgb(254, 254, 255)', color: 'rgb(28, 28, 109)' }}>
        {bs.map((bsItem, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'row', gap: '50px', padding: '5px 10px' }}>
            <h3>{i + 1}</h3><h3>{bsItem}</h3>
          </div>
        ))}
      </div>
    )}

    {/* 📄 Logs */}
    
    {filter == 'All' ? (
      <div>
      {logs.map((l, i) => (
        <div key={i} style={{ position: 'relative', marginTop: '10px' }} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: '50px' }}>
          <h2 style = {{border : '1px solid black', padding : '5px 12px', borderRadius  : '50px'}}>{i+1}</h2>

            {isSafe(l.url) ? (
              <Check style={{ backgroundColor: '#DCFCE7', padding: '10px', borderRadius: '35px' }} className="h-10 w-10 text-green-600" />
            ) : (
              <AlertTriangle style={{ backgroundColor: '#FEE2E2', padding: '10px', borderRadius: '35px' }} className="h-10 w-10 text-red-600" />
            )}

            <div>
              <h3 className="font-medium text-gray-900">{l.fetcher}</h3>
              <p
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="text-sm text-gray-600"
              >
                {l.url.length > 50 ? l.url.substring(0, 50) + '...' : l.url}
              </p>
            </div>
          </div>

          {/* Tooltip */}
          {hoveredIndex === i && l.url.length > 50 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: 'white',
                maxWidth: '800px',
                width: 'max-content',
                padding: '8px',
                borderRadius: '4px',
                boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                zIndex: 100,
                whiteSpace: 'normal',
                wordWrap: 'break-word',
              }}
            >
              {l.url}
            </div>
          )}
        </div>
      ))}
    </div>
    ) : (
      <div>
      {logs.map((l, i) => (isSafe(l.url) ? (null) : (
        <div key={i} style={{ position: 'relative', marginTop: '10px' }} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: '50px' }}>
             <h2 style = {{border : '1px solid black', padding : '5px 12px', borderRadius  : '50px'}}>{i+1}</h2>
           <AlertTriangle style={{ backgroundColor: '#FEE2E2', padding: '10px', borderRadius: '35px' }} className="h-10 w-10 text-red-600" />

            <div>
              <h3 className="font-medium text-gray-900">{l.fetcher}</h3>
              <p
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="text-sm text-gray-600"
              >
                {l.url.length > 50 ? l.url.substring(0, 50) + '...' : l.url}
              </p>
            </div>
          </div>

          {/* Tooltip */}
          {hoveredIndex === i && l.url.length > 50 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: 'white',
                maxWidth: '800px',
                width: 'max-content',
                padding: '8px',
                borderRadius: '4px',
                boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                zIndex: 100,
                whiteSpace: 'normal',
                wordWrap: 'break-word',
              }}
            >
              {l.url}
            </div>
          )}
        </div>)
      ))}
    </div>
    )}

  </div>
</DashboardLayout>

  );
}