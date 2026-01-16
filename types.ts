
export enum OpportunityStatus {
  NEW = 'Yeni',
  DISCOVERY = 'Keşif',
  PROPOSAL = 'Teklif',
  NEGOTIATION = 'Pazarlık',
  WON = 'Kazanıldı',
  LOST = 'Kaybedildi'
}

export enum TaskStatus {
  TODO = 'Yapılacak',
  IN_PROGRESS = 'Devam Ediyor',
  DONE = 'Tamamlandı'
}

export enum GlobalTaskStatus {
  PENDING = 'Bekliyor',
  COMPLETED = 'Tamamlandı'
}

export enum TrainingTypeDefaults {
  LEADERSHIP = 'Liderlik ve Yönetim',
  TECHNICAL = 'Teknik Beceriler',
  SOFT_SKILLS = 'Yumuşak Beceriler',
  COMPLIANCE = 'Uyumluluk ve Mevzuat',
  SALES = 'Satış Eğitimi',
  CUSTOM = 'Özel Çözüm',
  PROJECT_MANAGEMENT = 'Proje Yönetimi',
  CYBERSECURITY = 'Siber Güvenlik Farkındalığı'
}

export interface OpportunityTask {
  id: string;
  text: string;
  dueDate: string;
  status: TaskStatus;
}

export interface GlobalTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  dueDate: string;
  status: GlobalTaskStatus;
  priority: 'Düşük' | 'Orta' | 'Yüksek';
  createdAt: string;
}

export interface Instructor {
  id: string;
  name: string;
  specialty: string;
  isOnLeave: boolean;
  email?: string;
  phone?: string;
}

export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  email?: string;
  phone?: string;
  address: string;
  billingInfo: string;
  sector: string;
  employeeCount: number;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  customerId: string;
  customerName: string;
  status: OpportunityStatus;
  trainingType: string;
  description: string;
  requestedDates: string[];
  amount?: number;
  tasks: OpportunityTask[];
  createdAt: string;
}

export interface TrainingEvent {
  id: string;
  opportunityId: string;
  instructorName: string;
  title: string;
  startDate: string;
  endDate: string;
  status: 'Planlandı' | 'Tamamlandı' | 'İptal Edildi';
}

export type ViewType = 'dashboard' | 'crm' | 'sales' | 'calendar' | 'tasks' | 'customer_detail' | 'settings';
