
import React from 'react';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  ListTodo,
  CheckCircle,
  MoreHorizontal
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Customer, Opportunity, TrainingEvent, OpportunityStatus, ViewType, GlobalTask, GlobalTaskStatus } from '../types';

interface DashboardProps {
  customers: Customer[];
  opportunities: Opportunity[];
  events: TrainingEvent[];
  globalTasks: GlobalTask[];
  onViewChange: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ customers, opportunities, events, globalTasks, onViewChange }) => {
  const wonOpportunities = opportunities.filter(o => o.status === OpportunityStatus.WON);
  const totalRevenue = wonOpportunities.reduce((sum, o) => sum + (o.amount || 0), 0);
  
  const stats = [
    { label: 'Toplam Müşteri', value: customers.length, icon: <Users size={24} className="text-white" />, color: 'bg-blue-500', change: '+%12', trend: 'up' },
    { label: 'Aktif Fırsatlar', value: opportunities.length, icon: <Briefcase size={24} className="text-white" />, color: 'bg-purple-500', change: '+%5', trend: 'up' },
    { label: 'Beklenen Gelir', value: `₺${totalRevenue.toLocaleString()}`, icon: <TrendingUp size={24} className="text-white" />, color: 'bg-emerald-500', change: '+%18', trend: 'up' },
    { label: 'Yaklaşan Eğitim', value: events.length, icon: <CalendarIcon size={24} className="text-white" />, color: 'bg-amber-500', change: '-%2', trend: 'down' },
  ];

  const salesData = [
    { name: 'Yeni', value: opportunities.filter(o => o.status === OpportunityStatus.NEW).length },
    { name: 'Keşif', value: opportunities.filter(o => o.status === OpportunityStatus.DISCOVERY).length },
    { name: 'Teklif', value: opportunities.filter(o => o.status === OpportunityStatus.PROPOSAL).length },
    { name: 'Pazarlık', value: opportunities.filter(o => o.status === OpportunityStatus.NEGOTIATION).length },
    { name: 'Kazanıldı', value: opportunities.filter(o => o.status === OpportunityStatus.WON).length },
  ];

  const COLORS_CHART = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const pendingTasks = globalTasks.filter(t => t.status === GlobalTaskStatus.PENDING).slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-heading text-slate-900 tracking-tight">Güncel Durum</h1>
          <p className="text-slate-500 mt-2 font-medium">FranCo operasyonunun anlık özeti ve metrikleri.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            Rapor İndir
          </button>
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95">
            Analiz Oluştur
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${stat.color} shadow-${stat.color.replace('bg-', '')}/30 group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
                {stat.change}
              </div>
            </div>
            <div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</h3>
              <p className="text-3xl font-black text-slate-900 font-heading">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 min-w-0">
          {/* Sales Funnel Chart */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                   <TrendingUp size={20} />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg font-heading text-slate-900">Satış Hunisi</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Aşama Dağılımı</p>
                 </div>
              </div>
              
              <div className="flex gap-2">
                 {['Ay', 'Çeyrek', 'Yıl'].map(period => (
                   <button key={period} className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                     {period}
                   </button>
                 ))}
              </div>
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} barGap={0}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px 16px'}}
                    itemStyle={{fontSize: '12px', fontWeight: 'bold', color: '#1e293b'}}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={48}>
                    {salesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_CHART[index % COLORS_CHART.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-8 min-w-0">
          {/* Upcoming Trainings Widget */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <CalendarIcon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-heading text-slate-900">Eğitimler</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Yaklaşan Program</p>
                  </div>
               </div>
               <button onClick={() => onViewChange('calendar')} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                 <ArrowUpRight size={20} />
               </button>
            </div>
            
            <div className="flex-1 space-y-4">
              {events.length > 0 ? events.slice(0, 3).map((event) => (
                <div 
                  key={event.id} 
                  onClick={() => onViewChange('calendar')}
                  className="flex gap-5 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col items-center justify-center w-14 h-14 bg-white border border-slate-100 text-blue-600 rounded-2xl font-black shadow-sm group-hover:scale-110 transition-transform">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400">HAZ</span>
                    <span className="text-xl leading-none">15</span>
                  </div>
                  <div className="truncate flex-1 py-1">
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate text-sm font-heading">{event.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium flex items-center gap-1">
                      <Clock size={12} className="text-amber-500" />
                      09:00 - 17:00
                    </p>
                  </div>
                </div>
              )) : (
                <div className="py-10 flex flex-col items-center justify-center text-slate-400">
                  <CalendarIcon size={32} className="mb-2 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">Planlanmış eğitim yok</p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Tasks Widget */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <ListTodo size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-heading text-slate-900">Görevler</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Yapılacaklar</p>
                  </div>
               </div>
               <button onClick={() => onViewChange('tasks')} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                 <ArrowUpRight size={20} />
               </button>
            </div>

            <div className="flex-1 space-y-3">
              {pendingTasks.length > 0 ? pendingTasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => onViewChange('tasks')}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                     <div className="mt-0.5 p-1 rounded-full border-2 border-slate-300 group-hover:border-blue-500 transition-colors"></div>
                     <div className="flex-1">
                        <h4 className="font-bold text-slate-700 text-sm group-hover:text-slate-900 transition-colors line-clamp-1">{task.title}</h4>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[9px] font-black bg-white px-2 py-0.5 rounded-md border border-slate-100 text-slate-400 uppercase tracking-wider">{task.assignedTo}</span>
                          <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wider">{task.dueDate}</span>
                        </div>
                     </div>
                  </div>
                </div>
              )) : (
                <div className="py-10 flex flex-col items-center justify-center text-slate-400">
                  <CheckCircle size={32} className="mb-2 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">Bekleyen görev yok</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
