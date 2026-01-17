import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppointments } from '@/contexts/AppointmentContext';
import { doctors, patients } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Users, UserCheck, Calendar, TrendingUp, Activity, Award } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const AdminAnalyticsDashboard = () => {
  const { t } = useTranslation();
  const { appointments, getStatusStats } = useAppointments();
  const stats = getStatusStats();

  const doctorAnalytics = useMemo(() => {
    return doctors.map(doc => {
      const docAppts = appointments.filter(a => a.doctorId === doc.id);
      const uniquePatients = new Set(docAppts.map(a => a.patientId)).size;
      const thisMonth = docAppts.filter(a => {
        const d = new Date(a.createdAt);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length;
      const accepted = docAppts.filter(a => ['Accepted', 'Completed', 'RescheduleAccepted'].includes(a.status)).length;
      const noShows = docAppts.filter(a => a.status === 'NoShow').length;
      return {
        id: doc.id,
        name: doc.name,
        specialty: doc.specialty,
        totalPatients: uniquePatients,
        totalAppointments: docAppts.length,
        thisMonth,
        acceptRate: docAppts.length > 0 ? (accepted / docAppts.length * 100).toFixed(0) : 0,
        noShowRate: docAppts.length > 0 ? (noShows / docAppts.length * 100).toFixed(0) : 0,
        avgPerDay: (docAppts.length / 30).toFixed(1),
      };
    }).sort((a, b) => b.totalAppointments - a.totalAppointments);
  }, [appointments]);

  const statusData = useMemo(() => 
    Object.entries(stats).map(([name, value]) => ({ name: t(`appointments.status.${name}` as any, name), value })),
  [stats, t]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--info))', 'hsl(var(--secondary))'];

  const totalAppts = appointments.length;
  const completedRate = ((stats.Completed || 0) / totalAppts * 100).toFixed(1);
  const noShowRate = ((stats.NoShow || 0) / totalAppts * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
            <div><p className="text-2xl font-bold">{doctors.length}</p><p className="text-sm text-muted-foreground">{t('admin.analytics.totalDoctors')}</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10"><UserCheck className="h-5 w-5 text-success" /></div>
            <div><p className="text-2xl font-bold">{patients.length}</p><p className="text-sm text-muted-foreground">{t('admin.analytics.totalPatients')}</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10"><Calendar className="h-5 w-5 text-info" /></div>
            <div><p className="text-2xl font-bold">{totalAppts}</p><p className="text-sm text-muted-foreground">{t('admin.analytics.totalAppointments')}</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10"><Activity className="h-5 w-5 text-warning" /></div>
            <div><p className="text-2xl font-bold">{noShowRate}%</p><p className="text-sm text-muted-foreground">{t('admin.analytics.noShowRate')}</p></div>
          </div>
        </CardContent></Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />{t('admin.analytics.statusDistribution')}</CardTitle></CardHeader>
          <CardContent className="overflow-hidden">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie 
                  data={statusData} 
                  cx="50%" 
                  cy="35%" 
                  innerRadius={50} 
                  outerRadius={80} 
                  paddingAngle={2} 
                  dataKey="value"
                  label={false}
                >
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend 
                  layout="horizontal" 
                  align="center" 
                  verticalAlign="bottom"
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value: string, entry: any) => {
                    const item = statusData.find(d => d.name === value);
                    const total = statusData.reduce((sum, d) => sum + d.value, 0);
                    const percent = item && total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
                    return <span className="text-xs">{value} ({percent}%)</span>;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />{t('admin.analytics.appointmentsPerDoctor')}</CardTitle></CardHeader>
          <CardContent className="overflow-hidden">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={doctorAnalytics.slice(0, 6)} layout="vertical">
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={80} 
                  tick={{ fontSize: 10 }} 
                  tickFormatter={(value) => value.length > 12 ? value.substring(0, 12) + '...' : value}
                />
                <Tooltip /><Bar dataKey="totalAppointments" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader><CardTitle>{t('admin.analytics.topDoctors')}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.table.rank')}</TableHead>
                <TableHead>{t('admin.table.doctorName')}</TableHead>
                <TableHead>{t('admin.table.specialty')}</TableHead>
                <TableHead>{t('admin.table.patients')}</TableHead>
                <TableHead>{t('admin.table.appointments')}</TableHead>
                <TableHead>{t('admin.table.acceptRate')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctorAnalytics.slice(0, 10).map((doc, i) => (
                <TableRow key={doc.id}>
                  <TableCell><span className={`font-bold ${i < 3 ? 'text-primary' : ''}`}>#{i + 1}</span></TableCell>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>{doc.specialty}</TableCell>
                  <TableCell>{doc.totalPatients}</TableCell>
                  <TableCell>{doc.totalAppointments}</TableCell>
                  <TableCell><div className="flex items-center gap-2"><Progress value={Number(doc.acceptRate)} className="w-16 h-2" /><span className="text-sm">{doc.acceptRate}%</span></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
