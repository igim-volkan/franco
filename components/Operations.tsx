import React, { useState } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    Calendar,
    CheckCircle2,
    TrendingUp,
    FileText,
    User,
    Building2,
    Clock,
    ChevronRight,
    Layers
} from 'lucide-react';
import { Opportunity, OpportunityStatus, Customer } from '../types';

interface OperationsProps {
    opportunities: Opportunity[];
    customers: Customer[];
}

const Operations: React.FC<OperationsProps> = ({ opportunities }) => {
    const wonOpportunities = opportunities.filter(o => o.status === OpportunityStatus.WON);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOpportunities = wonOpportunities.filter(opp =>
        opp.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.trainingDetails.some(d => d.topic.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black font-heading text-slate-900 tracking-tight">Operasyon</h1>
                    <p className="text-slate-500 mt-2 font-medium">Kazanılan satışların operasyonel süreçlerini yönetin.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                    <Search size={20} className="text-slate-400 ml-2" />
                    <input
                        type="text"
                        placeholder="Operasyonlarda ara..."
                        className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 placeholder:text-slate-400 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredOpportunities.length > 0 ? (
                    filteredOpportunities.map((opp) => (
                        <div key={opp.id} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Left: Indicator & Status */}
                                <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:w-24 shrink-0">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <div className="text-center lg:text-left">
                                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-emerald-100 block w-full">
                                            Kazanıldı
                                        </span>
                                    </div>
                                </div>

                                {/* Middle: Content */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <Building2 size={12} /> {opp.customerName}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {opp.id}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 font-heading group-hover:text-blue-600 transition-colors">
                                            {opp.title || 'İsimsiz Fırsat'}
                                        </h3>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {opp.trainingDetails.map((d, idx) => (
                                            <span key={idx} className="bg-slate-50 text-slate-600 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-1.5">
                                                <Layers size={12} className="text-blue-500" />
                                                {d.topic}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-50">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Katılımcı Grubu</p>
                                            <p className="text-sm font-bold text-slate-700">{opp.participantGroup || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tutar</p>
                                            <p className="text-sm font-bold text-slate-700">{(opp.amount || 0).toLocaleString()} {opp.currency}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kapanış Tarihi</p>
                                            <p className="text-sm font-bold text-slate-700">
                                                {opp.estimatedCloseDate ? new Date(opp.estimatedCloseDate).toLocaleDateString('tr-TR') : '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Oluşturma</p>
                                            <p className="text-sm font-bold text-slate-700">{new Date(opp.createdAt).toLocaleDateString('tr-TR')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Actions */}
                                <div className="flex lg:flex-col justify-center gap-3 lg:border-l border-slate-100 lg:pl-8 lg:w-48 shrink-0">
                                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                                        <Calendar size={14} />
                                        Planla
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
                                        <FileText size={14} />
                                        Detaylar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Layers size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Operasyonda Kayıt Yok</h3>
                        <p className="text-slate-500 font-medium text-sm">Henüz "Kazanıldı" statüsünde bir fırsat bulunmuyor.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Operations;
