import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, Check, X, FileText, Pill } from 'lucide-react';
import Button from '../../components/UI/Button';
import api from '../../utils/api';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Prescription Modal State
  const [showPrescribe, setShowPrescribe] = useState(null); // appointment object
  const [prescriptionForm, setPrescriptionForm] = useState({ diagnosis: '', medicines: '', notes: '' });

  const fetchAppointments = async () => {
      try {
          const { data } = await api.get('/doctor/appointments');
          setAppointments(data);
      } catch (error) {
          console.error("Failed to fetch appointments", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
      try {
          await api.put(`/doctor/appointments/${id}`, { status });
          fetchAppointments(); // Refresh list
      } catch (error) {
          console.error(`Failed to update status to ${status}`, error);
          alert('Failed to update status');
      }
  };

  const handlePrescribeClick = (apt) => {
      setShowPrescribe(apt);
      setPrescriptionForm({ diagnosis: '', medicines: '', notes: '' });
  };

  const submitPrescription = async (e) => {
      e.preventDefault();
      try {
          // Parse medicines string to object array if backend expects array
          // Backend might expect: [{ name, dosage, frequency, duration }]
          // For simplicity, let's just make it one entry or fix backend to accept string or just send as is if flexible.
          // Looking at Prescription.js model: medicines: [{ name, dosage, frequency, duration }]
          // I'll assume simple text input for now and parse it crudely or update backend to be more lenient.
          // Let's create a single generic medicine entry for now to satisfy schema.
          
          const medicinesArray = prescriptionForm.medicines.split(',').map(m => ({
              name: m.trim(),
              dosage: 'As directed', // Default
              frequency: 'Daily',
              duration: '7 days'
          }));

          await api.post('/doctor/prescriptions', {
              appointmentId: showPrescribe._id,
              patientId: showPrescribe.patientId._id,
              diagnosis: prescriptionForm.diagnosis,
              medicines: medicinesArray,
              notes: prescriptionForm.notes
          });
          
          // Optionally mark appointment as completed
          await api.put(`/doctor/appointments/${showPrescribe._id}`, { status: 'completed' });
          
          setShowPrescribe(null);
          fetchAppointments();
          alert('Prescription sent successfully!');
      } catch (error) {
          console.error("Failed to issue prescription", error);
          alert('Failed to issue prescription');
      }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Appointments Request</h1>

      <div className="space-y-4">
        {appointments.map((apt) => (
            <div key={apt._id} className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg uppercase">
                        {apt.patientId?.name ? apt.patientId.name[0] : 'P'}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{apt.patientId?.name || 'Unknown Patient'}</h3>
                        <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                            <FileText className="w-3 h-3" />
                            {apt.reason || 'No reason provided'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          {formatDate(apt.date)}
                      </div>
                      <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          {apt.time}
                      </div>
                </div>

                <div className="flex gap-3">
                    {apt.status === 'pending' && (
                        <>
                             <Button size="sm" onClick={() => handleStatusUpdate(apt._id, 'confirmed')} className="bg-green-600 hover:bg-green-700">
                                <Check className="w-4 h-4 mr-1" /> Accept
                             </Button>
                             <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(apt._id, 'cancelled')} className="text-red-400 border-red-400/30 hover:bg-red-400/10">
                                <X className="w-4 h-4 mr-1" /> Reject
                             </Button>
                        </>
                    )}
                    {apt.status === 'confirmed' && (
                         <Button size="sm" onClick={() => handlePrescribeClick(apt)} className="bg-blue-600 hover:bg-blue-700">
                            <Pill className="w-4 h-4 mr-1" /> Prescribe
                         </Button>
                    )}
                    {apt.status === 'completed' && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                            Completed
                        </span>
                    )}
                    {apt.status === 'cancelled' && (
                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                            Cancelled
                        </span>
                    )}
                </div>
            </div>
        ))}
      </div>

      {/* Simplified Prescription Modal */}
      {showPrescribe && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
           <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-lg w-full">
               <h2 className="text-xl font-bold mb-4">Issue Prescription for {showPrescribe.patientId?.name}</h2>
               <form onSubmit={submitPrescription} className="space-y-4">
                   <div>
                       <label className="block text-sm text-gray-400 mb-1">Diagnosis</label>
                       <input 
                         className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                         value={prescriptionForm.diagnosis}
                         onChange={e => setPrescriptionForm({...prescriptionForm, diagnosis: e.target.value})}
                         required 
                       />
                   </div>
                   <div>
                       <label className="block text-sm text-gray-400 mb-1">Medicines (comma separated)</label>
                       <input 
                         className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                         placeholder="e.g. Asprin, Vitamin C"
                         value={prescriptionForm.medicines}
                         onChange={e => setPrescriptionForm({...prescriptionForm, medicines: e.target.value})}
                         required 
                       />
                   </div>
                   <div>
                       <label className="block text-sm text-gray-400 mb-1">Notes</label>
                       <textarea 
                         className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                         value={prescriptionForm.notes}
                         onChange={e => setPrescriptionForm({...prescriptionForm, notes: e.target.value})}
                         rows="3"
                       />
                   </div>
                   <div className="flex justify-end gap-3 mt-6">
                       <Button type="button" variant="ghost" onClick={() => setShowPrescribe(null)}>Cancel</Button>
                       <Button type="submit">Submit Prescription</Button>
                   </div>
               </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
