
import React from 'react';
import {
  ArrowLeft,
  Building2,
  User,
  MapPin,
  CreditCard,
  Briefcase,
  Users2,
  Calendar,
  ExternalLink,
  Edit,
  History,
  TrendingUp,
  FileText,
  Plus,
  Mail,
  Phone,
  Send,
  MoreVertical
} from 'lucide-react';
import { Customer, Opportunity } from '../types';

interface CustomerDetailProps {
  customer: Customer;
  opportunities: Opportunity[];
  onBack: () => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer, opportunities, onBack }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors group"
        >
          <div className="p-2 bg-white border border-slate-200 rounded-full group-hover:border-slate-300 transition-colors">
            <ArrowLeft size={16} />
          </div>
          <span>Listeye Dön</span>
        </button>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
            <Edit size={14} />
            Düzenle
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95">
            <Plus size={14} />
            Yeni Fırsat
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Core Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8 relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-10"></div>

            <div className="relative flex flex-col items-center text-center pb-8 border-b border-slate-100">
              <div className="w-28 h-28 bg-white rounded-[2rem] flex items-center justify-center text-blue-600 shadow-2xl shadow-blue-500/20 mb-6 border-4 border-white">
                <Building2 size={48} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 font-heading">{customer.name}</h1>
              <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-black">{customer.id}</p>

              <div className="flex gap-2 mt-6">
                <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                  <Mail size={20} />
                </button>
                <button className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors">
                  <Phone size={20} />
                </button>
                <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">İlgili Kişi</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{customer.contactPerson}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adres</p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5 leading-relaxed">{customer.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <Briefcase size={12} /> Sektör
                  </p>
                  <p className="text-sm font-bold text-slate-900">{customer.sector}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <Users2 size={12} /> Ölçek
                  </p>
                  <p className="text-sm font-bold text-slate-900">{customer.employeeCount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] shadow-xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-3">
                <CreditCard size={20} className="text-blue-400" />
                Fatura Bilgileri
              </h3>
              <div className="p-5 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-sm space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fatura Adresi</p>
                  <p className="text-sm text-slate-200 leading-relaxed font-mono">
                    {customer.billingAddress}
                  </p>
                </div>
                <div className="flex gap-8 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vergi Dairesi</p>
                    <p className="text-sm font-bold text-white">{customer.taxOffice}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vergi Numarası</p>
                    <p className="text-sm font-bold text-white tracking-wider font-mono">{customer.taxNumber}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/30 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Right Column: Activity and Opportunities */}
        <div className="lg:col-span-8 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg transition-all">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Toplam Fırsat</p>
              <p className="text-4xl font-black text-slate-900 font-heading">{opportunities.length}</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg transition-all">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kazanılan Gelir</p>
              <p className="text-4xl font-black text-emerald-600 font-heading tracking-tight">
                ₺{opportunities.filter(o => o.status === 'Kazanıldı').reduce((sum, o) => sum + (o.amount || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg transition-all">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Müşteri Puanı</p>
              <p className="text-4xl font-black text-blue-600 font-heading">9.8</p>
            </div>
          </div>

          {/* Sales Opportunities History */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-black text-xl font-heading text-slate-900">Satış Geçmişi</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tüm etkileşimler</p>
              </div>
              <button className="text-blue-600 text-xs font-bold hover:underline uppercase tracking-widest">Tümünü Gör</button>
            </div>
            <div className="space-y-4">
              {opportunities.length > 0 ? opportunities.map((opp) => (
                <div key={opp.id} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex items-center justify-between hover:bg-white hover:border-blue-200 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${opp.status === 'Kazanıldı' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-900 font-heading flex flex-wrap gap-2">
                        {opp.trainingTopics.map(t => (
                          <span key={t}>{t}</span>
                        ))}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${opp.status === 'Kazanıldı' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                          }`}>{opp.status}</span>
                        <span className="text-xs text-slate-400 font-medium">{new Date(opp.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900 font-heading">
                      {(opp.amount || 0).toLocaleString()} {opp.currency}
                      <span className="text-sm text-slate-400 font-bold ml-1">/ {opp.priceUnit}</span>
                    </p>
                    <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Detaylar
                    </button>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <FileText size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold">Henüz bir satış fırsatı kaydı bulunmuyor.</p>
                </div>
              )}
            </div>
          </div>

          {/* Documents / Notes Section */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-black text-xl font-heading text-slate-900">Dosyalar</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sözleşmeler ve Notlar</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all uppercase tracking-widest">
                <Plus size={14} />
                Dosya Ekle
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 border border-slate-100 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-blue-200 hover:bg-blue-50/20 hover:shadow-lg transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Eğitim_Sözleşmesi.pdf</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">2.4 MB • 12 Haz</p>
                  </div>
                </div>
                <div className="p-2 bg-white rounded-full border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={14} className="text-slate-400" />
                </div>
              </div>

              <div className="p-5 border border-slate-100 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-blue-200 hover:bg-blue-50/20 hover:shadow-lg transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                    <History size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Toplantı_Notları.docx</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">120 KB • 10 Haz</p>
                  </div>
                </div>
                <div className="p-2 bg-white rounded-full border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={14} className="text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
