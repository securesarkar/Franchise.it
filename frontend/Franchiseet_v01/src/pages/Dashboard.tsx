import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, type PotentialMatch } from '../store/useStore';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { updateFranchisorRequirements, type FranchisorRequirementsPayload } from '../services/userProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  LayoutDashboard, 
  User, 
  Heart, 
  Settings, 
  LogOut,
  TrendingUp,
  Building2,
  IndianRupee,
  MapPin,
  Handshake,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  Edit3,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, setAuthenticated, updateUserProfile, matches, potentialMatches } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'matches' | 'settings'>('overview');
  const [selectedBreakdown, setSelectedBreakdown] = useState<PotentialMatch | null>(null);
  const [isEditingRequirements, setIsEditingRequirements] = useState(false);
  const [isSavingRequirements, setIsSavingRequirements] = useState(false);
  const [requirementsForm, setRequirementsForm] = useState<FranchisorRequirementsPayload>({
    investmentRequired: '',
    franchiseFee: '',
    royaltyFee: '',
    locationRequirements: '',
    preferredLocations: [],
    supportProvided: [],
    trainingProgram: '',
  });

  useEffect(() => {
    if (!currentUser?.requirements) return;

    setRequirementsForm({
      investmentRequired: currentUser.requirements.investmentRequired || '',
      franchiseFee: currentUser.requirements.franchiseFee || '',
      royaltyFee: currentUser.requirements.royaltyFee || '',
      locationRequirements: currentUser.requirements.locationRequirements || '',
      preferredLocations: currentUser.requirements.preferredLocations || [],
      supportProvided: currentUser.requirements.supportProvided || [],
      trainingProgram: currentUser.requirements.trainingProgram || '',
    });
  }, [currentUser?.requirements]);

  useEffect(() => {
    if (!selectedBreakdown) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedBreakdown(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBreakdown]);

  const isFranchisee = currentUser?.role === 'franchisee';

  // Find whatever handleLogout looks like now, replace entirely with:
const handleLogout = async () => {
  try {
    await signOut(auth);
    setCurrentUser(null);
    setAuthenticated(false);
    navigate('/login');
    toast.success('Logged out successfully');
  } catch (error) {
    toast.error('Logout failed');
  }
};

  const handleRequirementsFieldChange = (
    field: keyof FranchisorRequirementsPayload,
    value: string,
  ) => {
    setRequirementsForm((prev) => {
      if (field === 'preferredLocations' || field === 'supportProvided') {
        return {
          ...prev,
          [field]: value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSaveRequirements = async () => {
    if (!currentUser) return;

    setIsSavingRequirements(true);

    try {
      updateUserProfile({
        requirements: requirementsForm,
      });

      try {
        await updateFranchisorRequirements(currentUser.id, requirementsForm);
      } catch {
        toast.warning('Requirements updated locally. Cloud sync will retry later.');
      }

      setIsEditingRequirements(false);
      toast.success('Requirements updated successfully');
    } catch {
      toast.error('Failed to update requirements');
    } finally {
      setIsSavingRequirements(false);
    }
  };

  const userMatches = matches.filter(m => 
    isFranchisee ? m.franchiseeId === currentUser?.id : m.franchisorId === currentUser?.id
  );

  const pendingMatches = userMatches.filter(m => m.status === 'pending' || m.status === 'interested_franchisee' || m.status === 'interested_franchisor');
  const mutualMatches = userMatches.filter(m => m.status === 'mutual_interest' || m.status === 'matched');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'interested_franchisee':
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center gap-1"><Heart className="w-3 h-3" /> Franchisee Interested</span>;
      case 'interested_franchisor':
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center gap-1"><Heart className="w-3 h-3" /> Franchisor Interested</span>;
      case 'mutual_interest':
        return <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full flex items-center gap-1"><Star className="w-3 h-3" /> Mutual Interest</span>;
      case 'matched':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Matched</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">{status}</span>;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8"> 
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#d2a855]/20 to-[#a88644]/20 border border-[#d2a855]/30 rounded-2xl p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Welcome back, {currentUser?.personalInfo?.firstName}!
                  </h2>
                  <p className="text-white/60">
                    {isFranchisee 
                      ? 'Find your perfect franchise opportunity and start your entrepreneurial journey.'
                      : 'Connect with qualified franchisees and expand your brand presence.'}
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/matching')}
                  className="bg-gradient-to-r from-[#d2a855] to-[#a88644] text-[#141414] hover:opacity-90"
                >
                  {isFranchisee ? 'Find Franchises' : 'Find Franchisees'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#d2a855]/10 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-[#d2a855]" />
                  </div>
                  <span className="text-white/60 text-sm">Total Matches</span>
                </div>
                <p className="text-3xl font-bold text-white">{userMatches.length}</p>
              </div>

              <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-white/60 text-sm">Pending</span>
                </div>
                <p className="text-3xl font-bold text-white">{pendingMatches.length}</p>
              </div>

              <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-white/60 text-sm">Mutual Interest</span>
                </div>
                <p className="text-3xl font-bold text-white">{mutualMatches.length}</p>
              </div>

              <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-white/60 text-sm">Finalized</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {userMatches.filter(m => m.status === 'matched').length}
                </p>
              </div>
            </div>

            {/* Recent Matches */}
            <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Recent Matches</h3>
                <button 
                  onClick={() => setActiveTab('matches')}
                  className="text-[#d2a855] text-sm hover:underline"
                >
                  View All
                </button>
              </div>

              {userMatches.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[#1d1d1d] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Handshake className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-white/60 mb-4">No matches yet</p>
                  <Button
                    onClick={() => navigate('/matching')}
                    className="bg-gradient-to-r from-[#d2a855] to-[#a88644] text-[#141414] hover:opacity-90"
                  >
                    Start Matching
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userMatches.slice(0, 3).map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-4 bg-[#141414] rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#d2a855]/20 to-[#a88644]/20 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-[#d2a855]" />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {isFranchisee ? match.franchisorName : match.franchiseeName}
                          </p>
                          <p className="text-sm text-white/50">
                            Match Score: <span className="text-[#d2a855]">{match.matchScore}%</span>
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(match.status)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <button 
                onClick={() => setActiveTab('profile')}
                className="p-6 bg-[#0e0e0e] border border-white/5 rounded-xl text-left hover:border-[#d2a855]/30 transition-all"
              >
                <div className="w-10 h-10 bg-[#d2a855]/10 rounded-lg flex items-center justify-center mb-4">
                  <User className="w-5 h-5 text-[#d2a855]" />
                </div>
                <h4 className="text-white font-medium mb-1">Edit Profile</h4>
                <p className="text-sm text-white/50">Update your personal and business information</p>
              </button>

              <button 
                onClick={() => navigate('/matching')}
                className="p-6 bg-[#0e0e0e] border border-white/5 rounded-xl text-left hover:border-[#d2a855]/30 transition-all"
              >
                <div className="w-10 h-10 bg-[#d2a855]/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5 text-[#d2a855]" />
                </div>
                <h4 className="text-white font-medium mb-1">Browse Matches</h4>
                <p className="text-sm text-white/50">Discover new franchise opportunities</p>
              </button>

              <button 
                onClick={() => setActiveTab('settings')}
                className="p-6 bg-[#0e0e0e] border border-white/5 rounded-xl text-left hover:border-[#d2a855]/30 transition-all"
              >
                <div className="w-10 h-10 bg-[#d2a855]/10 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-5 h-5 text-[#d2a855]" />
                </div>
                <h4 className="text-white font-medium mb-1">Settings</h4>
                <p className="text-sm text-white/50">Manage your account preferences</p>
              </button>
            </div>

            {isFranchisee && potentialMatches.length > 0 && (
              <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Live Match Score Breakdown</h3>
                <div className="space-y-3">
                  {potentialMatches.slice(0, 3).map((match, idx) => (
                    <div key={`${match.brandName}-${idx}`} className="p-4 bg-[#141414] rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white font-medium">{match.brandName}</p>
                        <p className="text-[#d2a855] text-sm font-semibold">{Math.round(match.totalScore)}%</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                        <span>Asset: {match.assetMatchScore.toFixed(1)}</span>
                        <span>Investment: {match.investmentScore.toFixed(1)}</span>
                        <span>Traits: {match.traitScore.toFixed(1)}</span>
                        <span>Industry: {match.industryScore.toFixed(1)}</span>
                      </div>
                      <button
                        onClick={() => setSelectedBreakdown(match)}
                        className="mt-3 text-xs text-[#d2a855] hover:underline"
                      >
                        View Full Breakdown
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">My Profile</h2>

            {/* Personal Information */}
            <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-[#d2a855]" />
                  Personal Information
                </h3>
                <button className="text-[#d2a855] text-sm flex items-center gap-1 hover:underline">
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-white/50 mb-1">Full Name</p>
                  <p className="text-white">{currentUser?.personalInfo?.firstName} {currentUser?.personalInfo?.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-1">Email</p>
                  <p className="text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#d2a855]" />
                    {currentUser?.personalInfo?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-1">Phone</p>
                  <p className="text-white flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#d2a855]" />
                    {currentUser?.personalInfo?.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-1">Location</p>
                  <p className="text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#d2a855]" />
                    {currentUser?.personalInfo?.city}, {currentUser?.personalInfo?.state}
                  </p>
                </div>
              </div>
            </div>

            {/* Role-specific Information */}
            {isFranchisee ? (
              <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-[#d2a855]" />
                    Investment Profile
                  </h3>
                  <button className="text-[#d2a855] text-sm flex items-center gap-1 hover:underline">
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-white/50 mb-1">Available Capital</p>
                    <p className="text-white">{currentUser?.assets?.availableCapital || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50 mb-1">Liquid Assets</p>
                    <p className="text-white">{currentUser?.assets?.liquidAssets || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50 mb-1">Net Worth</p>
                    <p className="text-white">{currentUser?.assets?.netWorth || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50 mb-1">Property Size</p>
                    <p className="text-white">{currentUser?.assets?.locationSize || 'Not specified'}</p>
                  </div>
                </div>

                {currentUser?.assets?.preferredIndustries && (
                  <div className="mt-6">
                    <p className="text-sm text-white/50 mb-2">Preferred Industries</p>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.assets.preferredIndustries.map((industry, idx) => (
                        <span key={idx} className="px-3 py-1 bg-[#d2a855]/10 text-[#d2a855] text-sm rounded-full">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#d2a855]" />
                    Franchise Requirements
                  </h3>
                  <button
                    onClick={() => setIsEditingRequirements((prev) => !prev)}
                    className="text-[#d2a855] text-sm flex items-center gap-1 hover:underline"
                  >
                    <Edit3 className="w-4 h-4" />
                    {isEditingRequirements ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {isEditingRequirements ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white/80">Investment Required</Label>
                        <Input
                          value={requirementsForm.investmentRequired}
                          onChange={(event) => handleRequirementsFieldChange('investmentRequired', event.target.value)}
                          placeholder="e.g., 50 Lakhs - 1 Crore"
                          className="bg-[#141414] border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/80">Franchise Fee</Label>
                        <Input
                          value={requirementsForm.franchiseFee}
                          onChange={(event) => handleRequirementsFieldChange('franchiseFee', event.target.value)}
                          placeholder="e.g., 10 Lakhs"
                          className="bg-[#141414] border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/80">Royalty Fee</Label>
                        <Input
                          value={requirementsForm.royaltyFee}
                          onChange={(event) => handleRequirementsFieldChange('royaltyFee', event.target.value)}
                          placeholder="e.g., 5%"
                          className="bg-[#141414] border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/80">Training Program</Label>
                        <Input
                          value={requirementsForm.trainingProgram}
                          onChange={(event) => handleRequirementsFieldChange('trainingProgram', event.target.value)}
                          placeholder="Describe training support"
                          className="bg-[#141414] border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/80">Location Requirements</Label>
                      <Textarea
                        value={requirementsForm.locationRequirements}
                        onChange={(event) => handleRequirementsFieldChange('locationRequirements', event.target.value)}
                        placeholder="e.g., 1000+ sq ft, high street, parking available"
                        className="bg-[#141414] border-white/10 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/80">Preferred Locations (comma-separated)</Label>
                      <Input
                        value={requirementsForm.preferredLocations.join(', ')}
                        onChange={(event) => handleRequirementsFieldChange('preferredLocations', event.target.value)}
                        placeholder="Mumbai, Pune, Bangalore"
                        className="bg-[#141414] border-white/10 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/80">Support Provided (comma-separated)</Label>
                      <Input
                        value={requirementsForm.supportProvided.join(', ')}
                        onChange={(event) => handleRequirementsFieldChange('supportProvided', event.target.value)}
                        placeholder="Site selection, Training, Marketing"
                        className="bg-[#141414] border-white/10 text-white"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleSaveRequirements}
                        disabled={isSavingRequirements}
                        className="bg-gradient-to-r from-[#d2a855] to-[#a88644] text-[#141414] hover:opacity-90"
                      >
                        {isSavingRequirements ? 'Saving...' : 'Save Requirements'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-white/50 mb-1">Investment Required</p>
                        <p className="text-white">{currentUser?.requirements?.investmentRequired || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-white/50 mb-1">Franchise Fee</p>
                        <p className="text-white">{currentUser?.requirements?.franchiseFee || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-white/50 mb-1">Royalty Fee</p>
                        <p className="text-white">{currentUser?.requirements?.royaltyFee || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-white/50 mb-1">Preferred Locations</p>
                        <p className="text-white">{(currentUser?.requirements?.preferredLocations || []).length} cities selected</p>
                      </div>
                    </div>

                    {currentUser?.requirements?.supportProvided && (
                      <div className="mt-6">
                        <p className="text-sm text-white/50 mb-2">Support Provided</p>
                        <div className="flex flex-wrap gap-2">
                          {currentUser.requirements.supportProvided.map((support, idx) => (
                            <span key={idx} className="px-3 py-1 bg-[#d2a855]/10 text-[#d2a855] text-sm rounded-full">
                              {support}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        );

      case 'matches':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">My Matches</h2>

            {isFranchisee && potentialMatches.length > 0 && (
              <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Live Recommendations</h3>
                <div className="space-y-3">
                  {potentialMatches.slice(0, 5).map((match, idx) => (
                    <div key={`${match.brandName}-${idx}`} className="p-4 bg-[#141414] rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{match.brandName}</p>
                        <p className="text-sm text-white/50">{match.contactEmail}</p>
                        <button
                          onClick={() => setSelectedBreakdown(match)}
                          className="mt-2 text-xs text-[#d2a855] hover:underline"
                        >
                          View Full Breakdown
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-[#d2a855] font-semibold">{Math.round(match.totalScore)}%</p>
                        <p className="text-xs text-white/50">A {match.assetMatchScore.toFixed(1)} | I {match.investmentScore.toFixed(1)} | T {match.traitScore.toFixed(1)} | In {match.industryScore.toFixed(1)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {userMatches.length === 0 ? (
              <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-[#1d1d1d] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Handshake className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Matches Yet</h3>
                <p className="text-white/60 mb-6 max-w-md mx-auto">
                  Start browsing and expressing interest to find your perfect franchise match.
                </p>
                <Button
                  onClick={() => navigate('/matching')}
                  className="bg-gradient-to-r from-[#d2a855] to-[#a88644] text-[#141414] hover:opacity-90"
                >
                  Find Matches
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {userMatches.map((match) => (
                  <div key={match.id} className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#d2a855]/20 to-[#a88644]/20 rounded-xl flex items-center justify-center">
                          <Building2 className="w-7 h-7 text-[#d2a855]" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg">
                            {isFranchisee ? match.franchisorName : match.franchiseeName}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-white/50">
                              Match Score: <span className="text-[#d2a855]">{match.matchScore}%</span>
                            </span>
                            <span className="text-sm text-white/50 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(match.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(match.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Settings</h2>

            <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Account Settings</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#141414] rounded-xl">
                  <div>
                    <p className="text-white font-medium">Email Notifications</p>
                    <p className="text-sm text-white/50">Receive updates about new matches and messages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[#1d1d1d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d2a855]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#141414] rounded-xl">
                  <div>
                    <p className="text-white font-medium">SMS Notifications</p>
                    <p className="text-sm text-white/50">Receive text messages for important updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-[#1d1d1d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d2a855]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#141414] rounded-xl">
                  <div>
                    <p className="text-white font-medium">Profile Visibility</p>
                    <p className="text-sm text-white/50">Make your profile visible to potential matches</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[#1d1d1d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d2a855]"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 text-red-400">Danger Zone</h3>
              
              <div className="space-y-4">
                <button className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-left hover:bg-red-500/20 transition-colors">
                  <p className="text-white font-medium">Delete Account</p>
                  <p className="text-sm text-white/50">Permanently delete your account and all data</p>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#141414]">

      {/* Header */}
      <header className="bg-[#0e0e0e] border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#d2a855] to-[#a88644] rounded-lg flex items-center justify-center">
                <Handshake className="w-5 h-5 text-[#141414]" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Franchise</span>
                <span className="text-xl font-bold text-[#d2a855]">It</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#d2a855]/10 rounded-full flex items-center justify-center">
                <span className="text-[#d2a855] font-semibold">
                  {currentUser?.personalInfo?.firstName?.[0] || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-4 sticky top-24">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'overview' 
                      ? 'bg-[#d2a855]/10 text-[#d2a855]' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'profile' 
                      ? 'bg-[#d2a855]/10 text-[#d2a855]' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <User className="w-5 h-5" />
                  My Profile
                </button>
                <button
                  onClick={() => setActiveTab('matches')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'matches' 
                      ? 'bg-[#d2a855]/10 text-[#d2a855]' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  My Matches
                  {userMatches.length > 0 && (
                    <span className="ml-auto px-2 py-0.5 bg-[#d2a855]/20 text-[#d2a855] text-xs rounded-full">
                      {userMatches.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'settings' 
                      ? 'bg-[#d2a855]/10 text-[#d2a855]' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
              </nav>

              <div className="mt-8 pt-8 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>

      {selectedBreakdown && (
        <div
          className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedBreakdown(null);
            }
          }}
        >
          <div className="w-full max-w-lg bg-[#0e0e0e] border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedBreakdown.brandName}</h3>
                <p className="text-sm text-white/50">{selectedBreakdown.contactEmail}</p>
              </div>
              <button
                onClick={() => setSelectedBreakdown(null)}
                className="text-white/60 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mb-4 p-3 bg-[#141414] rounded-lg border border-[#d2a855]/20">
              <p className="text-sm text-white/70">Overall Compatibility</p>
              <p className="text-2xl font-bold text-[#d2a855]">{Math.round(selectedBreakdown.totalScore)}%</p>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm text-white/70 mb-1">
                  <span>Asset Match</span>
                  <span>{selectedBreakdown.assetMatchScore.toFixed(1)} / 30</span>
                </div>
                <div className="h-2 bg-[#1d1d1d] rounded-full overflow-hidden">
                  <div className="h-full bg-[#d2a855]" style={{ width: `${(selectedBreakdown.assetMatchScore / 30) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm text-white/70 mb-1">
                  <span>Investment Fit</span>
                  <span>{selectedBreakdown.investmentScore.toFixed(1)} / 30</span>
                </div>
                <div className="h-2 bg-[#1d1d1d] rounded-full overflow-hidden">
                  <div className="h-full bg-[#d2a855]" style={{ width: `${(selectedBreakdown.investmentScore / 30) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm text-white/70 mb-1">
                  <span>Trait Alignment</span>
                  <span>{selectedBreakdown.traitScore.toFixed(1)} / 30</span>
                </div>
                <div className="h-2 bg-[#1d1d1d] rounded-full overflow-hidden">
                  <div className="h-full bg-[#d2a855]" style={{ width: `${(selectedBreakdown.traitScore / 30) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm text-white/70 mb-1">
                  <span>Industry Match</span>
                  <span>{selectedBreakdown.industryScore.toFixed(1)} / 10</span>
                </div>
                <div className="h-2 bg-[#1d1d1d] rounded-full overflow-hidden">
                  <div className="h-full bg-[#d2a855]" style={{ width: `${(selectedBreakdown.industryScore / 10) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
