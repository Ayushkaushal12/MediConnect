import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Stethoscope, Calendar, Activity } from 'lucide-react';
import api from '../../utils/api';

const StatCard = ({ title, value, icon, color }) => (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-400`}>
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
      totalPatients: 0,
      totalDoctors: 0,
      totalAppointments: 0,
      pendingDoctors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchStats = async () => {
          try {
              const { data } = await api.get('/admin/stats');
              setStats(data);
          } catch (error) {
              console.error("Failed to fetch admin stats", error);
          } finally {
              setLoading(false);
          }
      };
      fetchStats();
  }, []);

  const statCards = [
      { title: "Total Patients", value: stats.totalPatients, icon: <Users className="w-6 h-6"/>, color: "blue" },
      { title: "Active Doctors", value: stats.totalDoctors, icon: <Stethoscope className="w-6 h-6"/>, color: "green" },
      { title: "Total Appointments", value: stats.totalAppointments, icon: <Calendar className="w-6 h-6"/>, color: "purple" },
      { title: "Pending Approvals", value: stats.pendingDoctors, icon: <Activity className="w-6 h-6"/>, color: "orange" },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Platform Overview</h1>
        <p className="text-gray-400">Welcome to the master control panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => (
             <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
             >
                <StatCard {...stat} />
             </motion.div>
          ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
