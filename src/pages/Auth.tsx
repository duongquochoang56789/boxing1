import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { BrandedLoader } from '@/components/ui/branded-loader';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = window.location;
  const fromRoute = (history.state?.usr?.from?.pathname as string) || '/dashboard';

  useEffect(() => {
    if (!loading && user) {
      navigate(fromRoute, { replace: true });
    }
  }, [user, loading, navigate, fromRoute]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          const msg = error.message || '';
          let description = msg;
          if (msg.includes('Invalid login credentials')) {
            description = 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.';
          } else if (msg.includes('Email not confirmed')) {
            description = 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư.';
          } else if (msg.includes('rate') || msg.includes('too many')) {
            description = 'Quá nhiều lần thử. Vui lòng đợi 30 giây rồi thử lại.';
          } else if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed')) {
            description = 'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.';
          }
          toast({ variant: 'destructive', title: 'Đăng nhập thất bại', description });
        } else {
          toast({ title: 'Đăng nhập thành công', description: 'Chào mừng bạn trở lại!' });
          navigate(fromRoute, { replace: true });
        }
      } else {
        if (!fullName.trim()) {
          toast({ variant: 'destructive', title: 'Lỗi', description: 'Vui lòng nhập họ tên' });
          setIsSubmitting(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({ variant: 'destructive', title: 'Đăng ký thất bại', description: error.message });
        } else {
          toast({ title: 'Đăng ký thành công', description: 'Vui lòng kiểm tra email để xác nhận tài khoản.' });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <BrandedLoader message="Đang kiểm tra đăng nhập..." />;
  }

  const inputClasses = "h-14 px-5 rounded-none border-border/50 bg-background/50 focus:border-terracotta focus:ring-terracotta/20 transition-all duration-300 font-body";

  return (
    <div className="min-h-screen flex bg-cream">
      {/* Left - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-20 py-12 relative">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-peach/30 rounded-full blur-3xl pointer-events-none" />

        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-soft-brown hover:text-terracotta transition-colors duration-300 mb-12 w-fit relative z-10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-label">Về trang chủ</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md w-full mx-auto lg:mx-0 relative z-10"
        >
          <motion.a 
            href="/"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-display text-2xl font-semibold tracking-tight text-charcoal block mb-10"
          >
            FLY<span className="text-terracotta">FIT</span>
          </motion.a>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="heading-section text-charcoal mb-3">
                {isLogin ? 'Chào mừng\ntrở lại' : 'Tạo tài khoản'}
              </h1>
              <p className="text-body text-soft-brown mb-10">
                {isLogin 
                  ? 'Đăng nhập để quản lý lịch tập của bạn' 
                  : 'Đăng ký để bắt đầu hành trình fitness'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <label htmlFor="fullName" className="text-label text-soft-brown mb-2 block">
                      Họ và tên
                    </label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className={inputClasses}
                      required={!isLogin}
                    />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <label htmlFor="email" className="text-label text-soft-brown mb-2 block">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className={inputClasses}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <label htmlFor="password" className="text-label text-soft-brown mb-2 block">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`${inputClasses} pr-12`}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-soft-brown hover:text-terracotta transition-colors duration-300"
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={showPassword ? 'hide' : 'show'}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                  </div>
                </motion.div>

                <motion.div 
                  className="pt-2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <MagneticButton 
                    type="submit" 
                    className="btn-primary rounded-none w-full h-14 group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <>
                        {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </MagneticButton>
                </motion.div>
              </form>

              {isLogin && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <button
                    type="button"
                    onClick={async () => {
                      setIsSubmitting(true);
                      const demoEmail = 'admin@flyfit.vn';
                      const demoPassword = 'admin123';
                      setEmail(demoEmail);
                      setPassword(demoPassword);
                      const { error } = await signIn(demoEmail, demoPassword);
                      if (error) {
                        const msg = error.message || '';
                        let description = 'Tài khoản demo chưa được tạo hoặc mật khẩu đã thay đổi.';
                        if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed')) {
                          description = 'Lỗi kết nối mạng. Vui lòng kiểm tra internet.';
                        } else if (msg.includes('Invalid login credentials')) {
                          description = 'Sai thông tin đăng nhập demo. Mật khẩu có thể đã thay đổi.';
                        }
                        toast({ variant: 'destructive', title: 'Đăng nhập nhanh thất bại', description });
                      } else {
                        toast({ title: 'Đăng nhập thành công', description: 'Chào mừng Admin!' });
                        navigate(fromRoute, { replace: true });
                      }
                      setIsSubmitting(false);
                    }}
                    disabled={isSubmitting}
                    className="w-full h-12 border border-terracotta/30 text-terracotta hover:bg-terracotta/5 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium tracking-wide"
                  >
                    ⚡ Đăng nhập nhanh (Admin Demo)
                  </button>
                </motion.div>
              )}

              <div className="mt-8 pt-8 border-t border-border/50 text-center">
                <p className="text-body-sm text-soft-brown">
                  {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-terracotta hover:text-terracotta/80 font-medium link-underline transition-colors duration-300"
                  >
                    {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                  </button>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Right - Visual Panel */}
      <div className="hidden lg:block lg:w-[45%] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal/80 via-charcoal/60 to-terracotta/40" />
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h2 className="heading-section text-cream mb-4">
              Bắt đầu hành trình
              <br />
              <span className="text-terracotta-light">thay đổi bản thân</span>
            </h2>
            <p className="text-cream/70 text-body max-w-sm">
              Đặt lịch tập luyện, theo dõi tiến trình và kết nối với huấn luyện viên chuyên nghiệp.
            </p>
          </motion.div>

          {/* Decorative stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-12 mt-12 pt-8 border-t border-cream/20"
          >
            {[
              { value: "5K+", label: "Học viên" },
              { value: "20+", label: "HLV" },
              { value: "98%", label: "Hài lòng" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl text-cream font-medium">{stat.value}</div>
                <div className="text-label text-cream/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
