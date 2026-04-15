'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export function VitalSignsForm({ patientId }: { patientId: number }) {
  const [isLoading, setIsLoading] = useState(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/vital-signs/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          bloodPressureSystolic: parseInt(formData.bloodPressureSystolic),
          bloodPressureDiastolic: parseInt(formData.bloodPressureDiastolic),
          heartRate: parseInt(formData.heartRate),
          temperature: parseFloat(formData.temperature),
          respiratoryRate: parseInt(formData.respiratoryRate),
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          notes: formData.notes,
        }),
      });

      if (!response.ok) throw new Error('Failed to record vital signs');

      alert('Vital signs recorded successfully!');
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Record Vital Signs</CardTitle>
        <CardDescription>Enter your current vital signs. Only submit when approved by your doctor.</CardDescription>
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
