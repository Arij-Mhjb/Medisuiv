'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, UserCheck } from 'lucide-react';

interface ApprovedPatient {
  id: number;
  patientId: number;
  patientFirstName: string;
  patientLastName: string;
  patientEmail: string;
  specialty: string;
  symptoms: string;
  medicalHistory: string;
  currentMedications: string;
  status: string;
  approvedAt: string;
}

export function DoctorApprovedPatients({ doctorId }: { doctorId: number }) {
  const [patients, setPatients] = useState<ApprovedPatient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedPatients = async () => {
      try {
        const response = await fetch(`/api/patient-approvals/doctor/${doctorId}/approved`);
        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        }
      } catch (error) {
        console.error('Error fetching approved patients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovedPatients();
  }, [doctorId]);

  if (isLoading) {
    return <div>Loading your patients...</div>;
  }

  if (patients.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>My Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>You haven't approved any patients yet. Check your pending requests.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-green-600" />
          My Approved Patients
        </h2>
        <p className="text-gray-600 text-sm">You are currently monitoring {patients.length} patient(s).</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {patients.map((patient) => (
          <Card key={patient.id} className="border-green-100 shadow-sm">
            <CardHeader className="bg-green-50/50 pb-4 border-b border-green-100">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{patient.patientFirstName} {patient.patientLastName}</CardTitle>
                  <CardDescription className="text-sm mt-1">{patient.patientEmail}</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800 border-none">Active Patient</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Approved On</p>
                <p className="text-sm">{patient.approvedAt ? new Date(patient.approvedAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Symptoms</p>
                <p className="text-sm text-gray-700">{patient.symptoms || 'None reported'}</p>
              </div>
              {patient.medicalHistory && (
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Medical History</p>
                  <p className="text-sm text-gray-700">{patient.medicalHistory}</p>
                </div>
              )}
              {patient.currentMedications && (
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Current Medications</p>
                  <p className="text-sm text-gray-700">{patient.currentMedications}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
