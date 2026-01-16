
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Trash2, 
  Plus, 
  Edit2, 
  Check, 
  X,
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  Zap,
  Database,
  Save
} from 'lucide-react';

interface SettingsProps {
  trainingTypes: string[];
  setTrainingTypes: React.Dispatch<React.SetStateAction<string[]>>;
}

const Settings: React.FC<SettingsProps> = ({ trainingTypes, setTrainingTypes }) => {
  const [newTypeName, setNewTypeName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    if (trainingTypes.includes(newTypeName.trim())) {
      alert('Bu eğitim türü zaten mevcut.');
      return;
    }
    setTrainingTypes([...trainingTypes, newTypeName.trim()]);
    setNewTypeName('');
  };

  const handleDeleteType = (index: number) => {
    if (window.confirm('Bu eğitim türünü silmek istediğinize emin misiniz? Mevcut fırsatları etkileyebilir.')) {
      const updated = trainingTypes.filter((_, i) => i !== index);
      setTrainingTypes(updated);
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingValue(trainingTypes[index]);
  };

  const saveEdit = () => {
    if (!editingValue.trim() || editingIndex === null) return;
    const updated = [...trainingTypes];
    updated[editingIndex] = editingValue.trim();
    setTrainingTypes(updated);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-3xl font-black font-heading text-slate-900 tracking-tight flex items-center gap-3">
          <div className="p-2 bg-slate-900 text-white rounded-xl">
            <SettingsIcon size={24} />
          </div>
          Sistem Ayarları
        </h1>
        <p className="text-slate-500 font-medium ml-14">FranCo altyapısını ve veri sözlüklerini yönetin.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Training Types Management */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <GraduationCap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl font-heading text-slate-900">Eğitim Türleri</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kategori Yönetimi</p>
              </div>
            </div>
            <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-slate-900/20">
              {trainingTypes.length} Aktif Tür
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
             <form onSubmit={handleAddType} className="flex gap-3">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="Yeni eğitim türü adı..." 
                  className="w-full pl-5 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-normal"
                />
              </div>
              <button 
                type="submit"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 uppercase text-xs tracking-widest"
              >
                <Plus size={18} />
                <span>Ekle</span>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainingTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
                      <Zap size={18} />
                    </div>
                    {editingIndex === index ? (
                      <input 
                        autoFocus
                        type="text"
                        className="flex-1 bg-slate-50 px-3 py-2 border border-blue-500 rounded-lg outline-none text-sm font-bold shadow-sm"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') setEditingIndex(null);
                        }}
                      />
                    ) : (
                      <span className="text-sm font-bold text-slate-700">{type}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {editingIndex === index ? (
                      <>
                        <button 
                          onClick={saveEdit}
                          className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => setEditingIndex(null)}
                          className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => startEditing(index)}
                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteType(index)}
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
        </div>

        {/* Security & System Info */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="p-5 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10">
                <ShieldCheck size={40} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black font-heading">Yönetici Yetkileri</h3>
                <p className="text-slate-400 text-sm mt-2 max-w-md font-medium leading-relaxed">Sözlük değişiklikleri ve sistem yapılandırmaları tüm şirket verilerini anlık olarak günceller. Bu alandaki değişiklikler geri alınamaz.</p>
                <div className="flex items-center gap-3 mt-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                     <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Veritabanı Aktif</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                     <Database size={12} className="text-blue-400" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">v2.4.0</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-blue-50 transition-all whitespace-nowrap shadow-xl uppercase text-xs tracking-widest flex items-center gap-2">
              <Save size={16} />
              Yedek Al
            </button>
          </div>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
