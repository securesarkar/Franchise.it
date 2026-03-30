import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, type Match } from '../store/useStore';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  MapPin, 
  IndianRupee, 
  ArrowRight,
  Filter,
  Search,
  Star,
  CheckCircle2,
  Briefcase,
  Handshake,
  Maximize
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data for franchisors
const mockFranchisors = [
  {
    id: 'f1',
    companyName: 'Gourmet Burger Co.',
    industry: 'Food & Beverage',
    logo: '🍔',
    investmentRequired: '₹50-75 Lakhs',
    franchiseFee: '₹10 Lakhs',
    royaltyFee: '6%',
    locations: ['Mumbai', 'Delhi NCR', 'Bangalore', 'Pune'],
    description: 'Premium gourmet burger franchise with proven track record of success.',
    rating: 4.8,
    matchScore: 95,
    supportProvided: ['Site Selection', 'Training', 'Marketing Support'],
    established: 2015,
    outlets: 45,
  },
  {
    id: 'f2',
    companyName: 'FitZone Gym',
    industry: 'Fitness',
    logo: '💪',
    investmentRequired: '₹1-2 Crores',
    franchiseFee: '₹15 Lakhs',
    royaltyFee: '8%',
    locations: ['Metro Cities', 'Tier 2 Cities'],
    description: 'State-of-the-art fitness centers with latest equipment and technology.',
    rating: 4.6,
    matchScore: 88,
    supportProvided: ['Equipment Setup', 'Training', 'Marketing', 'Technology Platform'],
    established: 2012,
    outlets: 120,
  },
  {
    id: 'f3',
    companyName: 'Smart Learning Academy',
    industry: 'Education',
    logo: '📚',
    investmentRequired: '₹25-40 Lakhs',
    franchiseFee: '₹5 Lakhs',
    royaltyFee: '10%',
    locations: ['Pan India'],
    description: 'Ed-tech enabled coaching centers for K-12 students.',
    rating: 4.9,
    matchScore: 92,
    supportProvided: ['Curriculum', 'Teacher Training', 'Technology', 'Marketing'],
    established: 2018,
    outlets: 200,
  },
  {
    id: 'f4',
    companyName: 'Cafe Aroma',
    industry: 'Food & Beverage',
    logo: '☕',
    investmentRequired: '₹30-50 Lakhs',
    franchiseFee: '₹8 Lakhs',
    royaltyFee: '5%',
    locations: ['Mumbai', 'Bangalore', 'Hyderabad', 'Chennai'],
    description: 'Premium coffee shop chain with unique ambiance and quality beverages.',
    rating: 4.7,
    matchScore: 85,
    supportProvided: ['Store Design', 'Barista Training', 'Supply Chain', 'Marketing'],
    established: 2010,
    outlets: 80,
  },
  {
    id: 'f5',
    companyName: 'MedCare Diagnostics',
    industry: 'Healthcare',
    logo: '🏥',
    investmentRequired: '₹75 Lakhs - 1 Crore',
    franchiseFee: '₹20 Lakhs',
    royaltyFee: '7%',
    locations: ['Tier 2 Cities', 'Tier 3 Cities'],
    description: 'Advanced diagnostic centers with cutting-edge medical technology.',
    rating: 4.5,
    matchScore: 78,
    supportProvided: ['Equipment', 'Staff Training', 'Quality Control', 'Marketing'],
    established: 2016,
    outlets: 35,
  },
];

// Mock data for franchisees
const mockFranchisees = [
  {
    id: 'fe1',
    name: 'Rajesh Kumar',
    location: 'Mumbai, Maharashtra',
    availableCapital: '₹1 Crore',
    propertySize: '2000 sq ft',
    preferredIndustries: ['Food & Beverage', 'Retail'],
    experience: '5 years in retail management',
    matchScore: 94,
    psychometricMatch: 91,
  },
  {
    id: 'fe2',
    name: 'Priya Sharma',
    location: 'Bangalore, Karnataka',
    availableCapital: '₹75 Lakhs',
    propertySize: '1500 sq ft',
    preferredIndustries: ['Education', 'Healthcare'],
    experience: '3 years in education sector',
    matchScore: 89,
    psychometricMatch: 87,
  },
  {
    id: 'fe3',
    name: 'Amit Patel',
    location: 'Ahmedabad, Gujarat',
    availableCapital: '₹2 Crores',
    propertySize: '3000 sq ft',
    preferredIndustries: ['Fitness', 'Healthcare'],
    experience: '7 years in hospitality',
    matchScore: 92,
    psychometricMatch: 95,
  },
  {
    id: 'fe4',
    name: 'Sneha Gupta',
    location: 'Delhi NCR',
    availableCapital: '₹50 Lakhs',
    propertySize: '1200 sq ft',
    preferredIndustries: ['Food & Beverage', 'Beauty & Wellness'],
    experience: '4 years in F&B industry',
    matchScore: 86,
    psychometricMatch: 88,
  },
  {
    id: 'fe5',
    name: 'Vikram Singh',
    location: 'Jaipur, Rajasthan',
    availableCapital: '₹1.5 Crores',
    propertySize: '2500 sq ft',
    preferredIndustries: ['Retail', 'Automotive'],
    experience: '10 years in automobile industry',
    matchScore: 81,
    psychometricMatch: 84,
  },
];

const MatchingPage = () => {
  const navigate = useNavigate();
  const { currentUser, addMatch } = useStore();
  const [activeTab, setActiveTab] = useState<'matches' | 'interested'>('matches');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [interestedIds, setInterestedIds] = useState<string[]>([]);

  const isFranchisee = currentUser?.role === 'franchisee';
  const data = isFranchisee ? mockFranchisors : mockFranchisees;

  const filteredData = data.filter((item: any) => {
    const matchesSearch = isFranchisee 
      ? item.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      : item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = filterIndustry === 'all' || 
      (isFranchisee ? item.industry === filterIndustry : item.preferredIndustries.includes(filterIndustry));
    
    return matchesSearch && matchesIndustry;
  });

  const handleInterest = (id: string) => {
    if (interestedIds.includes(id)) {
      toast.info('You have already expressed interest in this match');
      return;
    }

    setInterestedIds([...interestedIds, id]);
    
    // Create a match
    const match = {
      id: 'match_' + Date.now(),
      franchiseeId: isFranchisee ? (currentUser?.id || '') : id,
      franchisorId: isFranchisee ? id : (currentUser?.id || ''),
      franchiseeName: isFranchisee ? (currentUser?.personalInfo?.firstName || '') : (mockFranchisees.find(f => f.id === id)?.name || ''),
      franchisorName: isFranchisee ? (mockFranchisors.find(f => f.id === id)?.companyName || '') : (currentUser?.personalInfo?.firstName || ''),
      franchiseeCompany: isFranchisee ? '' : (mockFranchisees.find(f => f.id === id)?.name || ''),
      franchisorCompany: isFranchisee ? (mockFranchisors.find(f => f.id === id)?.companyName || '') : '',
      matchScore: isFranchisee 
        ? (mockFranchisors.find(f => f.id === id)?.matchScore || 0)
        : (mockFranchisees.find(f => f.id === id)?.matchScore || 0),
      status: (isFranchisee ? 'interested_franchisee' : 'interested_franchisor') as Match['status'],
      createdAt: new Date().toISOString(),
    };

    addMatch(match);
    toast.success('Interest expressed! Redirecting to detailed form...');
    
    // Redirect to ML match form
    setTimeout(() => {
      navigate(`/ml-match/${match.id}`);
    }, 1500);
  };

  const industries = ['all', ...Array.from(new Set(isFranchisee 
    ? mockFranchisors.map(f => f.industry)
    : mockFranchisees.flatMap(f => f.preferredIndustries)
  ))];

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Header */}
      <header className="bg-[#0e0e0e] border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#d2a855] to-[#a88644] rounded-lg flex items-center justify-center">
                <Handshake className="w-5 h-5 text-[#141414]" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Franchise</span>
                <span className="text-xl font-bold text-[#d2a855]">Match</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-white/60 hover:text-white transition-colors"
              >
                Dashboard
              </button>
              <div className="w-10 h-10 bg-[#d2a855]/10 rounded-full flex items-center justify-center">
                <span className="text-[#d2a855] font-semibold">
                  {currentUser?.personalInfo?.firstName?.[0] || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isFranchisee ? 'Find Your Perfect Franchise' : 'Discover Qualified Franchisees'}
          </h1>
          <p className="text-white/60">
            {isFranchisee 
              ? 'Browse and connect with top franchise brands that match your profile'
              : 'Review and connect with potential franchise partners for your brand'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('matches')}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === 'matches' ? 'text-[#d2a855]' : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Recommended Matches
              <span className="px-2 py-0.5 bg-[#d2a855]/20 text-[#d2a855] text-xs rounded-full">
                {filteredData.length}
              </span>
            </span>
            {activeTab === 'matches' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d2a855]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('interested')}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === 'interested' ? 'text-[#d2a855]' : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Interested
              <span className="px-2 py-0.5 bg-[#d2a855]/20 text-[#d2a855] text-xs rounded-full">
                {interestedIds.length}
              </span>
            </span>
            {activeTab === 'interested' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d2a855]" />
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isFranchisee ? 'Search by brand name...' : 'Search by name...'}
              className="w-full pl-10 pr-4 py-3 bg-[#0e0e0e] border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#d2a855]"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <select
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
              className="pl-10 pr-8 py-3 bg-[#0e0e0e] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#d2a855] appearance-none"
            >
              <option value="all">All Industries</option>
              {industries.filter(i => i !== 'all').map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Matches Grid */}
        {activeTab === 'matches' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item: any) => (
              <div 
                key={item.id} 
                className="bg-[#0e0e0e] border border-white/10 rounded-2xl overflow-hidden hover:border-[#d2a855]/30 transition-all group"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#d2a855]/20 to-[#a88644]/20 rounded-xl flex items-center justify-center text-2xl">
                        {isFranchisee ? item.logo : <Briefcase className="w-6 h-6 text-[#d2a855]" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {isFranchisee ? item.companyName : item.name}
                        </h3>
                        <p className="text-sm text-white/50">
                          {isFranchisee ? item.industry : item.preferredIndustries.join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-[#d2a855]/10 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-[#d2a855]" />
                      <span className="text-sm font-medium text-[#d2a855]">{item.matchScore}%</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {isFranchisee ? (
                      <>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <IndianRupee className="w-4 h-4 text-[#d2a855]" />
                          {item.investmentRequired}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <MapPin className="w-4 h-4 text-[#d2a855]" />
                          {item.locations.length} cities
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <IndianRupee className="w-4 h-4 text-[#d2a855]" />
                          {item.availableCapital}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <MapPin className="w-4 h-4 text-[#d2a855]" />
                          {item.location}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-sm text-white/60 mb-4 line-clamp-2">
                    {isFranchisee ? item.description : `Experience: ${item.experience}`}
                  </p>

                  {isFranchisee && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.supportProvided.slice(0, 3).map((support: string, idx: number) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-[#1d1d1d] text-white/50 text-xs rounded-full"
                        >
                          {support}
                        </span>
                      ))}
                    </div>
                  )}

                  {!isFranchisee && (
                    <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
                      <Maximize className="w-4 h-4 text-[#d2a855]" />
                      Property: {item.propertySize}
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    onClick={() => handleInterest(item.id)}
                    disabled={interestedIds.includes(item.id)}
                    className={`w-full ${
                      interestedIds.includes(item.id)
                        ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#d2a855] to-[#a88644] text-[#141414] hover:opacity-90'
                    }`}
                  >
                    {interestedIds.includes(item.id) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Interest Expressed
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 mr-2" />
                        I am Interested
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Interested Tab */
          <div className="text-center py-16">
            {interestedIds.length === 0 ? (
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-[#1d1d1d] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Interested Matches Yet</h3>
                <p className="text-white/60 mb-6">
                  Browse through recommended matches and express interest in the ones that align with your goals.
                </p>
                <Button
                  onClick={() => setActiveTab('matches')}
                  className="bg-gradient-to-r from-[#d2a855] to-[#a88644] text-[#141414] hover:opacity-90"
                >
                  Browse Matches
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interestedIds.map((id) => {
                  const item = data.find((d: any) => d.id === id);
                  if (!item) return null;
                  const franchiseeItem = isFranchisee ? null : item as typeof mockFranchisees[0];
                  const franchisorItem = isFranchisee ? item as typeof mockFranchisors[0] : null;
                  return (
                    <div 
                      key={item.id} 
                      className="bg-[#0e0e0e] border border-green-500/30 rounded-2xl overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#d2a855]/20 to-[#a88644]/20 rounded-xl flex items-center justify-center text-xl">
                            {isFranchisee ? franchisorItem?.logo : <Briefcase className="w-5 h-5 text-[#d2a855]" />}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              {isFranchisee ? franchisorItem?.companyName : franchiseeItem?.name}
                            </h3>
                            <p className="text-sm text-white/50">
                              {isFranchisee ? franchisorItem?.industry : franchiseeItem?.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          Awaiting response
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MatchingPage;
