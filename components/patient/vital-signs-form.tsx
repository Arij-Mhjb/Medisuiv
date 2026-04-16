'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export function VitalSignsForm({ patientId }: { patientId: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [assignedDoctorId, setAssignedDoctorId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    weight: '',
    height: '',
    notes: '',
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/patients/${patientId}`);
        if (res.ok) {
          const data = await res.json();
          setIsApproved(data.isApproved);
          if (data.assignedDoctorId) {
            setAssignedDoctorId(data.assignedDoctorId);
          }
        }
      } catch (error) {
        console.error('Failed to fetch patient status:', error);
      }
    };
    fetchStatus();
    // Poll every 3 seconds to keep it updated if the doctor approves it recently
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [patientId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignedDoctorId) {
      alert("Error: No assigned doctor found. Please ensure you are approved.");
      return;
    }
    
    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams({
        patientId: patientId.toString(),
        bloodPressureSystolic: formData.bloodPressureSystolic || '0',
        bloodPressureDiastolic: formData.bloodPressureDiastolic || '0',
        heartRate: formData.heartRate || '0',
        temperature: formData.temperature || '0',
        respiratoryRate: formData.respiratoryRate || '0',
        weight: formData.weight || '0',
        height: formData.height || '0',
        notes: formData.notes || '',
      });

      // 1. Save to patient-service
      const response = await fetch(`/api/vital-signs/record?${queryParams.toString()}`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to record vital signs');
      
      const vitalSignsData = await response.json();
      const vitalSignsId = vitalSignsData.id;

      // 2. Submit to doctor-service for review
      const reviewParams = new URLSearchParams({
        patientId: patientId.toString(),
        vitalSignsId: vitalSignsId.toString(),
        doctorId: assignedDoctorId.toString(),
        bloodPressureSystolic: formData.bloodPressureSystolic || '0',
        bloodPressureDiastolic: formData.bloodPressureDiastolic || '0',
        heartRate: formData.heartRate || '0',
        temperature: formData.temperature || '0',
        respiratoryRate: formData.respiratoryRate || '0',
        weight: formData.weight || '0',
        height: formData.height || '0',
        recordedAt: new Date().toISOString().slice(0, 19)
      });

      const doctorResponse = await fetch(`/api/vital-signs-review/create?${reviewParams.toString()}`, {
        method: 'POST',
      });

      if (!doctorResponse.ok) {
        const errorText = await doctorResponse.text();
        console.error('Failed to send vital signs to doctor:', errorText);
        alert(`Warning: Vital signs saved for you, but failed to reach doctor. Reason: ${errorText}`);
      } else {
        alert('Vital signs submitted successfully to your doctor!');
      }

      setFormData({
        bloodPressureSystolic: '',
        bloodPressureDiastolic: '',
        heartRate: '',
        temperature: '',
        respiratoryRate: '',
        weight: '',
        height: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error recording vital signs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isApproved === null) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Checking Status...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Please wait while we verify your approval status.</p>
        </CardContent>
      </Card>
    );
  }

  if (isApproved === false) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Doctor Approval Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            You cannot submit vital signs yet. Please wait until a doctor reviews your questionnaire and approves your request to begin treatment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Record Vital Signs</CardTitle>
        <CardDescription>Enter your current vital signs for your doctor to review.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cardiovascular Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Cardiovascular Measurements</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodPressureSystolic">Blood Pressure Systolic (mmHg)</Label>
                <Input
                  id="bloodPressureSystolic"
                  name="bloodPressureSystolic"
                  type="number"
                  value={formData.bloodPressureSystolic}
                  onChange={handleInputChange}
                  required
                  min="60"
                  max="250"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodPressureDiastolic">Blood Pressure Diastolic (mmHg)</Label>
                <Input
                  id="bloodPressureDiastolic"
                  name="bloodPressureDiastolic"
                  type="number"
                  value={formData.bloodPressureDiastolic}
                  onChange={handleInputChange}
                  required
                  min="40"
                  max="150"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
              <Input
                id="heartRate"
                name="heartRate"
                type="number"
                value={formData.heartRate}
                onChange={handleInputChange}
                required
                min="30"
                max="200"
              />
            </div>
          </div>

          {/* General Measurements Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">General Measurements</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  required
                  min="35"
                  max="42"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Respiratory Rate (breaths/min)</Label>
                <Input
                  id="respiratoryRate"
                  name="respiratoryRate"
                  type="number"
                  value={formData.respiratoryRate}
                  onChange={handleInputChange}
                  required
                  min="10"
                  max="60"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleInputChange}
                  required
                  min="20"
                  max="300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={handleInputChange}
                  required
                  min="100"
                  max="260"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any additional observations or concerns..."
              className="min-h-24"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Recording...' : 'Record Vital Signs'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
