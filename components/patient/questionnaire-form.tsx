'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PatientQuestionnaireProps {
  onPatientRegistered?: (patientId: number) => void;
}

export function PatientSignupQuestionnaire({ onPatientRegistered }: PatientQuestionnaireProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    specialty: '',
    symptoms: '',
    medicalHistory: '',
    currentMedications: '',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, specialty: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.email || !formData.firstName || !formData.lastName || !formData.specialty) {
        throw new Error('Please fill in all required fields');
      }

      console.log('Step 1: Registering patient...');
      // First: Register patient
      const registerResponse = await fetch('/api/patients/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }),
      });

      console.log('Register response:', registerResponse.status, registerResponse.statusText);
      
      if (!registerResponse.ok) {
        const errorText = await registerResponse.text();
        throw new Error(`Failed to register patient: ${errorText}`);
      }

      const patientData = await registerResponse.json();
      console.log('Patient registered:', patientData);
      const patientId = patientData.id;

      // Notify parent component of the newly registered patient
      if (onPatientRegistered) {
        onPatientRegistered(patientId);
      }

      console.log('Step 2: Completing questionnaire...');
      // Second: Complete questionnaire
      const questionnaireResponse = await fetch(
        `/api/patients/${patientId}/questionnaire`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            specialty: formData.specialty,
            symptoms: formData.symptoms || '',
            medicalHistory: formData.medicalHistory || '',
            currentMedications: formData.currentMedications || '',
          }),
        }
      );

      console.log('Questionnaire response:', questionnaireResponse.status, questionnaireResponse.statusText);
      
      if (!questionnaireResponse.ok) {
        const errorText = await questionnaireResponse.text();
        throw new Error(`Failed to complete questionnaire: ${errorText}`);
      }

      const questionnaireData = await questionnaireResponse.json();
      console.log('Questionnaire submitted:', questionnaireData);

      setIsSubmitted(true);
      alert('Questionnaire submitted successfully! Please wait for doctor approval.');
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to submit questionnaire. Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Health Questionnaire</CardTitle>
        <CardDescription>
          Please complete this questionnaire so we can match you with the right doctor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="text-center space-y-4">
            <div className="text-green-600 text-lg font-semibold">✓ Questionnaire Submitted</div>
            <p className="text-muted-foreground">
              Your questionnaire has been successfully submitted. A doctor will review your request shortly and you will be notified once approved.
            </p>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Personal Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Health Information Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Health Information</h3>

            <div className="space-y-2">
              <Label htmlFor="specialty">Medical Specialty Required</Label>
              <Select value={formData.specialty} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a specialty" />
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
              <Label htmlFor="symptoms">Current Symptoms</Label>
              <Textarea
                id="symptoms"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                placeholder="Describe your current symptoms..."
                className="min-h-24"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleInputChange}
                placeholder="List any previous medical conditions or surgeries..."
                className="min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentMedications">Current Medications</Label>
              <Textarea
                id="currentMedications"
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleInputChange}
                placeholder="List any medications you are currently taking..."
                className="min-h-24"
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Submitting...' : 'Submit Questionnaire'}
          </Button>
        </form>
        )}
      </CardContent>
    </Card>
  );
}
