'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface PatientData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isApproved: boolean;
  approvedAt: string;
  assignedDoctorId: number;
}

export function PatientApprovalStatus({ 
  patientId,
  onStatusUpdate
}: { 
  patientId: number;
  onStatusUpdate?: (isApproved: boolean) => void;
}) {
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        console.log('Fetching patient data for ID:', patientId);
        const response = await fetch(`/api/patients/${patientId}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Patient data fetched:', data);
          setPatient(data);
          if (onStatusUpdate) {
            onStatusUpdate(data.isApproved);
          }
        } else {
          console.error('Failed to fetch patient:', response.status);
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();
    
    // Poll for updates every 3 seconds to check if doctor has approved
    const interval = setInterval(fetchPatient, 3000);
    
    return () => clearInterval(interval);
  }, [patientId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Approval Status</CardTitle>
        <CardDescription>
          Your current approval status with the healthcare provider
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <p className="text-lg font-semibold">{patient.firstName} {patient.lastName}</p>
          </div>
          {patient.isApproved ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <Badge className="bg-green-100 text-green-800">Approved</Badge>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <Badge className="bg-amber-100 text-amber-800">Pending Review</Badge>
            </div>
          )}
        </div>

        {patient.isApproved && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">You are approved!</p>
                <p className="text-sm text-green-800 mt-1">
                  Approved on {new Date(patient.approvedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-green-800 mt-2">
                  You can now submit your vital signs for your doctor to review.
                </p>
              </div>
            </div>
          </div>
        )}

        {!patient.isApproved && (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex gap-2">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">Under Review</p>
                <p className="text-sm text-amber-800 mt-1">
                  Your questionnaire has been submitted and is awaiting doctor review.
                </p>
                <p className="text-sm text-amber-800 mt-2">
                  You will be notified once a doctor approves your request to begin treatment.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <p className="text-sm text-gray-600">Email: {patient.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}
