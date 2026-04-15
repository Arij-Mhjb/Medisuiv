'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DoctorPendingPatients } from '@/components/doctor/pending-patients';
import { DoctorVitalSignsReview } from '@/components/doctor/vital-signs-review';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function DoctorPage() {
  const [doctorId, setDoctorId] = useState<number>(1); // Demo doctor ID
  const [doctorSpecialty, setDoctorSpecialty] = useState<string>(''); // Track doctor's specialty
  const [showRegistration, setShowRegistration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    specialty: '',
    licenseNumber: '',
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, specialty: value }));
  };

  const handleRegister = async () => {
    try {
      // Validate required fields
      if (!formData.email || !formData.firstName || !formData.lastName || !formData.specialty || !formData.licenseNumber) {
        alert('Please fill in all required fields');
        return;
      }

      setIsLoading(true);
      console.log('Registering doctor:', formData);

      const response = await fetch('/api/doctors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Doctor registered:', data);
        setDoctorId(data.id);
        setDoctorSpecialty(formData.specialty); // Save the specialty
        setShowRegistration(false);
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          specialty: '',
          licenseNumber: '',
        });
        alert('Doctor registered successfully!');
      } else {
        const error = await response.text();
        console.error('Registration error:', error);
        alert(`Error registering doctor: ${error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error registering doctor: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
            <p className="text-gray-600">
              Review patient requests, manage approvals, and monitor vital signs.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/doctor/profile">
              <Button variant="outline">My Profile</Button>
            </Link>
            <Button
              onClick={() => setShowRegistration(!showRegistration)}
              variant={showRegistration ? 'outline' : 'default'}
            >
              {showRegistration ? 'Cancel' : 'Register as Doctor'}
            </Button>
          </div>
        </div>

        {/* Registration Card */}
        {showRegistration && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Doctor Registration</CardTitle>
              <CardDescription>
                Create your doctor account to start reviewing patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Smith"
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
                    placeholder="doctor@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1-234-567-8900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Select value={formData.specialty} onValueChange={handleSelectChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
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
                      placeholder="LIC123456"
                    />
                  </div>
                </div>

                <Button onClick={handleRegister} disabled={isLoading} className="w-full">
                  {isLoading ? 'Registering...' : 'Register'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="pending">Pending Patients</TabsTrigger>
            <TabsTrigger value="vital-signs">Vital Signs Review</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>

          {/* Pending Patients Tab */}
          <TabsContent value="pending" className="space-y-4">
            <DoctorPendingPatients doctorId={doctorId} specialty={doctorSpecialty || undefined} />
          </TabsContent>

          {/* Vital Signs Review Tab */}
          <TabsContent value="vital-signs" className="space-y-4">
            <DoctorVitalSignsReview doctorId={doctorId} />
          </TabsContent>

          {/* Help Tab */}
          <TabsContent value="help" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Doctor Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">📋 Reviewing Patient Requests</h3>
                    <p className="text-gray-600">
                      Review patient questionnaires carefully. Check their symptoms, medical history, and specialty match.
                      Only approve patients whose conditions match your specialty.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">❤️ Vital Signs Monitoring</h3>
                    <p className="text-gray-600">
                      Regularly monitor your approved patients' vital signs. Look for any abnormalities and add clinical
                      notes to help guide patient care.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">✉️ Patient Communication</h3>
                    <p className="text-gray-600">
                      Always provide feedback when rejecting a patient. This helps them understand and potentially seek
                      more appropriate care.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">⚠️ Critical Values</h3>
                    <p className="text-gray-600 mb-2">Contact patients immediately if vital signs show:</p>
                    <ul className="text-gray-600 space-y-1 ml-4">
                      <li>• BP: &gt;180/110 or &lt;90/60</li>
                      <li>• Heart Rate: &lt;50 or &gt;120 bpm</li>
                      <li>• Temperature: &gt;39°C or &lt;36°C</li>
                      <li>• Respiratory Rate: &lt;10 or &gt;30</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">💾 Data Privacy</h3>
                    <p className="text-gray-600">
                      All patient data is confidential. Never share patient information outside the platform or discuss
                      with other patients.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">0</p>
                      <p className="text-sm text-gray-600">Pending Approval</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">0</p>
                      <p className="text-sm text-gray-600">Approved Patients</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">0</p>
                      <p className="text-sm text-gray-600">Unreviewed Vitals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Support?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Contact our support team at{' '}
                    <span className="font-semibold">doctor-support@medisuiv.com</span> or call +1-800-MEDISUIV
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
