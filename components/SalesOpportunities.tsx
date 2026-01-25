
import React, { useState } from 'react';
import {
  Plus,
  MoreVertical,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  X,
  FileText,
  CheckCircle,
  Circle,
  Loader2,
  CalendarDays,
  ListTodo,
  Filter,
  Sparkles,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Pencil
} from 'lucide-react';
import { Opportunity, Customer, OpportunityStatus, OpportunityTask, TaskStatus } from '../types';
import { STATUS_STEPS } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface SalesOpportunitiesProps {
  opportunities: Opportunity[];
  customers: Customer[];
  trainingTypes: string[];
  onAddOpportunity: (opp: Opportunity) => void;
  onUpdateStatus: (id: string, status: OpportunityStatus) => void;
  onAddTask: (opportunityId: string, task: OpportunityTask) => void;
  onUpdateTaskStatus: (opportunityId: string, taskId: string, status: TaskStatus) => void;
}

const StatusBar: React.FC<{ currentStatus: OpportunityStatus, onStatusClick: (s: OpportunityStatus) => void }> = ({ currentStatus, onStatusClick }) => {
  const currentIndex = STATUS_STEPS.indexOf(currentStatus);

  const getStatusText = (status: OpportunityStatus) => {
    switch (status) {
      case OpportunityStatus.PROPOSAL_SENT: return 'Teklif Verildi';
      case OpportunityStatus.PROPOSAL_DISCUSSED: return 'Teklif Görüşüldü';
      case OpportunityStatus.PROPOSAL_DETAILED: return 'Teklif Detaylandırıldı';
      case OpportunityStatus.CLOSE_TO_CLOSING: return 'Bitmeye Çok Yakın';
      default: return status;
    }
  };

  return (
    <div className="flex items-center w-full gap-2 py-4 px-2">
      {STATUS_STEPS.map((status, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        // Check if finished
        const isWon = currentStatus === OpportunityStatus.WON;
        const isLost = currentStatus === OpportunityStatus.LOST;

        return (
          <React.Fragment key={status}>
            <button
              onClick={() => onStatusClick(status)}
              className={`flex-1 flex flex-col items-center gap-1 group focus:outline-none relative py-1`}
            >
              <div className={`w-full h-2 rounded-full transition-all duration-500 ${isWon ? 'bg-emerald-400' :
                isLost ? 'bg-slate-200' :
                  isCompleted ? 'bg-blue-400' :
                    isActive ? 'bg-blue-600' :
                      'bg-slate-100 group-hover:bg-slate-200'
                }`}></div>

              <span className={`text-[10px] uppercase font-black tracking-widest whitespace-nowrap px-2 py-1 rounded-lg mt-2 transition-all ${isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-400 opacity-50'
                }`}>
                {getStatusText(status)}
              </span>
            </button>
            {index < STATUS_STEPS.length - 1 && <div className={`h-[2px] flex-1 ${index < currentIndex ? (isWon ? 'bg-emerald-200' : 'bg-blue-200') : 'bg-slate-100'}`} />}
          </React.Fragment>
        );
      })}

      {/* End Actions */}
      <div className="flex gap-2 ml-4 pl-4 border-l border-slate-100">
        <button
          onClick={() => onStatusClick(OpportunityStatus.WON)}
          className={`p-2 rounded-xl transition-all ${currentStatus === OpportunityStatus.WON ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'}`}>
          <CheckCircle2 size={16} />
        </button>
        <button
          onClick={() => onStatusClick(OpportunityStatus.LOST)}
          className={`p-2 rounded-xl transition-all ${currentStatus === OpportunityStatus.LOST ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600'}`}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const SalesOpportunities: React.FC<SalesOpportunitiesProps> = ({
  opportunities,
  customers,
  trainingTypes,
  onAddOpportunity,
  onUpdateStatus,
  onAddTask,
  onUpdateTaskStatus
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'requests'>('list');
  const [taskFilters, setTaskFilters] = useState<Record<string, TaskStatus | 'Hepsi'>>({});
  const [newTaskInput, setNewTaskInput] = useState<Record<string, { text: string, date: string }>>({});

  // AI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  // Status Confirmation State
  const [pendingStatusChange, setPendingStatusChange] = useState<{ oppId: string, newStatus: OpportunityStatus } | null>(null);

  const [formData, setFormData] = useState({
    customerId: '',
    trainingTopics: [] as string[], // Changed to array
    currency: 'TL' as 'TL' | 'USD' | 'EUR',
    priceUnit: 'Günlük' as 'Toplam' | 'Günlük' | 'Saatlik',
    amount: '',
    description: '',
    dateRequest: ''
  });

  const handleGenerateOutline = async (opp: Opportunity) => {
    if (!process.env.API_KEY) {
      alert("API Key eksik!");
      return;
    }

    setIsGenerating(true);
    setAiSuggestion(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: `Eğitim Şirketi için bir taslak oluştur.
        Müşteri: ${opp.customerName}
        Konu: ${opp.trainingTopics.join(', ')}
        Notlar: ${opp.description}
        
        Lütfen 3 maddelik kısa bir eğitim içeriği önerisi ve 2 adet satış odaklı "kazanım" maddesi yaz.`,
      });
      setAiSuggestion(response.text);
    } catch (e) {
      console.error(e);
      alert("AI yanıtı alınamadı.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === formData.customerId);
    const newOpp: Opportunity = {
      id: `FRS-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: formData.customerId,
      customerName: customer?.name || 'Bilinmiyor',
      status: OpportunityStatus.PROPOSAL_SENT,

      trainingTopics: formData.trainingTopics,
      currency: formData.currency,
      priceUnit: formData.priceUnit,
      amount: parseFloat(formData.amount) || 0,
      description: formData.description,
      requestedDates: formData.dateRequest ? [formData.dateRequest] : [],
      tasks: [],
      createdAt: new Date().toISOString()
    };
    onAddOpportunity(newOpp);
    setIsModalOpen(false);
    setFormData({
      customerId: '',
      trainingTopics: [],
      currency: 'TL',
      priceUnit: 'Günlük',
      amount: '',
      description: '',
      dateRequest: ''
    });
  };

  const handleTaskAdd = (opportunityId: string) => {
    const input = newTaskInput[opportunityId];
    if (!input || !input.text.trim()) return;

    const newTask: OpportunityTask = {
      id: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
      text: input.text,
      dueDate: input.date || new Date().toISOString().split('T')[0],
      status: TaskStatus.TODO
    };

    onAddTask(opportunityId, newTask);
    setNewTaskInput({ ...newTaskInput, [opportunityId]: { text: '', date: '' } });
  };

  const getTaskIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE: return <CheckCircle className="text-emerald-500" size={18} />;
      case TaskStatus.IN_PROGRESS: return <Loader2 className="text-blue-500 animate-spin" size={18} />;
      default: return <Circle className="text-slate-300" size={18} />;
    }
  };

  const toggleTaskStatus = (oppId: string, task: OpportunityTask) => {
    let nextStatus: TaskStatus;
    if (task.status === TaskStatus.TODO) nextStatus = TaskStatus.IN_PROGRESS;
    else if (task.status === TaskStatus.IN_PROGRESS) nextStatus = TaskStatus.DONE;
    else nextStatus = TaskStatus.TODO;
    onUpdateTaskStatus(oppId, task.id, nextStatus);
  };

  const setOpportunityTaskFilter = (oppId: string, status: TaskStatus | 'Hepsi') => {
    setTaskFilters(prev => ({ ...prev, [oppId]: status }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-heading text-slate-900 tracking-tight">Satış Hattı</h1>
          <p className="text-slate-500 mt-2 font-medium">Fırsatları, teklifleri ve müşteri taleplerini yönetin.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 hidden sm:flex">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Fırsatlar
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'requests' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Tarih Talepleri
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 active:scale-95 uppercase text-xs tracking-widest"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            <span>Yeni Fırsat</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeTab === 'list' ? (
          opportunities.map((opp) => {
            const currentFilter = taskFilters[opp.id] || 'Hepsi';
            const displayedTasks = opp.tasks.filter(t => currentFilter === 'Hepsi' || t.status === currentFilter);

            return (
              <div key={opp.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group relative overflow-hidden">
                <div className="flex flex-col xl:flex-row gap-10 relative z-10">


                  {/* Left: Info */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-slate-200">{opp.id}</span>
                      <div className="flex flex-wrap gap-2">
                        {opp.trainingTopics.map(topic => (
                          <span key={topic} className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-blue-100 flex items-center gap-1">
                            <TrendingUp size={12} /> {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-3xl font-black text-slate-900 font-heading leading-tight mb-2 group-hover:text-blue-600 transition-colors">{opp.customerName}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed max-w-3xl">{opp.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                        <CalendarIcon size={16} className="text-blue-500" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Talep Tarihi</span>
                          <span className="text-xs font-bold text-slate-700">{opp.requestedDates.length > 0 ? opp.requestedDates.join(', ') : 'Belirlenmedi'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                        <Clock size={16} className="text-blue-500" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Oluşturma</span>
                          <span className="text-xs font-bold text-slate-700">{new Date(opp.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Teklif ({opp.currency})</span>
                          <span className="text-xs font-bold text-slate-700">
                            {(opp.amount || 0).toLocaleString()} {opp.currency} / {opp.priceUnit}
                          </span>
                        </div>
                      </div>

                      {/* AI Button */}
                      <button
                        onClick={() => handleGenerateOutline(opp)}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-fuchsia-500/20 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        {isGenerating ? 'Düşünüyor...' : 'AI Asistan'}
                      </button>
                    </div>

                    {aiSuggestion && (
                      <div className="mt-4 p-6 bg-slate-50 border border-slate-200 rounded-2xl relative animate-in fade-in zoom-in-95">
                        <div className="absolute top-4 right-4 text-violet-500"><BrainCircuit size={20} /></div>
                        <h4 className="text-xs font-black text-violet-600 uppercase tracking-widest mb-3">Gemini Önerisi</h4>
                        <div className="prose prose-sm prose-slate max-w-none text-xs leading-relaxed font-medium">
                          {aiSuggestion.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                        </div>
                        <button onClick={() => setAiSuggestion(null)} className="mt-3 text-[10px] font-bold text-slate-400 hover:text-slate-600 underline">Kapat</button>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions & Status */}
                  <div className="w-full xl:w-[450px] flex flex-col gap-6 pl-0 xl:pl-10 xl:border-l border-slate-100">


                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <ListTodo size={14} className="text-slate-600" />
                          Görevler
                        </h4>
                        <div className="flex bg-slate-100 p-0.5 rounded-lg">
                          {[TaskStatus.TODO, TaskStatus.DONE].map(f => (
                            <button key={f} onClick={() => setOpportunityTaskFilter(opp.id, f)} className={`p-1 rounded-md text-[8px] font-black uppercase transition-all ${taskFilters[opp.id] === f ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>
                              {f === TaskStatus.TODO ? 'Yapılacak' : 'Bitti'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 flex-1 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {displayedTasks.map(task => (
                          <div key={task.id} onClick={() => toggleTaskStatus(opp.id, task)} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-blue-200 cursor-pointer group transition-all">
                            {getTaskIcon(task.status)}
                            <span className={`text-xs font-bold flex-1 ${task.status === TaskStatus.DONE ? 'text-slate-300 line-through' : 'text-slate-700 group-hover:text-slate-900'}`}>{task.text}</span>
                            <span className="text-[9px] font-bold text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded uppercase">{task.dueDate.slice(5)}</span>
                          </div>
                        ))}

                        <div className="flex items-center gap-2 mt-2">
                          <input
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-blue-400 transition-all placeholder:text-slate-300"
                            placeholder="Hızlı görev ekle..."
                            value={newTaskInput[opp.id]?.text || ''}
                            onChange={(e) => setNewTaskInput({ ...newTaskInput, [opp.id]: { text: e.target.value, date: newTaskInput[opp.id]?.date || '' } })}
                            onKeyDown={(e) => e.key === 'Enter' && handleTaskAdd(opp.id)}
                          />
                          <button onClick={() => handleTaskAdd(opp.id)} className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom: Timeline (Full Width) */}
                <div className="w-full mt-8 pt-6 border-t border-slate-100 relative z-20">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <TrendingUp size={14} />
                    Süreç Yönetimi
                  </h4>
                  <StatusBar currentStatus={opp.status} onStatusClick={(s) => setPendingStatusChange({ oppId: opp.id, newStatus: s })} />
                </div>
              </div>
            );
          })
        ) : (
          /* Table View for Date Requests */
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Müşteri</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarihler</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Konu</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksiyon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {opportunities.filter(o => o.requestedDates.length > 0).map((opp) => (
                    <tr key={opp.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-6">
                        <div className="font-bold text-slate-900 text-sm">{opp.customerName}</div>
                        <div className="text-[10px] font-bold text-slate-400 mt-0.5">{opp.id}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-wrap gap-2">
                          {opp.requestedDates.map((date, i) => (
                            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-black border border-amber-100">
                              <CalendarDays size={12} />
                              {date}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-wrap gap-1">
                          {opp.trainingTopics.map(t => (
                            <span key={t} className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                          Planla
                        </button>
                      </td>
                    </tr>
                  ))}
                  {opportunities.filter(o => o.requestedDates.length > 0).length === 0 && (
                    <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-medium">Tarih talebi bulunamadı.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Status Confirmation Modal */}
      {
        pendingStatusChange && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 border border-white/20 animate-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 font-heading">Onay Gerekiyor</h3>
                  <p className="text-sm font-medium text-slate-500">Lütfen onay verin. Bu işlem statüyü değiştirecektir.</p>
                </div>
                <div className="flex gap-3 w-full mt-2">
                  <button
                    onClick={() => setPendingStatusChange(null)}
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors"
                  >
                    Vazgeç
                  </button>
                  <button
                    onClick={() => {
                      if (pendingStatusChange) {
                        onUpdateStatus(pendingStatusChange.oppId, pendingStatusChange.newStatus);
                        setPendingStatusChange(null);
                      }
                    }}
                    className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                  >
                    Tamam
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* New Opportunity Modal */}
      {
        isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20 flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 font-heading">Yeni Fırsat</h2>
                    <p className="text-slate-500 text-xs font-bold mt-0.5 uppercase tracking-wide">Satış Sürecini Başlat</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-100">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Müşteri</label>
                  <select
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  >
                    <option value="">Bir müşteri seçin...</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eğitim Konuları (Çoklu Seçilebilir)</label>
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-32 overflow-y-auto custom-scrollbar">
                      {trainingTypes.map(t => {
                        const isSelected = formData.trainingTopics.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setFormData({ ...formData, trainingTopics: formData.trainingTopics.filter(topic => topic !== t) });
                              } else {
                                setFormData({ ...formData, trainingTopics: [...formData.trainingTopics, t] });
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isSelected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                              }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Pricing Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tutar</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Para Birimi</label>
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                    >
                      <option value="TL">TL (₺)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Birim</label>
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                      value={formData.priceUnit}
                      onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value as any })}
                    >
                      <option value="Günlük">Günlük</option>
                      <option value="Saatlik">Saatlik</option>
                      <option value="Toplam">Toplam</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hedef Tarih</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                    value={formData.dateRequest}
                    onChange={(e) => setFormData({ ...formData, dateRequest: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notlar / Kapsam</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none font-medium text-sm"
                    placeholder="Kapsamı ve müşteri ihtiyaçlarını özetleyin..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="pt-6 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all uppercase text-xs tracking-widest"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98] uppercase text-xs tracking-widest flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Fırsatı Başlat
                  </button>
                </div>
              </form>
            </div >
          </div >
        )
      }
    </div >
  );
};

export default SalesOpportunities;
