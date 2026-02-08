import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, ArrowLeft, Star, Calendar, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(startOfDay(new Date()), i));

  useEffect(() => {
    fetchTrainers();
  }, []);

  useEffect(() => {
    if (selectedTrainer && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedTrainer, selectedDate]);

  const fetchTrainers = async () => {
    try {
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTrainers(data || []);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedTrainer) return;

    try {
      const dayOfWeek = selectedDate.getDay();
      
      // Get trainer's availability for this day
      const { data: availability } = await supabase
        .from('trainer_availability')
        .select('start_time, end_time')
        .eq('trainer_id', selectedTrainer.id)
        .eq('day_of_week', dayOfWeek)
        .eq('is_available', true);

      // Get existing bookings for this trainer on this date
      const dayStart = selectedDate.toISOString();
      const dayEnd = addDays(selectedDate, 1).toISOString();
      
      const { data: bookings } = await supabase
        .from('pt_sessions')
        .select('start_time')
        .eq('trainer_id', selectedTrainer.id)
        .gte('start_time', dayStart)
        .lt('start_time', dayEnd)
        .in('status', ['booked', 'confirmed']);

      const bookedTimes = new Set(
        (bookings || []).map((b: any) => new Date(b.start_time).getHours())
      );

      // Generate time slots (6 AM to 9 PM, 1-hour slots)
      const slots: TimeSlot[] = [];
      for (let hour = 6; hour <= 21; hour++) {
        const slotTime = setMinutes(setHours(selectedDate, hour), 0);
        const isBooked = bookedTimes.has(hour);
        const isInAvailability = availability && availability.some((a: any) => {
          const startHour = parseInt(a.start_time.split(':')[0]);
          const endHour = parseInt(a.end_time.split(':')[0]);
          return hour >= startHour && hour < endHour;
        });
        
        // If no availability set, assume trainer is available during gym hours
        const hasNoAvailabilitySet = !availability || availability.length === 0;
        const isDefaultAvailable = hasNoAvailabilitySet && hour >= 6 && hour <= 21;
        
        slots.push({
          time: slotTime,
          available: !isBooked && (isInAvailability || isDefaultAvailable) && slotTime > new Date(),
        });
      }

      setTimeSlots(slots);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const handleBookSession = async () => {
    if (!user || !selectedTrainer || !selectedTime) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Vui lòng chọn đầy đủ thông tin.',
      });
      return;
    }

    setBooking(true);
    try {
      const endTime = new Date(selectedTime);
      endTime.setHours(endTime.getHours() + 1);

      const { error } = await supabase
        .from('pt_sessions')
        .insert({
          trainer_id: selectedTrainer.id,
          user_id: user.id,
          start_time: selectedTime.toISOString(),
          end_time: endTime.toISOString(),
          status: 'booked',
        });

      if (error) throw error;

      toast({
        title: 'Đặt lịch thành công!',
        description: `Buổi tập với ${selectedTrainer.name} vào ${format(selectedTime, 'HH:mm dd/MM/yyyy', { locale: vi })}`,
      });

      // Reset
      setSelectedTime(null);
      setStep(1);
      fetchAvailableSlots();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể đặt lịch. Vui lòng thử lại.',
      });
    } finally {
      setBooking(false);
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
            Đặt lịch tập cá nhân
          </h1>
          <p className="text-muted-foreground mb-8">
            Chọn huấn luyện viên và thời gian phù hợp
          </p>

          {/* Steps */}
          <div className="flex items-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 flex items-center justify-center border ${
                  step >= s ? 'bg-accent text-accent-foreground border-accent' : 'border-border text-muted-foreground'
                }`}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                <span className={`text-sm ${step >= s ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s === 1 ? 'Chọn PT' : s === 2 ? 'Chọn ngày' : 'Chọn giờ'}
                </span>
                {s < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </div>
            ))}
          </div>

          {/* Step 1: Select Trainer */}
          {step === 1 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainers.length > 0 ? (
                trainers.map((trainer) => (
                  <motion.button
                    key={trainer.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => {
                      setSelectedTrainer(trainer);
                      setStep(2);
                    }}
                    className={`p-6 border text-left transition-colors hover:border-accent ${
                      selectedTrainer?.id === trainer.id ? 'border-accent bg-accent/5' : 'border-border bg-secondary'
                    }`}
                  >
                    <div className="w-16 h-16 bg-accent/10 flex items-center justify-center mb-4">
                      {trainer.avatar_url ? (
                        <img src={trainer.avatar_url} alt={trainer.name} className="w-full h-full object-cover" />
                      ) : (
                        <Dumbbell className="w-8 h-8 text-accent" />
                      )}
                    </div>
                    <h3 className="font-display text-lg font-medium mb-1">{trainer.name}</h3>
                    {trainer.specialization && (
                      <p className="text-sm text-accent mb-2">{trainer.specialization}</p>
                    )}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-accent" />
                      {trainer.experience_years} năm kinh nghiệm
                    </div>
                    {trainer.bio && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{trainer.bio}</p>
                    )}
                  </motion.button>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Chưa có huấn luyện viên nào</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Date */}
          {step === 2 && selectedTrainer && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none"
                  onClick={() => setStep(1)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Quay lại
                </Button>
                <span className="text-muted-foreground">
                  PT: <span className="text-foreground font-medium">{selectedTrainer.name}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {next7Days.map((day) => {
                  const isSelected = isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => {
                        setSelectedDate(day);
                        setSelectedTime(null);
                        setStep(3);
                      }}
                      className={`p-4 border text-center transition-colors hover:border-accent ${
                        isSelected ? 'border-accent bg-accent/10' : 'border-border bg-secondary'
                      }`}
                    >
                      <p className="text-sm text-muted-foreground">
                        {format(day, 'EEEE', { locale: vi })}
                      </p>
                      <p className="font-display text-xl mt-1">
                        {format(day, 'dd/MM')}
                      </p>
                      {isToday && (
                        <span className="text-xs text-accent">Hôm nay</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Select Time */}
          {step === 3 && selectedTrainer && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none"
                  onClick={() => setStep(2)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Quay lại
                </Button>
                <span className="text-muted-foreground">
                  PT: <span className="text-foreground font-medium">{selectedTrainer.name}</span> • 
                  Ngày: <span className="text-foreground font-medium">{format(selectedDate, 'dd/MM/yyyy', { locale: vi })}</span>
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTime && isSameDay(slot.time, selectedTime) && 
                    slot.time.getHours() === selectedTime.getHours();
                  
                  return (
                    <button
                      key={slot.time.toISOString()}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-4 border text-center transition-colors ${
                        !slot.available 
                          ? 'border-border bg-muted text-muted-foreground cursor-not-allowed'
                          : isSelected 
                            ? 'border-accent bg-accent text-accent-foreground'
                            : 'border-border bg-secondary hover:border-accent'
                      }`}
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1" />
                      <p className="font-medium">{format(slot.time, 'HH:mm')}</p>
                    </button>
                  );
                })}
              </div>

              {selectedTime && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-secondary border border-border p-6"
                >
                  <h3 className="font-display text-xl font-medium mb-4">Xác nhận đặt lịch</h3>
                  <div className="space-y-2 text-muted-foreground mb-6">
                    <p><span className="text-foreground">Huấn luyện viên:</span> {selectedTrainer.name}</p>
                    <p><span className="text-foreground">Ngày:</span> {format(selectedDate, 'EEEE, dd/MM/yyyy', { locale: vi })}</p>
                    <p><span className="text-foreground">Giờ:</span> {format(selectedTime, 'HH:mm')} - {format(new Date(selectedTime.getTime() + 60 * 60 * 1000), 'HH:mm')}</p>
                  </div>
                  <Button 
                    className="btn-primary rounded-none w-full"
                    onClick={handleBookSession}
                    disabled={booking}
                  >
                    {booking ? 'Đang đặt lịch...' : 'Xác nhận đặt lịch'}
                  </Button>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default BookPT;
