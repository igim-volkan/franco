
export enum OpportunityStatus {
  PROPOSAL_SENT = 'Teklif Verildi',
  PROPOSAL_DISCUSSED = 'Teklif Görüşüldü',
  PROPOSAL_DETAILED = 'Teklif Detaylandırıldı',
  CLOSE_TO_CLOSING = 'Bitmeye Çok Yakın',
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

export enum CustomerStatus {
  POTENTIAL = 'Potansiyel',
  EXISTING = 'Mevcut'
}

export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  email?: string;
  phone?: string;
  address: string;
  billingAddress: string; // Changed from billingInfo
  taxOffice: string;      // Added
  taxNumber: string;      // Added
  sector: string;
  employeeCount: number;
  status: CustomerStatus; // Added status field
  ownerId?: string; // Added ownerId field
  createdAt: string;
}

export interface Opportunity {
  id: string;
  customerId: string;
  ownerId?: string; // Added ownerId field
  customerName: string;
  status: OpportunityStatus;
  trainingTopics: string[]; // Changed from trainingType (string)
  currency: 'TL' | 'USD' | 'EUR';
  priceUnit: 'Toplam' | 'Günlük' | 'Saatlik';
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
  clientPartner?: string; // Added fields
  location?: string;
  hasKit?: boolean;
  hasAssessment?: boolean;
  status: 'Planlandı' | 'Tamamlandı' | 'İptal Edildi';
}

export type ViewType = 'dashboard' | 'my_page' | 'crm' | 'sales' | 'calendar' | 'tasks' | 'customer_detail' | 'settings';
