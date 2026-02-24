import { useEffect, useState } from 'react';
import { Video, MapPin } from 'lucide-react';
import { BrandedLoader } from '@/components/ui/branded-loader';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, ArrowLeft, Star, Clock, ChevronLeft, ChevronRight, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, isSameDay, startOfDay, setHours, setMinutes } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Trainer {
  id: string;
  name: string;
  specialization: string | null;
  bio: string | null;
  avatar_url: string | null;
  experience_years: number;
}

interface TimeSlot {
  time: Date;
  available: boolean;
}

const BookPT = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [step, setStep] = useState(1);
  const [sessionType, setSessionType] = useState<"offline" | "online">("offline");

  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(startOfDay(new Date()), i));

  useEffect(() => { fetchTrainers(); }, []);
  useEffect(() => { if (selectedTrainer && selectedDate) fetchAvailableSlots(); }, [selectedTrainer, selectedDate]);

  const fetchTrainers = async () => {
    try {
      const { data, error } = await supabase.from('trainers').select('*').eq('is_active', true).order('name');
      if (error) throw error;
      setTrainers(data || []);
    } catch (error) { console.error('Error fetching trainers:', error); }
    finally { setLoading(false); }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedTrainer) return;
    try {
      const dayOfWeek = selectedDate.getDay();
      const { data: availability } = await supabase.from('trainer_availability').select('start_time, end_time').eq('trainer_id', selectedTrainer.id).eq('day_of_week', dayOfWeek).eq('is_available', true);
      const dayStart = selectedDate.toISOString();
      const dayEnd = addDays(selectedDate, 1).toISOString();
      const { data: bookings } = await supabase.from('pt_sessions').select('start_time').eq('trainer_id', selectedTrainer.id).gte('start_time', dayStart).lt('start_time', dayEnd).in('status', ['booked', 'confirmed']);
      const bookedTimes = new Set((bookings || []).map((b: any) => new Date(b.start_time).getHours()));

      const slots: TimeSlot[] = [];
      for (let hour = 6; hour <= 21; hour++) {
        const slotTime = setMinutes(setHours(selectedDate, hour), 0);
        const isBooked = bookedTimes.has(hour);
        const isInAvailability = availability?.some((a: any) => { const s = parseInt(a.start_time.split(':')[0]); const e = parseInt(a.end_time.split(':')[0]); return hour >= s && hour < e; });
        const hasNoAvailabilitySet = !availability || availability.length === 0;
        const isDefaultAvailable = hasNoAvailabilitySet && hour >= 6 && hour <= 21;
        slots.push({ time: slotTime, available: !isBooked && (isInAvailability || isDefaultAvailable) && slotTime > new Date() });
      }
      setTimeSlots(slots);
    } catch (error) { console.error('Error fetching availability:', error); }
  };

  const handleBookSession = async () => {
    if (!user || !selectedTrainer || !selectedTime) { toast({ variant: 'destructive', title: 'Lỗi', description: 'Vui lòng chọn đầy đủ thông tin.' }); return; }
    setBooking(true);
    try {
      const endTime = new Date(selectedTime); endTime.setHours(endTime.getHours() + 1);
      const { error } = await supabase.from('pt_sessions').insert({ trainer_id: selectedTrainer.id, user_id: user.id, start_time: selectedTime.toISOString(), end_time: endTime.toISOString(), status: 'booked' });
      if (error) throw error;
      toast({ title: 'Đặt lịch thành công!', description: `Buổi tập với ${selectedTrainer.name} vào ${format(selectedTime, 'HH:mm dd/MM/yyyy', { locale: vi })}` });
      setSelectedTime(null); setStep(1); fetchAvailableSlots();
    } catch { toast({ variant: 'destructive', title: 'Lỗi', description: 'Không thể đặt lịch.' }); }
    finally { setBooking(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-30">
          <div className="container-custom py-4 flex items-center gap-4">
            <div className="h-5 w-5 shimmer rounded" />
            <div className="h-6 w-32 shimmer rounded" />
          </div>
        </header>
        <main className="container-custom py-10">
          <div className="mb-10">
            <div className="h-4 w-20 shimmer rounded mb-3" />
            <div className="h-10 w-64 shimmer rounded mb-2" />
            <div className="h-5 w-80 shimmer rounded" />
          </div>
          <div className="flex items-center gap-2 mb-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-9 h-9 shimmer rounded" />
                <div className="h-3 w-16 shimmer rounded hidden sm:block" />
                {i < 2 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-7 border border-border/50 bg-background">
                <div className="w-16 h-16 shimmer rounded mb-5" />
                <div className="h-6 w-3/4 shimmer rounded mb-2" />
                <div className="h-4 w-1/2 shimmer rounded mb-3" />
                <div className="h-4 w-2/3 shimmer rounded" />
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
        <div className="container-custom py-4 flex items-center gap-4">
          <Link to="/dashboard" className="text-soft-brown hover:text-terracotta transition-colors duration-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link to="/" className="font-display text-xl font-semibold tracking-tight text-charcoal">
            FLY<span className="text-terracotta">FIT</span>
          </Link>
        </div>
      </header>

      <main className="container-custom py-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <span className="text-label text-terracotta block mb-3">Đặt lịch</span>
          <h1 className="heading-section text-charcoal mb-2">Đặt lịch tập cá nhân</h1>
          <p className="text-body text-soft-brown mb-10">Chọn huấn luyện viên và thời gian phù hợp</p>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-10">
            {[
              { n: 1, label: 'Chọn PT' },
              { n: 2, label: 'Chọn ngày' },
              { n: 3, label: 'Chọn giờ' },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <motion.div
                  animate={{ 
                    backgroundColor: step >= s.n ? 'hsl(15 65% 45%)' : 'transparent',
                    borderColor: step >= s.n ? 'hsl(15 65% 45%)' : 'hsl(28 20% 88%)',
                    color: step >= s.n ? 'hsl(30 40% 98%)' : 'hsl(25 15% 45%)',
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-9 h-9 flex items-center justify-center border text-sm font-medium"
                >
                  {step > s.n ? <Check className="w-4 h-4" /> : s.n}
                </motion.div>
                <span className={`text-label hidden sm:inline ${step >= s.n ? 'text-charcoal' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
                {i < 2 && <div className={`w-8 h-px ${step > s.n ? 'bg-terracotta' : 'bg-border'} transition-colors duration-300`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Select Trainer */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {trainers.length > 0 ? trainers.map((trainer, i) => (
                    <motion.button
                      key={trainer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => { setSelectedTrainer(trainer); setStep(2); }}
                      className="group p-7 border border-border/50 bg-background text-left hover:border-terracotta/50 hover:shadow-xl hover:shadow-terracotta/5 transition-all duration-500 hover:-translate-y-1"
                    >
                      <div className="w-16 h-16 bg-terracotta/10 flex items-center justify-center mb-5 group-hover:bg-terracotta/20 transition-colors duration-300 overflow-hidden">
                        {trainer.avatar_url ? (
                          <img src={trainer.avatar_url} alt={trainer.name} className="w-full h-full object-cover" />
                        ) : (
                          <Dumbbell className="w-8 h-8 text-terracotta" />
                        )}
                      </div>
                      <h3 className="font-display text-xl font-medium text-charcoal mb-1 group-hover:text-terracotta transition-colors duration-300">{trainer.name}</h3>
                      {trainer.specialization && <p className="text-label text-terracotta mb-3">{trainer.specialization}</p>}
                      <div className="flex items-center gap-1 text-body-sm text-soft-brown">
                        <Star className="w-4 h-4 text-terracotta" />
                        {trainer.experience_years} năm kinh nghiệm
                      </div>
                      {trainer.bio && <p className="text-body-sm text-soft-brown mt-3 line-clamp-2">{trainer.bio}</p>}
                    </motion.button>
                  )) : (
                    <div className="col-span-full text-center py-16">
                      <Dumbbell className="w-16 h-16 mx-auto mb-4 text-muted-foreground/20" />
                      <p className="text-soft-brown font-display text-lg">Chưa có huấn luyện viên nào</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Select Date */}
            {step === 2 && selectedTrainer && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }}>
                <div className="flex items-center gap-4 mb-8 bg-background border border-border/50 p-4">
                  <Button variant="ghost" size="sm" className="rounded-none text-soft-brown hover:text-terracotta" onClick={() => setStep(1)}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại
                  </Button>
                  <span className="text-body-sm text-soft-brown">
                    PT: <span className="text-charcoal font-medium">{selectedTrainer.name}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                  {next7Days.map((day, i) => {
                    const isToday = isSameDay(day, new Date());
                    return (
                      <motion.button
                        key={day.toISOString()}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => { setSelectedDate(day); setSelectedTime(null); setStep(3); }}
                        className="group p-5 border border-border/50 bg-background text-center hover:border-terracotta hover:shadow-lg hover:shadow-terracotta/5 transition-all duration-500 hover:-translate-y-1"
                      >
                        <p className="text-label text-soft-brown group-hover:text-terracotta transition-colors">{format(day, 'EEEE', { locale: vi })}</p>
                        <p className="font-display text-2xl text-charcoal mt-2">{format(day, 'dd/MM')}</p>
                        {isToday && <span className="text-label text-terracotta mt-1 block">Hôm nay</span>}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3: Select Time */}
            {step === 3 && selectedTrainer && (
              <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }}>
                <div className="flex items-center gap-4 mb-8 bg-background border border-border/50 p-4 flex-wrap">
                  <Button variant="ghost" size="sm" className="rounded-none text-soft-brown hover:text-terracotta" onClick={() => setStep(2)}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại
                  </Button>
                  <span className="text-body-sm text-soft-brown">
                    PT: <span className="text-charcoal font-medium">{selectedTrainer.name}</span> • 
                    Ngày: <span className="text-charcoal font-medium">{format(selectedDate, 'dd/MM/yyyy', { locale: vi })}</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
                  {timeSlots.map((slot, i) => {
                    const isSelected = selectedTime && isSameDay(slot.time, selectedTime) && slot.time.getHours() === selectedTime.getHours();
                    return (
                      <motion.button
                        key={slot.time.toISOString()}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-4 border text-center transition-all duration-300 ${
                          !slot.available 
                            ? 'border-border/30 bg-muted/50 text-muted-foreground cursor-not-allowed opacity-40'
                            : isSelected 
                              ? 'border-terracotta bg-terracotta text-primary-foreground shadow-lg shadow-terracotta/20'
                              : 'border-border/50 bg-background hover:border-terracotta/50 hover:shadow-md'
                        }`}
                      >
                        <Clock className="w-4 h-4 mx-auto mb-1" />
                        <p className="font-display font-medium">{format(slot.time, 'HH:mm')}</p>
                      </motion.button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {selectedTime && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: 20, height: 0 }}
                      className="bg-background border border-terracotta/30 p-8 shadow-xl shadow-terracotta/5"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="w-5 h-5 text-terracotta" />
                        <h3 className="font-display text-xl font-medium text-charcoal">Xác nhận đặt lịch</h3>
                      </div>

                      {/* Session Type Toggle */}
                      <div className="mb-6">
                        <span className="text-label text-soft-brown block mb-3">Hình thức tập</span>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setSessionType("offline")}
                            className={`flex items-center gap-2 px-5 py-3 border text-sm font-medium transition-all duration-300 ${
                              sessionType === "offline"
                                ? "border-terracotta bg-terracotta text-cream"
                                : "border-border text-soft-brown hover:border-terracotta/50"
                            }`}
                          >
                            <MapPin className="w-4 h-4" /> Tại phòng gym
                          </button>
                          <button
                            onClick={() => setSessionType("online")}
                            className={`flex items-center gap-2 px-5 py-3 border text-sm font-medium transition-all duration-300 ${
                              sessionType === "online"
                                ? "border-terracotta bg-terracotta text-cream"
                                : "border-border text-soft-brown hover:border-terracotta/50"
                            }`}
                          >
                            <Video className="w-4 h-4" /> Online qua Zoom
                          </button>
                        </div>
                        {sessionType === "online" && (
                          <div className="mt-3 p-3 bg-terracotta/5 border border-terracotta/20 text-sm text-soft-brown">
                            📹 Link Zoom sẽ được gửi qua email sau khi xác nhận đặt lịch
                          </div>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4 mb-8">
                        <div className="p-4 bg-cream">
                          <span className="text-label text-soft-brown block mb-1">Huấn luyện viên</span>
                          <span className="font-display text-charcoal font-medium">{selectedTrainer.name}</span>
                        </div>
                        <div className="p-4 bg-cream">
                          <span className="text-label text-soft-brown block mb-1">Ngày</span>
                          <span className="font-display text-charcoal font-medium">{format(selectedDate, 'dd/MM/yyyy', { locale: vi })}</span>
                        </div>
                        <div className="p-4 bg-cream">
                          <span className="text-label text-soft-brown block mb-1">Giờ</span>
                          <span className="font-display text-charcoal font-medium">
                            {format(selectedTime, 'HH:mm')} - {format(new Date(selectedTime.getTime() + 60 * 60 * 1000), 'HH:mm')}
                          </span>
                        </div>
                      </div>
                      <MagneticButton 
                        className="btn-primary rounded-none w-full h-14 group"
                        onClick={handleBookSession}
                        disabled={booking}
                      >
                        {booking ? (
                          <BrandedLoader size="sm" variant="inline" />
                        ) : (
                          <>
                            Xác nhận đặt lịch
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </MagneticButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default BookPT;
