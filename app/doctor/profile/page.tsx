'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface DoctorProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  specialty: string;
  licenseNumber: string;
  isVerified: boolean;
}

export default function DoctorProfilePage() {
  const [doctorId] = useState<number>(1); // Get from session/auth
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<DoctorProfile | null>(null);

  const specialties = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Dermatology',
    'General Practice',
    'Pediatrics',
    'Psychiatry',
    'Surgery',
    'ENT',
    'Ophthalmology',
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/doctors/${doctorId}`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setFormData(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [doctorId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (value: string) => {
    if (formData) {
      setFormData({ ...formData, specialty: value });
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      const response = await fetch(`/api/doctors/${doctorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updated = await response.json();
        setProfile(updated);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Error updating profile');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating profile');
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (!profile) {
    return (
      <div className="p-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Profile not found. Please register first.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Doctor Profile</h1>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{profile.firstName} {profile.lastName}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
              </div>
              {profile.isVerified && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-semibold">Verified</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isEditing ? (
              <>
                {/* View Mode */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">First Name</Label>
                    <p className="text-lg font-medium">{profile.firstName}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">Last Name</Label>
                    <p className="text-lg font-medium">{profile.lastName}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600">Email</Label>
                  <p className="text-lg font-medium">{profile.email}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600">Phone</Label>
                  <p className="text-lg font-medium">{profile.phone}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">Specialty</Label>
                    <p className="text-lg font-medium px-3 py-2 bg-blue-100 text-blue-900 rounded-md inline-block">
                      {profile.specialty}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">License Number</Label>
                    <p className="text-lg font-medium">{profile.licenseNumber}</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Your specialty is <span className="font-semibold">{profile.specialty}</span>. 
                    You will see pending patients requesting this specialty.
                  </p>
                </div>

                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Edit Profile
                </Button>
              </>
            ) : (
              <>
                {/* Edit Mode */}
                {formData && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialty">Specialty</Label>
                        <Select value={formData.specialty} onValueChange={handleSelectChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {specialties.map((spec) => (
                              <SelectItem key={spec} value={spec}>
                                {spec}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">License Number</Label>
                        <Input
                          id="licenseNumber"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button onClick={handleSave} className="flex-1">
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData(profile);
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Your Specialty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Your specialty is set to <span className="font-semibold">{profile.specialty}</span>. 
              Only patients requesting this specialty will appear in your Pending Patients list. 
              You can update your specialty anytime by editing your profile.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
