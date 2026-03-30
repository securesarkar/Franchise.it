import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  ArrowLeft, 
  Brain,
  CheckCircle2,
  Handshake,
  BarChart3,
  Lightbulb,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

const MLMatchForm = () => {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const { currentUser, updateMatchStatus } = useStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFranchisee = currentUser?.role === 'franchisee';

  // Franchisee specific questions
  const [franchiseeData, setFranchiseeData] = useState({
    expansionTimeline: '',
    expectedROI: '',
    operationalInvolvement: '',
    previousExperience: '',
    growthExpectations: '',
    brandAlignment: '',
    localMarketKnowledge: '',
    customerAcquisitionStrategy: '',
  });

  // Franchisor specific questions
  const [franchisorData, setFranchisorData] = useState({
    franchiseeProfile: '',
    expansionPriority: '',
    supportCommitment: '',
    qualityExpectations: '',
    performanceMetrics: '',
    territoryExclusivity: '',
    trainingIntensity: '',
    ongoingEngagement: '',
  });

  const franchiseeQuestions = [
    {
      id: 'expansionTimeline',
      question: 'What is your preferred timeline for opening the franchise?',
      options: [
        { value: 'immediate', label: 'Immediate (within 3 months)' },
        { value: 'short', label: 'Short-term (3-6 months)' },
        { value: 'medium', label: 'Medium-term (6-12 months)' },
        { value: 'long', label: 'Long-term (12+ months)' },
      ]
    },
    {
      id: 'expectedROI',
      question: 'What is your expected Return on Investment timeline?',
      options: [
        { value: '1year', label: 'Within 1 year' },
        { value: '2years', label: '1-2 years' },
        { value: '3years', label: '2-3 years' },
        { value: '3plus', label: '3+ years' },
      ]
    },
    {
      id: 'operationalInvolvement',
      question: 'How involved do you plan to be in day-to-day operations?',
      options: [
        { value: 'fulltime', label: 'Full-time hands-on' },
        { value: 'parttime', label: 'Part-time with manager' },
        { value: 'passive', label: 'Passive with hired team' },
        { value: 'hybrid', label: 'Hybrid approach' },
      ]
    },
    {
      id: 'previousExperience',
      question: 'Rate your previous business/franchise experience',
      options: [
        { value: 'extensive', label: 'Extensive (5+ years)' },
        { value: 'moderate', label: 'Moderate (2-5 years)' },
        { value: 'limited', label: 'Limited (1-2 years)' },
        { value: 'none', label: 'No prior experience' },
      ]
    },
    {
      id: 'growthExpectations',
      question: 'What are your growth expectations for the first 3 years?',
      options: [
        { value: 'aggressive', label: 'Aggressive - Multiple outlets' },
        { value: 'steady', label: 'Steady - Single outlet optimization' },
        { value: 'conservative', label: 'Conservative - Learn and grow' },
        { value: 'exploratory', label: 'Exploratory - See how it goes' },
      ]
    },
    {
      id: 'brandAlignment',
      question: 'How well do you align with the brand values and vision?',
      options: [
        { value: 'complete', label: 'Complete alignment' },
        { value: 'strong', label: 'Strong alignment' },
        { value: 'moderate', label: 'Moderate alignment' },
        { value: 'learning', label: 'Still learning about the brand' },
      ]
    },
    {
      id: 'localMarketKnowledge',
      question: 'Rate your knowledge of the local market',
      options: [
        { value: 'expert', label: 'Expert - Deep local insights' },
        { value: 'good', label: 'Good - Understand the market' },
        { value: 'basic', label: 'Basic - Some knowledge' },
        { value: 'limited', label: 'Limited - Need guidance' },
      ]
    },
    {
      id: 'customerAcquisitionStrategy',
      question: 'What is your approach to customer acquisition?',
      options: [
        { value: 'digital', label: 'Digital-first marketing' },
        { value: 'traditional', label: 'Traditional marketing' },
        { value: 'hybrid', label: 'Hybrid approach' },
        { value: 'brandled', label: 'Rely on brand marketing' },
      ]
    },
  ];

  const franchisorQuestions = [
    {
      id: 'franchiseeProfile',
      question: 'What type of franchisee are you looking for?',
      options: [
        { value: 'experienced', label: 'Experienced multi-unit operator' },
        { value: 'entrepreneur', label: 'First-time entrepreneur' },
        { value: 'careerchange', label: 'Career change professional' },
        { value: 'investor', label: 'Pure investor' },
      ]
    },
    {
      id: 'expansionPriority',
      question: 'What is your current expansion priority?',
      options: [
        { value: 'aggressive', label: 'Aggressive national expansion' },
        { value: 'strategic', label: 'Strategic city-wise expansion' },
        { value: 'selective', label: 'Selective quality-focused growth' },
        { value: 'maintain', label: 'Maintain current footprint' },
      ]
    },
    {
      id: 'supportCommitment',
      question: 'How much support can you commit to new franchisees?',
      options: [
        { value: 'comprehensive', label: 'Comprehensive - Full handholding' },
        { value: 'standard', label: 'Standard - Regular support' },
        { value: 'limited', label: 'Limited - Basic support only' },
        { value: 'selfserve', label: 'Self-service - Training provided' },
      ]
    },
    {
      id: 'qualityExpectations',
      question: 'What are your quality and performance expectations?',
      options: [
        { value: 'exceptional', label: 'Exceptional - Top 10% performance' },
        { value: 'high', label: 'High - Above average' },
        { value: 'standard', label: 'Standard - Meet benchmarks' },
        { value: 'flexible', label: 'Flexible - Room for learning' },
      ]
    },
    {
      id: 'performanceMetrics',
      question: 'How do you measure franchisee success?',
      options: [
        { value: 'revenue', label: 'Revenue-focused' },
        { value: 'profitability', label: 'Profitability-focused' },
        { value: 'balanced', label: 'Balanced scorecard' },
        { value: 'growth', label: 'Growth and expansion' },
      ]
    },
    {
      id: 'territoryExclusivity',
      question: 'What is your territory policy?',
      options: [
        { value: 'exclusive', label: 'Exclusive territory protection' },
        { value: 'protected', label: 'Protected radius' },
        { value: 'flexible', label: 'Flexible based on performance' },
        { value: 'open', label: 'Open territory' },
      ]
    },
    {
      id: 'trainingIntensity',
      question: 'What training intensity do you provide?',
      options: [
        { value: 'intensive', label: 'Intensive (4+ weeks)' },
        { value: 'standard', label: 'Standard (2-4 weeks)' },
        { value: 'condensed', label: 'Condensed (1-2 weeks)' },
        { value: 'ongoing', label: 'Ongoing as needed' },
      ]
    },
    {
      id: 'ongoingEngagement',
      question: 'How do you engage with franchisees post-launch?',
      options: [
        { value: 'frequent', label: 'Frequent check-ins and visits' },
        { value: 'regular', label: 'Regular scheduled reviews' },
        { value: 'asneeded', label: 'As-needed basis' },
        { value: 'selfmanaged', label: 'Self-managed with support portal' },
      ]
    },
  ];

  const questions = isFranchisee ? franchiseeQuestions : franchisorQuestions;
  const data = isFranchisee ? franchiseeData : franchisorData;

  const handleNext = () => {
    const currentQuestion = questions[step - 1];
    if (!data[currentQuestion.id as keyof typeof data]) {
      toast.error('Please answer this question');
      return;
    }
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate ML processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update match status
    if (matchId) {
      updateMatchStatus(matchId, 'mutual_interest');
    }
    
    toast.success('ML analysis complete! Match compatibility calculated.');
    navigate('/dashboard');
  };

  const currentQuestion = questions[step - 1];

  return (
    <div className="min-h-screen bg-[#141414] py-12 px-4">
      <div className="max-w-3xl mx-auto">
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

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d2a855]/10 border border-[#d2a855]/20 rounded-full mb-4">
            <Brain className="w-4 h-4 text-[#d2a855]" />
            <span className="text-sm text-[#d2a855]">AI-Powered Matching</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Detailed Compatibility Assessment
          </h1>
          <p className="text-white/60">
            Help our ML model find the best match by answering these questions
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Question {step} of {questions.length}</span>
            <span className="text-[#d2a855] text-sm">{Math.round((step / questions.length) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-[#1d1d1d] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#d2a855] to-[#a88644] transition-all duration-300"
              style={{ width: `${(step / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">
              <span className="text-[#d2a855] mr-2">{step}.</span>
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                  data[currentQuestion.id as keyof typeof data] === option.value
                    ? 'bg-[#d2a855]/20 border-2 border-[#d2a855]'
                    : 'bg-[#1d1d1d] border-2 border-transparent hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option.value}
                  checked={data[currentQuestion.id as keyof typeof data] === option.value}
                  onChange={(e) => {
                if (isFranchisee) {
                  setFranchiseeData({ ...franchiseeData, [currentQuestion.id]: e.target.value });
                } else {
                  setFranchisorData({ ...franchisorData, [currentQuestion.id]: e.target.value });
                }
              }}
                  className="w-5 h-5 text-[#d2a855] border-white/30 focus:ring-[#d2a855]"
                />
                <span className="text-white/80">{option.label}</span>
              </label>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/10">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#d2a855] to-[#a88644] text-[#141414] hover:opacity-90"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : step === questions.length ? (
                <>
                  Complete Assessment
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next Question
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="p-4 bg-[#0e0e0e] border border-white/5 rounded-xl text-center">
            <BarChart3 className="w-6 h-6 text-[#d2a855] mx-auto mb-2" />
            <p className="text-xs text-white/50">50+ Parameters</p>
          </div>
          <div className="p-4 bg-[#0e0e0e] border border-white/5 rounded-xl text-center">
            <Lightbulb className="w-6 h-6 text-[#d2a855] mx-auto mb-2" />
            <p className="text-xs text-white/50">AI-Powered</p>
          </div>
          <div className="p-4 bg-[#0e0e0e] border border-white/5 rounded-xl text-center">
            <Clock className="w-6 h-6 text-[#d2a855] mx-auto mb-2" />
            <p className="text-xs text-white/50">Instant Results</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLMatchForm;
