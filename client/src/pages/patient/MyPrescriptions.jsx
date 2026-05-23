import React, { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import Button from '../../components/UI/Button';
import api from '../../utils/api';

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchPrescriptions = async () => {
          try {
              const { data } = await api.get('/patient/prescriptions');
              setPrescriptions(data);
          } catch (error) {
             console.error("Failed to fetch prescriptions", error);
          } finally {
              setLoading(false);
          }
      }
      fetchPrescriptions();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)]">
      {/* List Side */}
      <div className="lg:col-span-1 border-r border-white/10 pr-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Prescriptions</h1>
          {prescriptions.length === 0 ? (
             <div className="text-gray-500">No prescriptions found.</div>
          ) : (
             <div className="space-y-3">
              {prescriptions.map((script) => (
                  <button
                      key={script._id}
                      onClick={() => setSelectedPrescription(script)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${selectedPrescription?._id === script._id ? 'bg-blue-600 border-blue-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                  >
                      <div className="flex justify-between items-start mb-2">
                         <span className="font-semibold">{script.doctorId?.name || 'Doctor'}</span>
                         <span className={`text-xs ${selectedPrescription?._id === script._id ? 'text-blue-200' : 'text-gray-500'}`}>{formatDate(script.createdAt || new Date())}</span>
                      </div>
                      <p className={`text-sm ${selectedPrescription?._id === script._id ? 'text-blue-100' : 'text-gray-400'}`}>{script.diagnosis}</p>
                  </button>
              ))}
             </div>
          )}
      </div>

      {/* Detail Side */}
      <div className="lg:col-span-2">
          {selectedPrescription ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full overflow-y-auto">
                  <div className="flex justify-between items-start mb-8">
                      <div>
                          <h2 className="text-3xl font-bold mb-1">Prescription</h2>
                          <p className="text-gray-400">Issued by {selectedPrescription.doctorId?.name} on {formatDate(selectedPrescription.createdAt || new Date())}</p>
                      </div>
                      <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                      </Button>
                  </div>

                  <div className="space-y-8">
                      <div>
                          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Diagnosis</h3>
                          <p className="text-xl">{selectedPrescription.diagnosis}</p>
                      </div>
                      
                      {selectedPrescription.notes && (
                         <div>
                            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Notes</h3>
                            <p className="text-gray-300">{selectedPrescription.notes}</p>
                         </div>
                      )}

                      <div>
                          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Medications</h3>
                          <div className="space-y-3">
                              {selectedPrescription.medicines.map((med, idx) => (
                                  <div key={idx} className="flex justify-between items-center p-4 rounded-lg bg-black/20 border border-white/5">
                                      <div>
                                          <div className="font-semibold text-lg text-blue-400">{med.name}</div>
                                          <div className="text-sm text-gray-400">{med.dosage}</div>
                                      </div>
                                      <div className="text-sm bg-white/5 px-3 py-1 rounded-full">
                                          {med.frequency}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
                  <FileText className="w-16 h-16 mb-4 opacity-20" />
                  <p>Select a prescription to view details</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default MyPrescriptions;
