import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Presentation, Palette, LogOut, ArrowUpRight, Home, Clock, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface HubStats {
  upcomingSessions: number;
  registeredClasses: number;
  totalDecks: number;
  totalBrandKits: number;
}

interface Activity {
  id: string;
  type: 'deck' | 'brand' | 'class' | 'pt';
  title: string;
  timestamp: string;
  app: 'flyfit' | 'slideai';
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
};

const Hub = () => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<HubStats>({ upcomingSessions: 0, registeredClasses: 0, totalDecks: 0, totalBrandKits: 0 });
  const [profileName, setProfileName] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const uid = user!.id;
      const now = new Date().toISOString();

      const [profileRes, classRes, ptRes, deckRes, brandRes] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('user_id', uid).maybeSingle(),
        supabase.from('class_registrations').select('id', { count: 'exact', head: true }).eq('user_id', uid).eq('status', 'registered'),
        supabase.from('pt_sessions').select('id', { count: 'exact', head: true }).eq('user_id', uid).in('status', ['booked', 'confirmed']).gte('start_time', now),
        supabase.from('decks').select('id', { count: 'exact', head: true }).eq('user_id', uid),
        supabase.from('brand_kits').select('id', { count: 'exact', head: true }).eq('user_id', uid),
      ]);

      setProfileName(profileRes.data?.full_name || user!.user_metadata?.full_name || 'Thành viên');
      setStats({
        registeredClasses: classRes.count || 0,
        upcomingSessions: ptRes.count || 0,
        totalDecks: deckRes.count || 0,
        totalBrandKits: brandRes.count || 0,
      });

      // Fetch recent activities
      const [recentDecks, recentBrands, recentClasses, recentPT] = await Promise.all([
        supabase.from('decks').select('id, title, created_at').eq('user_id', uid).order('created_at', { ascending: false }).limit(3),
        supabase.from('brand_kits').select('id, name, created_at').eq('user_id', uid).order('created_at', { ascending: false }).limit(2),
        supabase.from('class_registrations').select('id, registered_at, class_schedules(group_classes(name))').eq('user_id', uid).order('registered_at', { ascending: false }).limit(3),
        supabase.from('pt_sessions').select('id, created_at, trainers(name)').eq('user_id', uid).order('created_at', { ascending: false }).limit(2),
      ]);

      const allActivities: Activity[] = [
        ...(recentDecks.data || []).map((d: any) => ({ id: d.id, type: 'deck' as const, title: `Tạo deck "${d.title}"`, timestamp: d.created_at, app: 'slideai' as const })),
        ...(recentBrands.data || []).map((b: any) => ({ id: b.id, type: 'brand' as const, title: `Tạo brand kit "${b.name}"`, timestamp: b.created_at, app: 'slideai' as const })),
        ...(recentClasses.data || []).map((c: any) => ({ id: c.id, type: 'class' as const, title: `Đăng ký lớp ${c.class_schedules?.group_classes?.name || ''}`, timestamp: c.registered_at, app: 'flyfit' as const })),
        ...(recentPT.data || []).map((p: any) => ({ id: p.id, type: 'pt' as const, title: `Đặt PT với ${p.trainers?.name || 'HLV'}`, timestamp: p.created_at, app: 'flyfit' as const })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

      setActivities(allActivities);
    } catch (err) {
      console.error('Hub stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const shimmer = (
    <div className="min-h-screen bg-cream">
      <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-30">
        <div className="container-custom py-4 flex items-center justify-between">
          <div className="h-6 w-32 shimmer rounded" />
          <div className="h-8 w-24 shimmer rounded" />
        </div>
      </header>
      <main className="container-custom py-16">
        <div className="h-10 w-72 shimmer rounded mb-4" />
        <div className="h-5 w-48 shimmer rounded mb-12" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map(i => <div key={i} className="h-64 shimmer rounded-lg" />)}
        </div>
      </main>
    </div>
  );

  if (loading) return shimmer;

  const apps = [
    {
      name: 'FLYFIT',
      subtitle: 'Fitness & Wellness',
      icon: Dumbbell,
      href: '/dashboard',
      color: 'terracotta',
      gradientFrom: 'from-[hsl(15,65%,45%)]',
      gradientTo: 'to-[hsl(25,70%,55%)]',
      bgAccent: 'bg-[hsl(15,65%,45%)]/10',
      borderHover: 'hover:border-[hsl(15,65%,45%)]/50',
      textAccent: 'text-[hsl(15,65%,45%)]',
      stats: [
        { value: stats.registeredClasses, label: 'Lớp đã đăng ký' },
        { value: stats.upcomingSessions, label: 'Buổi PT sắp tới' },
      ],
    },
    {
      name: 'SlideAI',
      subtitle: 'Presentation Builder',
      icon: Presentation,
      href: '/slides',
      color: 'indigo',
      gradientFrom: 'from-[hsl(239,84%,67%)]',
      gradientTo: 'to-[hsl(263,70%,50%)]',
      bgAccent: 'bg-[hsl(239,84%,67%)]/10',
      borderHover: 'hover:border-[hsl(239,84%,67%)]/50',
      textAccent: 'text-[hsl(239,84%,67%)]',
      stats: [
        { value: stats.totalDecks, label: 'Deck đã tạo' },
        { value: stats.totalBrandKits, label: 'Brand Kit' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-30">
        <div className="container-custom py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-semibold tracking-tight text-charcoal">
            FLY<span className="text-terracotta">FIT</span> <span className="text-soft-brown font-normal text-sm ml-1">Hub</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-soft-brown hover:text-terracotta">
                <Home className="w-4 h-4 mr-1.5" />
                <span className="text-label hidden sm:inline">Trang chủ</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-soft-brown hover:text-terracotta">
              <LogOut className="w-4 h-4 mr-1.5" />
              <span className="text-label">Đăng xuất</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container-custom py-12 md:py-16">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <span className="text-label text-terracotta block mb-3">Hub</span>
          <h1 className="heading-section text-charcoal">
            Xin chào, <span className="text-terracotta">{profileName}</span>
          </h1>
          <p className="text-body text-soft-brown mt-3">
            Chọn ứng dụng bạn muốn sử dụng hôm nay
          </p>
        </motion.div>

        {/* App Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-6 max-w-4xl"
        >
          {apps.map((app) => (
            <motion.div key={app.name} variants={itemVariants}>
              <Link
                to={app.href}
                className={`group block bg-background border border-border/50 ${app.borderHover} hover:shadow-xl hover:shadow-black/5 transition-all duration-500 hover:-translate-y-1 overflow-hidden`}
              >
                {/* Gradient top bar */}
                <div className={`h-1.5 bg-gradient-to-r ${app.gradientFrom} ${app.gradientTo}`} />

                <div className="p-8">
                  {/* Icon + Title */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 ${app.bgAccent} flex items-center justify-center rounded-lg group-hover:scale-105 transition-transform duration-300`}>
                        <app.icon className={`w-7 h-7 ${app.textAccent}`} />
                      </div>
                      <div>
                        <h2 className="font-display text-2xl font-semibold text-charcoal group-hover:text-foreground transition-colors">
                          {app.name}
                        </h2>
                        <p className="text-body-sm text-soft-brown">{app.subtitle}</p>
                      </div>
                    </div>
                    <ArrowUpRight className={`w-5 h-5 text-muted-foreground group-hover:${app.textAccent} transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {app.stats.map((stat) => (
                      <div key={stat.label} className="bg-cream border border-border/30 p-4 rounded-lg">
                        <div className={`font-display text-2xl font-semibold ${app.textAccent}`}>
                          {stat.value}
                        </div>
                        <div className="text-body-sm text-soft-brown mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        {activities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 max-w-4xl"
          >
            <h2 className="font-display text-xl font-medium text-charcoal flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-muted flex items-center justify-center rounded-lg">
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
              Hoạt động gần đây
            </h2>
            <div className="bg-background border border-border/50 divide-y divide-border/30">
              {activities.map((activity, i) => {
                const IconComp = activity.type === 'deck' ? Presentation : activity.type === 'brand' ? Palette : activity.type === 'class' ? Users : Dumbbell;
                const isFlyfit = activity.app === 'flyfit';
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-cream/50 transition-colors duration-200"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isFlyfit ? 'bg-[hsl(15,65%,45%)]/10' : 'bg-[hsl(239,84%,67%)]/10'}`}>
                      <IconComp className={`w-4 h-4 ${isFlyfit ? 'text-[hsl(15,65%,45%)]' : 'text-[hsl(239,84%,67%)]'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-charcoal truncate">{activity.title}</p>
                      <p className="text-xs text-soft-brown mt-0.5">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: vi })}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isFlyfit ? 'bg-[hsl(15,65%,45%)]/10 text-[hsl(15,65%,45%)]' : 'bg-[hsl(239,84%,67%)]/10 text-[hsl(239,84%,67%)]'}`}>
                      {isFlyfit ? 'FLYFIT' : 'SlideAI'}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Hub;
