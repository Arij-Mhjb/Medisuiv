'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface PatientRequest {
  id: number;
  patientId: number;
  patientEmail: string;
  patientFirstName: string;
  patientLastName: string;
  specialty: string;
  symptoms: string;
  medicalHistory: string;
  currentMedications: string;
  status: string;
  createdAt: string;
}

export function DoctorPendingPatients({ doctorId, specialty }: { doctorId: number; specialty?: string }) {
  const [patients, setPatients] = useState<PatientRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPendingPatients = async () => {
      try {
        // Use specialty endpoint if specialty is provided
        const url = specialty 
          ? `/api/patient-approvals/doctor/${doctorId}/specialty/${specialty}/pending`
          : `/api/patient-approvals/doctor/${doctorId}/pending`;
        
        console.log('Fetching pending patients from:', url);
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setPatients(data);
          console.log('Loaded pending patients:', data);
        } else {
          console.error('Failed to fetch patients:', response.status);
        }
      } catch (error) {
        console.error('Error fetching pending patients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingPatients();
    
    // Auto-refresh every 3 seconds to show new patients
    const interval = setInterval(fetchPendingPatients, 3000);
    
    return () => clearInterval(interval);
  }, [doctorId, specialty]);

  const handleApprove = async (approvalId: number) => {
    setProcessingId(approvalId);
    try {
      const response = await fetch(`/api/patient-approvals/${approvalId}/approve?notes=Approved%20by%20doctor`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setPatients(patients.filter((p) => p.id !== approvalId));
        alert('Patient approved successfully!');
      } else {
        const error = await response.text();
        alert(`Error approving patient: ${error}`);
      }
    } catch (error) {
      console.error('Error approving patient:', error);
      alert('Error approving patient');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (approvalId: number) => {
    setProcessingId(approvalId);
    try {
      const response = await fetch(`/api/patient-approvals/${approvalId}/reject?rejectReason=Rejected%20by%20doctor`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setPatients(patients.filter((p) => p.id !== approvalId));
        alert('Patient rejected');
      } else {
        const error = await response.text();
        alert(`Error rejecting patient: ${error}`);
      }
    } catch (error) {
      console.error('Error rejecting patient:', error);
      alert('Error rejecting patient');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (patients.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Pending Patient Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No pending patient requests at this time.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Pending Patient Requests</h2>
        <p className="text-gray-600 text-sm">Review and approve patients for your specialty</p>
      </div>

      {patients.map((patient) => (
        <Card key={patient.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{patient.patientFirstName} {patient.patientLastName}</CardTitle>
                <CardDescription>{patient.patientEmail}</CardDescription>
              </div>
              <div className="text-right">
                <Badge variant="outline">{patient.specialty}</Badge>
                <p className="text-xs text-gray-500 mt-2">
                  Submitted: {new Date(patient.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-600">Current Symptoms</h4>
                <p className="text-sm mt-1">{patient.symptoms}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-600">Medical History</h4>
                <p className="text-sm mt-1">{patient.medicalHistory || 'Not provided'}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-600">Current Medications</h4>
              <p className="text-sm mt-1">{patient.currentMedications || 'Not provided'}</p>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Button
                onClick={() => handleApprove(patient.id)}
                disabled={processingId === patient.id}
                className="flex-1"
                variant="default"
              >
                {processingId === patient.id ? 'Processing...' : 'Approve'}
              </Button>
              <Button
                onClick={() => handleReject(patient.id)}
                disabled={processingId === patient.id}
                className="flex-1"
                variant="outline"
              >
                {processingId === patient.id ? 'Processing...' : 'Reject'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
