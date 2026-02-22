import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Users, Dumbbell, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import AnimatedCounter from '@/components/AnimatedCounter';

interface HistoryItem {
  id: string;
  type: 'class' | 'pt';
  date: string;
  name: string;
  trainer: string;
  status: string;
}

const History = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      const [classRes, ptRes] = await Promise.all([
        supabase
          .from('class_registrations')
          .select('id, registered_at, status, class_schedules (start_time, group_classes (name), trainers (name))')
          .eq('user_id', user!.id)
          .order('registered_at', { ascending: false })
          .limit(50),
        supabase
          .from('pt_sessions')
          .select('id, start_time, status, trainers (name)')
          .eq('user_id', user!.id)
          .order('start_time', { ascending: false })
          .limit(50),
      ]);

      const classItems: HistoryItem[] = (classRes.data || [])
        .filter((r: any) => r.class_schedules)
        .map((r: any) => ({
          id: r.id,
          type: 'class',
          date: r.class_schedules.start_time,
          name: r.class_schedules.group_classes?.name || 'Lớp học',
          trainer: r.class_schedules.trainers?.name || 'N/A',
          status: r.status || 'registered',
        }));

      const ptItems: HistoryItem[] = (ptRes.data || []).map((s: any) => ({
        id: s.id,
        type: 'pt',
        date: s.start_time,
        name: 'Buổi tập cá nhân',
        trainer: s.trainers?.name || 'N/A',
        status: s.status || 'booked',
      }));

      const all = [...classItems, ...ptItems].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setItems(all);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const completed = items.filter(i => i.status === 'completed' || i.status === 'attended');
  const totalClasses = items.filter(i => i.type === 'class').length;
  const totalPT = items.filter(i => i.type === 'pt').length;

  const statusLabel: Record<string, string> = {
    registered: 'Đã đăng ký',
    cancelled: 'Đã huỷ',
    attended: 'Đã tham gia',
    completed: 'Hoàn thành',
    booked: 'Đã đặt',
    confirmed: 'Đã xác nhận',
    no_show: 'Vắng mặt',
  };

  const statusColor: Record<string, string> = {
    completed: 'text-green-600 bg-green-50',
    attended: 'text-green-600 bg-green-50',
    registered: 'text-blue-600 bg-blue-50',
    booked: 'text-blue-600 bg-blue-50',
    confirmed: 'text-blue-600 bg-blue-50',
    cancelled: 'text-red-500 bg-red-50',
    no_show: 'text-red-500 bg-red-50',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-30">
        <div className="container-custom py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-soft-brown hover:text-terracotta transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-label">Dashboard</span>
          </Link>
          <Link to="/" className="font-display text-xl font-semibold tracking-tight text-charcoal">
            FLY<span className="text-terracotta">FIT</span>
          </Link>
        </div>
      </header>

      <main className="container-custom py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-label text-terracotta block mb-3">Lịch sử</span>
          <h1 className="heading-section text-charcoal mb-2">Lịch sử tập luyện</h1>
          <p className="text-body text-soft-brown mb-10">Theo dõi hành trình tập luyện của bạn.</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          <AnimatedCounter end={items.length} label="Tổng buổi tập" icon={<Calendar className="w-6 h-6 text-terracotta" />} duration={1.2} />
          <AnimatedCounter end={totalClasses} label="Lớp học nhóm" icon={<Users className="w-6 h-6 text-terracotta" />} duration={1.2} />
          <AnimatedCounter end={totalPT} label="Buổi PT" icon={<Dumbbell className="w-6 h-6 text-terracotta" />} duration={1.2} />
          <AnimatedCounter end={completed.length} label="Hoàn thành" icon={<CheckCircle2 className="w-6 h-6 text-terracotta" />} duration={1.2} />
        </motion.div>

        {/* History List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-background border border-border/50"
        >
          {items.length > 0 ? (
            <div className="divide-y divide-border/30">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between p-5 hover:bg-cream/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-terracotta/10 flex items-center justify-center">
                      {item.type === 'class' ? (
                        <Users className="w-5 h-5 text-terracotta" />
                      ) : (
                        <Dumbbell className="w-5 h-5 text-terracotta" />
                      )}
                    </div>
                    <div>
                      <p className="font-display font-medium text-charcoal">{item.name}</p>
                      <p className="text-body-sm text-soft-brown">{item.trainer} • {formatDate(item.date)}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 font-medium ${statusColor[item.status] || 'text-muted-foreground bg-muted'}`}>
                    {statusLabel[item.status] || item.status}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-soft-brown mb-3">Chưa có lịch sử tập luyện</p>
              <Link to="/schedule" className="text-terracotta text-label link-underline">
                Đăng ký lớp học ngay
              </Link>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default History;
