
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader,
  ArrowRight,
  Shield,
  Star,
  Users,
  MapPin,
  BookOpen
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import toast from 'react-hot-toast';

const ROLE_CONFIG = [
  {
    value: 'traveller',
    label: 'Traveller',
    description: 'Discover and book amazing experiences',
    icon: MapPin,
    color: 'blue',
    features: ['Book experiences', 'Save favorites', 'Write reviews', 'Track bookings']
  },
  {
    value: 'guide',
    label: 'Tour Guide',
    description: 'Share your local expertise and culture',
    icon: Users,
    color: 'green',
    features: ['Create tours', 'Manage bookings', 'Earn money', 'Build reputation']
  },
  {
    value: 'instructor',
    label: 'Activity Instructor',
    description: 'Teach skills and unique activities',
    icon: Star,
    color: 'purple',
    features: ['Host activities', 'Share expertise', 'Flexible schedule', 'Grow income']
  },
  {
    value: 'advisor',
    label: 'Business Advisor',
    description: 'Promote your business and services',
    icon: BookOpen,
    color: 'orange',
    features: ['Business profile', 'Marketing tools', 'Analytics', 'Lead generation']
  }
];

// Static Tailwind maps (avoid dynamic class strings that JIT may purge)
const THEME = {
  blue:   { border: 'border-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/20',     iconBg: 'bg-blue-500',   text: 'text-blue-500',   dotBg: 'bg-blue-500' },
  green:  { border: 'border-green-500',  bg: 'bg-green-50 dark:bg-green-900/20',   iconBg: 'bg-green-500',  text: 'text-green-500',  dotBg: 'bg-green-500' },
  purple: { border: 'border-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', iconBg: 'bg-purple-500', text: 'text-purple-500', dotBg: 'bg-purple-500' },
  orange: { border: 'border-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', iconBg: 'bg-orange-500', text: 'text-orange-500', dotBg: 'bg-orange-500' }
};

// Safe patterned background (inline style to avoid parser issues)
const SIGNUP_BG_SVG =
  `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="#ffffff" fill-opacity="0.1"><circle cx="30" cy="30" r="4"/></g></g></svg>`;
const SIGNUP_BG_URL = `url("data:image/svg+xml,${encodeURIComponent(SIGNUP_BG_SVG)}")`;

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signup, isLoading } = useAuthStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: searchParams.get('role') || 'traveller',
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const calculateStrength = (password) => {
      let strength = 0;
      if (password.length >= 8) strength += 1;
      if (/[a-z]/.test(password)) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      return strength;
    };
    setPasswordStrength(calculateStrength(formData.password));
  }, [formData.password]);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Name can only contain letters and spaces';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      case 'agreeToTerms':
        if (!value) return 'You must agree to the Terms of Service';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, fieldValue) }));
    }

    if (name === 'password' && touched.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: validateField('confirmPassword', formData.confirmPassword)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.role) {
        toast.error('Please select your role');
        return;
      }
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const fieldsToValidate = ['name', 'email', 'password', 'confirmPassword', 'agreeToTerms'];
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      agreeToTerms: true
    });

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please correct the errors below');
      return;
    }

    try {
      const result = await signup({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.role
      });

     if (result.success) {
  toast.success(`Welcome to TourGuide, ${result.user.name}!`);
  const role = result.user.role;
  switch (role) {
    case "admin":
      navigate("/dashboard/admin");
      break;
    case "advisor":
      navigate("/dashboard/advisor");
      break;
    case "guide":
      navigate("/dashboard/guide");
      break;
    case "instructor":
      navigate("/dashboard/instructor");
      break;
    case "traveller":
    default:
      navigate("/"); // homepage only
      break;
  }
}
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'Weak';
      case 2:
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return 'Weak';
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'bg-red-500';
      case 2:
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Choose Your Role
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Tell us how you&apos;d like to use TourGuide
        </p>
      </div>

      <div className="grid gap-3">
        {ROLE_CONFIG.map((role) => {
          const Icon = role.icon;
          const isSelected = formData.role === role.value;
          const theme = THEME[role.color];

          return (
            <div
              key={role.value}
              onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
              className={`relative cursor-pointer rounded-xl border-2 p-4 sm:p-5 transition-all hover:shadow-md ${
                isSelected
                  ? `${theme.border} ${theme.bg}`
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected ? theme.iconBg : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                </div>

                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-0.5">
                    {role.label}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2">
                    {role.description}
                  </p>

                  <div className="grid grid-cols-2 gap-1.5">
                    {role.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">
                        <CheckCircle className={`h-3 w-3 mr-1 ${isSelected ? theme.text : 'text-gray-400'}`} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? theme.border : 'border-gray-300'
                  } bg-white`}
                >
                  {isSelected && <div className={`w-2 h-2 rounded-full ${theme.dotBg}`} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
        size="lg"
        disabled={!formData.role}
      >
        Continue
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Create Your Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Join as a {ROLE_CONFIG.find(r => r.value === formData.role)?.label}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`bg-white w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
                dark:bg-gray-800 dark:text-white transition-colors ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>
          {errors.name && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              {errors.name}
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`bg-white w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
                dark:bg-gray-800 dark:text-white transition-colors ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              {errors.email}
            </div>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`bg-white w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
                dark:bg-gray-800 dark:text-white transition-colors ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              placeholder="Create a strong password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Password strength: {getPasswordStrengthLabel()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {errors.password && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              {errors.password}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`bg-white w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
                dark:bg-gray-800 dark:text-white transition-colors ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={isLoading}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              {errors.confirmPassword}
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="space-y-3">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className={`bg-white mt-0.5 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${
                errors.agreeToTerms ? 'border-red-500' : ''
              }`}
              disabled={isLoading}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-500 font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500 font-medium">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agreeToTerms && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              {errors.agreeToTerms}
            </div>
          )}

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              id="agreeToMarketing"
              name="agreeToMarketing"
              type="checkbox"
              checked={formData.agreeToMarketing}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I&apos;d like to receive marketing updates and special offers (optional)
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button type="button" variant="outline" onClick={handleBack} className="flex-1" disabled={isLoading}>
            Back
          </Button>

          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
            loading={isLoading}
            disabled={isLoading || Object.keys(errors).some(key => errors[key]) || !formData.agreeToTerms}
          >
            {isLoading ? (
              <>
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    // One unified scroll. Left column slightly narrower (5/12) on lg+.
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: a bit smaller */}
          <div className="lg:col-span-5">
            <div className="w-full space-y-6">
              {/* Header */}
              <div className="text-center">
                <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
                  <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <span className="text-white font-bold text-lg">TG</span>
                  </div>
                  <span className="font-bold text-2xl text-gray-900 dark:text-white">TourGuide</span>
                </Link>

                {/* Progress (compact) */}
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                    step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>1</div>
                  <div className={`w-10 h-0.5 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                    step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>2</div>
                </div>
              </div>

              {/* Card */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 sm:p-7">
                  {step === 1 ? renderStep1() : renderStep2()}
                </CardContent>
              </Card>

              {/* Sign In */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link to="/auth/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Sign in here
                  </Link>
                </p>
              </div>

              {/* Security */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    SSL Encrypted
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Secure Signup
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: a bit wider, no sticky, scrolls together with left */}
          <div className="hidden lg:block lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden h-full min-h-[520px]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-blue-800" />
              <div className="absolute inset-0 bg-black/20" />
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: SIGNUP_BG_URL,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '60px 60px',
                  backgroundPosition: 'center'
                }}
              />
              <div className="relative z-10 h-full flex items-center justify-center p-10">
                <div className="text-center text-white max-w-xl">
                  {formData.role ? (
                    (() => {
                      const role = ROLE_CONFIG.find(r => r.value === formData.role);
                      const Icon = role?.icon || Users;
                      return (
                        <>
                          <Icon className="h-20 w-20 mx-auto mb-6 opacity-90" />
                          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Join as a {role?.label}
                          </h2>
                          <p className="text-lg sm:text-xl opacity-90 mb-6">
                            {role?.description}
                          </p>
                          <div className="space-y-3 text-left mx-auto w-full max-w-md">
                            {role?.features.map((feature, index) => (
                              <div key={index} className="flex items-center">
                                <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <>
                      <Users className="h-20 w-20 mx-auto mb-6 opacity-90" />
                      <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Start your journey with us
                      </h2>
                      <p className="text-lg sm:text-xl opacity-90 mb-6">
                        Join our community of travelers, guides, and experience creators
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* /Right */}
        </div>
      </div>
    </div>
  );
};

export default Signup;
