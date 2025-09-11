// import { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { Eye, EyeOff } from 'lucide-react';
// import { useAuthStore } from '@/store/auth';
// import Button from '@/components/ui/Button';
// import { Card, CardContent } from '@/components/ui/Card';
// import toast from 'react-hot-toast';

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login, isLoading } = useAuthStore();
  
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   const from = location.state?.from?.pathname || '/dashboard';

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const result = await login(formData);
    
//     if (result.success) {
//       toast.success(`Welcome back, ${result.user.name}!`);
//       navigate(from, { replace: true });
//     } else {
//       toast.error(result.error);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <Link to="/" className="inline-flex items-center space-x-2 mb-6">
//             <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold">TG</span>
//             </div>
//             <span className="font-bold text-2xl text-gray-900 dark:text-white">TourGuide</span>
//           </Link>
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
//             Sign in to your account
//           </h2>
//           <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//             Or{' '}
//             <Link
//               to="/auth/signup"
//               className="font-medium text-primary-600 hover:text-primary-500"
//             >
//               create a new account
//             </Link>
//           </p>
//         </div>

//         <Card>
//           <CardContent className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Email address
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-white"
//                   placeholder="Enter your email"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Password
//                 </label>
//                 <div className="mt-1 relative">
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? 'text' : 'password'}
//                     required
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-white"
//                     placeholder="Enter your password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-5 w-5 text-gray-400" />
//                     ) : (
//                       <Eye className="h-5 w-5 text-gray-400" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <input
//                     id="remember-me"
//                     name="remember-me"
//                     type="checkbox"
//                     className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
//                     Remember me
//                   </label>
//                 </div>

//                 <div className="text-sm">
//                   <Link
//                     to="/auth/forgot-password"
//                     className="font-medium text-primary-600 hover:text-primary-500"
//                   >
//                     Forgot your password?
//                   </Link>
//                 </div>
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full"
//                 loading={isLoading}
//                 disabled={!formData.email || !formData.password}
//               >
//                 Sign in
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Login;








// update 2
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader,
  ArrowRight,
  Globe,
  Shield
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import toast from 'react-hot-toast';

// ---- bg pattern fix (avoid quotes in JSX attribute) ----
const LOGIN_BG_PATTERN_SVG =
  `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="#ffffff" fill-opacity="0.1"><circle cx="30" cy="30" r="4"/></g></g></svg>`;
const LOGIN_BG_PATTERN_URL = `url("data:image/svg+xml,${encodeURIComponent(LOGIN_BG_PATTERN_SVG)}")`;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const from = location.state?.from?.pathname || '/';

  // Validation
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      default:
        return '';
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, fieldValue) }));
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'rememberMe') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please correct the errors below');
      return;
    }

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });

     if (result.success) {
  toast.success(`Welcome back, ${result.user.name}!`);
  const role = result.user.role;
  switch (role) {
    case "admin":
      navigate('/dashboard/admin', { replace: true });
      break;
    case "advisor":
      navigate("/dashboard/advisor", { replace: true });
      break;
    case "guide":
      navigate("/dashboard/guide", { replace: true });
      break;
    case "instructor":
      navigate("/dashboard/instructor", { replace: true });
      break;
    case "traveller":
    default:
      navigate("/", { replace: true }); // homepage only
      break;
  }
}

    } catch (error) {
      console.error('Login error:', error);
      // Store/toast handles showing the error
    }
  };

  // Demo login function
  const handleDemoLogin = async (role = 'traveller') => {
    const demoCredentials = {
      traveller: { email: 'demo@traveller.com', password: 'demo123' },
      guide: { email: 'demo@guide.com', password: 'demo123' },
      instructor: { email: 'demo@instructor.com', password: 'demo123' }
    };

    setFormData(prev => ({ ...prev, ...demoCredentials[role] }));

    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 300);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-white font-bold text-xl">TG</span>
              </div>
              <span className="font-bold text-2xl text-gray-900 dark:text-white">TourGuide</span>
            </Link>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Sign in to continue your journey
            </p>
          </div>

          {/* Login Form */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                        dark:bg-gray-800 dark:text-white transition-colors
                        ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}`}
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
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`bg-white w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
                        dark:bg-gray-800 dark:text-white transition-colors
                        ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                      placeholder="Enter your password"
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
                  {errors.password && (
                    <div className="mt-1 flex items-center text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Remember / Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      disabled={isLoading}
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                  </label>

                  <Link
                    to="/auth/forgot-password"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                  size="lg"
                  loading={isLoading}
                  disabled={isLoading || Object.keys(errors).some(k => errors[k])}
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-5 w-5 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Demo Logins */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                      Or try demo accounts
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin('traveller')}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    Traveller
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin('guide')}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    Guide
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin('instructor')}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    Instructor
                  </Button>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account?{' '}
                  <Link
                    to="/auth/signup"
                    className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                  >
                    Create one now
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                SSL Encrypted
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Secure Login
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-blue-800">
          <div className="absolute inset-0 bg-black/20" />
          {/* Pattern layer using style (no JSX quote issues) */}
          <div
            className="absolute inset-0 opacity-30"
            style={{ backgroundImage: LOGIN_BG_PATTERN_URL }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full p-12">
          <div className="text-center text-white max-w-lg">
            <Globe className="h-24 w-24 mx-auto mb-8 opacity-90" />
            <h2 className="text-4xl font-bold mb-6">Welcome back to your adventure</h2>
            <p className="text-xl opacity-90 mb-8">
              Continue discovering amazing experiences with local guides around the world
            </p>

            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">1M+</div>
                <div className="text-sm opacity-80">Happy Travelers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm opacity-80">Expert Guides</div>
              </div>
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm opacity-80">Destinations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
