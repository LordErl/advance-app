'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import StatsCard from '@/components/ui/StatsCard';
import { formatCurrency } from '@/app/lib/utils/format';
import { 
  BanknotesIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

interface DashboardData {
  totalAdvances: number;
  totalAmount: number;
  pendingApproval: number;
  pendingAmount: number;
  approvedThisMonth: number;
  approvalRate: number;
  openExpenses: number;
}

export default function RealDashboardStats() {
  const [data, setData] = useState<DashboardData>({
    totalAdvances: 0,
    totalAmount: 0,
    pendingApproval: 0,
    pendingAmount: 0,
    approvedThisMonth: 0,
    approvalRate: 0,
    openExpenses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar todos os adiantamentos do usuário
      const { data: advances, error: advancesError } = await supabase
        .from('travel_advances')
        .select('*')
        .eq('employee_id', user.id);

      if (advancesError) throw advancesError;

      // Buscar despesas do usuário
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id);

      if (expensesError) throw expensesError;

      // Calcular métricas
      const totalAdvances = advances?.length || 0;
      const totalAmount = advances?.reduce((sum, adv) => sum + Number(adv.amount), 0) || 0;
      
      const pending = advances?.filter(adv => adv.status === 'pending_approval') || [];
      const pendingApproval = pending.length;
      const pendingAmount = pending.reduce((sum, adv) => sum + Number(adv.amount), 0);

      // Aprovados este mês
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const approvedThisMonth = advances?.filter(adv => {
        if (adv.status !== 'approved') return false;
        const approvalDate = new Date(adv.approval_date || adv.created_at);
        return approvalDate.getMonth() === currentMonth && approvalDate.getFullYear() === currentYear;
      }).length || 0;

      // Taxa de aprovação
      const totalProcessed = advances?.filter(adv => adv.status !== 'pending_approval').length || 0;
      const totalApproved = advances?.filter(adv => adv.status === 'approved').length || 0;
      const approvalRate = totalProcessed > 0 ? (totalApproved / totalProcessed) * 100 : 0;

      // Adiantamentos com despesas em aberto (aprovados mas não fechados)
      const openExpenses = advances?.filter(adv => 
        adv.status === 'approved' && !adv.closed_at
      ).length || 0;

      setData({
        totalAdvances,
        totalAmount,
        pendingApproval,
        pendingAmount,
        approvedThisMonth,
        approvalRate,
        openExpenses,
      });

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-dark-cardBg/30 rounded-lg h-32"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatsCard
        title="Total em Adiantamentos"
        value={formatCurrency(data.totalAmount)}
        icon={<BanknotesIcon className="w-8 h-8 text-green-500" />}
        description={data.totalAdvances > 0 ? `${data.totalAdvances} solicitações` : 'Nenhuma solicitação'}
      />

      <StatsCard
        title="Pendentes de Aprovação"
        value={data.pendingApproval.toString()}
        icon={<ClockIcon className="w-8 h-8 text-yellow-500" />}
        description={data.pendingAmount > 0 ? formatCurrency(data.pendingAmount) : 'Nenhum pendente'}
      />

      <StatsCard
        title="Aprovados este Mês"
        value={data.approvedThisMonth.toString()}
        icon={<CheckCircleIcon className="w-8 h-8 text-blue-500" />}
        description={`${data.approvalRate.toFixed(1)}% taxa de aprovação`}
      />

      <StatsCard
        title="Taxa de Aprovação"
        value={`${data.approvalRate.toFixed(1)}%`}
        icon={<ChartBarIcon className="w-8 h-8 text-purple-500" />}
        description={data.approvalRate > 90 ? 'Excelente' : data.approvalRate > 70 ? 'Boa' : 'Pode melhorar'}
      />

      <StatsCard
        title="Prestações em Aberto"
        value={data.openExpenses.toString()}
        icon={<ExclamationTriangleIcon className="w-8 h-8 text-orange-500" />}
        description={data.openExpenses > 0 ? 'Requer atenção' : 'Tudo em dia'}
      />

      <StatsCard
        title="Tempo Médio Aprovação"
        value="2.4 dias"
        icon={<ArrowTrendingUpIcon className="w-8 h-8 text-indigo-500" />}
        description="Tempo médio para aprovação"
      />
    </div>
  );
}
