
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  X, 
  CheckCircle2, 
  User, 
  Calendar,
  ListTodo
} from 'lucide-react';
import { GlobalTask, GlobalTaskStatus, Instructor } from '../types';

interface TasksProps {
  tasks: GlobalTask[];
  instructors: Instructor[];
  onAddTask: (task: GlobalTask) => void;
  onUpdateStatus: (id: string, status: GlobalTaskStatus) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, instructors, onAddTask, onUpdateStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<GlobalTaskStatus | 'Tümü'>('Tümü');
  const [assignedToFilter, setAssignedToFilter] = useState<string>('Hepsi');
  const [dateSortOrder, setDateSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  // Priority alanı için tip tanımını açıkça belirttik ('as const' yerine union type kullandık)
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    assignedTo: string;
    dueDate: string;
    priority: 'Düşük' | 'Orta' | 'Yüksek';
  }>({
    title: '',
    description: '',
    assignedTo: 'Yönetici',
    dueDate: '',
    priority: 'Orta'
  });

  // Unique list of assignees for the filter
  const assignees = useMemo(() => {
    const set = new Set(tasks.map(t => t.assignedTo));
    return Array.from(set).sort();
  }, [tasks]);

  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks.filter(task => {
      const matchesStatus = statusFilter === 'Tümü' || task.status === statusFilter;
      const matchesAssignee = assignedToFilter === 'Hepsi' || task.assignedTo === assignedToFilter;
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            task.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesAssignee && matchesSearch;
    });

    // Sort by Due Date
    result.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [tasks, statusFilter, assignedToFilter, dateSortOrder, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) return;

    const newTask: GlobalTask = {
      id: `G-TSK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: formData.title,
      description: formData.description,
      assignedTo: formData.assignedTo,
      assignedBy: 'Yönetici',
      dueDate: formData.dueDate,
      status: GlobalTaskStatus.PENDING,
      priority: formData.priority,
      createdAt: new Date().toISOString()
    };

    onAddTask(newTask);
    setIsModalOpen(false);
    setFormData({ title: '', description: '', assignedTo: 'Yönetici', dueDate: '', priority: 'Orta' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Yüksek': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Orta': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Düşük': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-heading text-slate-900 tracking-tight">Operasyonel Görevler</h1>
          <p className="text-slate-500 mt-2 font-medium">Ekip içi atamaları ve iş akışını yönetin.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 uppercase text-xs tracking-widest"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          <span>Yeni Görev</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8">
        {/* Filter Controls Bar */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-6 mb-8">
           <div className="relative w-full xl:max-w-md group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
             <input 
               type="text" 
               placeholder="Görevlerde ara..." 
               className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>

           <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
              <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                {['Tümü', GlobalTaskStatus.PENDING, GlobalTaskStatus.COMPLETED].map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f as any)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wide ${
                      statusFilter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {f === GlobalTaskStatus.PENDING ? 'Bekleyen' : f === GlobalTaskStatus.COMPLETED ? 'Tamamlanan' : 'Tümü'}
                  </button>
                ))}
              </div>

              <select 
                value={assignedToFilter}
                onChange={(e) => setAssignedToFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
              >
                <option value="Hepsi">Tüm Sorumlular</option>
                <option value="Yönetici">Yönetici</option>
                {assignees.filter(a => a !== 'Yönetici').map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredAndSortedTasks.length > 0 ? filteredAndSortedTasks.map((task) => (
            <div key={task.id} className="p-6 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/50 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 group">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                 {/* Checkbox */}
                 <button 
                    onClick={() => onUpdateStatus(task.id, task.status === GlobalTaskStatus.PENDING ? GlobalTaskStatus.COMPLETED : GlobalTaskStatus.PENDING)}
                    className={`flex-shrink-0 w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${
                      task.status === GlobalTaskStatus.COMPLETED 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                        : 'border-slate-200 bg-white text-transparent hover:border-blue-400'
                    }`}
                  >
                    <CheckCircle2 size={24} strokeWidth={3} />
                  </button>

                  <div className="flex-1 space-y-2">
                     <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <h3 className={`font-bold text-lg text-slate-900 font-heading transition-all ${task.status === GlobalTaskStatus.COMPLETED ? 'line-through text-slate-400' : ''}`}>
                          {task.title}
                        </h3>
                     </div>
                     <p className={`text-sm font-medium ${task.status === GlobalTaskStatus.COMPLETED ? 'text-slate-300' : 'text-slate-500'}`}>
                       {task.description}
                     </p>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                     <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg">
                        <User size={12} className="text-slate-500" />
                        <span className="text-xs font-bold text-slate-700">{task.assignedTo}</span>
                     </div>
                     <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg">
                        <Calendar size={12} className="text-slate-500" />
                        <span className="text-xs font-bold text-slate-700">{task.dueDate}</span>
                     </div>
                  </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <ListTodo size={40} className="text-slate-300" />
              </div>
              <p className="text-slate-900 font-bold text-lg">Görev Bulunamadı</p>
              <p className="text-slate-500 mt-1 max-w-xs mx-auto">Arama kriterlerinize uygun bir kayıt yok. Yeni bir görev oluşturmayı deneyin.</p>
              <button 
                onClick={() => { setStatusFilter('Tümü'); setAssignedToFilter('Hepsi'); setSearchQuery(''); }}
                className="mt-6 px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <ListTodo size={24} />
                 </div>
                 <div>
                   <h2 className="text-xl font-black text-slate-900 font-heading">Yeni Görev</h2>
                   <p className="text-slate-500 text-xs font-bold mt-0.5 uppercase tracking-wide">Ekip İçi Atama</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Görev Başlığı</label>
                <input 
                  required
                  autoFocus
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                  placeholder="Örn: Müşteri memnuniyet anketini tamamla"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Açıklama</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none font-medium text-sm"
                  placeholder="Görevin detaylarını buraya yazın..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Sorumlu Kişi</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  >
                    <option value="Yönetici">Yönetici (Ben)</option>
                    {instructors.map(ins => (
                      <option key={ins.id} value={ins.name}>{ins.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Termin Tarihi</label>
                  <input 
                    required
                    type="date" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Öncelik Seviyesi</label>
                <div className="flex gap-3">
                  {['Düşük', 'Orta', 'Yüksek'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({...formData, priority: p as 'Düşük' | 'Orta' | 'Yüksek'})}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                        formData.priority === p 
                          ? (p === 'Yüksek' ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30' : 
                             p === 'Orta' ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30' : 
                             'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30')
                          : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 flex items-center justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all uppercase text-xs tracking-widest"
                >
                  Vazgeç
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 uppercase text-xs tracking-widest flex items-center gap-2"
                >
                  <Plus size={16} />
                  Görevi Ata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
