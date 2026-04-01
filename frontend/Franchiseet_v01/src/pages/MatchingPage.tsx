import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, type Match } from '../store/useStore';
import { fetchMatchesByEmail, fetchMatchesByProfile } from '../services/matchApi';
import { buildProfileMatchRequest } from '../services/matchProfile';
import { useFranchiseesRealtime, useFranchisorsRealtime } from '../hooks/useRoleDatasetsRealtime';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Mail,
  ArrowRight,
  Search,
  Star,
  CheckCircle2,
  Briefcase,
  Handshake,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';

type LiveFranchisorMatch = {
  id: string;
  companyName: string;
  contactEmail: string;
  matchScore: number;
  assetMatchScore: number;
  investmentScore: number;
  traitScore: number;
  industryScore: number;
};

type RealtimeFranchiseeCard = {
  id: string;
  name: string;
  location: string;
  availableCapital: string;
  preferredIndustries: string[];
  experience: string;
  matchScore: number;
};

const MatchingPage = () => {
  const navigate = useNavigate();
  const { currentUser, addMatch, matches, potentialMatches, setPotentialMatches } = useStore();

  const [activeTab, setActiveTab] = useState<'matches' | 'interested'>('matches');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const {
    data: realtimeFranchisees,
    loading: realtimeFranchiseesLoading,
    error: realtimeFranchiseesError,
  } = useFranchiseesRealtime();
  const {
    data: realtimeFranchisors,
    loading: realtimeFranchisorsLoading,
    error: realtimeFranchisorsError,
  } = useFranchisorsRealtime();

  const isFranchisee = currentUser?.role === 'franchisee';

  const franchiseeEmail = currentUser?.personalInfo?.email?.trim() || '';

  const liveFranchisorMatches: LiveFranchisorMatch[] = useMemo(
    () =>
      potentialMatches.map((match, index) => ({
        id: `${match.brandName}-${index}`,
        companyName: match.brandName,
        contactEmail: match.contactEmail,
        matchScore: Math.round(match.totalScore),
        assetMatchScore: match.assetMatchScore,
        investmentScore: match.investmentScore,
        traitScore: match.traitScore,
        industryScore: match.industryScore,
      })),
    [potentialMatches],
  );

  const realtimeFranchisorMatches: LiveFranchisorMatch[] = useMemo(
    () =>
      realtimeFranchisors.map((item) => ({
        id: item.id,
        companyName: item.displayName || item.email,
        contactEmail: item.email,
        matchScore: 50,
        assetMatchScore: 0,
        investmentScore: 0,
        traitScore: 0,
        industryScore: 0,
      })),
    [realtimeFranchisors],
  );

  const realtimeFranchiseeCards: RealtimeFranchiseeCard[] = useMemo(
    () =>
      realtimeFranchisees.map((item) => ({
        id: item.id,
        name: item.displayName || item.email,
        location: 'Location not specified',
        availableCapital: 'Not specified',
        preferredIndustries: [],
        experience: 'Profile synced from Firestore',
        matchScore: 80,
      })),
    [realtimeFranchisees],
  );

  const loadLiveMatches = async () => {
    setIsLoadingMatches(true);
    setFetchError('');

    try {
      let response;
      try {
        if (!franchiseeEmail) {
          throw new Error('No email available for dataset matching');
        }
        response = await fetchMatchesByEmail(franchiseeEmail);
      } catch {
        response = await fetchMatchesByProfile(buildProfileMatchRequest(currentUser));
      }

      const mappedMatches = response.top_matches.map((item) => ({
        brandName: item['Brand Name'],
        contactEmail: item['Contact Email'],
        totalScore: item.total_score,
        assetMatchScore: item.asset_match_score,
        investmentScore: item.investment_score,
        traitScore: item.trait_score,
        industryScore: item.industry_score,
      }));

      setPotentialMatches(mappedMatches);
      toast.success('Live matches loaded from backend');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch matches';
      setFetchError(message);
      toast.error(message);
    } finally {
      setIsLoadingMatches(false);
    }
  };

  useEffect(() => {
    if (isFranchisee && potentialMatches.length === 0 && franchiseeEmail) {
      void loadLiveMatches();
    }
  }, [isFranchisee, potentialMatches.length, franchiseeEmail]);

  const data = isFranchisee
    ? (liveFranchisorMatches.length > 0 ? liveFranchisorMatches : realtimeFranchisorMatches)
    : realtimeFranchiseeCards;

  const datasetError = isFranchisee ? realtimeFranchisorsError : realtimeFranchiseesError;
  const isRealtimeLoading = isFranchisee ? realtimeFranchisorsLoading : realtimeFranchiseesLoading;

  const userInterestedMatches = useMemo(
    () =>
      matches.filter((match) => {
        const belongsToUser = isFranchisee
          ? match.franchiseeId === currentUser?.id
          : match.franchisorId === currentUser?.id;
        const isInterestFlow =
          match.status === 'interested_franchisee' ||
          match.status === 'interested_franchisor' ||
          match.status === 'mutual_interest' ||
          match.status === 'matched';
        return belongsToUser && isInterestFlow;
      }),
    [matches, isFranchisee, currentUser?.id],
  );

  const interestedIdSet = useMemo(() => {
    return new Set(
      userInterestedMatches.map((match) => (isFranchisee ? match.franchisorId : match.franchiseeId)),
    );
  }, [userInterestedMatches, isFranchisee]);

  const filteredData = data.filter((item) => {
    const term = searchQuery.toLowerCase();
    if (isFranchisee) {
      const liveItem = item as LiveFranchisorMatch;
      return liveItem.companyName.toLowerCase().includes(term);
    }
    const franchiseeItem = item as RealtimeFranchiseeCard;
    return franchiseeItem.name.toLowerCase().includes(term);
  });

  const handleInterest = (id: string) => {
    if (interestedIdSet.has(id)) {
      toast.info('You have already expressed interest in this match');
      return;
    }

    const selected = data.find((item) => item.id === id);

    const match: Match = {
      id: `match_${Date.now()}`,
      franchiseeId: isFranchisee ? currentUser?.id || '' : id,
      franchisorId: isFranchisee ? id : currentUser?.id || '',
      franchiseeName: isFranchisee
        ? currentUser?.personalInfo?.firstName || ''
        : (selected as RealtimeFranchiseeCard)?.name || '',
      franchisorName: isFranchisee
        ? (selected as LiveFranchisorMatch)?.companyName || ''
        : currentUser?.personalInfo?.firstName || '',
      franchiseeCompany: '',
      franchisorCompany: isFranchisee ? (selected as LiveFranchisorMatch)?.companyName || '' : '',
      matchScore: (selected as LiveFranchisorMatch)?.matchScore || (selected as RealtimeFranchiseeCard)?.matchScore || 0,
      status: (isFranchisee ? 'interested_franchisee' : 'interested_franchisor') as Match['status'],
      createdAt: new Date().toISOString(),
    };

    addMatch(match);
    toast.success('Interest expressed! Redirecting to detailed form...');

    setTimeout(() => {
      navigate(`/ml-match/${match.id}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <header className="bg-[#0e0e0e] border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#d2a855] to-[#a88644] rounded-lg flex items-center justify-center">
                <Handshake className="w-5 h-5 text-[#141414]" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Franchise</span>
                <span className="text-xl font-bold text-[#d2a855]">It</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="text-white/60 hover:text-white transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isFranchisee ? 'Live Franchise Matches' : 'Discover Qualified Franchisees'}
            </h1>
            <p className="text-white/60">
              {isFranchisee
                ? 'These recommendations are fetched from the Python matching API.'
                : 'This list uses a realtime Firestore listener on franchisee records.'}
            </p>
          </div>

          {isFranchisee && (
            <Button
              onClick={() => void loadLiveMatches()}
              disabled={isLoadingMatches}
              className="bg-[#1d1d1d] border border-white/15 text-white hover:bg-[#2a2a2a]"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {isLoadingMatches ? 'Refreshing...' : 'Refresh Matches'}
            </Button>
          )}
        </div>

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
                {userInterestedMatches.length}
              </span>
            </span>
          </button>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isFranchisee ? 'Search by brand name...' : 'Search by franchisee name...'}
            className="w-full pl-10 pr-4 py-3 bg-[#0e0e0e] border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#d2a855]"
          />
        </div>

        {activeTab === 'matches' ? (
          <>
            {isFranchisee && fetchError && (
              <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm">
                {fetchError}
              </div>
            )}

            {datasetError && (
              <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm">
                {datasetError}
              </div>
            )}

            {isLoadingMatches || (!isFranchisee && isRealtimeLoading) ? (
              <div className="text-white/60">Loading live matches...</div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-16 text-white/60">
                No matches found. Try refreshing or adjusting your search.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((item) => {
                  const id = item.id;
                  const isInterested = interestedIdSet.has(id);

                  return (
                    <div
                      key={id}
                      className="bg-[#0e0e0e] border border-white/10 rounded-2xl overflow-hidden hover:border-[#d2a855]/30 transition-all"
                    >
                      <div className="p-6 border-b border-white/5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#d2a855]/20 to-[#a88644]/20 rounded-xl flex items-center justify-center">
                              <Briefcase className="w-5 h-5 text-[#d2a855]" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {isFranchisee
                                  ? (item as LiveFranchisorMatch).companyName
                                  : (item as RealtimeFranchiseeCard).name}
                              </h3>
                              <p className="text-sm text-white/50">
                                {isFranchisee
                                  ? (item as LiveFranchisorMatch).contactEmail
                                  : (item as RealtimeFranchiseeCard).location}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-[#d2a855]/10 px-2 py-1 rounded-lg">
                            <Star className="w-4 h-4 text-[#d2a855]" />
                            <span className="text-sm font-medium text-[#d2a855]">
                              {isFranchisee
                                ? (item as LiveFranchisorMatch).matchScore
                                : (item as RealtimeFranchiseeCard).matchScore}
                              %
                            </span>
                          </div>
                        </div>

                        {isFranchisee ? (
                          <div className="grid grid-cols-2 gap-2 text-xs text-white/65">
                            <span>Asset: {(item as LiveFranchisorMatch).assetMatchScore.toFixed(1)}</span>
                            <span>Investment: {(item as LiveFranchisorMatch).investmentScore.toFixed(1)}</span>
                            <span>Traits: {(item as LiveFranchisorMatch).traitScore.toFixed(1)}</span>
                            <span>Industry: {(item as LiveFranchisorMatch).industryScore.toFixed(1)}</span>
                          </div>
                        ) : (
                          <p className="text-sm text-white/60">
                            {(item as RealtimeFranchiseeCard).availableCapital}
                          </p>
                        )}
                      </div>

                      <div className="p-6">
                        {isFranchisee ? (
                          <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
                            <Mail className="w-4 h-4 text-[#d2a855]" />
                            Contact available after mutual interest
                          </div>
                        ) : (
                          <p className="text-sm text-white/60 mb-4">
                            {(item as RealtimeFranchiseeCard).experience}
                          </p>
                        )}

                        <Button
                          onClick={() => handleInterest(id)}
                          disabled={isInterested}
                          className={`w-full ${
                            isInterested
                              ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-[#d2a855] to-[#a88644] text-[#141414] hover:opacity-90'
                          }`}
                        >
                          {isInterested ? (
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
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            {userInterestedMatches.length === 0 ? (
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-[#1d1d1d] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Interested Matches Yet</h3>
                <p className="text-white/60 mb-6">Browse matches and express interest to track them here.</p>
                <Button
                  onClick={() => setActiveTab('matches')}
                  className="bg-gradient-to-r from-[#d2a855] to-[#a88644] text-[#141414] hover:opacity-90"
                >
                  Browse Matches
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4 text-left">
                {userInterestedMatches.map((match) => {
                  const companyName = isFranchisee ? match.franchisorName : match.franchiseeName;
                  const statusLabel =
                    match.status === 'mutual_interest' || match.status === 'matched'
                      ? 'Quiz Completed'
                      : 'Interest Expressed';
                  const statusClass =
                    match.status === 'mutual_interest' || match.status === 'matched'
                      ? 'text-green-400 bg-green-500/10 border-green-500/30'
                      : 'text-blue-300 bg-blue-500/10 border-blue-500/30';

                  return (
                    <div key={match.id} className="bg-[#0e0e0e] border border-white/10 rounded-xl p-5">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="text-white font-medium">{companyName || 'Company'}</p>
                        <span className={`text-xs px-2 py-1 rounded-full border ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <p className="text-sm text-white/60">
                        Match Score: <span className="text-[#d2a855]">{match.matchScore}%</span>
                      </p>
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
