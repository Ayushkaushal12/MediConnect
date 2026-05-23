import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Activity, FileText } from 'lucide-react';
import api from '../../utils/api';

const StatCard = ({ title, value, icon, subtext, color = "blue" }) => (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-400`}>
          {icon}
        </div>
        {/* <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
            +4.5%
        </span> */}
      </div>
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
);

const AppointmentItem = ({ date, time, doctor, type, status }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold uppercase">
                {doctor ? doctor[0] : 'D'}
            </div>
            <div>
                <h4 className="font-medium text-white">{doctor || 'Unknown Doctor'}</h4>
                <p className="text-sm text-gray-500">{type || 'Specialist'}</p>
            </div>
        </div>
        <div className="text-right">
             <div className="text-sm text-white font-medium">{time}</div>
             <div className="text-xs text-gray-500">{date}</div>
        </div>
    </div>
)

const PatientDashboard = () => {
  const [stats, setStats] = useState({
      appointments: 0,
      prescriptions: 0,
      nextVisit: 'None'
  });
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const [appointmentsRes, prescriptionsRes] = await Promise.all([
                  api.get('/patient/appointments'),
                  api.get('/patient/prescriptions')
              ]);

              const appointments = appointmentsRes.data;
              const prescriptions = prescriptionsRes.data;

              // Calculate Next Visit (First future appointment)
              const now = new Date();
              const futureAppts = appointments.filter(a => new Date(a.date) >= now && a.status !== 'cancelled' && a.status !== 'mod_cancelled'); // Assuming mod_cancelled for doctor rejection
              const nextAppt = futureAppts.sort((a,b) => new Date(a.date) - new Date(b.date))[0];
              
              const nextVisitDate = nextAppt 
                  ? new Date(nextAppt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) 
                  : 'N/A';

              setStats({
                  appointments: appointments.length,
                  prescriptions: prescriptions.length,
                  nextVisit: nextVisitDate
              });

              setUpcoming(futureAppts.slice(0, 3)); // Top 3 upcoming

          } catch (error) {
              console.error("Failed to fetch dashboard data", error);
          } finally {
              setLoading(false);
          }
      };

      fetchData();
  }, []);

  const statCards = [
      { title: "Total Appointments", value: stats.appointments, icon: <Calendar className="w-6 h-6"/> },
      { title: "Prescriptions", value: stats.prescriptions, icon: <FileText className="w-6 h-6"/> },
      { title: "Next Visit", value: stats.nextVisit, icon: <Clock className="w-6 h-6"/> },
      { title: "Next Visit", value: stats.nextVisit, icon: <Clock className="w-6 h-6"/> },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back, here's your health overview.</p>
      </div>
      
      {/* Stats Grid */}
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

      <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Appointments */}
          <div className="lg:col-span-2 space-y-6">
               <h2 className="text-xl font-bold">Upcoming Appointments</h2>
               <div className="space-y-4">
                    {upcoming.length > 0 ? upcoming.map(apt => (
                        <AppointmentItem 
                            key={apt._id}
                            doctor={apt.doctorId?.name} 
                            type={apt.doctorId?.specialization || 'General'} 
                            date={new Date(apt.date).toLocaleDateString()} 
                            time={apt.time} 
                            status={apt.status} 
                        />
                    )) : (
                        <div className="text-gray-500">No upcoming appointments.</div>
                    )}
               </div>
          </div>
          
           {/* Quick Actions / Notifications */}
          <div className="space-y-6">
               <h2 className="text-xl font-bold">Notifications</h2>
               <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-4">
                   <div className="flex gap-3">
                       <div className="mt-1 w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                       <div>
                           <p className="text-sm text-gray-200">System functionality restored with real-time data.</p>
                           <p className="text-xs text-gray-500 mt-1">Just now</p>
                       </div>
                   </div>
               </div>
          </div>
      </div>

    </div>
  );
};

export default PatientDashboard;
