
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  User,
  Plus,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  LayoutGrid,
  List,
  Search,
  Filter
} from 'lucide-react';
import { TrainingEvent, Opportunity, Instructor } from '../types';

interface InstructorCalendarProps {
  events: TrainingEvent[];
  opportunities: Opportunity[];
  instructors: Instructor[];
  onUpdateDates: (id: string, dates: string[]) => void;
  onAddEvent: (event: TrainingEvent) => void;
  onToggleLeave: (instructorId: string) => void;
}

type ViewType = 'month' | 'list';

const InstructorCalendar: React.FC<InstructorCalendarProps> = ({ 
  events, 
  instructors,
  onAddEvent, 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 5, 15));
  const [activeView, setActiveView] = useState<ViewType>('month');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    instructorName: '',
    opportunityId: '',
    startDate: '2024-06-15T09:00',
    endDate: '2024-06-15T17:00'
  });

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  const monthName = currentDate.toLocaleString('tr-TR', { month: 'long' });
  const year = currentDate.getFullYear();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(e => e.startDate.startsWith(dateStr));
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.instructorName) return;

    const newEvent: TrainingEvent = {
      id: `ETK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: formData.title,
      instructorName: formData.instructorName,
      opportunityId: formData.opportunityId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'Planlandı'
    };

    onAddEvent(newEvent);
    setIsAddModalOpen(false);
    setFormData({
      title: '',
      instructorName: '',
      opportunityId: '',
      startDate: '2024-06-15T09:00',
      endDate: '2024-06-15T17:00'
    });
  };

  const getStatusConfig = (status: TrainingEvent['status']) => {
    switch (status) {
      case 'Tamamlandı':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2 };
      case 'İptal Edildi':
        return { bg: 'bg-rose-50', text: 'text-rose-700', icon: XCircle };
      default:
        return { bg: 'bg-blue-50', text: 'text-blue-700', icon: Clock };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-body">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-heading text-slate-900 tracking-tight">Eğitmen Takvimi</h1>
          <p className="text-slate-500 mt-2 font-medium">Eğitim programını ve eğitmen doluluk durumlarını görüntüleyin.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 flex items-center">
            <button
              onClick={() => setActiveView('month')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${activeView === 'month' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <LayoutGrid size={14} /> Ay
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${activeView === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <List size={14} /> Liste
            </button>
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 uppercase text-xs tracking-widest"
          >
            <Plus size={18} />
            Eğitim Ekle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
            <h2 className="text-xl font-black text-slate-900 font-heading">
              {monthName} {year}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={() => handleNavigate('prev')} className="p-2.5 hover:bg-slate-50 rounded-full transition-colors text-slate-500"><ChevronLeft size={20} /></button>
              <button onClick={() => setCurrentDate(new Date())} className="px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all uppercase tracking-widest">Bugün</button>
              <button onClick={() => handleNavigate('next')} className="p-2.5 hover:bg-slate-50 rounded-full transition-colors text-slate-500"><ChevronRight size={20} /></button>
            </div>
          </div>

          {activeView === 'month' ? (
            <div className="p-8">
              <div className="grid grid-cols-7 mb-4">
                {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map(day => (
                  <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-4">
                {blanks.map(i => (<div key={`blank-${i}`} className="h-24 md:h-32"></div>))}
                {days.map(day => {
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const dayEvents = getEventsForDate(date);
                  const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth();
                  const isToday = day === 15 && currentDate.getMonth() === 5; // Demo için 15 Haziran

                  return (
                    <div 
                      key={day} 
                      onClick={() => handleDayClick(day)}
                      className={`h-24 md:h-32 border rounded-2xl p-2 cursor-pointer transition-all hover:shadow-md flex flex-col gap-1 ${
                        isSelected ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50' : 
                        isToday ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-sm font-bold ${isToday ? 'text-blue-600' : 'text-slate-700'}`}>{day}</span>
                        {dayEvents.length > 0 && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                      </div>
                      <div className="flex-1 overflow-hidden space-y-1">
                        {dayEvents.slice(0, 2).map(e => (
                          <div key={e.id} className="text-[9px] truncate px-1.5 py-0.5 rounded bg-white border border-slate-100 text-slate-600 font-bold shadow-sm">
                            {e.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[9px] text-slate-400 font-bold px-1">+ {dayEvents.length - 2} daha</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {events.map(event => (
                <div key={event.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-sm">
                      {new Date(event.startDate).getDate()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{event.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><User size={14}/> {event.instructorName}</span>
                        <span className="flex items-center gap-1"><Clock size={14}/> {new Date(event.startDate).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{event.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Selected Date Details */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[200px]">
            <h3 className="font-bold text-lg font-heading text-slate-900 mb-4 border-b border-slate-100 pb-4">
              {selectedDate 
                ? selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' }) 
                : 'Bir tarih seçin'}
            </h3>
            
            <div className="space-y-3">
              {selectedDate ? (
                getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map(e => {
                     const conf = getStatusConfig(e.status);
                     const Icon = conf.icon;
                     return (
                        <div key={e.id} className={`p-4 rounded-2xl border ${conf.bg.replace('bg-', 'border-').replace('50', '200')} ${conf.bg}`}>
                          <div className="flex items-start justify-between mb-2">
                             <h4 className={`font-bold text-sm ${conf.text}`}>{e.title}</h4>
                             <Icon size={16} className={conf.text} />
                          </div>
                          <p className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
                            <User size={12} /> {e.instructorName}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                            <Clock size={12} /> 09:00 - 17:00
                          </p>
                        </div>
                     );
                  })
                ) : (
                  <p className="text-slate-400 text-sm text-center py-8 font-medium">Bu tarihte planlanmış eğitim bulunmuyor.</p>
                )
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-slate-400 text-sm font-medium">Detayları görmek için takvimden bir gün seçin.</p>
                </div>
              )}
            </div>
          </div>

          {/* Instructor List */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <h3 className="font-bold text-lg font-heading text-slate-900 mb-4">Eğitmenler</h3>
             <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {instructors.map(ins => (
                  <div key={ins.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-xs font-black text-slate-500 shadow-sm">
                           {ins.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-900">{ins.name}</p>
                           <p className="text-[10px] text-slate-400">{ins.specialty}</p>
                        </div>
                     </div>
                     <div className={`w-2 h-2 rounded-full ${ins.isOnLeave ? 'bg-rose-500' : 'bg-emerald-500'}`} title={ins.isOnLeave ? 'İzinde' : 'Aktif'}></div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900 font-heading">Eğitim Planla</h2>
              <button onClick={() => setIsAddModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-900" /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-8 space-y-5">
               <div className="space-y-2">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Başlık</label>
                 <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Eğitim başlığı..." required />
               </div>
               
               <div className="space-y-2">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Eğitmen</label>
                 <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20" value={formData.instructorName} onChange={e => setFormData({...formData, instructorName: e.target.value})} required>
                   <option value="">Seçiniz...</option>
                   {instructors.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                 </select>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Başlangıç</label>
                   <input type="datetime-local" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Bitiş</label>
                   <input type="datetime-local" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
                 </div>
               </div>

               <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-blue-500/30">Ekle</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorCalendar;
