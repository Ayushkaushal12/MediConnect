import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/UI/Button';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import api from '../../utils/api';

const BookAppointment = () => {
  const [formData, setFormData] = useState({
      doctorId: '',
      date: '',
      time: '',
      reason: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
        try {
            const { data } = await api.get('/patient/doctors');
            setDoctors(data);
        } catch (err) {
            console.error("Failed to fetch doctors", err);
           setError("Failed to fetch doctors list.");
        }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
          await api.post('/patient/book-appointment', formData);
          setSuccess(true);
          setFormData({ doctorId: '', date: '', time: '', reason: '' });
          setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
          setError(err.response?.data?.message || "Failed to book appointment");
      } finally {
          setLoading(false);
      }
  };

  const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Book New Appointment</h1>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
         {success && (
             <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg">
                 Appointment Request Sent Successfully!
             </div>
         )}
         {error && (
             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
                 {error}
             </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Select Doctor</label>
                <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                    <select
                        name="doctorId"
                        value={formData.doctorId}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white appearance-none"
                    >
                        <option value="">Choose a specialist...</option>
                        {doctors.map(doc => (
                            <option key={doc._id} value={doc._id}>{doc.name} {doc.specialization ? `— ${doc.specialization}` : ''}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                        />
                    </div>
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Time</label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                        <select
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white appearance-none"
                        >
                            <option value="">Select slot...</option>
                            <option value="09:00">09:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="14:00">02:00 PM</option>
                            <option value="15:00">03:00 PM</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Reason for Visit</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-600"
                        placeholder="Briefly describe your symptoms..."
                    ></textarea>
                </div>
            </div>

            <Button type="submit" size="lg" className="w-full md:w-auto" disabled={loading}>
                {loading ? 'Booking...' : 'Confirm Booking'}
            </Button>
         </form>
      </div>
    </div>
  );
};

export default BookAppointment;
