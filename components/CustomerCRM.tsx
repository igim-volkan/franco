
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Search, 
  Filter, 
  Building2, 
  Users2,
  X,
  User,
  MapPin,
  CreditCard,
  Briefcase,
  ChevronRight,
  Mail,
  Phone,
  LayoutGrid,
  List,
  ArrowUpRight,
  TrendingUp,
  Globe,
  MoreHorizontal
} from 'lucide-react';
import { Customer } from '../types';

interface CustomerCRMProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onViewCustomer: (customerId: string) => void;
}

const getRandomGradient = (name: string) => {
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-amber-500',
    'from-purple-500 to-pink-500',
    'from-indigo-500 to-violet-500',
    'from-rose-500 to-red-500'
  ];
  const index = name.length % gradients.length;
  return gradients[index];
};

const CustomerCRM: React.FC<CustomerCRMProps> = ({ customers, onAddCustomer, onViewCustomer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSector, setSelectedSector] = useState<string>('Tümü');
  
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    billingInfo: '',
    sector: '',
    employeeCount: ''
  });

  const uniqueSectors = useMemo(() => {
    const sectors = new Set(customers.map(c => c.sector));
    return ['Tümü', ...Array.from(sectors)];
  }, [customers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contactPerson) return;

    const newCustomer: Customer = {
      id: `MST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      billingInfo: formData.billingInfo,
      sector: formData.sector,
      employeeCount: parseInt(formData.employeeCount) || 0,
      createdAt: new Date().toISOString()
    };

    onAddCustomer(newCustomer);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '', billingInfo: '', sector: '', employeeCount: '' });
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'Tümü' || c.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  // Stats Logic
  const totalEmployees = customers.reduce((acc, curr) => acc + curr.employeeCount, 0);
  const newThisMonth = customers.filter(c => {
    const date = new Date(c.createdAt);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 font-heading">Müşteriler</h1>
          <p className="text-slate-500 mt-2 font-medium">Kurumsal ilişkilerinizi ve portföyünüzü yönetin.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Müşteri Ekle</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-all">
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Toplam Portföy</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900 font-heading">{customers.length}</h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ArrowUpRight size={12} /> %12
              </span>
            </div>
          </div>
          <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Building2 size={64} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-purple-200 transition-all">
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Toplam Erişim (Çalışan)</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900 font-heading">{(totalEmployees / 1000).toFixed(1)}k+</h3>
              <span className="text-xs font-bold text-slate-400">Kişi</span>
            </div>
          </div>
          <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Users2 size={64} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-all">
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bu Ay Eklenen</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900 font-heading">{newThisMonth}</h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Yeni Kurum</span>
            </div>
          </div>
          <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp size={64} />
          </div>
        </div>
      </div>

      {/* Controls: Search, Filter, View Toggle */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sticky top-0 bg-slate-50/90 backdrop-blur-sm z-10 py-2">
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Şirket, yetkili veya sektör ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 hidden sm:flex">
             <button 
               onClick={() => setViewMode('grid')}
               className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
             >
               <LayoutGrid size={20} />
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
             >
               <List size={20} />
             </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
           {uniqueSectors.map(sector => (
             <button
               key={sector}
               onClick={() => setSelectedSector(sector)}
               className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                 selectedSector === sector 
                   ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20' 
                   : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
               }`}
             >
               {sector}
             </button>
           ))}
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
            <div 
              key={customer.id} 
              onClick={() => onViewCustomer(customer.id)}
              className="group bg-white rounded-[2rem] p-6 border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getRandomGradient(customer.name)} shadow-lg flex items-center justify-center text-white text-2xl font-black`}>
                  {customer.name.substring(0, 1)}
                </div>
                <button className="p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="mb-6 flex-1">
                <h3 className="text-lg font-bold text-slate-900 font-heading line-clamp-1 group-hover:text-blue-600 transition-colors">{customer.name}</h3>
                <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                  <User size={14} />
                  {customer.contactPerson}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    <Briefcase size={12} /> {customer.sector}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    <Users2 size={12} /> {customer.employeeCount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between gap-2">
                <div className="flex gap-1">
                  {customer.phone && (
                    <button 
                      onClick={(e) => e.stopPropagation()} 
                      className="p-2.5 bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors" title="Ara"
                    >
                      <Phone size={16} />
                    </button>
                  )}
                  {customer.email && (
                    <button 
                      onClick={(e) => e.stopPropagation()} 
                      className="p-2.5 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors" title="E-posta Gönder"
                    >
                      <Mail size={16} />
                    </button>
                  )}
                </div>
                <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-slate-900/20 translate-y-2 group-hover:translate-y-0">
                  Detaylar
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Sonuç Bulunamadı</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">Arama kriterlerinize uygun müşteri kaydı bulunmuyor.</p>
              <button onClick={() => { setSearchQuery(''); setSelectedSector('Tümü'); }} className="mt-4 text-blue-600 font-bold hover:underline">Filtreleri Temizle</button>
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-5">Şirket</th>
                <th className="px-6 py-5">Sektör</th>
                <th className="px-6 py-5">İlgili Kişi</th>
                <th className="px-6 py-5">İletişim</th>
                <th className="px-6 py-5 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  onClick={() => onViewCustomer(customer.id)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getRandomGradient(customer.name)} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                        {customer.name.substring(0, 1)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{customer.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold">
                      {customer.sector}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <User size={14} className="text-slate-300" />
                       <span className="text-sm font-medium text-slate-700">{customer.contactPerson}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      {customer.email && <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600" title={customer.email}><Mail size={14}/></div>}
                      {customer.phone && <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600" title={customer.phone}><Phone size={14}/></div>}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <ChevronRight className="inline text-slate-300 group-hover:text-blue-600 transition-colors" size={18} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <Building2 size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 font-heading">Yeni Müşteri</h2>
                  <p className="text-slate-500 text-xs font-bold mt-0.5 uppercase tracking-wide">Kurumsal Kayıt Formu</p>
                </div>
              </div>
              <button 
                onClick={closeModal} 
                className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-full shadow-sm transition-all border border-transparent hover:border-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                {/* Şirket Adı */}
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Globe size={12} className="text-blue-500" />
                    Şirket / Müşteri Adı
                  </label>
                  <input 
                    required
                    autoFocus
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-normal"
                    placeholder="Örn: FranCo Eğitim Hizmetleri A.Ş."
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                {/* İlgili Kişi */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={12} className="text-blue-500" />
                    Kontak Kişisi
                  </label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                    placeholder="Ad Soyad"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  />
                </div>

                {/* Sektör */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase size={12} className="text-blue-500" />
                    Sektör
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                    placeholder="Örn: Teknoloji"
                    value={formData.sector}
                    onChange={(e) => setFormData({...formData, sector: e.target.value})}
                  />
                </div>

                {/* E-posta */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Mail size={12} className="text-blue-500" />
                    E-posta
                  </label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                    placeholder="ornek@sirket.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                {/* Telefon */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Phone size={12} className="text-blue-500" />
                    Telefon
                  </label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                    placeholder="+90 5XX..."
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                {/* Çalışan Sayısı */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Users2 size={12} className="text-blue-500" />
                    Ölçek (Çalışan)
                  </label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                    placeholder="Örn: 250"
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({...formData, employeeCount: e.target.value})}
                  />
                </div>

                {/* Adres */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={12} className="text-blue-500" />
                    Lokasyon / Adres
                  </label>
                  <input 
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                    placeholder="Tam adres..."
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                {/* Fatura Bilgileri */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <CreditCard size={12} className="text-blue-500" />
                    Fatura Başlığı & Vergi No
                  </label>
                  <textarea 
                    rows={2}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none font-medium"
                    placeholder="Resmi fatura bilgileri..."
                    value={formData.billingInfo}
                    onChange={(e) => setFormData({...formData, billingInfo: e.target.value})}
                  />
                </div>
              </div>

              {/* Modal Footer / Actions */}
              <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all uppercase text-xs tracking-widest"
                >
                  Vazgeç
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98] uppercase text-xs tracking-widest flex items-center gap-2"
                >
                  <Plus size={16} />
                  Müşteriyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCRM;
