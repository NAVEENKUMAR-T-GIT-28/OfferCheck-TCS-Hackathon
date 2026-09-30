import { SampleOffer } from '../types';

export const SAMPLE_OFFERS: SampleOffer[] = [
  {
    id: 'sample-safe',
    title: 'Legitimate Internship Offer (Safe Pattern)',
    type: 'SAFE',
    badgeLabel: 'Safe Benchmark',
    companyName: 'Infosys Limited',
    recruiterEmail: 'campus.hiring@infosys.com',
    recruiterPhone: '+91 80 2852 0261',
    recruiterUrl: 'https://careers.infosys.com/internships',
    offerText: `Dear Candidate,

Congratulations! Based on your performance in the InfyTQ certification assessment and subsequent technical interview rounds, we are pleased to offer you the position of Systems Engineer Intern at Infosys Limited.

Key Offer Details:
- Role: Systems Engineer Intern (Development & Cloud Practice)
- Duration: 6 Months (Full-time hybrid)
- Monthly Stipend: ₹25,000 per month
- Work Location: Infosys Electronic City Campus, Bengaluru / Virtual during Phase 1
- Joining Date: January 15, 2027

Next Steps:
1. Please log in to our official career portal at https://careers.infosys.com/candidate-login using your registered candidate ID.
2. Complete your electronic onboarding documentation (educational transcripts, Aadhaar/Passport proof, degree provisional certificate).
3. Infosys never asks for any registration fee, security deposit, laptop bond, or processing charges at any stage of the recruitment process.

Please verify this offer letter on our official portal within 7 business days.

Warm regards,
Campus Recruitment Team
Infosys Limited | www.infosys.com`,
    jdText: `Role: Systems Engineer Intern
Requirements:
- B.E / B.Tech / M.Tech in CS, IT, ECE with minimum 65% aggregate
- Proficiency in Java, Python, or C++ and basic Data Structures
- Evaluation includes online coding assessment and 1 technical discussion
- Zero fee or deposit policy strictly maintained`,
    description: 'Authentic enterprise offer sent from verified corporate email domain (@infosys.com) with official portal onboarding, no money requested, and a clear anti-scam disclaimer.'
  },
  {
    id: 'sample-suspicious',
    title: 'Suspicious Offer (High Urgency & Generic Email)',
    type: 'SUSPICIOUS',
    badgeLabel: 'Suspicious Signals',
    companyName: 'TechNova Global Solutions',
    recruiterEmail: 'technova.talent.acquisition@gmail.com',
    recruiterPhone: '+91 99887 66554',
    recruiterUrl: 'https://bit.ly/technova-hire-2026',
    offerText: `URGENT: DIRECT INTERNSHIP SELECTION - IMMEDIATE JOINING

Dear Student,
We reviewed your profile on LinkedIn / Naukri and selected you directly for our Remote Web Development & AI Intern position at TechNova Global Solutions!

⭐ Highlights:
- No technical interview or screening test required!
- High Stipend: ₹65,000 per month for just 10 hours of work per week
- 100% Work from Home with flexible timings
- Certificate signed by US Director

⚠️ CRITICAL NOTICE:
Only 2 slots remaining for your college batch. You must confirm your acceptance within 4 hours by clicking the link below and submitting your personal identity documents, or this offer will immediately be forfeited to the next applicant in queue!

Confirmation Link: https://bit.ly/technova-hire-2026

Regards,
Ms. Shalini Gupta
Senior Headhunter & Talent Lead
TechNova Global Solutions`,
    jdText: `Role: Web Development & AI Intern
Eligibility: Any student from any branch. Zero experience required.
Stipend: ₹65,000 / month
Selection: Direct selection without tests.`,
    description: 'Flags include free public email (@gmail.com) for official corporate HR, unrealistic stipend (₹65,000/mo for 10h/week with zero screening), extreme time pressure (4-hour timer), and a masked bit.ly URL.'
  },
  {
    id: 'sample-high-risk',
    title: 'High-Risk Scam (Police Clearance & UPI Fee Demand)',
    type: 'HIGH_RISK',
    badgeLabel: 'Known Scam Pattern',
    companyName: 'Tata Consultancy Services (Claimed)',
    recruiterEmail: 'tcs.hr.onboarding.department@gmail.com',
    recruiterPhone: '+91 98765 43210',
    recruiterUrl: 'https://tcs-careers-portal.xyz/verify',
    offerText: `CONFIRMATION OF PROVISIONAL SELECTION - TCS IGNITE INTERNSHIP 2026/2027

Reference: TCS/HR-OFF/2026/0984
Candidate Status: SHORTLISTED & APPROVED

Dear Candidate,
Greetings from Tata Consultancy Services HR Recruitment Cell. We are glad to inform you that you have been provisionally selected for the TCS Software Intern Program with a monthly stipend of ₹32,000.

MANDATORY COMPLIANCE STEP (POLICE CLEARANCE & VERIFICATION BADGE):
As per updated cybersecurity compliance for 2026, all selected interns must undergo mandatory Government Police Clearance Certificate & Background Verification clearance before the final Appointment Letter is generated.

You are required to submit the government verification processing fee of ₹2,500 immediately. This amount is 100% REFUNDABLE and will be reimbursed in your first month stipend credit.

Payment Instructions:
- Payment Method: UPI (Google Pay, PhonePe, Paytm, BHIM)
- Official HR UPI ID: tcshr.verify@okaxis
- Amount: ₹2,500 (Two Thousand Five Hundred Rupees only)
- Deadline: WITHIN 90 MINUTES of receiving this notification

Once payment is complete, send the UPI transaction screenshot and reference number to this WhatsApp number (+91 98765 43210). Failure to pay within 90 minutes will result in immediate cancellation of your candidature.

DO NOT DELAY. SEATS ARE ALLOCATED ON FIRST-COME BASIS.

Best regards,
Anil Sharma | Chief Talent Officer
TCS HR Recruitment & Verification Cell`,
    jdText: `TCS Internship Selection. Mandatory background check and police clearance deposit of ₹2,500 via UPI before release of joining documents.`,
    description: 'Matches active college scam pattern! Demands ₹2,500 via UPI ID (tcshr.verify@okaxis) for fake "police clearance certificate", uses a Gmail address, creates high panic with a 90-minute deadline, and threatens cancellation.'
  }
];
