'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Eye } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface VitalSignsReview {
  id: number;
  patientId: number;
  vitalSignsId: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  weight: number;
  height: number;
  recordedAt: string;
  isReviewed: boolean;
  doctorNotes: string;
}

export function DoctorVitalSignsReview({ doctorId }: { doctorId: number }) {
  const [vitalSigns, setVitalSigns] = useState<VitalSignsReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchUnreviewedVitalSigns = async () => {
      try {
        const response = await fetch(`/api/vital-signs-review/doctor/${doctorId}/unreviewed`);
        if (response.ok) {
          const data = await response.json();
          setVitalSigns(data);
        }
      } catch (error) {
        console.error('Error fetching vital signs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnreviewedVitalSigns();
  }, [doctorId]);

  const handleReview = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/vital-signs-review/${reviewId}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorNotes: notes }),
      });

      if (response.ok) {
        setVitalSigns(vitalSigns.filter((v) => v.id !== reviewId));
        setSelectedId(null);
        setNotes('');
        alert('Vital signs reviewed successfully');
      }
    } catch (error) {
      console.error('Error reviewing vital signs:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (vitalSigns.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Patient Vital Signs Review</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No vital signs to review at this time.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Vital Signs Review</h2>
        <p className="text-gray-600 text-sm">{vitalSigns.length} patient records need review</p>
      </div>

      {vitalSigns.map((vital) => (
        <Card key={vital.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Patient ID: {vital.patientId}</CardTitle>
                <CardDescription>
                  Recorded: {new Date(vital.recordedAt).toLocaleDateString()}
                </CardDescription>
              </div>
              {!vital.isReviewed && (
                <Badge variant="destructive">Needs Review</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold">BP</p>
                <p className="text-lg">{vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic} mmHg</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">Heart Rate</p>
                <p className="text-lg">{vital.heartRate} bpm</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">Temperature</p>
                <p className="text-lg">{vital.temperature}°C</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold">RR</p>
                <p className="text-lg">{vital.respiratoryRate} br/min</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">Weight</p>
                <p className="text-lg">{vital.weight} kg</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">Height</p>
                <p className="text-lg">{vital.height} cm</p>
              </div>
            </div>

            {selectedId === vital.id && (
              <div className="space-y-3 pt-2 border-t">
                <div>
                  <label className="text-sm font-semibold">Your Notes</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your clinical notes..."
                    className="mt-1 min-h-20"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleReview(vital.id)}
                    className="flex-1"
                  >
                    Complete Review
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedId(null);
                      setNotes('');
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {selectedId !== vital.id && (
              <Button
                onClick={() => setSelectedId(vital.id)}
                className="w-full"
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                Review & Add Notes
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
