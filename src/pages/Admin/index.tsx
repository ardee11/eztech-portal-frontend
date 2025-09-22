import { useState } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import { ClipLoader } from "react-spinners";
import AdminModal from "../../components/modal/Admin/AdminAddModal";
import { AdminRemoveModal } from "../../components/modal/Admin/AdminRemoveModal";
import AdminEditModal from "../../components/modal/Admin/AdminEditModal";

export default function Admin() {
  const [refresh, setRefresh] = useState(false);
  const { admins, loading, error } = useAdmin(refresh);
  const [adminToDelete, setAdminToDelete] = useState<null | { aid: number; name: string; email: string }>(null);
  const [adminToEdit, setAdminToEdit] = useState<null | { aid: number; }>(null);
  const [isAddAdminModalOpen, setIsAddCompanyModalOpen] = useState(false);

  const handleModalClose = () => {
    setRefresh(prev => !prev); 
    setIsAddCompanyModalOpen(false);
  };

  const handleRemoveModalClose = () => {
    setRefresh(prev => !prev); 
    setAdminToDelete(null);
  };

  const handleEditModalClose = () => {
    setRefresh(prev => !prev); 
    setAdminToEdit(null);
  };

  return (
    <>
      <div className="p-6 mx-auto">
        <div className="flex flex-col">
          <div className="min-w-full">
            <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
              <div className="bg-blue-100 px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center">
                <div>
                  <h2 className="text-lg 3xl:text-xl font-bold text-gray-900">
                    Access List
                  </h2>
                </div>
                
                <div>
                  <button 
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-xs 3xl:text-sm font-medium rounded-lg text-white bg-teal-500 shadow-2xs hover:bg-teal-600 hover:cursor-pointer transition"
                    onClick={()=>setIsAddCompanyModalOpen(true)}
                  >
                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                    Add Access
                  </button>
                </div>
              </div>
              
              {isAddAdminModalOpen && (
                <AdminModal
                  isOpen={isAddAdminModalOpen}
                  onClose={handleModalClose}
                />
              )}
              
              {loading && (
                <div className="p-4 flex justify-center">
                  <ClipLoader color="#3498db" size={42} />
                </div>
              )}
              {error && (
                <div className="p-4 flex justify-center">
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && (
                <div className="w-full">
                  <div className="sticky top-0 z-10 bg-gray-50 border-b border-t border-gray-300">
                    <div className="flex min-w-full">
                      <div className="px-6 py-3 w-[20%] text-left text-xs 3xl:text-sm font-medium text-gray-700 uppercase">Name</div>
                      <div className="px-6 py-3 w-[25%] text-left text-xs 3xl:text-sm font-medium text-gray-700 uppercase">Email</div>
                      <div className="px-6 py-3 w-[20%] text-left text-xs 3xl:text-sm font-medium text-gray-700 uppercase">Position</div>
                      <div className="px-6 py-3 w-[20%] text-left text-xs 3xl:text-sm font-medium text-gray-700 uppercase">Role</div>
                      <div className="px-6 py-3 ml-auto text-left text-xs 3xl:text-sm font-medium text-gray-700 uppercase"></div>
                    </div>
                  </div>

                  <div className="overflow-auto max-h-[calc(100vh-440px)] divide-y divide-gray-200">
                    {admins
                      .slice()
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((admin) => (
                      <div 
                        key={admin.aid} 
                        onClick={() => 
                          setAdminToEdit({aid: admin.aid})
                        }
                        className="flex items-center hover:bg-gray-100 text-sm hover:cursor-pointer 3xl:text-base transition duration-200">
                        <div className="px-6 py-3 3xl:py-4 w-[20%] flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                          {admin.name}
                        </div>
                        <div className="px-6 py-2 w-[25%]">{admin.email}</div>
                        <div className="px-6 py-2 w-[20%]">{admin.position}</div>
                        <div className="px-6 py-2 w-[20%] truncate">{admin.role && admin.role.length > 0
                            ? admin.role.join(", ")
                            : "Not specified"}
                        </div>
                        <div className="px-6 py-2 ml-auto text-xs">
                          <button 
                            className="text-neutral-600 hover:cursor-pointer hover:bg-gray-200 hover:text-red-400 p-2 rounded-full transition duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAdminToDelete({
                                aid: admin.aid,
                                name: admin.name,
                                email: admin.email
                              });
                            }}
                          >
                            <svg className="shrink-0 size-4.5 3xl:size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" /></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {adminToDelete && (
                <AdminRemoveModal
                  aid={adminToDelete.aid}
                  name={adminToDelete.name}
                  email={adminToDelete.email}
                  isOpen={true}
                  onClose={handleRemoveModalClose}
                />
              )}
              {adminToEdit && (
                <AdminEditModal
                  aid={adminToEdit.aid}
                  isOpen={true}
                  onClose={handleEditModalClose}
                />
              )}
              <div className="py-5 flex justify-between border-t border-gray-300">
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
