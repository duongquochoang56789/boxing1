import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, User, Phone, Calendar, Heart, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileData {
  full_name: string;
  phone: string | null;
  date_of_birth: string | null;
  emergency_contact: string | null;
  health_notes: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '', phone: null, date_of_birth: null,
    emergency_contact: null, health_notes: null, avatar_url: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, phone, date_of_birth, emergency_contact, health_notes, avatar_url')
      .eq('user_id', user!.id)
      .maybeSingle();
    if (data) setProfile(data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        date_of_birth: profile.date_of_birth,
        emergency_contact: profile.emergency_contact,
        health_notes: profile.health_notes,
      })
      .eq('user_id', user!.id);

    if (error) {
      toast.error('Không thể lưu thông tin');
    } else {
      toast.success('Đã cập nhật hồ sơ');
    }
    setSaving(false);
  };

  const fields = [
    { key: 'full_name', label: 'Họ và tên', icon: User, type: 'text', placeholder: 'Nguyễn Văn A' },
    { key: 'phone', label: 'Số điện thoại', icon: Phone, type: 'tel', placeholder: '0912 345 678' },
    { key: 'date_of_birth', label: 'Ngày sinh', icon: Calendar, type: 'date', placeholder: '' },
    { key: 'emergency_contact', label: 'Liên hệ khẩn cấp', icon: AlertTriangle, type: 'text', placeholder: 'Tên — SĐT' },
  ];

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

      <main className="container-custom py-10 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-label text-terracotta block mb-3">Hồ sơ cá nhân</span>
          <h1 className="heading-section text-charcoal mb-2">Thông tin của bạn</h1>
          <p className="text-body text-soft-brown mb-10">Cập nhật thông tin để huấn luyện viên hỗ trợ bạn tốt hơn.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-background border border-border/50 p-8 space-y-6"
        >
          {/* Avatar placeholder */}
          <div className="flex items-center gap-5 pb-6 border-b border-border/30">
            <div className="w-20 h-20 bg-terracotta/10 flex items-center justify-center rounded-full">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-terracotta" />
              )}
            </div>
            <div>
              <p className="font-display text-lg font-medium text-charcoal">{profile.full_name || 'Thành viên'}</p>
              <p className="text-body-sm text-soft-brown">{user?.email}</p>
            </div>
          </div>

          {/* Fields */}
          {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
            <div key={key} className="space-y-2">
              <Label className="text-label text-charcoal flex items-center gap-2">
                <Icon className="w-4 h-4 text-terracotta" />
                {label}
              </Label>
              <Input
                type={type}
                value={(profile as any)[key] || ''}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value || null })}
                placeholder={placeholder}
                className="rounded-none border-border/50 focus:border-terracotta"
              />
            </div>
          ))}

          {/* Health Notes */}
          <div className="space-y-2">
            <Label className="text-label text-charcoal flex items-center gap-2">
              <Heart className="w-4 h-4 text-terracotta" />
              Ghi chú sức khoẻ
            </Label>
            <Textarea
              value={profile.health_notes || ''}
              onChange={(e) => setProfile({ ...profile, health_notes: e.target.value || null })}
              placeholder="Dị ứng, chấn thương cũ, bệnh nền..."
              className="rounded-none border-border/50 focus:border-terracotta min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-none bg-terracotta hover:bg-terracotta/90 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Đang lưu...' : 'Lưu thông tin'}
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
