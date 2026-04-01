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
  Building2,
  TrendingUp,
  CheckCircle2,
  Handshake,
  IndianRupee,
  Maximize
} from 'lucide-react';
import { toast } from 'sonner';

const FranchiseeOnboarding = () => {
  const navigate = useNavigate();
  const { updateUserProfile } = useStore();
  const [step, setStep] = useState(1);
  const [assets, setAssets] = useState({
    availableCapital: '',
    liquidAssets: '',
    netWorth: '',
    locationSize: '',
    locationAddress: '',
    preferredIndustries: [] as string[],
    preferredLocations: [] as string[],
  });

  const industries = [
    'Food & Beverage',
    'Retail',
    'Education',
    'Healthcare',
    'Fitness',
    'Beauty & Wellness',
    'Automotive',
    'Technology',
    'Real Estate',
    'Logistics',
  ];

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
  ];

  const toggleIndustry = (industry: string) => {
    setAssets(prev => ({
      ...prev,
      preferredIndustries: prev.preferredIndustries.includes(industry)
        ? prev.preferredIndustries.filter(i => i !== industry)
        : [...prev.preferredIndustries, industry]
    }));
  };

  const toggleLocation = (location: string) => {
    setAssets(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.includes(location)
        ? prev.preferredLocations.filter(l => l !== location)
        : [...prev.preferredLocations, location]
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!assets.availableCapital || !assets.liquidAssets || !assets.netWorth) {
        toast.error('Please fill in all financial details');
        return;
      }
    }
    if (step === 2) {
      if (!assets.locationSize || !assets.locationAddress) {
        toast.error('Please provide location details');
        return;
      }
    }
    if (step === 3) {
      if (assets.preferredIndustries.length === 0) {
        toast.error('Please select at least one preferred industry');
        return;
      }
    }
    if (step === 4) {
      if (assets.preferredLocations.length === 0) {
        toast.error('Please select at least one preferred location');
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
      assets: {
        availableCapital: assets.availableCapital,
        liquidAssets: assets.liquidAssets,
        netWorth: assets.netWorth,
        locationSize: assets.locationSize,
        locationAddress: assets.locationAddress,
        preferredIndustries: assets.preferredIndustries,
        preferredLocations: assets.preferredLocations,
      },
      isProfileComplete: true,
    });

    toast.success('Profile completed! Finding matches for you...');
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
              <h2 className="text-2xl font-bold text-white mb-2">Financial Assets</h2>
              <p className="text-white/60">Tell us about your investment capacity</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white/80">Available Capital for Investment</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    value={assets.availableCapital}
                    onChange={(e) => setAssets({ ...assets, availableCapital: e.target.value })}
                    placeholder="e.g., 50 Lakhs"
                    className="pl-10 bg-[#1d1d1d] border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Liquid Assets (Cash, FDs, etc.)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    value={assets.liquidAssets}
                    onChange={(e) => setAssets({ ...assets, liquidAssets: e.target.value })}
                    placeholder="e.g., 30 Lakhs"
                    className="pl-10 bg-[#1d1d1d] border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Total Net Worth</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    value={assets.netWorth}
                    onChange={(e) => setAssets({ ...assets, netWorth: e.target.value })}
                    placeholder="e.g., 2 Crores"
                    className="pl-10 bg-[#1d1d1d] border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#d2a855]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-[#d2a855]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Location Assets</h2>
              <p className="text-white/60">Tell us about your property details</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white/80">Property Size (in sq. ft.)</Label>
                <div className="relative">
                  <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    value={assets.locationSize}
                    onChange={(e) => setAssets({ ...assets, locationSize: e.target.value })}
                    placeholder="e.g., 1500"
                    className="pl-10 bg-[#1d1d1d] border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Property Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-white/40" />
                  <textarea
                    value={assets.locationAddress}
                    onChange={(e) => setAssets({ ...assets, locationAddress: e.target.value })}
                    placeholder="Enter complete address of your property..."
                    rows={4}
                    className="w-full pl-10 pr-4 py-2 bg-[#1d1d1d] border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#d2a855] resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#d2a855]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#d2a855]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Preferred Industries</h2>
              <p className="text-white/60">Select industries you're interested in</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => toggleIndustry(industry)}
                  className={`px-4 py-3 rounded-full text-sm transition-all ${
                    assets.preferredIndustries.includes(industry)
                      ? 'bg-[#d2a855] text-[#141414] font-medium'
                      : 'bg-[#1d1d1d] text-white/60 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>

            {assets.preferredIndustries.length > 0 && (
              <div className="mt-6 p-4 bg-[#d2a855]/10 border border-[#d2a855]/20 rounded-lg">
                <p className="text-sm text-[#d2a855] mb-2">Selected Industries:</p>
                <div className="flex flex-wrap gap-2">
                  {assets.preferredIndustries.map((ind) => (
                    <span key={ind} className="px-3 py-1 bg-[#d2a855]/20 text-[#d2a855] text-xs rounded-full">
                      {ind}
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
                <MapPin className="w-8 h-8 text-[#d2a855]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Preferred Locations</h2>
              <p className="text-white/60">Where would you like to operate?</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => toggleLocation(location)}
                  className={`px-4 py-3 rounded-full text-sm transition-all ${
                    assets.preferredLocations.includes(location)
                      ? 'bg-[#d2a855] text-[#141414] font-medium'
                      : 'bg-[#1d1d1d] text-white/60 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>

            {assets.preferredLocations.length > 0 && (
              <div className="mt-6 p-4 bg-[#d2a855]/10 border border-[#d2a855]/20 rounded-lg">
                <p className="text-sm text-[#d2a855] mb-2">Selected Locations:</p>
                <div className="flex flex-wrap gap-2">
                  {assets.preferredLocations.map((loc) => (
                    <span key={loc} className="px-3 py-1 bg-[#d2a855]/20 text-[#d2a855] text-xs rounded-full">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
            <span className="text-xl font-bold text-[#d2a855]">It</span>
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
                  Complete & Find Matches
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

export default FranchiseeOnboarding;
