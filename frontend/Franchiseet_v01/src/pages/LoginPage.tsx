// At the top, add these imports:
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Briefcase, 
  Building2, 
  ArrowRight, 
  ArrowLeft, 
  Mail, 
  Lock,
  Handshake,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setCurrentUser, setAuthenticated, setFirstVisit } = useStore();
  const [role, setRole] = useState<'franchisee' | 'franchisor' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => { 

  console.log('handleLogin called'); // ADD THIS FIRST LINE
  

  if (!role) {
    toast.error('Please select your role');
    return;
  }
  if (!email || !password) {
    toast.error('Please enter email and password');
    return;
  }

   console.log('Attempting Firebase login with:', email);
  setIsLoading(true);

  try {
    console.log('Calling signInWithEmailAndPassword...'); // ADD THIS
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Firebase success:', userCredential.user); // ADD THIS
    const firebaseUser = userCredential.user;

    const user = {
      id: firebaseUser.uid,
      role,
      personalInfo: {
        firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
        lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
        email: firebaseUser.email || email,
        phone: firebaseUser.phoneNumber || '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
      },
      isProfileComplete: false,
    };

    setCurrentUser(user as any);
    setAuthenticated(true);
    setFirstVisit(false);
    toast.success('Welcome back!');
    navigate('/dashboard');
  } catch (error: any) {
  console.log('Firebase error code:', error.code); // ADD THIS
  console.log('Firebase error message:', error.message); // ADD THIS
  
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-email': 'Invalid email address',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/invalid-credential': 'Invalid email or password',
  };
  toast.error(errorMessages[error.code] || 'Login failed. Please try again.');
}finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl">
        {/* Logo */}
        <button
  onClick={() => navigate('/home')}
  className="flex items-center justify-center gap-2 mb-12 cursor-pointer hover:opacity-80 transition-opacity"
>
  <div className="w-10 h-10 bg-gradient-to-br from-[#d2a855] to-[#a88644] rounded-lg flex items-center justify-center">
    <Handshake className="w-5 h-5 text-[#141414]" />
  </div>
  <div>
    <span className="text-xl font-bold text-white">Franchise</span>
    <span className="text-xl font-bold text-[#d2a855]">Match</span>
  </div>
</button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Role Selection */}
          <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-white/60 mb-8">Select your role to continue</p>

            <div className="space-y-4">
              <button
                onClick={() => setRole('franchisee')}
                className={`w-full p-6 border rounded-xl text-left transition-all ${
                  role === 'franchisee'
                    ? 'border-[#d2a855] bg-[#d2a855]/10'
                    : 'border-white/10 bg-[#1d1d1d] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    role === 'franchisee' ? 'bg-[#d2a855]' : 'bg-white/10'
                  }`}>
                    <Briefcase className={`w-6 h-6 ${role === 'franchisee' ? 'text-[#141414]' : 'text-white'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">I am a Franchisee</h3>
                    <p className="text-sm text-white/50">Looking for franchise opportunities</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setRole('franchisor')}
                className={`w-full p-6 border rounded-xl text-left transition-all ${
                  role === 'franchisor'
                    ? 'border-[#d2a855] bg-[#d2a855]/10'
                    : 'border-white/10 bg-[#1d1d1d] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    role === 'franchisor' ? 'bg-[#d2a855]' : 'bg-white/10'
                  }`}>
                    <Building2 className={`w-6 h-6 ${role === 'franchisor' ? 'text-[#141414]' : 'text-white'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">I am a Franchisor</h3>
                    <p className="text-sm text-white/50">Looking to expand my brand</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-white/60 text-sm mb-4">Don't have an account?</p>
              <Button
                variant="outline"
                onClick={() => navigate('/signup')}
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Create Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-8">
  <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Login</h2>
                <p className="text-white/60">Enter your credentials to access your account</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="pl-10 bg-[#1d1d1d] border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-[#1d1d1d] border-white/10 text-white placeholder:text-white/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-white/30 bg-[#1d1d1d] text-[#d2a855]" />
                    <span className="text-sm text-white/60">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-[#d2a855] hover:underline">
                    Forgot password?
                  </button>
                </div>
              </div>

              <Button
  type="button"
  onClick={handleLogin}
  disabled={isLoading}
  className="w-full bg-gradient-to-r from-[#d2a855] to-[#a88644] text-[#141414] hover:opacity-90 py-6"
>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Login
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-[#1d1d1d] rounded-lg">
              <p className="text-xs text-white/40 mb-2">Demo Credentials:</p>
              <p className="text-xs text-white/60">Email: demo@example.com</p>
              <p className="text-xs text-white/60">Password: password123</p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white mx-auto mt-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
