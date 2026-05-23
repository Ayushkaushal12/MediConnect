import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, CheckCircle, Activity } from 'lucide-react';
import api from '../../utils/api';

const StatCard = ({ title, value, icon, color = "blue" }) => (
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

const DoctorDashboard = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        todayAppointments: 0,
        completedToday: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // We can fetch appointments and patients to calc stats on frontend or make a stats endpoint.
                // Reusing simple fetching for now.
                const [appointmentsRes, patientsRes] = await Promise.all([
                    api.get('/doctor/appointments'),
                    api.get('/doctor/patients')
                ]);
                
                const appointments = appointmentsRes.data;
                const patients = patientsRes.data;

                const today = new Date().toDateString();
                const todayAppts = appointments.filter(a => new Date(a.date).toDateString() === today);
                
                setStats({
                    totalPatients: patients.length,
                    todayAppointments: todayAppts.length,
                    completedToday: todayAppts.filter(a => a.status === 'completed').length
                });

            } catch (error) {
                console.error("Failed to fetch doctor stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { title: "Total Patients", value: stats.totalPatients, icon: <Users className="w-6 h-6"/> },
        { title: "Today's Appointments", value: stats.todayAppointments, icon: <Calendar className="w-6 h-6"/> },
        { title: "Completed Today", value: stats.completedToday, icon: <CheckCircle className="w-6 h-6"/> },
    ];

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-2">Doctor Dashboard</h1>
                <p className="text-gray-400">Manage your schedule and patients.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                 <h2 className="text-xl font-bold mb-6">Today's Schedule</h2>
                 <div className="text-center text-gray-500 py-10">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Check the "Appointments" tab for details.</p>
                 </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
