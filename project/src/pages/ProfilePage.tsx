import React from 'react';
import { User, Mail, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <User size={40} />
                  )}
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                <div className="flex items-center justify-center mt-1 text-gray-500">
                  <Mail size={14} className="mr-1" />
                  <span>{user.email}</span>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="mt-1 text-gray-900">{user.name}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="mt-1 text-gray-900">{user.email}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="mt-1 text-gray-900">{user.id}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Joined Date</p>
                  <div className="flex items-center mt-1">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    <p className="text-gray-900">January 15, 2023</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-6">
                <h3 className="text-base font-medium text-gray-900 mb-3">Preferences</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="email-notifications"
                      name="email-notifications"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900">
                      Email notifications
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="marketing-emails"
                      name="marketing-emails"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="marketing-emails" className="ml-2 block text-sm text-gray-900">
                      Marketing emails
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="activity-digest"
                      name="activity-digest"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="activity-digest" className="ml-2 block text-sm text-gray-900">
                      Weekly activity digest
                    </label>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button size="sm">Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;