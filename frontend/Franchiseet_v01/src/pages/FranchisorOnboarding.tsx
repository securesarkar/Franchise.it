import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowRight, 
  ArrowLeft, 
  Wallet, 
  MapPin, 
  Handshake,
  IndianRupee,
  CheckCircle2,
  Users,
  BookOpen,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

const FranchisorOnboarding = () => {
  const navigate = useNavigate();
  const { updateUserProfile } = useStore();
  const [step, setStep] = useState(1);
  const [requirements, setRequirements] = useState({
    investmentRequired: '',
    franchiseFee: '',
    royaltyFee: '',
    locationRequirements: '',
    preferredLocations: [] as string[],
    supportProvided: [] as string[],
    trainingProgram: '',
  });

  const locations = [
    'Mumbai',
    'Delhi NCR',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
    'Tier 2 Cities',
    'Tier 3 Cities',
    'Pan India',
  ];

  const supportOptions = [
    'Site Selection Assistance',
    'Store Design & Setup',
    'Initial Training Program',
    'Marketing Support',
    'Operational Guidance',
    'Technology Platform',
    'Supply Chain Management',
    'Quality Control',
    'Staff Recruitment Help',
    'Ongoing Consultation',
  ];

  const toggleLocation = (location: string) => {
    setRequirements(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.includes(location)
        ? prev.preferredLocations.filter(l => l !== location)
        : [...prev.preferredLocations, location]
    }));
  };

  const toggleSupport = (support: string) => {
    setRequirements(prev => ({
      ...prev,
      supportProvided: prev.supportProvided.includes(support)
        ? prev.supportProvided.filter(s => s !== support)
        : [...prev.supportProvided, support]
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!requirements.investmentRequired || !requirements.franchiseFee) {
        toast.error('Please fill in all financial requirements');
        return;
      }
    }
    if (step === 2) {
      if (requirements.preferredLocations.length === 0) {
        toast.error('Please select at least one preferred location');
        return;
      }
    }
    if (step === 3) {
      if (requirements.supportProvided.length === 0) {
        toast.error('Please select at least one support option');
        return;
      }
    }
    if (step === 4) {
      if (!requirements.trainingProgram) {
        toast.error('Please describe your training program');
        return;
      }
      handleComplete();
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    updateUserProfile({
      requirements: {
        investmentRequired: requirements.investmentRequired,
        franchiseFee: requirements.franchiseFee,
        royaltyFee: requirements.royaltyFee,
        locationRequirements: requirements.locationRequirements,
        preferredLocations: requirements.preferredLocations,
        supportProvided: requirements.supportProvided,
        trainingProgram: requirements.trainingProgram,
      },
      isProfileComplete: true,
    });

    toast.success('Profile completed! Finding qualified franchisees...');
    navigate('/matching');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#d2a855]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-[#d2a855]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Investment Requirements</h2>
              <p className="text-white/60">Specify the financial requirements for franchisees</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white/80">Total Investment Required</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    value={requirements.investmentRequired}
                    onChange={(e) => setRequirements({ ...requirements, investmentRequired: e.target.value })}
                    placeholder="e.g., 50 Lakhs - 1 Crore"
                    className="pl-10 bg-[#1d1d1d] border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
                <p className="text-xs text-white/40">Total capital required including franchise fee, setup, and working capital</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Franchise Fee</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    value={requirements.franchiseFee}
                    onChange={(e) => setRequirements({ ...requirements, franchiseFee: e.target.value })}
                    placeholder="e.g., 10 Lakhs"
                    className="pl-10 bg-[#1d1d1d] border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
                <p className="text-xs text-white/40">One-time fee for franchise rights</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Royalty Fee (%)</Label>
                <Input
                  value={requirements.royaltyFee}
                  onChange={(e) => setRequirements({ ...requirements, royaltyFee: e.target.value })}
                  placeholder="e.g., 5%"
                  className="bg-[#1d1d1d] border-white/10 text-white placeholder:text-white/30"
                />
                <p className="text-xs text-white/40">Percentage of monthly revenue paid as royalty</p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#d2a855]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-[#d2a855]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Location Preferences</h2>
              <p className="text-white/60">Where do you want to expand your franchise?</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white/80">Property Requirements</Label>
                <textarea
                  value={requirements.locationRequirements}
                  onChange={(e) => setRequirements({ ...requirements, locationRequirements: e.target.value })}
                  placeholder="Describe your ideal location requirements (e.g., minimum 1000 sq ft, ground floor, high street location)..."
                  rows={4}
                  className="w-full px-4 py-2 bg-[#1d1d1d] border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#d2a855] resize-none"
                />
              </div>

              <div>
                <Label className="text-white/80 mb-4 block">Preferred Locations</Label>
                <div className="flex flex-wrap gap-3">
                  {locations.map((location) => (
                    <button
                      key={location}
                      onClick={() => toggleLocation(location)}
                      className={`px-4 py-3 rounded-full text-sm transition-all ${
                        requirements.preferredLocations.includes(location)
                          ? 'bg-[#d2a855] text-[#141414] font-medium'
                          : 'bg-[#1d1d1d] text-white/60 border border-white/10 hover:border-white/30'
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              {requirements.preferredLocations.length > 0 && (
                <div className="mt-6 p-4 bg-[#d2a855]/10 border border-[#d2a855]/20 rounded-lg">
                  <p className="text-sm text-[#d2a855] mb-2">Selected Locations:</p>
                  <div className="flex flex-wrap gap-2">
                    {requirements.preferredLocations.map((loc) => (
                      <span key={loc} className="px-3 py-1 bg-[#d2a855]/20 text-[#d2a855] text-xs rounded-full">
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#d2a855]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#d2a855]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Support Provided</h2>
              <p className="text-white/60">What support do you offer to franchisees?</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {supportOptions.map((support) => (
                <button
                  key={support}
                  onClick={() => toggleSupport(support)}
                  className={`px-4 py-3 rounded-full text-sm transition-all ${
                    requirements.supportProvided.includes(support)
                      ? 'bg-[#d2a855] text-[#141414] font-medium'
                      : 'bg-[#1d1d1d] text-white/60 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {support}
                </button>
              ))}
            </div>

            {requirements.supportProvided.length > 0 && (
              <div className="mt-6 p-4 bg-[#d2a855]/10 border border-[#d2a855]/20 rounded-lg">
                <p className="text-sm text-[#d2a855] mb-2">Selected Support Options:</p>
                <div className="flex flex-wrap gap-2">
                  {requirements.supportProvided.map((support) => (
                    <span key={support} className="px-3 py-1 bg-[#d2a855]/20 text-[#d2a855] text-xs rounded-full">
                      {support}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#d2a855]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-[#d2a855]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Training Program</h2>
              <p className="text-white/60">Describe your training and onboarding program</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white/80">Training Program Details</Label>
                <textarea
                  value={requirements.trainingProgram}
                  onChange={(e) => setRequirements({ ...requirements, trainingProgram: e.target.value })}
                  placeholder="Describe your training program including duration, topics covered, mode of training (online/on-site), ongoing support, etc."
                  rows={8}
                  className="w-full px-4 py-2 bg-[#1d1d1d] border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#d2a855] resize-none"
                />
              </div>

              <div className="p-4 bg-[#1d1d1d] border border-white/10 rounded-lg">
                <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#d2a855]" />
                  Suggested Topics to Include:
                </h4>
                <ul className="text-sm text-white/60 space-y-1">
                  <li>• Initial training duration and schedule</li>
                  <li>• Operational procedures and SOPs</li>
                  <li>• Marketing and sales training</li>
                  <li>• Technology and systems training</li>
                  <li>• Ongoing support and refresher training</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-[#d2a855] to-[#a88644] rounded-lg flex items-center justify-center">
            <Handshake className="w-5 h-5 text-[#141414]" />
          </div>
          <div>
            <span className="text-xl font-bold text-white">Franchise</span>
            <span className="text-xl font-bold text-[#d2a855]">Match</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Step {step} of 4</span>
            <span className="text-[#d2a855] text-sm">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-[#1d1d1d] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#d2a855] to-[#a88644] transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-8">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/10">
            <Button
              variant="outline"
              onClick={step === 1 ? () => navigate('/dashboard') : handleBack}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step === 1 ? 'Skip for Now' : 'Previous'}
            </Button>

            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-[#d2a855] to-[#a88644] text-[#141414] hover:opacity-90"
            >
              {step === 4 ? (
                <>
                  Complete & Find Franchisees
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FranchisorOnboarding;
