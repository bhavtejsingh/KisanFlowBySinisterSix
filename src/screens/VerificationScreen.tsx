import { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  Loader,
  MapPin,
  FileText,
  Upload,
  Lock,
  AlertTriangle,
  Sparkles,
  ScanFace,
  Landmark,
  TrendingDown,
  CalendarCheck,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../App';
import Header from '../components/Header';

type FarmerType = 'owner' | 'tenant' | '';

export default function VerificationScreen() {
  const { tr, go } = useApp();

  // Section 1: Identity
  const [aadhaar, setAadhaar] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [identityVerified, setIdentityVerified] = useState(false);
  const [verifyingIdentity, setVerifyingIdentity] = useState(false);

  // Section 2: Farmer type
  const [farmerType, setFarmerType] = useState<FarmerType>('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [khasra, setKhasra] = useState('');
  const [landChecking, setLandChecking] = useState(false);
  const [landVerified, setLandVerified] = useState(false);

  // Section 5: Tenant
  const [leaseUploaded, setLeaseUploaded] = useState(false);
  const [panchayatUploaded, setPanchayatUploaded] = useState(false);
  const [tenantVerifying, setTenantVerifying] = useState(false);
  const [tenantVerified, setTenantVerified] = useState(false);

  // Section 4: Quota
  const maxQuota = farmerType === 'tenant' ? 60 : 90;
  const [reqQty, setReqQty] = useState('');
  const reqNum = parseInt(reqQty) || 0;
  const quotaExceeded = reqNum > maxQuota;
  const utilized = Math.min(reqNum, maxQuota);

  const states = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh'];
  const districts: Record<string, string[]> = {
    Punjab: ['Ludhiana', 'Khanna', 'Samrala', 'Jalandhar'],
    Haryana: ['Karnal', 'Kurukshetra', 'Ambala', 'Hisar'],
    'Uttar Pradesh': ['Meerut', 'Agra', 'Kanpur', 'Varanasi'],
    Rajasthan: ['Jaipur', 'Kota', 'Udaipur', 'Jodhpur'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur'],
  };

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const handleVerifyIdentity = () => {
    setVerifyingIdentity(true);
    setTimeout(() => {
      setVerifyingIdentity(false);
      setIdentityVerified(true);
    }, 1800);
  };

  const handleVerifyLand = () => {
    setLandChecking(true);
    setTimeout(() => {
      setLandChecking(false);
      setLandVerified(true);
    }, 2000);
  };

  const handleVerifyTenant = () => {
    setTenantVerifying(true);
    setTimeout(() => {
      setTenantVerifying(false);
      setTenantVerified(true);
    }, 2000);
  };

  const canProceed =
    identityVerified &&
    landVerified &&
    (farmerType === 'owner' || (farmerType === 'tenant' && tenantVerified)) &&
    reqNum > 0 &&
    !quotaExceeded;

  return (
    <div className="min-h-full bg-gray-50">
      <Header title={tr.identityVerification} />

      <div className="px-5 py-5 pb-24 space-y-5">
        {/* SECTION 1: Identity Verification */}
        <SectionCard icon={ScanFace} title={tr.identityVerification} step={1}>
          {!identityVerified ? (
            <>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">
                {tr.aadhaar}
              </label>
              <input
                type="tel"
                maxLength={12}
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                placeholder="XXXX XXXX XXXX"
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 text-lg font-semibold tracking-widest focus:border-kisan-600 focus:outline-none mb-4"
              />
              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  disabled={aadhaar.length < 12}
                  className="w-full py-3.5 rounded-2xl bg-kisan-600 text-white font-bold shadow-lg active:scale-[0.98] disabled:opacity-40 hover:bg-kisan-700 transition"
                >
                  {tr.sendOtp}
                </button>
              ) : (
                <div className="animate-fade-in">
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    {tr.enterOtp}
                  </label>
                  <input
                    type="tel"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="------"
                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 text-2xl font-bold text-center tracking-[0.5em] focus:border-kisan-600 focus:outline-none mb-4"
                  />
                  <button
                    onClick={handleVerifyIdentity}
                    disabled={otp.length < 4 || verifyingIdentity}
                    className="w-full py-3.5 rounded-2xl bg-saffron-500 text-white font-bold shadow-lg active:scale-[0.98] disabled:opacity-40 hover:bg-saffron-600 transition flex items-center justify-center gap-2"
                  >
                    {verifyingIdentity ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" /> {tr.checkingLandRecords.replace('Land', 'Identity')}
                      </>
                    ) : (
                      <>
                        {tr.verify} <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="animate-fade-in space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-kisan-50 border border-kisan-200">
                <div className="w-12 h-12 rounded-xl bg-kisan-100 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-kisan-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-kisan-700">{tr.aadhaarVerified}</p>
                  <p className="text-xs text-kisan-600">Name: Ramesh Singh</p>
                  <p className="text-xs text-kisan-600">Farmer ID: FRM-2045</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-kisan-600 text-white text-xs font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> {tr.verified}
                </span>
              </div>
            </div>
          )}
        </SectionCard>

        {/* SECTION 2: Farmer Type */}
        {identityVerified && (
          <SectionCard icon={Landmark} title={tr.farmerType} step={2}>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setFarmerType('owner')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition active:scale-95 ${
                  farmerType === 'owner' ? 'border-kisan-600 bg-kisan-50' : 'border-gray-200 bg-white'
                }`}
              >
                <Landmark className={`w-7 h-7 ${farmerType === 'owner' ? 'text-kisan-600' : 'text-gray-400'}`} />
                <span className="text-sm font-bold text-gray-700">{tr.landOwner}</span>
              </button>
              <button
                onClick={() => setFarmerType('tenant')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition active:scale-95 ${
                  farmerType === 'tenant' ? 'border-kisan-600 bg-kisan-50' : 'border-gray-200 bg-white'
                }`}
              >
                <FileText className={`w-7 h-7 ${farmerType === 'tenant' ? 'text-kisan-600' : 'text-gray-400'}`} />
                <span className="text-sm font-bold text-gray-700">{tr.tenantFarmer}</span>
              </button>
            </div>

            {farmerType && (
              <div className="animate-fade-in space-y-3">
                {/* State dropdown */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{tr.selectState}</label>
                  <div className="relative">
                    <select
                      value={state}
                      onChange={(e) => { setState(e.target.value); setDistrict(''); }}
                      className="w-full appearance-none px-4 py-3.5 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 focus:border-kisan-600 focus:outline-none bg-white"
                    >
                      <option value="" disabled>Select...</option>
                      {states.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* District dropdown */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{tr.selectDistrict}</label>
                  <div className="relative">
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      disabled={!state}
                      className="w-full appearance-none px-4 py-3.5 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 focus:border-kisan-600 focus:outline-none bg-white disabled:opacity-50"
                    >
                      <option value="" disabled>Select...</option>
                      {(districts[state] || []).map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Khasra number */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{tr.surveyKhasra}</label>
                  <input
                    type="text"
                    value={khasra}
                    onChange={(e) => setKhasra(e.target.value)}
                    placeholder="e.g. 88/12"
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 focus:border-kisan-600 focus:outline-none"
                  />
                </div>

                {!landVerified && (
                  <button
                    onClick={handleVerifyLand}
                    disabled={!state || !district || !khasra || landChecking}
                    className="w-full py-3.5 rounded-2xl bg-kisan-600 text-white font-bold shadow-lg active:scale-[0.98] disabled:opacity-40 hover:bg-kisan-700 transition flex items-center justify-center gap-2"
                  >
                    {landChecking ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" /> {tr.checkingLandRecords}
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" /> {tr.verifyLandRecords}
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </SectionCard>
        )}

        {/* SECTION 5: Tenant Farmer Flow */}
        {identityVerified && farmerType === 'tenant' && landVerified && !tenantVerified && (
          <SectionCard icon={FileText} title={tr.tenantFarmer} step={3}>
            <div className="space-y-3">
              <UploadButton
                label={tr.uploadLeaseAgreement}
                uploaded={leaseUploaded}
                onClick={() => setLeaseUploaded(true)}
              />
              <UploadButton
                label={tr.uploadPanchayatCert}
                uploaded={panchayatUploaded}
                onClick={() => setPanchayatUploaded(true)}
              />
              <button
                onClick={handleVerifyTenant}
                disabled={!leaseUploaded || !panchayatUploaded || tenantVerifying}
                className="w-full py-3.5 rounded-2xl bg-kisan-600 text-white font-bold shadow-lg active:scale-[0.98] disabled:opacity-40 hover:bg-kisan-700 transition flex items-center justify-center gap-2"
              >
                {tenantVerifying ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" /> {tr.checkingLandRecords}
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" /> {tr.verifyTenant}
                  </>
                )}
              </button>
            </div>
          </SectionCard>
        )}

        {/* SECTION 3: Verified Land Record Card */}
        {landVerified && farmerType === 'owner' && (
          <div className="animate-fade-in rounded-2xl bg-white border-2 border-kisan-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-kisan-50 border-b border-kisan-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-kisan-600" />
                <p className="text-sm font-bold text-kisan-700">{tr.verifiedLandRecord}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-kisan-600 text-white text-xs font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> {tr.verified}
              </span>
            </div>
            <div className="p-5 space-y-3">
              <DataRow label={tr.landholderName} value="Ramesh Singh" />
              <DataRow label={tr.landArea} value="4.5 Acres" />
              <DataRow label={tr.selectedCropLabel} value="Wheat" />
              <DataRow label={tr.yieldBenchmark} value="20 Quintals/Acre" />
              <DataRow label={tr.maxProcurementQuota} value="90 Quintals" />
              <DataRow label={tr.remainingQuota} value="90 Quintals" />
            </div>
          </div>
        )}

        {/* SECTION 5: Tenant Verified Card */}
        {tenantVerified && (
          <div className="animate-fade-in rounded-2xl bg-white border-2 border-kisan-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-kisan-50 border-b border-kisan-100">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-kisan-600" />
                <p className="text-sm font-bold text-kisan-700">{tr.tenantVerified}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-kisan-600 text-white text-xs font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> {tr.verified}
              </span>
            </div>
            <div className="p-5 space-y-3">
              <DataRow label={tr.parcel} value="88/12" />
              <DataRow label={tr.leasedArea} value="3 Acres" />
              <DataRow label={tr.maxProcurementQuota} value="60 Quintals" />
              <DataRow label={tr.quotaLockedTo} value="TN-9042" />
              <div className="flex items-center gap-2 p-3 rounded-xl bg-kisan-50 border border-kisan-100">
                <Lock className="w-4 h-4 text-kisan-600 flex-shrink-0" />
                <p className="text-xs font-semibold text-kisan-700">{tr.parcelProtected}</p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: Procurement Request Validation */}
        {landVerified && (farmerType === 'owner' || tenantVerified) && (
          <SectionCard icon={CalendarCheck} title={tr.procurementRequest} step={farmerType === 'tenant' ? 4 : 3}>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">
              {tr.requestedQuantity} ({tr.quintals})
            </label>
            <input
              type="tel"
              value={reqQty}
              onChange={(e) => setReqQty(e.target.value.replace(/\D/g, ''))}
              placeholder="40"
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 text-xl font-bold text-center focus:border-kisan-600 focus:outline-none mb-4"
            />

            {reqNum > 0 && !quotaExceeded && (
              <div className="animate-fade-in space-y-3">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-kisan-50 border border-kisan-200">
                  <CheckCircle className="w-6 h-6 text-kisan-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-kisan-700">{tr.withinQuota}</p>
                    <p className="text-xs text-kisan-600">
                      {reqNum} / {maxQuota} {tr.quintals} {tr.quotaUtilized}
                    </p>
                  </div>
                </div>
                {/* Quota progress bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-400 font-semibold">{tr.quotaUtilized}</span>
                    <span className="text-xs font-bold text-kisan-600">{Math.round((utilized / maxQuota) * 100)}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-kisan-400 to-kisan-600 transition-all duration-500"
                      style={{ width: `${(utilized / maxQuota) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {reqNum > 0 && quotaExceeded && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-700">{tr.quotaExceeded}</p>
                    <p className="text-xs text-red-600">
                      {tr.maxAllowed}: {maxQuota} {tr.quintals}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-xs font-bold text-red-700">{tr.tokenRequestDenied}</p>
                </div>
              </div>
            )}
          </SectionCard>
        )}

        {/* SECTION 6: AI Risk Detection */}
        {landVerified && (farmerType === 'owner' || tenantVerified) && (
          <SectionCard icon={Sparkles} title="AI Risk Detection" step={farmerType === 'tenant' ? 5 : 4}>
            <div className="space-y-3">
              <RiskCard
                icon={ScanFace}
                title={tr.duplicateParcelCheck}
                status={tr.noDuplicateClaims}
                color="kisan"
              />
              <RiskCard
                icon={TrendingDown}
                title={tr.fraudRiskScore}
                status={tr.lowRisk}
                color="kisan"
              />
              <RiskCard
                icon={CalendarCheck}
                title={tr.seasonQuotaStatus}
                status={tr.quotaAvailable}
                color="kisan"
              />
            </div>
          </SectionCard>
        )}

        {/* SECTION 7: Continue Button */}
        {landVerified && (farmerType === 'owner' || tenantVerified) && (
          <div className="animate-fade-in space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-kisan-50 border border-kisan-100">
              <CheckCircle className="w-4 h-4 text-kisan-600 flex-shrink-0" />
              <p className="text-xs font-semibold text-kisan-700">{tr.verificationCompleted}</p>
            </div>
            <button
              onClick={() => go('booking')}
              disabled={!canProceed}
              className="w-full py-4 rounded-2xl bg-saffron-500 text-white text-lg font-bold shadow-lg active:scale-[0.98] disabled:opacity-40 hover:bg-saffron-600 transition flex items-center justify-center gap-2"
            >
              {tr.proceedToBooking} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  step,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  step: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50">
        <div className="w-9 h-9 rounded-lg bg-kisan-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-kisan-600" />
        </div>
        <p className="text-sm font-bold text-gray-700 flex-1">{title}</p>
        <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">
          {step}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-bold text-gray-800">{value}</span>
    </div>
  );
}

function UploadButton({
  label,
  uploaded,
  onClick,
}: {
  label: string;
  uploaded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed transition active:scale-[0.98] ${
        uploaded ? 'border-kisan-500 bg-kisan-50' : 'border-gray-300 bg-gray-50 hover:border-kisan-400'
      }`}
    >
      {uploaded ? (
        <CheckCircle className="w-5 h-5 text-kisan-600" />
      ) : (
        <Upload className="w-5 h-5 text-gray-400" />
      )}
      <span className={`text-sm font-semibold ${uploaded ? 'text-kisan-700' : 'text-gray-500'}`}>
        {uploaded ? `${label} ✓` : label}
      </span>
    </button>
  );
}

function RiskCard({
  icon: Icon,
  title,
  status,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  status: string;
  color: 'kisan';
}) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
      <div className={`w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-700">{title}</p>
        <p className="text-xs text-gray-400">{status}</p>
      </div>
      <CheckCircle className={`w-5 h-5 text-${color}-600`} />
    </div>
  );
}
