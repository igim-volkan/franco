
import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar as CalendarIcon,
  Settings as SettingsIcon,
  Bell,
  Search,
  Plus,
  MoreVertical,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  ListTodo,
  Layers,
  Layout as LayoutKanbanIcon // Fallback if LayoutKanban doesn't exist, aliasing Layout to LayoutKanbanIcon
} from 'lucide-react';
import { OpportunityStatus } from './types';

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Panel', icon: <LayoutDashboard size={20} /> },
  { id: 'my_page', label: 'Sayfam', icon: <TrendingUp size={20} /> },
  { id: 'crm', label: 'Müşteriler', icon: <Users size={20} /> },
  { id: 'sales', label: 'Satış Fırsatları', icon: <Briefcase size={20} /> },
  { id: 'process_management', label: 'Süreç Yönetimi', icon: <LayoutKanbanIcon size={20} /> },
  { id: 'operations', label: 'Operasyon', icon: <Layers size={20} /> },
  { id: 'tasks', label: 'Görevler', icon: <ListTodo size={20} /> },
  { id: 'calendar', label: 'Eğitmen Takvimi', icon: <CalendarIcon size={20} /> },
  { id: 'settings', label: 'Ayarlar', icon: <SettingsIcon size={20} /> },
];

export const STATUS_STEPS = [
  OpportunityStatus.PROPOSAL_SENT,
  OpportunityStatus.PROPOSAL_DISCUSSED,
  OpportunityStatus.PROPOSAL_DETAILED,
  OpportunityStatus.CLOSE_TO_CLOSING
];

export const COLORS = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
};
