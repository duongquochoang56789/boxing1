import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Dumbbell, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

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

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            variant: 'destructive',
            title: 'Đăng nhập thất bại',
            description: error.message === 'Invalid login credentials' 
              ? 'Email hoặc mật khẩu không đúng' 
              : error.message,
          });
        } else {
          toast({
            title: 'Đăng nhập thành công',
            description: 'Chào mừng bạn trở lại!',
          });
          navigate('/dashboard');
        }
      } else {
        if (!fullName.trim()) {
          toast({
            variant: 'destructive',
            title: 'Lỗi',
            description: 'Vui lòng nhập họ tên',
          });
          setIsSubmitting(false);
          return;
        }
        
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({
            variant: 'destructive',
            title: 'Đăng ký thất bại',
            description: error.message,
          });
        } else {
          toast({
            title: 'Đăng ký thành công',
            description: 'Vui lòng kiểm tra email để xác nhận tài khoản.',
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 w-fit">
          <ArrowLeft className="w-4 h-4" />
          Về trang chủ
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto lg:mx-0"
        >
          <div className="flex items-center gap-3 mb-8">
            <Dumbbell className="w-8 h-8 text-accent" />
            <span className="font-display text-2xl font-semibold">ELITE FIT</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-medium mb-2">
            {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isLogin 
              ? 'Đăng nhập để quản lý lịch tập của bạn' 
              : 'Đăng ký để bắt đầu hành trình fitness'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                  Họ và tên
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="h-12 rounded-none border-border"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="h-12 rounded-none border-border"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-none border-border pr-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="btn-primary rounded-none w-full h-12"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
            </Button>
          </form>

          <p className="mt-6 text-center text-muted-foreground">
            {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-accent hover:underline font-medium"
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-secondary">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center">
            <h2 className="font-display text-4xl font-medium mb-4">
              Bắt đầu hành trình
              <br />
              <span className="text-accent">thay đổi bản thân</span>
            </h2>
            <p className="text-muted-foreground max-w-md">
              Đặt lịch tập luyện, theo dõi tiến trình và kết nối với huấn luyện viên chuyên nghiệp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
