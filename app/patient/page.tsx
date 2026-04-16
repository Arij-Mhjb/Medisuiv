'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PatientSignupQuestionnaire } from '@/components/patient/questionnaire-form';
import { VitalSignsForm } from '@/components/patient/vital-signs-form';
import { PatientVitalSignsHistory } from '@/components/patient/vital-signs-history';
import { PatientApprovalStatus } from '@/components/patient/approval-status';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PatientPage() {
  const [patientId, setPatientId] = useState<number | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('questionnaire');

  // Load from localStorage on mount
  useEffect(() => {
    const savedPatientId = localStorage.getItem('medisuiv_patient_id');
    if (savedPatientId) {
      setPatientId(parseInt(savedPatientId, 10));
    }
    const savedTab = localStorage.getItem('medisuiv_active_tab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handlePatientRegistered = (newPatientId: number) => {
    setPatientId(newPatientId);
    localStorage.setItem('medisuiv_patient_id', newPatientId.toString());
    setActiveTab('status'); // Auto switch to status after registration
  };

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    localStorage.setItem('medisuiv_active_tab', val);
  };

  const handleStatusUpdate = (approved: boolean) => {
    setIsApproved(approved);
    if (approved && activeTab === 'questionnaire') {
      handleTabChange('vital-signs');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Dashboard</h1>
          <p className="text-gray-600">
            Complete your health questionnaire, track your approval status, and share vital signs with your doctor.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className={`grid w-full mb-8 ${isApproved ? 'grid-cols-3' : 'grid-cols-4'}`}>
            {!isApproved && <TabsTrigger value="questionnaire">Questionnaire</TabsTrigger>}
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="vital-signs">Vital Signs</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>

          {/* Questionnaire Tab */}
          {!isApproved && (
            <TabsContent value="questionnaire" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <PatientSignupQuestionnaire onPatientRegistered={handlePatientRegistered} />
                </div>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Step 1: Registration</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600 space-y-2">
                      <p>✓ Fill your personal information</p>
                      <p>✓ Select your medical specialty</p>
                      <p>✓ Describe your symptoms</p>
                      <p>✓ Include medical history</p>
                      <p>✓ List current medications</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-sm">Next Step</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      After submission, a doctor will review your questionnaire. Check your status tab to track approval.
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          )}

          {/* Status Tab */}
          <TabsContent value="status" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                {patientId ? (
                  <PatientApprovalStatus patientId={patientId} onStatusUpdate={handleStatusUpdate} />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Questionnaire Submitted</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Please complete the questionnaire first to see your approval status.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What's Next?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600 space-y-3">
                    <div>
                      <p className="font-semibold text-gray-700">Pending</p>
                      <p>Your questionnaire is being reviewed by doctors.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Approved</p>
                      <p>You'll receive approval and can submit vital signs.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Vital Signs Tab */}
          <TabsContent value="vital-signs" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                {patientId ? (
                  <>
                    <VitalSignsForm patientId={patientId} />
                    <PatientVitalSignsHistory patientId={patientId} />
                  </>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Questionnaire Submitted</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Please complete the questionnaire first to submit vital signs.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Normal Ranges</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600 space-y-2">
                    <p><span className="font-semibold">BP:</span> 90-120 / 60-80</p>
                    <p><span className="font-semibold">Heart Rate:</span> 60-100 bpm</p>
                    <p><span className="font-semibold">Temp:</span> 36.5-37.5°C</p>
                    <p><span className="font-semibold">RR:</span> 12-20 br/min</p>
                  </CardContent>
                </Card>

                <Card className="bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-sm">💡 Tip</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Record your vital signs daily or as recommended by your doctor. This helps them monitor your health effectively.
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Help Tab */}
          <TabsContent value="help" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">How long does doctor review take?</h3>
                    <p className="text-gray-600">
                      Typically, doctors review questionnaires within 24-48 hours.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Can I change my specialty after submission?</h3>
                    <p className="text-gray-600">
                      Contact support to modify your information if needed.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">How often should I submit vital signs?</h3>
                    <p className="text-gray-600">
                      Follow your doctor's recommendations. Daily submissions are ideal for chronic conditions.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Is my data secure?</h3>
                    <p className="text-gray-600">
                      Yes, all data is encrypted and stored securely following HIPAA guidelines.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">What if I don't get approved?</h3>
                    <p className="text-gray-600">
                      You can request feedback from the doctor or try with a different specialty.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle>Need More Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Contact our support team at{' '}
                    <span className="font-semibold">support@medisuiv.com</span> or call +1-800-MEDISUIV
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
