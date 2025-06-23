import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Shield, User, Activity, Bell, Lock, Clock, ExternalLink, X, Eye, FileText, Database } from 'lucide-react';

interface ConnectedApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  connectedSince: string;
  accessFrequency: string;
  privacyPolicyUrl: string;
  dataCategories: string[];
  permissions: {
    name: string;
    status: 'Granted' | 'Denied';
  }[];
}
function toLabel(field: string): string {
  switch(field) {
    case "profilePhoto": return "Profile Photo";
    case "email": return "Email";
    case "name": return "Name";
    case "phoneNumber": return "Phone Number";
    case "physicalAddress": return "Physical Address";
    case "mailingAddress": return "Mailing Address";
    case "dateOfBirth": return "Date of Birth";
    case "gender": return "Gender";
    case "businessName": return "Business Name";
    case "businessEmail": return "Business Email";
    case "businessPhoneNumber": return "Business Phone Number";
    case "numberOfEmployees": return "Number Of Employees";
    case "dateOfFoundation": return "Date of Foundation";
  
  }
  return "";
}

const ConnectedApps: React.FC = () => {
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const current = JSON.parse(localStorage.getItem('current') || '{}')
  const sidebarItems = [
    { icon: Activity, label: 'Dashboard', path: '/user/dashboard' },
    { icon: User, label: 'Profile', path: '/user/profile' },
    { icon: Shield, label: 'Connected Apps', path: '/user/connected-apps' },
    { icon: Clock, label: 'Activity Logs', path: '/user/activity-logs' },
    { icon: Lock, label: 'Security', path: '/user/security' }
  ];

  useEffect(() => {
    fetchConnectedApps();
  }, []);

  const fetchConnectedApps = async () => {
    try {
      // Mock data based on your image - replace with actual API call
      const mockData: ConnectedApp[] = [
        {
          id: 'atlassian@att.com',
          name: 'Atlassian',
          description: 'Atlassian tools for team collaboration and project management',
          icon: '/api/placeholder/40/40', // Replace with actual Atlassian logo
          connectedSince: '5/16/2025',
          accessFrequency: 'High',
          privacyPolicyUrl: 'https://atlassian.com/privacy',
          dataCategories: ['Basic Information', 'Personal Information'],
          permissions: [
            { name: 'Name', status: 'Granted' },
            { name: 'Email', status: 'Granted' },
            { name: 'Phone Number', status: 'Granted' }
          ]
        }
      ];

      setConnectedApps(mockData);
      setIsLoading(false);

      let response = await fetch('http://localhost:5000/getConApp', {
        method : 'POST',
        headers : {'Content-type' : 'application/json'},
        body : JSON.stringify({ "email" : current.email})
      })
      if(response.ok) {
        let res = await response.json();
        setData(res);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching connected apps:', error);
      setIsLoading(false);
    }
  };

  const handleRevokeAccess = async (appId: string) => {
    if (window.confirm('Are you sure you want to revoke access for this application? This action cannot be undone.')) {
      try {
        // Add your revoke API call here
        console.log(`Revoking access for app: ${appId}`);
        
        // Remove from state
        setConnectedApps(prev => prev.filter(app => app.id !== appId));
        
        alert('Access revoked successfully');
      } catch (error) {
        console.error('Error revoking access:', error);
        alert('Failed to revoke access. Please try again.');
      }
    }
  };

  const handleVisitApp = (url: string) => {
    window.open(url, '_blank');
  };

  const getDataCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'user profile':
        return <User className="h-4 w-4" />;
      case 'documents':
        return <FileText className="h-4 w-4" />;
      case 'project data':
        return <Database className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getPermissionColor = (status: string) => {
    return status === 'Granted' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100';
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="ml-4 text-gray-600">Loading connected applications...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Connected Applications</h1>
          <p className="text-gray-600 mt-2">Manage third-party applications that have access to your data</p>
        </div>

        {/* Connected Apps List */}
        <div className="space-y-6">
          {data.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Connected Applications</h3>
              <p className="text-gray-600">You haven't connected any third-party applications yet.</p>
            </div>
          ) : (
            data.map((app) => (
              <div key={app.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* App Header */}
                <div className="bg-blue-50 p-6 rounded-t-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        {app.icon ? (<img src = {app.icon}/>) : <span className="text-white font-bold text-lg">A</span>}
                        
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{app.name}</h2>
                        <p className="text-gray-600 mt-1">{app.purpose}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleVisitApp(app.privacyPolicyUrl)}
                        className="flex items-center space-x-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Visit</span>
                      </button>
                      <button
                        onClick={() => handleRevokeAccess(app.id)}
                        className="flex items-center space-x-1 px-3 py-2 text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Revoke Access</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* App Details */}
                <div className="p-6">
                  {/* Connection Info */}
                  <div className="mb-6">
                
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {app.dataCategories.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {category}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm text-gray-600">
                      Connected since <span className="font-medium">{app.timestamp}</span>
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Last Access */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Last Access</h3>
                      <p className="text-sm text-gray-500">
                        Access Frequency: <span className={`font-medium ${getFrequencyColor(app.accessFrequency)}`}>
                          {app.accessFrequency}
                        </span>
                      </p>
                    </div>

                    {/* Access Expires */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Access Expires</h3>
                      <button
                        onClick={() => handleVisitApp(app.privacyPolicyUrl)}
                        className="text-sm text-purple-600 hover:text-purple-800 underline"
                      >
                        View Privacy Policy
                      </button>
                    </div>

                    {/* Data Categories */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Data Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {app.dataCategories.map((category) => (
                          <span
                            key={category}
                            className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                          >
                            {getDataCategoryIcon(category)}
                            <span>{category}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Permissions</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {app.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <span className="text-sm text-gray-700">{toLabel(permission.name)}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPermissionColor(permission.status)}`}>
                            {permission.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">About Connected Applications</h4>
              <p className="text-sm text-blue-700 mt-1">
                These are third-party applications that you've given permission to access your data. 
                You can revoke access at any time, but this may affect the functionality of those applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConnectedApps;


// import React from 'react';
// import DashboardLayout from '../../components/DashboardLayout';
// import { Shield, User, Activity, Bell, Lock, Clock, ExternalLink, Trash2, Settings } from 'lucide-react';

// export default function ConnectedApps() {
//   const sidebarItems = [
//     { icon: Activity, label: 'Dashboard', path: '/user/dashboard' },
//     { icon: User, label: 'Profile', path: '/user/profile' },
//     { icon: Shield, label: 'Connected Apps', path: '/user/connected-apps' },
//     { icon: Clock, label: 'Activity Logs', path: '/user/activity-logs' },
//     { icon: Lock, label: 'Security', path: '/user/security' },
//     { icon: Bell, label: 'Notifications', path: '/user/notifications' },
//   ];

//   const connectedApps = [
//     {
//       id: 1,
//       name: 'PhotoShare Pro',
//       description: 'Photo sharing and editing application',
//       permissions: ['Read profile', 'Access photos', 'Post on behalf'],
//       lastAccess: '2 hours ago',
//       status: 'active'
//     },
//     {
//       id: 2,
//       name: 'TaskManager',
//       description: 'Productivity and task management tool',
//       permissions: ['Read profile', 'Access calendar'],
//       lastAccess: '1 day ago',
//       status: 'active'
//     }
//   ];

//   return (
//     <DashboardLayout sidebarItems={sidebarItems}>
//       <div className="space-y-8">
//         {/* Header */}
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Connected Apps</h1>
//           <p className="text-gray-600 mt-2">Manage applications that have access to your account</p>
//         </div>

//         {/* Connected Apps List */}
//         <div className="space-y-6">
//           {connectedApps.length > 0 ? (
//             connectedApps.map((app) => (
//               <div key={app.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-start space-x-4">
//                     <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                       <Shield className="h-6 w-6 text-purple-600" />
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
//                       <p className="text-gray-600 mb-3">{app.description}</p>
                      
//                       <div className="mb-3">
//                         <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions:</h4>
//                         <div className="flex flex-wrap gap-2">
//                           {app.permissions.map((permission, index) => (
//                             <span
//                               key={index}
//                               className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
//                             >
//                               {permission}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
                      
//                       <p className="text-sm text-gray-500">Last accessed: {app.lastAccess}</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center space-x-2">
//                     <span className={`px-2 py-1 text-xs rounded-full ${
//                       app.status === 'active' 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-gray-100 text-gray-800'
//                     }`}>
//                       {app.status}
//                     </span>
//                     <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
//                       <Settings className="h-4 w-4" />
//                     </button>
//                     <button className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50">
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
//               <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No connected apps</h3>
//               <p className="text-gray-500 mb-6">You haven't connected any third-party applications yet.</p>
//               <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
//                 Browse Available Apps
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }


