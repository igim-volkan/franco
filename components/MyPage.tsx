import React, { useMemo } from 'react';
import {
    Users,
    Briefcase,
    Calendar,
    CheckSquare,
    TrendingUp,
    Clock,
    ArrowRight
} from 'lucide-react';
import {
    Customer,
    Opportunity,
    TrainingEvent,
    GlobalTask,
    Instructor,
    OpportunityStatus
} from '../types';
import { COLORS, STATUS_STEPS } from '../constants';

interface MyPageProps {
    currentUserId: string;
    currentUserRole?: string; // e.g. 'Instructor', 'Sales'
    customers: Customer[];
    opportunities: Opportunity[];
    events: TrainingEvent[];
    tasks: GlobalTask[];
    instructors: Instructor[];
}

const MyPage: React.FC<MyPageProps> = ({
    currentUserId,
    customers,
    opportunities,
    events,
    tasks,
    instructors
}) => {

    // Find current user details
    const currentUser = instructors.find(i => i.id === currentUserId);
    const currentUserName = currentUser?.name || 'Kullanıcı';

    // Filter Data
    const myCustomers = useMemo(() =>
        customers.filter(c => c.ownerId === currentUserId),
        [customers, currentUserId]
    );

    const myOpportunities = useMemo(() =>
        opportunities.filter(o => o.ownerId === currentUserId),
        [opportunities, currentUserId]
    );

    const myEvents = useMemo(() =>
        events.filter(e => e.instructorName === currentUserName),
        [events, currentUserName]
    );

    // For tasks, matching by assignedTo (assuming name match for MVP)
    const myTasks = useMemo(() =>
        tasks.filter(t => t.assignedTo === currentUserName || t.assignedTo === 'Yönetici'), // Including 'Yönetici' for demo visibility if needed, or strictly name
        [tasks, currentUserName]
    );

    // Calculate Stats
    const totalPipelineValue = myOpportunities.reduce((sum, op) => sum + (op.amount || 0), 0);
    const activeOppsCount = myOpportunities.filter(o => o.status !== OpportunityStatus.WON && o.status !== OpportunityStatus.LOST).length;

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black font-heading text-slate-900">Hoş Geldin, {currentUserName.split(' ')[0]} 👋</h1>
                    <p className="text-slate-500 mt-1">Bugünkü performans özetin ve yapacakların.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-sm font-bold text-slate-700">Çevrimiçi</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Müşterilerim"
                    value={myCustomers.length.toString()}
                    icon={<Users size={24} className="text-blue-600" />}
                    trend="+2 bu ay"
                />
                <StatCard
                    title="Aktif Fırsatlar"
                    value={activeOppsCount.toString()}
                    icon={<Briefcase size={24} className="text-indigo-600" />}
                    trend={`${totalPipelineValue.toLocaleString('tr-TR')} ₺`}
                />
                <StatCard
                    title="Yaklaşan Eğitimler"
                    value={myEvents.length.toString()}
                    icon={<Calendar size={24} className="text-purple-600" />}
                    subtext="Bu ay"
                />
                <StatCard
                    title="Görevlerim"
                    value={myTasks.length.toString()}
                    icon={<CheckSquare size={24} className="text-pink-600" />}
                    subtext="Tamamlanmamış"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* My Opportunities Section */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                <Briefcase size={20} className="text-slate-400" />
                                Fırsatlarım
                            </h3>
                            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                Tümünü Gör <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {myOpportunities.length > 0 ? (
                                myOpportunities.map(opp => (
                                    <div key={opp.id} className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all bg-slate-50/50 hover:bg-white">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                                {opp.customerName.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{opp.customerName}</h4>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {opp.trainingTopics.map(t => (
                                                        <span key={t} className="text-xs font-medium px-2 py-0.5 rounded text-slate-600 bg-slate-200">
                                                            {t}
                                                        </span>
                                                    ))}
                                                    <span className="text-xs text-slate-400 flex items-center">•</span>
                                                    <span className="text-xs text-slate-500 font-medium flex items-center">
                                                        {opp.amount?.toLocaleString('tr-TR')} {opp.currency} / {opp.priceUnit}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(opp.status)}`}>
                                                {opp.status}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">{new Date(opp.createdAt).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-400">
                                    <Briefcase size={40} className="mx-auto mb-3 opacity-20" />
                                    <p>Henüz atanmış bir fırsatın yok.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* My Trainings Section */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                <Calendar size={20} className="text-slate-400" />
                                Eğitim Programım
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {myEvents.length > 0 ? (
                                myEvents.map(event => (
                                    <div key={event.id} className="flex gap-4 p-4 rounded-2xl border-l-[6px] border-l-purple-500 bg-purple-50/30 border-y border-r border-slate-100">
                                        <div className="flex flex-col items-center justify-center -space-y-1 w-12 shrink-0">
                                            <span className="text-xs font-bold text-purple-600 uppercase">Haz</span>
                                            <span className="text-2xl font-black text-slate-900">{new Date(event.startDate).getDate()}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{event.title}</h4>
                                            <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                                                <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-200">
                                                    <Clock size={14} />
                                                    {new Date(event.startDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span>•</span>
                                                <span className="font-medium text-slate-700">{event.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-400">
                                    <Calendar size={40} className="mx-auto mb-3 opacity-20" />
                                    <p>Planlanmış eğitim etkinliği bulunmuyor.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column (1/3) */}
                <div className="space-y-8">
                    {/* My Customers Mini List */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Users size={120} />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-6 relative z-10">Müşterilerim</h3>
                        <div className="space-y-3 relative z-10">
                            {myCustomers.map(customer => (
                                <div key={customer.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                                        {customer.name.substring(0, 1)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 truncate">{customer.name}</h4>
                                        <p className="text-xs text-slate-500 truncate">{customer.contactPerson}</p>
                                    </div>
                                </div>
                            ))}
                            {myCustomers.length === 0 && (
                                <p className="text-sm text-slate-400 text-center py-4">Henüz müşteri atanmamış.</p>
                            )}
                        </div>
                        <button className="w-full mt-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
                            Tüm Müşterileri Gör
                        </button>
                    </div>

                    {/* Quick Tasks */}
                    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <CheckSquare size={20} className="text-slate-400" />
                            Görevlerim
                        </h3>
                        <div className="space-y-4">
                            {myTasks.length > 0 ? (
                                myTasks.map(task => (
                                    <div key={task.id} className="flex gap-3 items-start">
                                        <div className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer ${task.status === 'Tamamlandı' ? 'bg-green-500 border-green-500' : 'border-slate-600'}`}>
                                            {task.status === 'Tamamlandı' && <CheckSquare size={12} />}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${task.status === 'Tamamlandı' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                                {task.title}
                                            </p>
                                            <span className="text-xs text-slate-500 mt-1 block">Son gün: {new Date(task.dueDate).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-center text-sm">Bekleyen görev yok.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, trend, subtext }: any) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="bg-slate-50 p-3 rounded-2xl">
                {icon}
            </div>
            {trend && (
                <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                    <TrendingUp size={12} className="mr-1" />
                    {trend}
                </span>
            )}
        </div>
        <div>
            <h4 className="text-slate-500 text-sm font-bold mb-1">{title}</h4>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{value}</span>
                {subtext && <span className="text-xs font-bold text-slate-400">{subtext}</span>}
            </div>
        </div>
    </div>
);

const getStatusStyle = (status: OpportunityStatus) => {
    switch (status) {
        case OpportunityStatus.WON: return 'bg-green-100 text-green-700 border-green-200';
        case OpportunityStatus.LOST: return 'bg-red-100 text-red-700 border-red-200';
        case OpportunityStatus.PROPOSAL_SENT: return 'bg-blue-100 text-blue-700 border-blue-200';
        case OpportunityStatus.PROPOSAL_DISCUSSED: return 'bg-purple-100 text-purple-700 border-purple-200';
        case OpportunityStatus.PROPOSAL_DETAILED: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
        case OpportunityStatus.CLOSE_TO_CLOSING: return 'bg-orange-100 text-orange-700 border-orange-200';
        default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
};

export default MyPage;
