import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Dumbbell, Users, Clock, MapPin, ArrowLeft } from 'lucide-react';
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

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  useEffect(() => {
    fetchSchedules();
  }, [currentWeekStart, user]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const weekEnd = addDays(currentWeekStart, 7);
      
      // Fetch schedules
      const { data: schedulesData, error } = await supabase
        .from('class_schedules')
        .select(`
          id,
          start_time,
          end_time,
          room,
          status,
          group_classes (
            name,
            description,
            max_participants
          ),
          trainers (
            name
          )
        `)
        .gte('start_time', currentWeekStart.toISOString())
        .lt('start_time', weekEnd.toISOString())
        .eq('status', 'scheduled')
        .order('start_time', { ascending: true });

      if (error) throw error;

      // Fetch registration counts
      const scheduleIds = schedulesData?.map(s => s.id) || [];
      
      let registrationCounts: Record<string, number> = {};
      let userRegistrations: Set<string> = new Set();

      if (scheduleIds.length > 0) {
        // Get counts
        const { data: counts } = await supabase
          .from('class_registrations')
          .select('schedule_id')
          .in('schedule_id', scheduleIds)
          .eq('status', 'registered');

        if (counts) {
          counts.forEach((r: any) => {
            registrationCounts[r.schedule_id] = (registrationCounts[r.schedule_id] || 0) + 1;
          });
        }

        // Get user's registrations
        if (user) {
          const { data: userRegs } = await supabase
            .from('class_registrations')
            .select('schedule_id')
            .in('schedule_id', scheduleIds)
            .eq('user_id', user.id)
            .eq('status', 'registered');

          if (userRegs) {
            userRegs.forEach((r: any) => userRegistrations.add(r.schedule_id));
          }
        }
      }

      const formatted: ClassSchedule[] = (schedulesData || []).map((s: any) => ({
        id: s.id,
        start_time: s.start_time,
        end_time: s.end_time,
        room: s.room,
        status: s.status,
        class_name: s.group_classes?.name || 'N/A',
        class_description: s.group_classes?.description,
        trainer_name: s.trainers?.name,
        max_participants: s.group_classes?.max_participants || 15,
        current_participants: registrationCounts[s.id] || 0,
        is_registered: userRegistrations.has(s.id),
      }));

      setSchedules(formatted);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể tải lịch học. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (scheduleId: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Chưa đăng nhập',
        description: 'Vui lòng đăng nhập để đăng ký lớp học.',
      });
      return;
    }

    setRegistering(scheduleId);
    try {
      const { error } = await supabase
        .from('class_registrations')
        .insert({
          schedule_id: scheduleId,
          user_id: user.id,
          status: 'registered',
        });

      if (error) throw error;

      toast({
        title: 'Đăng ký thành công',
        description: 'Bạn đã đăng ký lớp học thành công!',
      });

      fetchSchedules();
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          variant: 'destructive',
          title: 'Đã đăng ký',
          description: 'Bạn đã đăng ký lớp học này rồi.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Không thể đăng ký. Vui lòng thử lại.',
        });
      }
    } finally {
      setRegistering(null);
    }
  };

  const handleCancelRegistration = async (scheduleId: string) => {
    if (!user) return;

    setRegistering(scheduleId);
    try {
      const { error } = await supabase
        .from('class_registrations')
        .update({ status: 'cancelled' })
        .eq('schedule_id', scheduleId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Đã hủy đăng ký',
        description: 'Bạn đã hủy đăng ký lớp học.',
      });

      fetchSchedules();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể hủy đăng ký. Vui lòng thử lại.',
      });
    } finally {
      setRegistering(null);
    }
  };

  const getSchedulesForDay = (date: Date) => {
    return schedules.filter(s => isSameDay(parseISO(s.start_time), date));
  };

  const formatTime = (dateStr: string) => {
    return format(parseISO(dateStr), 'HH:mm');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-secondary/30">
        <div className="container-custom py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-accent" />
              <span className="font-display text-xl font-semibold">ELITE FIT</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-medium mb-2">
            Lịch lớp học nhóm
          </h1>
          <p className="text-muted-foreground mb-8">
            Chọn và đăng ký các lớp học phù hợp với lịch trình của bạn
          </p>

          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              className="rounded-none"
              onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Tuần trước
            </Button>
            <span className="font-display text-lg">
              {format(currentWeekStart, 'dd/MM', { locale: vi })} - {format(addDays(currentWeekStart, 6), 'dd/MM/yyyy', { locale: vi })}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-none"
              onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
            >
              Tuần sau
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weekDays.map((day) => {
                const daySchedules = getSchedulesForDay(day);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div 
                    key={day.toISOString()} 
                    className={`border ${isToday ? 'border-accent' : 'border-border'} bg-secondary/30`}
                  >
                    <div className={`p-3 text-center border-b ${isToday ? 'bg-accent text-accent-foreground border-accent' : 'bg-secondary border-border'}`}>
                      <p className="text-sm font-medium">
                        {format(day, 'EEEE', { locale: vi })}
                      </p>
                      <p className="text-lg font-display">
                        {format(day, 'dd/MM')}
                      </p>
                    </div>
                    
                    <div className="p-2 space-y-2 min-h-[200px]">
                      {daySchedules.length > 0 ? (
                        daySchedules.map((schedule) => {
                          const isFull = schedule.current_participants >= schedule.max_participants;
                          
                          return (
                            <div 
                              key={schedule.id}
                              className={`p-3 border ${schedule.is_registered ? 'border-accent bg-accent/10' : 'border-border bg-background'}`}
                            >
                              <p className="font-medium text-sm mb-1">{schedule.class_name}</p>
                              <div className="space-y-1 text-xs text-muted-foreground">
                                <p className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                </p>
                                {schedule.trainer_name && (
                                  <p className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {schedule.trainer_name}
                                  </p>
                                )}
                                <p className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {schedule.room}
                                </p>
                                <p className="text-accent">
                                  {schedule.current_participants}/{schedule.max_participants} người
                                </p>
                              </div>
                              
                              {schedule.is_registered ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full mt-2 rounded-none text-xs h-7"
                                  onClick={() => handleCancelRegistration(schedule.id)}
                                  disabled={registering === schedule.id}
                                >
                                  {registering === schedule.id ? '...' : 'Hủy đăng ký'}
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  className="w-full mt-2 rounded-none text-xs h-7"
                                  onClick={() => handleRegister(schedule.id)}
                                  disabled={isFull || registering === schedule.id}
                                >
                                  {registering === schedule.id ? '...' : (isFull ? 'Đã đầy' : 'Đăng ký')}
                                </Button>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          Không có lớp
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Schedule;
