'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ProfilePage() {
  const [profile, setProfile] = useState({ email: '', name: '' });
  const [originalProfile, setOriginalProfile] = useState({ email: '', name: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    async function getUser() {
      const supabase = createClientComponentClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const userProfile = { 
          email: user.email ?? '', 
          name: (user.user_metadata as any)?.name ?? '' 
        };
        setProfile(userProfile);
        setOriginalProfile(userProfile);
      }
    }
    getUser();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      const supabase = createClientComponentClient();
      
      // Update user metadata with the new name
      const { error } = await supabase.auth.updateUser({
        data: { name: profile.name }
      });

      if (error) {
        setSaveMessage('Error saving profile: ' + error.message);
      } else {
        setSaveMessage('Profile saved successfully!');
        setOriginalProfile(profile);
        setIsEditing(false);
      }
    } catch (error) {
      setSaveMessage('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setProfile(originalProfile);
    setIsEditing(false);
    setSaveMessage('');
  }

  const hasChanges = profile.name !== originalProfile.name;
  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="text-foreground">
      <h2 className="text-xl font-semibold mb-6">My Profile</h2>
      <div className="max-w-md">
        {/* Avatar Section */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-semibold">
            {getInitials(profile.name)}
          </div>
          <div>
            <h3 className="text-lg font-medium">{profile.name || 'User'}</h3>
            <p className="text-muted-foreground text-sm">{profile.email}</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted mb-2">Name</label>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full border border-theme rounded px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-2">Email</label>
            <input 
              name="email" 
              value={profile.email} 
              readOnly 
              className="w-full border border-theme rounded px-3 py-2 bg-muted text-muted-foreground cursor-not-allowed" 
            />
          </div>
          
          {/* Save Message */}
          {saveMessage && (
            <div className={`p-3 rounded text-sm ${
              saveMessage.includes('Error') 
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}>
              {saveMessage}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            {hasChanges ? (
              <>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground px-4 py-2 rounded font-medium transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 border border-theme rounded text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded font-medium transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


