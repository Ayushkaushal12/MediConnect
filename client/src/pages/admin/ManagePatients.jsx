import React, { useState, useEffect } from 'react';
import { Trash2, Mail } from 'lucide-react';
import Button from '../../components/UI/Button';
import api from '../../utils/api';

const ManagePatients = () => {
   const [patients, setPatients] = useState([]);
   const [loading, setLoading] = useState(true);

   const fetchPatients = async () => {
       try {
           const { data } = await api.get('/admin/users?role=patient');
           setPatients(data);
       } catch (error) {
           console.error("Failed to fetch patients", error);
       } finally {
           setLoading(false);
       }
   };

   useEffect(() => {
       fetchPatients();
   }, []);

   const handleDelete = async (id) => {
       if(window.confirm('Are you sure you want to remove this patient?')) {
           try {
               await api.delete(`/admin/users/${id}`);
               fetchPatients();
           } catch (error) {
               console.error("Failed to delete", error);
               alert("Failed to delete user");
           }
       }
   };

   if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Patients</h1>

      {patients.length === 0 ? (
          <div className="text-gray-500">No patients found.</div>
      ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
             <table className="w-full text-left">
                 <thead className="bg-white/5 text-gray-400 text-sm uppercase">
                     <tr>
                         <th className="px-6 py-4 font-medium">Patient</th>
                         <th className="px-6 py-4 font-medium">Email</th>
                         <th className="px-6 py-4 font-medium text-right">Actions</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                     {patients.map((patient) => (
                         <tr key={patient._id} className="hover:bg-white/5 transition-colors">
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold uppercase">
                                         {patient.name ? patient.name[0] : 'P'}
                                     </div>
                                     <div>
                                         <div className="font-medium text-white">{patient.name}</div>
                                     </div>
                                 </div>
                             </td>
                             <td className="px-6 py-4 text-gray-400 text-sm">
                                 <div className="flex items-center gap-2">
                                     <Mail className="w-3 h-3" /> {patient.email}
                                 </div>
                             </td>
                             <td className="px-6 py-4 text-right">
                                 <Button size="sm" variant="ghost" onClick={() => handleDelete(patient._id)} className="text-red-400 hover:bg-red-400/10 h-8 w-8 p-0">
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

export default ManagePatients;
