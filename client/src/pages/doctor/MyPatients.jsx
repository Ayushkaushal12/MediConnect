import React, { useState, useEffect } from 'react';
import { User, Phone, Mail } from 'lucide-react';
import api from '../../utils/api';

const MyPatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
             try {
                 const { data } = await api.get('/doctor/patients');
                 setPatients(data);
             } catch (error) {
                 console.error("Failed to fetch patients", error);
             } finally {
                 setLoading(false);
             }
        };
        fetchPatients();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Patients</h1>
            {patients.length === 0 ? (
                <div className="text-gray-500">No patients found yet.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patients.map(patient => (
                        <div key={patient._id} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg uppercase">
                                    {patient.name ? patient.name[0] : 'P'}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{patient.name || 'Unknown'}</h3>
                                    {/* <p className="text-xs text-gray-500">Last Visit: TBD</p> */}
                                </div>
                            </div>
                            <div className="space-y-2 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> {patient.email}
                                </div>
                                {patient.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> {patient.phone}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPatients;
