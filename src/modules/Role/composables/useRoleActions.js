// modules/Role/composables/useRoleActions.js

import { ref } from 'vue';
import { roleService } from '@/modules/Role/services/roleService';
import { useToast } from "@/composables/useToast";
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

// Inisialisasi toast di luar (seperti kode asli Anda)
const toast = useToast();

// Fungsi VALIDASI yang digeneralisasi
const validateForm = (formData, errorState) => {
  errorState.value = {};
  if (!formData.role || formData.role.trim() === '') {
    errorState.value.role = "Nama Role tidak boleh kosong.";
  }
  return Object.keys(errorState.value).length === 0;
};

export function useRoleActions(allData, renderFeatherIcons, initTooltips) {
  const isSubmitting = ref(false);

  // TAMBAHKAN STATE PENTING INI UNTUK MODULARITAS
  const isEditMode = ref(false);

  const form = ref({ role: '' });
  const errors = ref({});
  const editForm = ref({ id: null, role: '' });
  const editErrors = ref({});

  // Helper untuk menutup Modal (kita gabung di sini)
  const hideModal = (modalId) => {
    const modalElement = document.getElementById(modalId);
    const modalInstance = Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  // FUNGSI UTAMA UNTUK MENGAMBIL DATA
  const fetchDataFromApi = async () => {
    try {
      const responseData = await roleService.getRole();
      allData.value = responseData.map(item => ({
        ...item,
        status_label: item.status === 1 ? 'Aktif' : 'Tidak Aktif',
        status_class: item.status === 1 ? 'bg-soft-success' : 'bg-soft-danger'
      }));
      renderFeatherIcons();
      initTooltips();
    } catch (error) {
      toast.error('Gagal memuat data role.');
    }
  };

  // FUNGSI UNTUK MENAMBAH ROLE
  const handleStoreRole = async (formData) => { // Menerima formData dari Parent/Modal
    if (!validateForm(formData, errors)) {
      toast.error("Ada kesalahan pada form. Silakan periksa kembali."); // <-- Perbaikan di sini
      return;
    }

    isSubmitting.value = true;
    try {
      const response = await roleService.storeRole({ role: formData.role });
      if (response.success) {
        toast.success(response.message);
        hideModal('roleModal'); // Asumsi ID modal yang digabung adalah 'roleModal'
        await fetchDataFromApi();
      } else {
        toast.error(response.message || 'Gagal menyimpan data.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.';
      toast.error(errorMessage);
    } finally {
      isSubmitting.value = false;
    }
  };

  // FUNGSI UNTUK RESET FORM
  // Fungsi ini hanya mereset state di composable, penutupan modal dilakukan di parent/saat event 'hidden.bs.modal'
  const resetForm = () => {
    form.value.role = '';
    errors.value = {};
    editForm.value = { id: null, role: '' };
    editErrors.value = {};
    isEditMode.value = false;
  };

  // FUNGSI UNTUK MENYIAPKAN DATA EDIT
  const setCurrentEditItem = (item) => {
    isEditMode.value = true; // <-- Set mode ke Edit
    editForm.value.id = item.id;
    editForm.value.role = item.role;
    editErrors.value = {};
    // Tidak perlu menampilkan modal di sini. Parent yang akan melakukannya.
  };

  // FUNGSI UNTUK MENGEDIT ROLE
  const handleEditRole = async (formData) => { // Menerima formData dari Parent/Modal
    if (!validateForm(formData, editErrors)) {
      toast.error("Ada kesalahan pada form. Silakan periksa kembali.");
      return;
    }

    isSubmitting.value = true;
    try {
      const response = await roleService.updateRole(formData.id, {
        role: formData.role
      });

      if (response.success) {
        toast.success(response.message);
        hideModal('roleModal'); // Asumsi ID modal yang digabung adalah 'roleModal'
        await fetchDataFromApi();
      } else {
        toast.error(response.message || 'Gagal memperbarui data.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan perubahan.';
      toast.error(errorMessage);
    } finally {
      isSubmitting.value = false;
    }
  };

  // FUNGSI UNTUK MENGHAPUS ROLE (Tidak ada perubahan)
  const handleDeleteRole = async (item) => {
    const result = await Swal.fire({
      title: "Apakah Anda Yakin?",
      text: "Anda tidak akan bisa mengembalikannya!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    });
    const payload = { id: item.id };
    if (result.isConfirmed) {
      try {
        const response = await roleService.deleteRole(payload);
        if (response.success) {
          toast.success(response.message);
          await fetchDataFromApi();
        } else {
          toast.error(response.message || "Gagal menghapus data.");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat menghubungi server.";
        toast.error(errorMessage);
      }
    }
  };

  return {
    form,
    errors,
    editForm,
    editErrors,
    isSubmitting,
    isEditMode, // <-- VARIABEL PENTING SUDAH DIKEMBALIKAN
    setCurrentEditItem, // <-- Ganti openEditModal dengan setCurrentEditItem
    fetchDataFromApi,
    handleStoreRole,
    handleEditRole,
    handleDeleteRole,
    resetForm,
  };
}
