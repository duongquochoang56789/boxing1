import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Dumbbell, Clock, LogOut, User, ChevronRight, ArrowUpRight, TrendingUp, Target, Flame } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  full_name: string;
  avatar_url: string | null;
}

interface UpcomingClass {
  id: string;
  start_time: string;
  class_name: string;
  trainer_name: string;
}

interface UpcomingPT {
  id: string;
  start_time: string;
  trainer_name: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Dashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [upcomingPT, setUpcomingPT] = useState<UpcomingPT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('user_id', user!.id)
        .maybeSingle();
      if (profileData) setProfile(profileData);

      const { data: classRegs } = await supabase
        .from('class_registrations')
        .select(`id, class_schedules (id, start_time, group_classes (name), trainers (name))`)
        .eq('user_id', user!.id)
        .eq('status', 'registered')
        .gte('class_schedules.start_time', new Date().toISOString())
        .order('class_schedules(start_time)', { ascending: true })
        .limit(3);
      if (classRegs) {
        setUpcomingClasses(classRegs.filter((r: any) => r.class_schedules).map((r: any) => ({
          id: r.id, start_time: r.class_schedules.start_time,
          class_name: r.class_schedules.group_classes?.name || 'N/A',
          trainer_name: r.class_schedules.trainers?.name || 'N/A',
        })));
      }

      const { data: ptSessions } = await supabase
        .from('pt_sessions')
        .select(`id, start_time, trainers (name)`)
        .eq('user_id', user!.id)
        .in('status', ['booked', 'confirmed'])
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(3);
      if (ptSessions) {
        setUpcomingPT(ptSessions.map((s: any) => ({
          id: s.id, start_time: s.start_time, trainer_name: s.trainers?.name || 'N/A',
        })));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const quickLinks = [
    { title: 'Lịch lớp học nhóm', description: 'Xem và đăng ký các lớp học', icon: Users, href: '/schedule' },
    { title: 'Đặt lịch PT', description: 'Đặt buổi tập với huấn luyện viên', icon: Dumbbell, href: '/book-pt' },
    { title: 'Lịch sử tập luyện', description: 'Xem các buổi tập đã hoàn thành', icon: Clock, href: '/history' },
    { title: 'Hồ sơ cá nhân', description: 'Cập nhật thông tin của bạn', icon: User, href: '/profile' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-30">
          <div className="container-custom py-4 flex items-center justify-between">
            <div className="h-6 w-32 shimmer rounded" />
            <div className="h-8 w-24 shimmer rounded" />
          </div>
        </header>
        <main className="container-custom py-10">
          <div className="mb-12">
            <div className="h-4 w-24 shimmer rounded mb-4" />
            <div className="h-12 w-72 shimmer rounded mb-3" />
            <div className="h-5 w-48 shimmer rounded" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-7 bg-background border border-border/50">
                <div className="w-12 h-12 shimmer rounded mb-5" />
                <div className="h-5 w-3/4 shimmer rounded mb-2" />
                <div className="h-4 w-full shimmer rounded" />
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-background border border-border/50 p-8">
                <div className="h-6 w-48 shimmer rounded mb-6" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="p-4 bg-cream border border-border/30">
                      <div className="h-4 w-2/3 shimmer rounded mb-2" />
                      <div className="h-3 w-1/2 shimmer rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-30">
        <div className="container-custom py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-semibold tracking-tight text-charcoal">
            ELITE<span className="text-terracotta">FIT</span>
          </Link>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="rounded-none border-border/50 text-label hover:border-terracotta hover:text-terracotta">
                  Admin
                </Button>
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={signOut}
              className="text-soft-brown hover:text-terracotta transition-colors duration-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="text-label">Đăng xuất</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container-custom py-10">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <span className="text-label text-terracotta block mb-3">Dashboard</span>
          <h1 className="heading-section text-charcoal">
            Xin chào, <span className="text-terracotta">{profile?.full_name || 'Thành viên'}</span>
          </h1>
          <p className="text-body text-soft-brown mt-3">
            Hôm nay bạn muốn tập luyện gì?
          </p>
        </motion.div>

        {/* Animated Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          <AnimatedCounter
            end={upcomingClasses.length + upcomingPT.length}
            label="Buổi tập sắp tới"
            icon={<Calendar className="w-6 h-6 text-terracotta" />}
            duration={1.5}
          />
          <AnimatedCounter
            end={upcomingClasses.length}
            label="Lớp học đã đăng ký"
            icon={<Users className="w-6 h-6 text-terracotta" />}
            duration={1.5}
          />
          <AnimatedCounter
            end={upcomingPT.length}
            label="Buổi PT đã đặt"
            icon={<Target className="w-6 h-6 text-terracotta" />}
            duration={1.5}
          />
          <AnimatedCounter
            end={7}
            label="Chuỗi ngày tập"
            suffix=" ngày"
            icon={<Flame className="w-6 h-6 text-terracotta" />}
            duration={1.5}
          />
        </motion.div>

        {/* Quick Links */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
        >
          {quickLinks.map((link) => (
            <motion.div key={link.href} variants={itemVariants}>
              <Link
                to={link.href}
                className="group block p-7 bg-background border border-border/50 hover:border-terracotta/50 hover:shadow-xl hover:shadow-terracotta/5 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 bg-terracotta/10 flex items-center justify-center group-hover:bg-terracotta/20 transition-colors duration-300">
                    <link.icon className="w-6 h-6 text-terracotta" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-terracotta transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="font-display text-lg font-medium text-charcoal mb-1 group-hover:text-terracotta transition-colors duration-300">
                  {link.title}
                </h3>
                <p className="text-body-sm text-soft-brown">{link.description}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Upcoming Classes */}
          <motion.div variants={itemVariants} className="bg-background border border-border/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-medium text-charcoal flex items-center gap-3">
                <div className="w-10 h-10 bg-terracotta/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-terracotta" />
                </div>
                Lớp học sắp tới
              </h2>
              <Link to="/schedule" className="text-terracotta text-label hover:text-terracotta/80 flex items-center gap-1 link-underline transition-colors duration-300">
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {upcomingClasses.length > 0 ? (
              <div className="space-y-3">
                {upcomingClasses.map((cls, i) => (
                  <motion.div 
                    key={cls.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 bg-cream border border-border/30 hover:border-terracotta/30 transition-colors duration-300"
                  >
                    <div>
                      <p className="font-display font-medium text-charcoal">{cls.class_name}</p>
                      <p className="text-body-sm text-soft-brown mt-1">
                        {cls.trainer_name} • {formatDateTime(cls.start_time)}
                      </p>
                    </div>
                    <Users className="w-5 h-5 text-terracotta/40" />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-soft-brown mb-3">Chưa có lớp học nào</p>
                <Link to="/schedule" className="text-terracotta text-label link-underline">
                  Đăng ký ngay
                </Link>
              </div>
            )}
          </motion.div>

          {/* Upcoming PT */}
          <motion.div variants={itemVariants} className="bg-background border border-border/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-medium text-charcoal flex items-center gap-3">
                <div className="w-10 h-10 bg-terracotta/10 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-terracotta" />
                </div>
                Buổi PT sắp tới
              </h2>
              <Link to="/book-pt" className="text-terracotta text-label hover:text-terracotta/80 flex items-center gap-1 link-underline transition-colors duration-300">
                Đặt lịch <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {upcomingPT.length > 0 ? (
              <div className="space-y-3">
                {upcomingPT.map((session, i) => (
                  <motion.div 
                    key={session.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 bg-cream border border-border/30 hover:border-terracotta/30 transition-colors duration-300"
                  >
                    <div>
                      <p className="font-display font-medium text-charcoal">Buổi tập cá nhân</p>
                      <p className="text-body-sm text-soft-brown mt-1">
                        {session.trainer_name} • {formatDateTime(session.start_time)}
                      </p>
                    </div>
                    <Dumbbell className="w-5 h-5 text-terracotta/40" />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Dumbbell className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-soft-brown mb-3">Chưa có buổi PT nào</p>
                <Link to="/book-pt" className="text-terracotta text-label link-underline">
                  Đặt lịch ngay
                </Link>
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
