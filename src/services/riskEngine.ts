import {
  AnalysisInput,
  AnalysisResult,
  DetectedFlag,
  PositiveSignal,
  RiskLevel,
  ScamReport,
  ChecklistItem
} from '../types';
import {
  INITIAL_SCAM_PATTERNS,
  INITIAL_SCAM_REPORTS,
  VERIFIED_LEGITIMATE_DOMAINS,
  KNOWN_SUSPICIOUS_EMAIL_PROVIDERS,
  SUSPICIOUS_TLDS
} from '../data/mockData';

// Helper regexes
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/g;
const PHONE_REGEX = /(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}|\b\d{10}\b/g;
const UPI_REGEX = /\b[a-zA-Z0-9.\-_]{2,256}@(ok[a-zA-Z]+|paytm|ybl|upi|icici|axisbank|sbi|apl|barodampay|kotak|postbank)\b/gi;
const URL_REGEX = /https?:\/\/[^\s<>"'{}|\\^`]+/gi;

export function analyzeOffer(input: AnalysisInput, storedReports: ScamReport[] = []): AnalysisResult {
  const combinedText = `${input.offerText} \n ${input.jdText || ''} \n ${input.companyName} \n ${input.recruiterEmail} \n ${input.recruiterPhone} \n ${input.recruiterUrl}`.trim();
  const lowerText = combinedText.toLowerCase();

  const allReports = [...storedReports, ...INITIAL_SCAM_REPORTS];

  const flags: DetectedFlag[] = [];
  const positiveSignals: PositiveSignal[] = [];
  const evidenceSnippets: string[] = [];
  const matchedPatterns: string[] = [];
  const matchedScamReports: ScamReport[] = [];

  let rawScore = 0;

  // 1. EXTRACT IDENTIFIERS
  const detectedEmails = Array.from(new Set(combinedText.match(EMAIL_REGEX) || []));
  const detectedPhones = Array.from(new Set(combinedText.match(PHONE_REGEX) || []));
  const detectedUpis = Array.from(new Set(combinedText.match(UPI_REGEX) || []));
  const detectedUrls = Array.from(new Set(combinedText.match(URL_REGEX) || []));

  if (input.recruiterEmail && !detectedEmails.includes(input.recruiterEmail)) {
    detectedEmails.push(input.recruiterEmail);
  }
  if (input.recruiterPhone && !detectedPhones.includes(input.recruiterPhone)) {
    detectedPhones.push(input.recruiterPhone);
  }

  // 2. CHECK AGAINST KNOWN SCAM DATABASE
  const normalizedPhones = detectedPhones.map(p => p.replace(/[\s+-]/g, '').slice(-10));
  const normalizedEmails = detectedEmails.map(e => e.toLowerCase().trim());
  const normalizedUpis = detectedUpis.map(u => u.toLowerCase().trim());

  for (const report of allReports) {
    let matchReason = '';
    const repPhoneNorm = report.recruiterPhone ? report.recruiterPhone.replace(/[\s+-]/g, '').slice(-10) : '';
    const repEmailNorm = report.recruiterEmail ? report.recruiterEmail.toLowerCase().trim() : '';
    const repUpiNorm = report.recruiterUpi ? report.recruiterUpi.toLowerCase().trim() : '';

    if (repUpiNorm && normalizedUpis.includes(repUpiNorm)) {
      matchReason = `UPI ID matched flagged scam record: ${report.recruiterUpi}`;
    } else if (repPhoneNorm && repPhoneNorm.length >= 10 && normalizedPhones.includes(repPhoneNorm)) {
      matchReason = `Phone number matched flagged scam record: ${report.recruiterPhone}`;
    } else if (repEmailNorm && normalizedEmails.includes(repEmailNorm)) {
      matchReason = `Recruiter email matched flagged scam record: ${report.recruiterEmail}`;
    } else if (
      input.companyName &&
      report.companyName.toLowerCase().includes(input.companyName.toLowerCase().trim()) &&
      input.companyName.trim().length > 3 &&
      (lowerText.includes('upi') || lowerText.includes('fee') || lowerText.includes('deposit'))
    ) {
      matchReason = `Company name and payment pattern matched recent report: ${report.companyName}`;
    }

    if (matchReason) {
      if (!matchedScamReports.some(r => r.id === report.id)) {
        matchedScamReports.push(report);
      }
    }
  }

  if (matchedScamReports.length > 0) {
    const reportRef = matchedScamReports[0];
    flags.push({
      id: 'db-scam-match',
      severity: 'CRITICAL',
      title: 'Direct Match with Community Scam Database',
      description: `Identifiers submitted in this offer match ${matchedScamReports.length} recorded incident report(s) in the OfferCheck Scam Repository (Pattern: ${reportRef.category}).`,
      evidence: `Matched record #${reportRef.id} - ${reportRef.companyName} (${reportRef.amountRequested} requested via ${reportRef.channel}).`,
      ruleCategory: 'Database Cross-Check',
      points: 35
    });
    rawScore += 35;
    evidenceSnippets.push(`Database Match: Record ${reportRef.id} reported on ${reportRef.reportedDate}`);
  }

  // 3. CHECK UPFRONT PAYMENT / REGISTRATION FEES
  const paymentKeywords = [
    'registration fee',
    'registration charges',
    'processing fee',
    'application fee',
    'seat reservation fee',
    'slot booking fee',
    'onboarding charge',
    'verification fee',
    'clearance fee',
    'portal fee',
    'kit fee',
    'uniform fee',
    'training fee',
    'certificate fee',
    'pay rs',
    'pay inr',
    'transfer rs',
    'refundable fee',
    'refundable amount',
    'refundable deposit',
    'security deposit',
    'caution deposit',
    'laptop bond',
    'asset deposit'
  ];

  const matchedPaymentTerms = paymentKeywords.filter(k => lowerText.includes(k));
  if (matchedPaymentTerms.length > 0) {
    const isSecurityDeposit = matchedPaymentTerms.some(t => t.includes('security') || t.includes('deposit') || t.includes('laptop'));
    const flagPoints = isSecurityDeposit ? 32 : 30;
    
    // Find snippet
    let snippet = '';
    const sentences = combinedText.split(/[.\n\r]+/);
    for (const s of sentences) {
      if (matchedPaymentTerms.some(term => s.toLowerCase().includes(term))) {
        snippet = s.trim().slice(0, 160);
        break;
      }
    }

    flags.push({
      id: 'rule-upfront-payment',
      severity: 'CRITICAL',
      title: isSecurityDeposit ? 'Security / Asset Deposit Demand' : 'Upfront Registration / Processing Fee Requested',
      description: 'Legitimate employers never demand upfront money, registration fees, or refundable deposits from candidates before joining or for receiving offer letters.',
      evidence: snippet || `Detected payment terms: "${matchedPaymentTerms.slice(0, 3).join('", "')}"`,
      ruleCategory: 'Monetary Demand',
      points: flagPoints
    });
    rawScore += flagPoints;
    if (snippet) evidenceSnippets.push(snippet);
  }

  // 4. CHECK UPI / DIRECT PEER-TO-PEER PAYMENT DETAILS
  const hasUpiMention = lowerText.includes('upi') || lowerText.includes('gpay') || lowerText.includes('google pay') || lowerText.includes('phonepe') || lowerText.includes('paytm qr') || detectedUpis.length > 0;
  if (hasUpiMention) {
    const upiEvidence = detectedUpis.length > 0 
      ? `Specific UPI handle detected: ${detectedUpis.join(', ')}` 
      : 'Peer-to-peer payment gateway (UPI/GPay/PhonePe) referenced in recruitment communication.';
    
    flags.push({
      id: 'rule-upi-payment',
      severity: 'CRITICAL',
      title: 'Personal UPI / Wallet Payment Requested',
      description: 'Official corporate recruitment never asks students to pay using personal UPI IDs or wallet transfers (Google Pay, PhonePe, Paytm).',
      evidence: upiEvidence,
      ruleCategory: 'Monetary Demand',
      points: 25
    });
    rawScore += 25;
    evidenceSnippets.push(upiEvidence);
  }

  // 5. CHECK POLICE VERIFICATION / CLEARANCE SCAM PATTERN
  const policeVerificationKeywords = ['police clearance', 'police verification', 'pcc charge', 'verification badge', 'background verification fee', 'character certificate charge'];
  if (policeVerificationKeywords.some(k => lowerText.includes(k))) {
    matchedPatterns.push('Police Clearance / Background Verification Fee Scam');
    flags.push({
      id: 'rule-police-clearance-scam',
      severity: 'CRITICAL',
      title: 'Known "Police Clearance Certificate" Scam Signature',
      description: 'A widespread cyber scam targeting Indian engineering students where impostors claim police clearance or background verification requires an urgent payment.',
      evidence: 'References government verification or police clearance fee required prior to offer release.',
      ruleCategory: 'Scam Signature',
      points: 25
    });
    rawScore += 25;
  }

  // 6. CHECK CREDENTIAL THEFT / OTP / SENSITIVE FINANCIAL DATA
  const credentialTheftTerms = [
    'share otp',
    'forward otp',
    'send otp',
    'debit card cvv',
    'atm pin',
    'net banking password',
    'bank login',
    'aadhaar otp',
    'bank account otp'
  ];
  const matchedCredentials = credentialTheftTerms.filter(t => lowerText.includes(t));
  if (matchedCredentials.length > 0) {
    flags.push({
      id: 'rule-credential-theft',
      severity: 'CRITICAL',
      title: 'Sensitive Security / OTP Request Detected',
      description: 'Extreme danger: Recruitment communications never ask for banking OTPs, debit card CVVs, or account passwords under any circumstance.',
      evidence: `Sensitive security keywords detected: "${matchedCredentials.join('", "')}"`,
      ruleCategory: 'Credential Security',
      points: 35
    });
    rawScore += 35;
    evidenceSnippets.push(`Critical risk: Request to share credentials/OTP detected.`);
  }

  // 7. CHECK RECRUITER EMAIL DOMAIN & MISMATCH
  const majorCompanies = [
    { name: 'tcs', canonical: 'tcs.com', full: 'Tata Consultancy Services' },
    { name: 'infosys', canonical: 'infosys.com', full: 'Infosys' },
    { name: 'wipro', canonical: 'wipro.com', full: 'Wipro' },
    { name: 'cognizant', canonical: 'cognizant.com', full: 'Cognizant' },
    { name: 'accenture', canonical: 'accenture.com', full: 'Accenture' },
    { name: 'google', canonical: 'google.com', full: 'Google' },
    { name: 'microsoft', canonical: 'microsoft.com', full: 'Microsoft' },
    { name: 'amazon', canonical: 'amazon.com', full: 'Amazon' },
    { name: 'hcl', canonical: 'hcltech.com', full: 'HCLTech' },
    { name: 'deloitte', canonical: 'deloitte.com', full: 'Deloitte' }
  ];

  const claimedCompanyLower = (input.companyName || '').toLowerCase();
  const matchedMajorCompany = majorCompanies.find(c => 
    claimedCompanyLower.includes(c.name) || lowerText.includes(c.name)
  );

  for (const email of detectedEmails) {
    const parts = email.split('@');
    if (parts.length === 2) {
      const domain = parts[1].toLowerCase();

      // Check if domain is free provider (e.g., gmail.com)
      if (KNOWN_SUSPICIOUS_EMAIL_PROVIDERS.includes(domain)) {
        if (matchedMajorCompany || input.companyName.trim().length > 3) {
          flags.push({
            id: 'rule-generic-email-impersonation',
            severity: 'HIGH',
            title: 'Free / Public Email Address Used as Corporate Recruiter',
            description: `Recruiter email uses a public email service (${domain}) instead of an official company email domain. Established organizations communicate exclusively through corporate domain mail.`,
            evidence: `Recruiter email: "${email}" for claimed organization "${input.companyName || (matchedMajorCompany ? matchedMajorCompany.full : 'Enterprise')}"`,
            ruleCategory: 'Identity Verification',
            points: 22
          });
          rawScore += 22;
          evidenceSnippets.push(`Email: ${email} (free ${domain} provider)`);
        } else {
          flags.push({
            id: 'rule-free-email',
            severity: 'MEDIUM',
            title: 'Public Webmail Domain Used',
            description: `Recruiter is contacting from an unverified public mailbox (${domain}). Verify physical registered address and company domain independently.`,
            evidence: `Contact email: "${email}"`,
            ruleCategory: 'Identity Verification',
            points: 12
          });
          rawScore += 12;
        }
      } else {
        // Check for typosquatted or lookalike domains
        if (matchedMajorCompany) {
          if (!domain.endsWith(matchedMajorCompany.canonical)) {
            flags.push({
              id: 'rule-domain-typosquat',
              severity: 'CRITICAL',
              title: 'Domain Mismatch / Lookalike Email Domain',
              description: `The offer claims affiliation with ${matchedMajorCompany.full}, but the email domain (@${domain}) does not match the official enterprise domain (@${matchedMajorCompany.canonical}).`,
              evidence: `Claimed: ${matchedMajorCompany.full} | Actual sender domain: @${domain}`,
              ruleCategory: 'Identity Verification',
              points: 28
            });
            rawScore += 28;
            evidenceSnippets.push(`Sender domain @${domain} does not match @${matchedMajorCompany.canonical}`);
          }
        }
      }
    }
  }

  // 8. CHECK URGENCY & PRESSURE TACTICS
  const urgencyKeywords = [
    'within 2 hours',
    'within 4 hours',
    'within 24 hours',
    'within 90 minutes',
    'within 60 minutes',
    'offer expires today',
    'immediate confirmation',
    'slots filling fast',
    'only 2 slots remaining',
    'only 3 slots remaining',
    'first come first serve',
    'forfeit your offer',
    'cancellation of your candidature',
    'immediate joining required',
    'urgent response required'
  ];

  const matchedUrgency = urgencyKeywords.filter(k => lowerText.includes(k));
  if (matchedUrgency.length > 0) {
    flags.push({
      id: 'rule-urgency-coercion',
      severity: 'HIGH',
      title: 'High-Pressure Urgency Tactics Detected',
      description: 'Scammers deliberately invent artificial tight deadlines (e.g. 2 hours, 90 minutes) to induce panic and prevent students from consulting parents or college placement officers.',
      evidence: `Urgency language: "${matchedUrgency.slice(0, 2).join('", "')}"`,
      ruleCategory: 'Psychological Manipulation',
      points: 16
    });
    rawScore += 16;
    evidenceSnippets.push(`Urgency signals: ${matchedUrgency.join(', ')}`);
  }

  // 9. CHECK UNREALISTIC STIPEND & DIRECT SELECTION
  const directSelectionTerms = [
    'no interview required',
    'no technical interview',
    'direct selection',
    'without any test',
    '100% selection guaranteed',
    'direct hiring without interview',
    'selected based on your resume alone'
  ];
  const matchedDirectSelection = directSelectionTerms.filter(t => lowerText.includes(t));
  if (matchedDirectSelection.length > 0) {
    flags.push({
      id: 'rule-direct-selection',
      severity: 'HIGH',
      title: 'Direct Selection Without Assessment or Interview',
      description: 'Legitimate professional software and technical internships require at least one structured technical screening, coding round, or video discussion.',
      evidence: `Detected phrases: "${matchedDirectSelection.join('", "')}"`,
      ruleCategory: 'Hiring Process',
      points: 18
    });
    rawScore += 18;
    evidenceSnippets.push(`Unusual: Direct selection without technical interview.`);
  }

  // Check unrealistic stipend figures (e.g., ₹50k - ₹80k for simple data entry or 10 hours work)
  const hasHighStipendClaims = (lowerText.includes('65,000') || lowerText.includes('50,000') || lowerText.includes('75,000') || lowerText.includes('80,000')) &&
    (lowerText.includes('typing') || lowerText.includes('data entry') || lowerText.includes('10 hours') || lowerText.includes('flexible') || lowerText.includes('zero experience'));
  if (hasHighStipendClaims) {
    flags.push({
      id: 'rule-unrealistic-compensation',
      severity: 'MEDIUM',
      title: 'Disproportionately High Stipend for Minimal Qualifications',
      description: 'Promising premium compensation (e.g. ₹50k+ per month) for part-time, low-skill, or zero-experience work is a standard bait mechanism.',
      evidence: 'High stipend claimed alongside low-effort or zero-screening requirements.',
      ruleCategory: 'Compensation Anomaly',
      points: 14
    });
    rawScore += 14;
  }

  // 10. CHECK SUSPICIOUS URLS & SHORTENERS
  const shorteners = ['bit.ly', 'tinyurl.com', 't.ly', 'rb.gy', 'cutt.ly', 'is.gd', 'shorturl.at'];
  const matchedShorteners = detectedUrls.filter(u => shorteners.some(s => u.toLowerCase().includes(s)));
  const matchedSuspiciousTlds = detectedUrls.filter(u => SUSPICIOUS_TLDS.some(tld => u.toLowerCase().includes(tld)));

  if (matchedShorteners.length > 0) {
    flags.push({
      id: 'rule-masked-url',
      severity: 'HIGH',
      title: 'Masked / Shortened URL in Offer Communication',
      description: 'Official corporate communications provide transparent, branded links to corporate career portals rather than obfuscated bit.ly or tinyurl redirects.',
      evidence: `Shortened link: ${matchedShorteners[0]}`,
      ruleCategory: 'Technical Indicators',
      points: 16
    });
    rawScore += 16;
    evidenceSnippets.push(`URL: ${matchedShorteners[0]}`);
  } else if (matchedSuspiciousTlds.length > 0) {
    flags.push({
      id: 'rule-suspicious-tld',
      severity: 'HIGH',
      title: 'Suspicious Domain Extension (TLD)',
      description: `URL uses a top-level domain frequently associated with throwaway phishing websites (${matchedSuspiciousTlds[0]}).`,
      evidence: `Domain: ${matchedSuspiciousTlds[0]}`,
      ruleCategory: 'Technical Indicators',
      points: 18
    });
    rawScore += 18;
    evidenceSnippets.push(`Suspicious domain: ${matchedSuspiciousTlds[0]}`);
  }

  // 11. CHECK UNOFFICIAL COMMUNICATION CHANNELS
  const telegramOnly = (lowerText.includes('t.me/') || lowerText.includes('telegram') || lowerText.includes('whatsapp only')) && !detectedEmails.some(e => !KNOWN_SUSPICIOUS_EMAIL_PROVIDERS.includes(e.split('@')[1]));
  if (telegramOnly && (lowerText.includes('task') || lowerText.includes('rating') || lowerText.includes('admin') || lowerText.includes('secret chat'))) {
    flags.push({
      id: 'rule-unofficial-channel',
      severity: 'HIGH',
      title: 'Communication Restricted to Telegram / Messaging Channels',
      description: 'Conducting recruitment exclusively via Telegram or WhatsApp channels without official domain email or registered corporate portal indicates high fraud risk.',
      evidence: 'Redirection to Telegram or unofficial messaging group for task execution or onboarding.',
      ruleCategory: 'Channel Verification',
      points: 18
    });
    rawScore += 18;
  }

  // 12. POSITIVE SIGNALS EVALUATION
  // Check if official verified corporate domain is used
  const hasVerifiedDomainEmail = detectedEmails.some(email => {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && VERIFIED_LEGITIMATE_DOMAINS.some(v => domain.endsWith(v));
  });

  if (hasVerifiedDomainEmail) {
    positiveSignals.push({
      id: 'pos-verified-email',
      title: 'Verified Corporate Email Domain',
      description: `Email sender matches an established enterprise domain (${detectedEmails.find(e => VERIFIED_LEGITIMATE_DOMAINS.some(v => e.toLowerCase().includes(v)))}).`
    });
  }

  // Check if standard anti-scam disclaimer is present
  const hasAntiScamNotice = lowerText.includes('never asks for') || lowerText.includes('never asks any registration fee') || lowerText.includes('zero fee policy') || lowerText.includes('does not charge any fee');
  if (hasAntiScamNotice) {
    positiveSignals.push({
      id: 'pos-anti-scam-notice',
      title: 'Explicit Zero-Fee / Anti-Scam Policy Mentioned',
      description: 'Offer explicitly reiterates that the company never charges candidate registration fees or deposits.'
    });
  }

  // Check structured technical screening mentioned
  const hasStructuredScreening = (lowerText.includes('technical interview') || lowerText.includes('coding assessment') || lowerText.includes('assessment round') || lowerText.includes('hiring manager round')) && !matchedDirectSelection.length;
  if (hasStructuredScreening) {
    positiveSignals.push({
      id: 'pos-structured-screening',
      title: 'Structured Multi-Stage Evaluation Referenced',
      description: 'Selection references prior assessment rounds, technical interviews, or standard campus evaluation benchmarks.'
    });
  }

  // Check official careers portal login
  const hasLegitPortal = detectedUrls.some(u => VERIFIED_LEGITIMATE_DOMAINS.some(v => u.toLowerCase().includes(v)));
  if (hasLegitPortal) {
    positiveSignals.push({
      id: 'pos-official-portal',
      title: 'Official Corporate Careers Portal Link',
      description: 'The offer directs onboarding document submission through an authenticated corporate portal.'
    });
  }

  // 13. CALCULATE FINAL NORMALIZED SCORE & RISK LEVEL
  // If positive signals exist and NO critical payment/OTP flags were found, discount modest score
  const hasCriticalRedFlags = flags.some(f => f.severity === 'CRITICAL');
  if (positiveSignals.length > 0 && !hasCriticalRedFlags) {
    rawScore = Math.max(0, rawScore - (positiveSignals.length * 10));
  }

  // Cap score between 0 and 100
  let finalScore = Math.min(100, Math.max(0, rawScore));

  // If critical payment or credential theft flag is present, ensure score is at least 70
  if (hasCriticalRedFlags && finalScore < 70) {
    finalScore = 75;
  }

  // If no flags at all and strong positive signals, give clean low score
  if (flags.length === 0) {
    finalScore = positiveSignals.length > 0 ? 5 : 12;
  }

  let riskLevel: RiskLevel = 'LOW';
  if (finalScore >= 85) {
    riskLevel = 'CRITICAL';
  } else if (finalScore >= 65) {
    riskLevel = 'HIGH';
  } else if (finalScore >= 30) {
    riskLevel = 'MEDIUM';
  } else {
    riskLevel = 'LOW';
  }

  // 14. GENERATE SUMMARY STATEMENT
  let summary = '';
  if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
    summary = `High risk indicators detected. The offer exhibits strong characteristics of known recruitment fraud (${flags.map(f => f.title).slice(0, 2).join(', ')}). Immediate caution advised.`;
  } else if (riskLevel === 'MEDIUM') {
    summary = `Potential risk detected. Certain inconsistencies or generic communication patterns warrant further independent verification before proceeding.`;
  } else {
    summary = `Low immediate risk detected. No standard upfront payment or known fraudulent pattern was found in the submitted offer details. Standard safety checks are still recommended.`;
  }

  // 15. TAILORED RECOMMENDED ACTIONS
  const recommendedActions: string[] = [];
  if (flags.some(f => f.ruleCategory === 'Monetary Demand')) {
    recommendedActions.push('Do NOT transfer any money, registration fee, or security deposit via UPI, QR code, or net banking.');
  }
  if (flags.some(f => f.ruleCategory === 'Credential Security')) {
    recommendedActions.push('Never disclose your OTP, ATM PIN, net banking credentials, or bank verification codes.');
  }
  recommendedActions.push('Verify the company through its official corporate website and career portal directly (do not use links sent in the message).');
  recommendedActions.push('Independently cross-verify recruiter identity via their company phone directory or official LinkedIn corporate page.');
  if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
    recommendedActions.push('Consult your college placement and training cell coordinator before responding.');
    recommendedActions.push('Report this suspicious message to the OfferCheck community repository and the National Cyber Crime Reporting Portal (cybercrime.gov.in).');
  } else {
    recommendedActions.push('Review the formal appointment letter carefully for company registration details and official stamp.');
  }

  // 16. GENERATE INTERACTIVE CHECKLIST ITEMS
  const checklistItems: ChecklistItem[] = [
    {
      id: 'chk-1',
      text: 'Do not pay any upfront fees or security deposits',
      detail: 'Genuine companies never ask job seekers to pay for tests, kits, ID cards, or police clearance.',
      priority: 'high',
      completed: flags.some(f => f.ruleCategory === 'Monetary Demand') ? false : true
    },
    {
      id: 'chk-2',
      text: 'Verify the email matches the official company domain',
      detail: 'Confirm the recruiter is not using @gmail.com, @yahoo.com, or a lookalike domain.',
      priority: 'high',
      completed: false
    },
    {
      id: 'chk-3',
      text: 'Independently search company registration on MCA portal',
      detail: 'Search the Ministry of Corporate Affairs (mca.gov.in) to verify active company status & registered office.',
      priority: 'recommended',
      completed: false
    },
    {
      id: 'chk-4',
      text: 'Never share OTP, PIN, or bank passwords',
      detail: 'Corporate payroll setup only requires bank account number and IFSC, never OTPs or debit card details.',
      priority: 'high',
      completed: true
    },
    {
      id: 'chk-5',
      text: 'Contact your college placement / training cell if in doubt',
      detail: 'Your campus placement officers can verify if this employer has visited your university.',
      priority: 'recommended',
      completed: false
    },
    {
      id: 'chk-6',
      text: 'Report suspicious activity to protect fellow students',
      detail: 'Submit details to the OfferCheck repository to alert other job-seeking peers.',
      priority: 'standard',
      completed: false
    }
  ];

  return {
    id: 'eval-' + Date.now(),
    timestamp: new Date().toISOString(),
    score: finalScore,
    riskLevel,
    summary,
    input,
    flags,
    positiveSignals,
    evidenceSnippets,
    matchedPatterns,
    matchedScamReports,
    recommendedActions,
    checklistItems
  };
}
