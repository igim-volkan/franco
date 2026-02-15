
import React, { useState } from 'react';
import {
    DndContext,
    useDraggable,
    useDroppable,
    DragEndEvent
} from '@dnd-kit/core';
import {
    Building2,
    Calendar,
    CheckCircle2,
    X,
} from 'lucide-react';
import { Opportunity, OpportunityStatus } from '../types';
import { STATUS_STEPS } from '../constants';

interface ProcessManagementProps {
    opportunities: Opportunity[];
    onUpdateStatus: (id: string, status: OpportunityStatus) => void;
    onSplitOpportunity?: (id: string, wonIndices: number[]) => void;
}

const DraggableCard = ({ opportunity, children }: { opportunity: Opportunity, children: React.ReactNode }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: opportunity.id,
        data: { opportunity }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 100 : undefined,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={isDragging ? 'shadow-2xl rotate-2 opacity-90' : ''}>
            {children}
        </div>
    );
};

const DroppableColumn = ({ status, children }: { status: string, children: React.ReactNode }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: status,
    });

    return (
        <div ref={setNodeRef} className={`w-80 flex flex-col rounded-3xl border p-4 h-full transition-colors ${isOver ? 'bg-blue-50/80 border-blue-200' : 'bg-slate-50/50 border-slate-200/60'}`}>
            {children}
        </div>
    );
};

const ProcessManagement: React.FC<ProcessManagementProps> = ({ opportunities, onUpdateStatus, onSplitOpportunity }) => {
    const [winConfirmation, setWinConfirmation] = useState<{
        oppId: string,
        trainingDetails: { topic: string; price: number }[],
        selectedIndices: number[]
    } | null>(null);

    // Define columns based on STATUS_STEPS + WON + LOST
    const columns = [
        ...STATUS_STEPS,
        OpportunityStatus.WON,
        OpportunityStatus.LOST
    ];

    const getStatusColor = (status: OpportunityStatus) => {
        switch (status) {
            case OpportunityStatus.WON: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case OpportunityStatus.LOST: return 'bg-rose-50 text-rose-700 border-rose-100';
            case OpportunityStatus.PROPOSAL_SENT: return 'bg-blue-50 text-blue-700 border-blue-100';
            case OpportunityStatus.PROPOSAL_DISCUSSED: return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case OpportunityStatus.PROPOSAL_DETAILED: return 'bg-violet-50 text-violet-700 border-violet-100';
            case OpportunityStatus.CLOSE_TO_CLOSING: return 'bg-amber-50 text-amber-700 border-amber-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    const getColumnTitle = (status: OpportunityStatus) => {
        switch (status) {
            case OpportunityStatus.PROPOSAL_SENT: return 'Teklif Verildi';
            case OpportunityStatus.PROPOSAL_DISCUSSED: return 'Teklif Görüşüldü';
            case OpportunityStatus.PROPOSAL_DETAILED: return 'Teklif Detaylandırıldı';
            case OpportunityStatus.CLOSE_TO_CLOSING: return 'Bitmeye Çok Yakın';
            case OpportunityStatus.WON: return 'Kazanıldı';
            case OpportunityStatus.LOST: return 'Kaybedildi';
            default: return status;
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const newStatus = over.id as OpportunityStatus;
            const oppId = active.id as string;

            // Check if dragging to WON
            if (newStatus === OpportunityStatus.WON) {
                const opp = opportunities.find(o => o.id === oppId);
                if (opp && opp.trainingDetails.length > 1 && onSplitOpportunity) {
                    setWinConfirmation({
                        oppId: opp.id,
                        trainingDetails: opp.trainingDetails,
                        selectedIndices: opp.trainingDetails.map((_, i) => i) // Default all selected
                    });
                    return;
                }
            }

            onUpdateStatus(oppId, newStatus);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 font-heading">Süreç Yönetimi</h1>
                    <p className="text-slate-500 mt-2 font-medium">Satış fırsatlarını taşıyarak aşamalarını güncelleyin.</p>
                </div>

                <div className="flex-1 overflow-x-auto pb-4 -mx-8 px-8 custom-scrollbar">
                    <div className="flex gap-6 min-w-max h-full">
                        {columns.map(status => (
                            <DroppableColumn key={status} status={status}>
                                <div className={`flex items-center justify-between px-2 py-3 mb-2 rounded-xl border ${getStatusColor(status)} bg-opacity-40`}>
                                    <span className="text-xs font-black uppercase tracking-widest">{getColumnTitle(status)}</span>
                                    <span className="bg-white/50 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                        {opportunities.filter(o => o.status === status).length}
                                    </span>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                                    {opportunities
                                        .filter(o => o.status === status)
                                        .map(opp => (
                                            <DraggableCard key={opp.id} opportunity={opp}>
                                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-grab active:cursor-grabbing">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{opp.id}</span>
                                                    </div>

                                                    <h4 className="font-bold text-slate-900 text-sm leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                                                        {opp.customerName}
                                                    </h4>

                                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                                        {opp.trainingDetails.map((d, i) => (
                                                            <span key={i} className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 truncate max-w-full">
                                                                {d.topic}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className="flex items-center justify-between pt-3 border-t border-slate-50 bg-slate-50/30 -mx-4 -mb-4 px-4 py-3 rounded-b-2xl">
                                                        <span className="text-xs font-bold text-slate-700">
                                                            {(opp.amount || 0).toLocaleString()} {opp.currency}
                                                        </span>

                                                        {opp.estimatedCloseDate && (
                                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                                                <Calendar size={12} />
                                                                <span>{new Date(opp.estimatedCloseDate).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </DraggableCard>
                                        ))}

                                    {opportunities.filter(o => o.status === status).length === 0 && (
                                        <div className="h-20 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl">
                                            <span className="text-xs font-bold text-slate-400">Boş</span>
                                        </div>
                                    )}
                                </div>
                            </DroppableColumn>
                        ))}
                    </div>
                </div>

                {/* Win Confirmation Modal */}
                {winConfirmation && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
                            <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-4 bg-emerald-50/50">
                                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 font-heading">Kazanımı Doğrula</h2>
                                    <p className="text-emerald-600 text-xs font-bold mt-0.5 uppercase tracking-wide">Hangi eğitimler kazanıldı?</p>
                                </div>
                            </div>

                            <div className="p-8">
                                <p className="text-sm font-medium text-slate-500 mb-4">
                                    Kazanılan eğitimleri seçin. Seçilmeyenler otomatik olarak <strong>Kaybedildi</strong> statüsünde yeni bir fırsata dönüştürülecektir.
                                </p>

                                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                    {winConfirmation.trainingDetails.map((detail, idx) => {
                                        const isSelected = winConfirmation.selectedIndices.includes(idx);
                                        const handleToggle = () => {
                                            const newIndices = isSelected
                                                ? winConfirmation.selectedIndices.filter(i => i !== idx)
                                                : [...winConfirmation.selectedIndices, idx];
                                            setWinConfirmation(prev => prev ? ({ ...prev, selectedIndices: newIndices }) : null);
                                        };

                                        return (
                                            <div
                                                key={idx}
                                                onClick={handleToggle}
                                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                                                        {isSelected && <CheckCircle2 size={12} className="text-white" />}
                                                    </div>
                                                    <span className={`text-sm font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-600'}`}>{detail.topic}</span>
                                                </div>
                                                <span className="text-xs font-bold text-slate-400">{(detail.price || 0).toLocaleString()}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => setWinConfirmation(null)}
                                        className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all uppercase text-xs tracking-widest"
                                    >
                                        Vazgeç
                                    </button>
                                    <button
                                        disabled={winConfirmation.selectedIndices.length === 0}
                                        onClick={() => {
                                            const isAllSelected = winConfirmation.selectedIndices.length === winConfirmation.trainingDetails.length;

                                            if (isAllSelected) {
                                                onUpdateStatus(winConfirmation.oppId, OpportunityStatus.WON);
                                            } else if (onSplitOpportunity) {
                                                onSplitOpportunity(winConfirmation.oppId, winConfirmation.selectedIndices);
                                            }
                                            setWinConfirmation(null);
                                        }}
                                        className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 uppercase text-xs tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Onayla ({winConfirmation.selectedIndices.length})
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DndContext>
    );
};

export default ProcessManagement;
