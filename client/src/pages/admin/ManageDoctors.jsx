import React, { useState, useEffect } from 'react';
import { Check, X, Trash2, Mail } from 'lucide-react';
import Button from '../../components/UI/Button';
import api from '../../utils/api';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
      try {
          const { data } = await api.get('/admin/users?role=doctor');
          setDoctors(data);
      } catch (error) {
          console.error("Failed to fetch doctors", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchDoctors();
  }, []);

  const handleApprove = async (id) => {
      try {
          await api.put(`/admin/approve-doctor/${id}`);
          fetchDoctors();
      } catch (error) {
          console.error("Failed to approve", error);
          alert("Failed to approve doctor");
      }
  };

  const handleDelete = async (id) => {
      if(window.confirm('Are you sure you want to delete this doctor account?')) {
          try {
              await api.delete(`/admin/users/${id}`);
              fetchDoctors();
          } catch (error) {
               console.error("Failed to delete", error);
               alert("Failed to delete user");
          }
      }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Doctors</h1>

       {doctors.length === 0 ? (
           <div className="text-gray-500">No doctors found.</div>
       ) : (
           <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
             <table className="w-full text-left">
                 <thead className="bg-white/5 text-gray-400 text-sm uppercase">
                     <tr>
                         <th className="px-6 py-4 font-medium">Doctor</th>
                         <th className="px-6 py-4 font-medium">Status</th>
                         <th className="px-6 py-4 font-medium">Specialization</th>
                         <th className="px-6 py-4 font-medium text-right">Actions</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                     {doctors.map((doc) => (
                         <tr key={doc._id} className="hover:bg-white/5 transition-colors">
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold uppercase">
                                         {doc.name ? doc.name[0] : 'D'}
                                     </div>
                                     <div>
                                         <div className="font-medium text-white">{doc.name}</div>
                                         <div className="text-xs text-gray-500 flex items-center gap-1">
                                             <Mail className="w-3 h-3" /> {doc.email}
                                         </div>
                                     </div>
                                 </div>
                             </td>
                             <td className="px-6 py-4">
                                 <span className={`px-2 py-1 rounded text-xs font-medium capitalize border ${
                                     doc.isDoctorApproved 
                                     ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                     : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                 }`}>
                                     {doc.isDoctorApproved ? 'Approved' : 'Pending'}
                                 </span>
                             </td>
                             <td className="px-6 py-4 text-gray-400 text-sm">
                                 {doc.specialization || 'General'}
                             </td>
                             <td className="px-6 py-4 text-right space-x-2">
                                 {!doc.isDoctorApproved && (
                                     <Button size="sm" onClick={() => handleApprove(doc._id)} className="bg-green-600 hover:bg-green-700 h-8">
                                         <Check className="w-4 h-4" />
                                     </Button>
                                 )}
                                 <Button size="sm" variant="ghost" onClick={() => handleDelete(doc._id)} className="text-red-400 hover:bg-red-400/10 h-8 w-8 p-0">
                                     <Trash2 className="w-4 h-4" />
                                 </Button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
          </div>
       )}
    </div>
  );
};

export default ManageDoctors;
