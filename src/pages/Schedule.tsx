import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, Users, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ClassSchedule {
  id: string;
  start_time: string;
  end_time: string;
  room: string;
  status: string;
  class_name: string;
  class_description: string | null;
  trainer_name: string | null;
  max_participants: number;
  current_participants: number;
  is_registered: boolean;
}

const Schedule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [registering, setRegistering] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  useEffect(() => {
    fetchSchedules();
  }, [currentWeekStart, user]);

  // Auto-expand today on mobile
  useEffect(() => {
    const todayIdx = weekDays.findIndex(d => isSameDay(d, new Date()));
    if (todayIdx >= 0) setExpandedDay(todayIdx);
  }, [currentWeekStart]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const weekEnd = addDays(currentWeekStart, 7);
      const { data: schedulesData, error } = await supabase
        .from('class_schedules')
        .select(`id, start_time, end_time, room, status, group_classes (name, description, max_participants), trainers (name)`)
        .gte('start_time', currentWeekStart.toISOString())
        .lt('start_time', weekEnd.toISOString())
        .eq('status', 'scheduled')
        .order('start_time', { ascending: true });

      if (error) throw error;

      const scheduleIds = schedulesData?.map(s => s.id) || [];
      let registrationCounts: Record<string, number> = {};
      let userRegistrations: Set<string> = new Set();

      if (scheduleIds.length > 0) {
        const { data: counts } = await supabase
          .from('class_registrations')
          .select('schedule_id')
          .in('schedule_id', scheduleIds)
          .eq('status', 'registered');
        if (counts) counts.forEach((r: any) => {
          registrationCounts[r.schedule_id] = (registrationCounts[r.schedule_id] || 0) + 1;
        });

        if (user) {
          const { data: userRegs } = await supabase
            .from('class_registrations')
            .select('schedule_id')
            .in('schedule_id', scheduleIds)
            .eq('user_id', user.id)
            .eq('status', 'registered');
          if (userRegs) userRegs.forEach((r: any) => userRegistrations.add(r.schedule_id));
        }
      }

      setSchedules((schedulesData || []).map((s: any) => ({
        id: s.id, start_time: s.start_time, end_time: s.end_time, room: s.room, status: s.status,
        class_name: s.group_classes?.name || 'N/A', class_description: s.group_classes?.description,
        trainer_name: s.trainers?.name, max_participants: s.group_classes?.max_participants || 15,
        current_participants: registrationCounts[s.id] || 0, is_registered: userRegistrations.has(s.id),
      })));
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Không thể tải lịch học.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (scheduleId: string) => {
    if (!user) { toast({ variant: 'destructive', title: 'Chưa đăng nhập', description: 'Vui lòng đăng nhập.' }); return; }
    setRegistering(scheduleId);
    try {
      const { error } = await supabase.from('class_registrations').insert({ schedule_id: scheduleId, user_id: user.id, status: 'registered' });
      if (error) throw error;
      toast({ title: 'Đăng ký thành công!' }); fetchSchedules();
    } catch (error: any) {
      toast({ variant: 'destructive', title: error.code === '23505' ? 'Đã đăng ký' : 'Lỗi', description: error.code === '23505' ? 'Bạn đã đăng ký rồi.' : 'Không thể đăng ký.' });
    } finally { setRegistering(null); }
  };

  const handleCancelRegistration = async (scheduleId: string) => {
    if (!user) return;
    setRegistering(scheduleId);
    try {
      const { error } = await supabase.from('class_registrations').update({ status: 'cancelled' }).eq('schedule_id', scheduleId).eq('user_id', user.id);
      if (error) throw error;
      toast({ title: 'Đã hủy đăng ký' }); fetchSchedules();
    } catch { toast({ variant: 'destructive', title: 'Lỗi', description: 'Không thể hủy.' }); }
    finally { setRegistering(null); }
  };

  const getSchedulesForDay = (date: Date) => schedules.filter(s => isSameDay(parseISO(s.start_time), date));
  const formatTime = (dateStr: string) => format(parseISO(dateStr), 'HH:mm');

  const renderScheduleCard = (schedule: ClassSchedule) => {
    const isFull = schedule.current_participants >= schedule.max_participants;
    return (
      <motion.div
        key={schedule.id}
        whileHover={{ scale: 1.02 }}
        className={`p-3 border transition-colors duration-300 ${schedule.is_registered ? 'border-terracotta bg-terracotta/5' : 'border-border/30 bg-cream hover:border-terracotta/30'}`}
      >
        <p className="font-display font-medium text-sm text-charcoal mb-1">{schedule.class_name}</p>
        <div className="space-y-0.5 text-xs text-soft-brown">
          <p className="flex items-center gap-1"><Clock className="w-3 h-3 text-terracotta/60" />{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</p>
          {schedule.trainer_name && <p className="flex items-center gap-1"><Users className="w-3 h-3 text-terracotta/60" />{schedule.trainer_name}</p>}
          <p className="flex items-center gap-1"><MapPin className="w-3 h-3 text-terracotta/60" />{schedule.room}</p>
          <p className="text-terracotta font-medium">{schedule.current_participants}/{schedule.max_participants}</p>
        </div>
        {schedule.is_registered ? (
          <Button size="sm" variant="outline" className="w-full mt-2 rounded-none text-xs h-7 border-terracotta/30 text-terracotta hover:bg-terracotta/10" onClick={() => handleCancelRegistration(schedule.id)} disabled={registering === schedule.id}>
            {registering === schedule.id ? '...' : 'Hủy đăng ký'}
          </Button>
        ) : (
          <Button size="sm" className="w-full mt-2 rounded-none text-xs h-7 bg-terracotta hover:bg-terracotta/90 text-primary-foreground" onClick={() => handleRegister(schedule.id)} disabled={isFull || registering === schedule.id}>
            {registering === schedule.id ? '...' : (isFull ? 'Đã đầy' : 'Đăng ký')}
          </Button>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-30">
        <div className="container-custom py-4 flex items-center gap-4">
          <Link to="/dashboard" className="text-soft-brown hover:text-terracotta transition-colors duration-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link to="/" className="font-display text-xl font-semibold tracking-tight text-charcoal">
            ELITE<span className="text-terracotta">FIT</span>
          </Link>
        </div>
      </header>

      <main className="container-custom py-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <span className="text-label text-terracotta block mb-3">Lịch học</span>
          <h1 className="heading-section text-charcoal mb-2">Lịch lớp học nhóm</h1>
          <p className="text-body text-soft-brown mb-10">Chọn và đăng ký các lớp học phù hợp với lịch trình của bạn</p>

          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-8 bg-background border border-border/50 p-4">
            <Button variant="ghost" size="sm" className="text-soft-brown hover:text-terracotta rounded-none" onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Tuần trước
            </Button>
            <span className="font-display text-lg text-charcoal">
              {format(currentWeekStart, 'dd/MM', { locale: vi })} — {format(addDays(currentWeekStart, 6), 'dd/MM/yyyy', { locale: vi })}
            </span>
            <Button variant="ghost" size="sm" className="text-soft-brown hover:text-terracotta rounded-none" onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}>
              Tuần sau <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4 md:grid md:grid-cols-7 md:gap-4 md:space-y-0">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="border border-border/50 bg-background">
                  <div className="p-3 border-b border-border/50 bg-cream">
                    <div className="h-3 w-16 shimmer rounded mx-auto mb-1" />
                    <div className="h-5 w-12 shimmer rounded mx-auto" />
                  </div>
                  <div className="p-2 space-y-2 min-h-[100px] md:min-h-[200px]">
                    <div className="p-3 border border-border/30 bg-cream">
                      <div className="h-4 w-3/4 shimmer rounded mb-2" />
                      <div className="h-3 w-1/2 shimmer rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Desktop: 7-column grid */}
              <div className="hidden md:grid md:grid-cols-7 gap-4">
                {weekDays.map((day, dayIdx) => {
                  const daySchedules = getSchedulesForDay(day);
                  const isToday = isSameDay(day, new Date());
                  return (
                    <motion.div
                      key={day.toISOString()}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: dayIdx * 0.05 }}
                      className={`border bg-background ${isToday ? 'border-terracotta shadow-lg shadow-terracotta/10' : 'border-border/50'}`}
                    >
                      <div className={`p-3 text-center border-b ${isToday ? 'bg-terracotta text-primary-foreground border-terracotta' : 'bg-cream border-border/50'}`}>
                        <p className="text-label">{format(day, 'EEEE', { locale: vi })}</p>
                        <p className="font-display text-lg mt-0.5">{format(day, 'dd/MM')}</p>
                      </div>
                      <div className="p-2 space-y-2 min-h-[200px]">
                        {daySchedules.length > 0 ? daySchedules.map(renderScheduleCard) : (
                          <p className="text-xs text-soft-brown/50 text-center py-8">Không có lớp</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile: Accordion list */}
              <div className="md:hidden space-y-2">
                {weekDays.map((day, dayIdx) => {
                  const daySchedules = getSchedulesForDay(day);
                  const isToday = isSameDay(day, new Date());
                  const isExpanded = expandedDay === dayIdx;
                  return (
                    <motion.div
                      key={day.toISOString()}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: dayIdx * 0.03 }}
                      className={`border bg-background overflow-hidden ${isToday ? 'border-terracotta' : 'border-border/50'}`}
                    >
                      <button
                        onClick={() => setExpandedDay(isExpanded ? null : dayIdx)}
                        className={`w-full flex items-center justify-between p-4 ${isToday ? 'bg-terracotta text-primary-foreground' : 'bg-cream'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-display text-lg font-medium">{format(day, 'dd/MM')}</span>
                          <span className="text-label">{format(day, 'EEEE', { locale: vi })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {daySchedules.length > 0 && (
                            <span className={`text-xs px-2 py-0.5 ${isToday ? 'bg-cream/20 text-cream' : 'bg-terracotta/10 text-terracotta'}`}>
                              {daySchedules.length} lớp
                            </span>
                          )}
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 space-y-2">
                              {daySchedules.length > 0 ? daySchedules.map(renderScheduleCard) : (
                                <p className="text-sm text-soft-brown/50 text-center py-6">Không có lớp học nào</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Schedule;
