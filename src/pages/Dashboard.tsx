import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Dumbbell, Clock, LogOut, User, ChevronRight } from 'lucide-react';
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

const Dashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [upcomingPT, setUpcomingPT] = useState<UpcomingPT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('user_id', user!.id)
        .maybeSingle();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch upcoming class registrations
      const { data: classRegs } = await supabase
        .from('class_registrations')
        .select(`
          id,
          class_schedules (
            id,
            start_time,
            group_classes (name),
            trainers (name)
          )
        `)
        .eq('user_id', user!.id)
        .eq('status', 'registered')
        .gte('class_schedules.start_time', new Date().toISOString())
        .order('class_schedules(start_time)', { ascending: true })
        .limit(3);

      if (classRegs) {
        const formatted = classRegs
          .filter((r: any) => r.class_schedules)
          .map((r: any) => ({
            id: r.id,
            start_time: r.class_schedules.start_time,
            class_name: r.class_schedules.group_classes?.name || 'N/A',
            trainer_name: r.class_schedules.trainers?.name || 'N/A',
          }));
        setUpcomingClasses(formatted);
      }

      // Fetch upcoming PT sessions
      const { data: ptSessions } = await supabase
        .from('pt_sessions')
        .select(`
          id,
          start_time,
          trainers (name)
        `)
        .eq('user_id', user!.id)
        .in('status', ['booked', 'confirmed'])
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(3);

      if (ptSessions) {
        const formatted = ptSessions.map((s: any) => ({
          id: s.id,
          start_time: s.start_time,
          trainer_name: s.trainers?.name || 'N/A',
        }));
        setUpcomingPT(formatted);
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
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const quickLinks = [
    {
      title: 'Lịch lớp học nhóm',
      description: 'Xem và đăng ký các lớp học',
      icon: Users,
      href: '/schedule',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Đặt lịch PT',
      description: 'Đặt buổi tập với huấn luyện viên',
      icon: Dumbbell,
      href: '/book-pt',
      color: 'bg-accent/10 text-accent',
    },
    {
      title: 'Lịch sử tập luyện',
      description: 'Xem các buổi tập đã hoàn thành',
      icon: Clock,
      href: '/history',
      color: 'bg-green-500/10 text-green-500',
    },
    {
      title: 'Hồ sơ cá nhân',
      description: 'Cập nhật thông tin của bạn',
      icon: User,
      href: '/profile',
      color: 'bg-purple-500/10 text-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-secondary/30">
        <div className="container-custom py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-accent" />
            <span className="font-display text-xl font-semibold">ELITE FIT</span>
          </Link>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="rounded-none">
                  Admin Panel
                </Button>
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={signOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-medium">
            Xin chào, <span className="text-accent">{profile?.full_name || 'Thành viên'}</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Hôm nay bạn muốn tập luyện gì?
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="p-6 bg-secondary border border-border hover:border-accent transition-colors group"
            >
              <div className={`w-12 h-12 ${link.color} flex items-center justify-center mb-4`}>
                <link.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-medium mb-1 group-hover:text-accent transition-colors">
                {link.title}
              </h3>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </Link>
          ))}
        </motion.div>

        {/* Upcoming Sessions */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Classes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-secondary border border-border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-medium flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                Lớp học sắp tới
              </h2>
              <Link to="/schedule" className="text-accent text-sm hover:underline flex items-center gap-1">
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {upcomingClasses.length > 0 ? (
              <div className="space-y-3">
                {upcomingClasses.map((cls) => (
                  <div 
                    key={cls.id} 
                    className="flex items-center justify-between p-4 bg-background border border-border"
                  >
                    <div>
                      <p className="font-medium">{cls.class_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {cls.trainer_name} • {formatDateTime(cls.start_time)}
                      </p>
                    </div>
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có lớp học nào</p>
                <Link to="/schedule" className="text-accent text-sm hover:underline mt-2 inline-block">
                  Đăng ký ngay
                </Link>
              </div>
            )}
          </motion.div>

          {/* Upcoming PT Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-secondary border border-border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-medium flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-accent" />
                Buổi PT sắp tới
              </h2>
              <Link to="/book-pt" className="text-accent text-sm hover:underline flex items-center gap-1">
                Đặt lịch <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {upcomingPT.length > 0 ? (
              <div className="space-y-3">
                {upcomingPT.map((session) => (
                  <div 
                    key={session.id} 
                    className="flex items-center justify-between p-4 bg-background border border-border"
                  >
                    <div>
                      <p className="font-medium">Buổi tập cá nhân</p>
                      <p className="text-sm text-muted-foreground">
                        {session.trainer_name} • {formatDateTime(session.start_time)}
                      </p>
                    </div>
                    <Dumbbell className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có buổi PT nào</p>
                <Link to="/book-pt" className="text-accent text-sm hover:underline mt-2 inline-block">
                  Đặt lịch ngay
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
