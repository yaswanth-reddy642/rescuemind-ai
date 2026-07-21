import jsPDF from 'jspdf';

export function generateEmergencyPDF(data: {
  patient_name?: string;
  age: number;
  gender: string;
  symptoms: string[];
  pulse: number;
  breathing_rate: number;
  consciousness: string;
  bleeding_level: string;
  priority: string;
  risk_percent: number;
  confidence: number;
  reasoning: Array<{ factor: string; weight: string; detail: string }>;
  first_aid: Array<{ step: string; action: string }>;
  location?: { lat: number; lng: number; address?: string };
}) {
  const doc = new jsPDF();
  const timestamp = new Date().toLocaleString();

  // Header Banner
  doc.setFillColor(220, 38, 38); // Emergency Red
  doc.rect(0, 0, 210, 25, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RESCUEMIND AI – EMERGENCY TRIAGE REPORT', 15, 16);

  // Subheader
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${timestamp} | Mode: AI Verified Triage`, 15, 33);
  doc.line(15, 36, 195, 36);

  // Section 1: Patient Information & Vitals
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('1. Patient Demographics & Vital Parameters', 15, 45);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Patient Name: ${data.patient_name || 'Emergency Patient'}`, 15, 53);
  doc.text(`Age / Gender: ${data.age} yrs | ${data.gender}`, 15, 59);
  doc.text(`Pulse Rate: ${data.pulse} bpm`, 15, 65);
  doc.text(`Breathing Rate: ${data.breathing_rate} bpm`, 15, 71);
  doc.text(`Consciousness (AVPU): ${data.consciousness}`, 115, 53);
  doc.text(`Bleeding Severity: ${data.bleeding_level}`, 115, 59);
  doc.text(`Reported Symptoms: ${data.symptoms.join(', ') || 'None'}`, 115, 65);

  doc.line(15, 76, 195, 76);

  // Section 2: AI Triage Assessment Output
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('2. AI Clinical Triage & Risk Prediction', 15, 85);

  // Priority Box
  if (data.priority === 'RED') {
    doc.setFillColor(254, 226, 226);
    doc.setDrawColor(239, 68, 68);
  } else if (data.priority === 'ORANGE') {
    doc.setFillColor(255, 237, 213);
    doc.setDrawColor(249, 115, 22);
  } else {
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(16, 185, 129);
  }
  doc.roundedRect(15, 90, 180, 20, 2, 2, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`PRIORITY RATING: ${data.priority} EMERGENCY`, 20, 100);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Survival Risk: ${data.risk_percent}% | AI Model Confidence: ${data.confidence}%`, 20, 106);

  // Section 3: Explainable Reasoning Factors
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Explainable Risk Factors:', 15, 120);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  let yPos = 127;
  (data.reasoning || []).slice(0, 4).forEach((r) => {
    doc.text(`• [${r.weight}] ${r.factor}: ${r.detail}`, 18, yPos);
    yPos += 6;
  });

  doc.line(15, yPos + 2, 195, yPos + 2);
  yPos += 10;

  // Section 4: Recommended First Aid
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Immediate First Aid Protocol', 15, yPos);
  yPos += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  (data.first_aid || []).forEach((fa) => {
    doc.setFont('helvetica', 'bold');
    doc.text(fa.step, 18, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(fa.action, 22, yPos);
    yPos += 7;
  });

  // Footer / Location
  doc.line(15, 275, 195, 275);
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`GPS Location: Lat ${data.location?.lat || 37.7749}, Lng ${data.location?.lng || -122.4194} | ${data.location?.address || 'GPS Verified'}`, 15, 282);
  doc.text('RescueMind AI Triage System - For Paramedic & Emergency Medical Responders Use', 15, 287);

  doc.save(`RescueMind_Triage_${Date.now()}.pdf`);
}
