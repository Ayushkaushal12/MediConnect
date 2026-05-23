import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import api from '../../utils/api';


const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchAppointments = async () => {
          try {
              const { data } = await api.get('/patient/appointments');
              setAppointments(data);
          } catch (error) {
              console.error("Failed to fetch appointments", error);
          } finally {
              setLoading(false);
          }
      };
      fetchAppointments();
  }, []);

  const getStatusColor = (status) => {
      switch(status) {
          case 'confirmed': return 'text-green-400 bg-green-400/10 border-green-400/20';
          case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
          case 'completed': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
          case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
          default: return 'text-gray-400';
      }
  };

  const formatDate = (dateString) => {
      try {
          return new Date(dateString).toLocaleDateString();
      } catch (e) {
          return dateString;
      }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
      
      {appointments.length === 0 ? (
          <div className="text-gray-500 text-center py-10">No appointments found.</div>
      ) : (
          <div className="grid gap-4">
              {appointments.map((apt) => (
                  <div key={apt._id} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg uppercase">
                              {apt.doctorId?.name ? apt.doctorId.name[0] : 'D'}
                          </div>
                          <div>
                              <h3 className="font-semibold text-lg">{apt.doctorId?.name || 'Unknown Doctor'}</h3>
                              <p className="text-gray-400 text-sm">{apt.doctorId?.email || 'General'}</p>
                          </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                          <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              {formatDate(apt.date)}
                          </div>
                          <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-500" />
                              {apt.time || 'TBD'}
                          </div>
                      </div>

                      <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)} capitalize`}>
                              {apt.status}
                          </span>
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default MyAppointments;
