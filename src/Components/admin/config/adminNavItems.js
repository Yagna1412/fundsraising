import {
  BarChart3,
  CheckCircle,
  CircleDollarSign,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
  ShieldCheck,
  UserCircle,
  Users,
} from "lucide-react";

export const navItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "campaigns", label: "Campaigns", icon: Home },
  { key: "donors", label: "Donors", icon: Users },
  { key: "donations", label: "Donations", icon: CircleDollarSign },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "userProfiles", label: "User Profiles", icon: UserCircle },
  { key: "approvals", label: "Approvals", icon: CheckCircle, badge: 3 },
  { key: "reports", label: "Reports", icon: FileText },
  { key: "security", label: "Security", icon: ShieldCheck },
  { key: "messages", label: "Messages", icon: MessageSquare },
  { key: "settings", label: "Settings", icon: Settings },
];
