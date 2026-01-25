
import React, { useState } from 'react';
import {
  Plus,
  Search,
  Bell,
  User,
  Menu,
  X,
  ChevronRight,
  Filter,
  GraduationCap
} from 'lucide-react';
import { NAVIGATION_ITEMS } from './constants';
import {
  Customer,
  Opportunity,
  TrainingEvent,
  ViewType,
  OpportunityStatus,
  TrainingTypeDefaults,
  OpportunityTask,
  TaskStatus,
  Instructor,
  GlobalTask,
  GlobalTaskStatus,
  CustomerStatus
} from './types';
import Dashboard from './components/Dashboard';
import CustomerCRM from './components/CustomerCRM';
import SalesOpportunities from './components/SalesOpportunities';
import InstructorCalendar from './components/InstructorCalendar';
import CustomerDetail from './components/CustomerDetail';
import Settings from './components/Settings';
import Tasks from './components/Tasks';
import MyPage from './components/MyPage';

const App: React.FC = () => {
  // Mock logged in user (Sarp Yılmaz)
  const currentUserId = 'INS-001';

  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [trainingTypes, setTrainingTypes] = useState<string[]>(Object.values(TrainingTypeDefaults));

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'MST-001',
      name: 'TechFlow Çözümleri',
      contactPerson: 'Arda Yılmaz',
      email: 'arda.yilmaz@techflow.com',
      phone: '+90 532 123 45 67',
      address: 'Levent, İstanbul',
      billingAddress: 'Levent Mah. Büyükdere Cad. No:123 Şişli/İstanbul',
      taxOffice: 'Zincirlikuyu',
      taxNumber: '1234567890',
      sector: 'Teknoloji',
      employeeCount: 250,
      status: CustomerStatus.EXISTING,
      ownerId: 'INS-001', // Assigned to Sarp Yılmaz
      createdAt: new Date().toISOString()
    },
    {
      id: 'MST-002',
      name: 'Global Finans Corp',
      contactPerson: 'Selin Demir',
      email: 'selin.demir@globalfinance.com',
      phone: '+90 212 987 65 43',
      address: 'Maslak, İstanbul',
      billingAddress: 'Maslak Mah. Meydan Sok. No:5 Sarıyer/İstanbul',
      taxOffice: 'Maslak',
      taxNumber: '9876543210',
      sector: 'Finans',
      employeeCount: 1200,
      status: CustomerStatus.POTENTIAL,
      createdAt: new Date().toISOString()
    }
  ]);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: 'FRS-1001',
      customerId: 'MST-001',
      ownerId: 'INS-001', // Assigned to Sarp Yılmaz
      customerName: 'TechFlow Yazılım',
      status: OpportunityStatus.PROPOSAL_SENT,
      trainingTopics: [TrainingTypeDefaults.LEADERSHIP, 'React'], // Changed to array
      currency: 'TL',
      priceUnit: 'Toplam',
      description: 'Frontend ekibi için React ve TypeScript İleri Seviye Eğitimi.',
      requestedDates: ['2024-06-15', '2024-06-16'],
      amount: 45000, // Updated amount
      tasks: [
        { id: 'TSK-1', text: 'Teklif dokümanını hazırla', dueDate: '2024-06-10', status: TaskStatus.DONE }
      ],
      createdAt: new Date().toISOString()
    }
  ]);

  const [events, setEvents] = useState<TrainingEvent[]>([
    {
      id: 'ETK-001',
      opportunityId: 'FRS-1001',
      title: 'React Atölyesi - TechFlow',
      instructorName: 'Deniz Can',
      startDate: '2024-06-15T09:00:00',
      endDate: '2024-06-16T17:00',
      status: 'Planlandı',
      clientPartner: 'Ahmet Yılmaz',
      location: 'TechFlow Genel Merkez - Toplantı Salonu A',
      hasKit: true,
      hasAssessment: true
    }
  ]);

  const [instructors, setInstructors] = useState<Instructor[]>([
    { id: 'INS-001', name: 'Sarp Yılmaz', specialty: 'React/TS', isOnLeave: false, email: 'sarp.yilmaz@franco.edu', phone: '+90 533 111 22 33' },
    { id: 'INS-002', name: 'Mert Aksoy', specialty: 'Liderlik', isOnLeave: false, email: 'mert.aksoy@franco.edu', phone: '+90 533 222 33 44' },
    { id: 'INS-003', name: 'Deniz Can', specialty: 'UX/UI', isOnLeave: false, email: 'deniz.can@franco.edu', phone: '+90 533 333 44 55' },
    { id: 'INS-004', name: 'Elif Şahin', specialty: 'Yumuşak Beceriler', isOnLeave: false, email: 'elif.sahin@franco.edu', phone: '+90 533 444 55 66' }
  ]);

  const [globalTasks, setGlobalTasks] = useState<GlobalTask[]>([
    {
      id: 'G-TSK-1',
      title: 'Eğitmen Sözleşmelerini Güncelle',
      description: 'Yeni dönem için tüm eğitmenlerin sözleşme taslaklarını hukuk departmanına gönder.',
      assignedTo: 'Yönetici',
      assignedBy: 'Sistem Sorumlusu',
      dueDate: '2024-06-20',
      status: GlobalTaskStatus.PENDING,
      priority: 'Yüksek',
      createdAt: new Date().toISOString()
    },
    {
      id: 'G-TSK-2',
      title: 'Haziran Ayı Faturaları',
      description: 'Tamamlanan eğitimlerin fatura kesim süreçlerini tamamla.',
      assignedTo: 'Yönetici',
      assignedBy: 'Finans',
      dueDate: '2024-06-30',
      status: GlobalTaskStatus.PENDING,
      priority: 'Orta',
      createdAt: new Date().toISOString()
    }
  ]);

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [...prev, newCustomer]);
  };

  const handleAddOpportunity = (newOpp: Opportunity) => {
    setOpportunities(prev => [...prev, newOpp]);

    // Check if customer is potential and update to existing
    const customer = customers.find(c => c.id === newOpp.customerId);
    if (customer && customer.status === CustomerStatus.POTENTIAL) {
      setCustomers(prev => prev.map(c =>
        c.id === newOpp.customerId ? { ...c, status: CustomerStatus.EXISTING } : c
      ));
    }
  };

  const handleAddEvent = (newEvent: TrainingEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const handleAddGlobalTask = (newTask: GlobalTask) => {
    setGlobalTasks(prev => [newTask, ...prev]);
  };

  const updateGlobalTaskStatus = (id: string, status: GlobalTaskStatus) => {
    setGlobalTasks(prev => prev.map(task => task.id === id ? { ...task, status } : task));
  };

  const handleUpdateGlobalTask = (updatedTask: GlobalTask) => {
    setGlobalTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const updateOpportunityStatus = (id: string, status: OpportunityStatus) => {
    setOpportunities(prev => prev.map(opp => opp.id === id ? { ...opp, status } : opp));
  };

  const updateOpportunityDates = (id: string, dates: string[]) => {
    setOpportunities(prev => prev.map(opp => opp.id === id ? { ...opp, requestedDates: dates } : opp));
  };

  const handleAddTask = (opportunityId: string, task: OpportunityTask) => {
    setOpportunities(prev => prev.map(opp =>
      opp.id === opportunityId ? { ...opp, tasks: [...opp.tasks, task] } : opp
    ));
  };

  const handleUpdateTaskStatus = (opportunityId: string, taskId: string, status: TaskStatus) => {
    setOpportunities(prev => prev.map(opp =>
      opp.id === opportunityId ? {
        ...opp,
        tasks: opp.tasks.map(t => t.id === taskId ? { ...t, status } : t)
      } : opp
    ));
  };

  const handleToggleInstructorLeave = (instructorId: string) => {
    setInstructors(prev => prev.map(ins =>
      ins.id === instructorId ? { ...ins, isOnLeave: !ins.isOnLeave } : ins
    ));
  };

  const handleViewCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setActiveView('customer_detail');
  };

  const getViewLabel = (view: ViewType) => {
    if (view === 'customer_detail') return 'Müşteri Detayı';
    const item = NAVIGATION_ITEMS.find(n => n.id === view);
    return item ? item.label : view;
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden text-slate-900 font-body selection:bg-blue-100 selection:text-blue-900">
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-24'} flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] z-20`}>
        <div className={`p-8 flex items-center gap-4 transition-all ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/30 text-white shrink-0">
            <GraduationCap size={24} />
          </div>
          {isSidebarOpen && <span className="font-black text-2xl tracking-tight font-heading text-slate-900">FranCo</span>}
        </div>

        <nav className="flex-1 px-6 py-6 space-y-3">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = (activeView === item.id || (activeView === 'customer_detail' && item.id === 'crm'));
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id as ViewType);
                  setSelectedCustomerId(null);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative overflow-hidden ${isActive
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 font-bold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  } ${!isSidebarOpen && 'justify-center px-0'}`}
              >
                <div className={`shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                {isSidebarOpen && <span className="text-sm tracking-wide">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 px-8 flex items-center justify-between shrink-0 bg-[#f8fafc]/80 backdrop-blur-md sticky top-0 z-10 transition-all">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              <span>Panel</span>
              <ChevronRight size={10} />
              <span className="text-slate-900">{getViewLabel(activeView)}</span>
            </div>
            <h2 className="text-xl font-black font-heading text-slate-900 capitalize tracking-tight">
              {activeView === 'customer_detail' ? selectedCustomer?.name : getViewLabel(activeView)}
            </h2>
          </div>

          <div className="flex items-center gap-6 bg-white pl-6 pr-2 py-2 rounded-full border border-slate-200 shadow-sm">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Ara..."
                className="pl-10 pr-4 py-2 bg-transparent border-none text-sm font-medium focus:ring-0 w-48 transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <button className="relative p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="w-9 h-9 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 border-white cursor-pointer hover:scale-105 transition-transform">
                YN
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pt-2 scroll-smooth">
          <div className="max-w-[1600px] mx-auto pb-20">
            {activeView === 'dashboard' && (
              <Dashboard
                customers={customers}
                opportunities={opportunities}
                events={events}
                globalTasks={globalTasks}
                onViewChange={setActiveView}
              />
            )}
            {activeView === 'my_page' && (
              <MyPage
                currentUserId={currentUserId}
                customers={customers}
                opportunities={opportunities}
                events={events}
                tasks={globalTasks}
                instructors={instructors}
              />
            )}
            {activeView === 'crm' && (
              <CustomerCRM
                customers={customers}
                instructors={instructors}
                onAddCustomer={handleAddCustomer}
                onViewCustomer={handleViewCustomer}
              />
            )}
            {activeView === 'customer_detail' && selectedCustomer && (
              <CustomerDetail
                customer={selectedCustomer}
                opportunities={opportunities.filter(o => o.customerId === selectedCustomer.id)}
                onBack={() => setActiveView('crm')}
              />
            )}
            {activeView === 'sales' && (
              <SalesOpportunities
                opportunities={opportunities}
                customers={customers}
                trainingTypes={trainingTypes}
                onAddOpportunity={handleAddOpportunity}
                onUpdateStatus={updateOpportunityStatus}
                onAddTask={handleAddTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
              />
            )}
            {activeView === 'tasks' && (
              <Tasks
                tasks={globalTasks}
                instructors={instructors}
                onAddTask={handleAddGlobalTask}
                onUpdateStatus={updateGlobalTaskStatus}
                onUpdateTask={handleUpdateGlobalTask}
              />
            )}
            {activeView === 'calendar' && (
              <InstructorCalendar
                events={events}
                opportunities={opportunities}
                instructors={instructors}
                onUpdateDates={updateOpportunityDates}
                onAddEvent={handleAddEvent}
                onToggleLeave={handleToggleInstructorLeave}
              />
            )}
            {activeView === 'settings' && <Settings trainingTypes={trainingTypes} setTrainingTypes={setTrainingTypes} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
