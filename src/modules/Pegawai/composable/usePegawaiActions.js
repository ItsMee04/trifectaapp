import { ref, computed, onBeforeUnmount } from 'vue'; // Tambahkan onBeforeUnmount
// Asumsi path ini benar dari file PegawaiPage.vue Anda
import { pegawaiService } from '@/modules/Pegawai/services/pegawaiService';
import { useToast } from "@/composables/useToast";
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

import { AVATAR_BASE_URL } from '@/composables/useBase';

const toast = useToast();

// --- UTILITY ---
const hideModal = (modalId) => {
    const modalElement = document.getElementById(modalId);
    const modalInstance = Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide();
    }
};

const validateForm = (formData, errorState) => {
    errorState.value = {};
    let isValid = true;

    if (!formData.nip || !formData.nip.trim()) {
        errorState.value.nip = 'NIP wajib diisi.'; isValid = false;
    }
    if (!formData.nama || !formData.nama.trim()) {
        errorState.value.nama = 'Nama wajib diisi.'; isValid = false;
    }
    if (!formData.alamat || !formData.alamat.trim()) {
        errorState.value.alamat = 'Alamat wajib diisi.'; isValid = false;
    }
    if (!formData.kontak || !formData.kontak.trim()) {
        errorState.value.kontak = 'Kontak wajib diisi.'; isValid = false;
    } else if (!/^\d+$/.test(formData.kontak.trim())) {
        errorState.value.kontak = 'Kontak hanya boleh berisi angka.'; isValid = false;
    }
    // Jabatan bisa berupa objek { id: X, label: Y } atau string kosong.
    if (!formData.jabatan || !formData.jabatan.id) {
        errorState.value.jabatan = 'Jabatan wajib diisi.'; isValid = false;
    }

    return isValid;
};

// Helper untuk mengelola URL objek dan mencegah memory leak
const updateImageState = (file, formState, previewUrlState, fieldName) => {
    // Revoke URL lama sebelum membuat yang baru
    if (previewUrlState.value) {
        URL.revokeObjectURL(previewUrlState.value);
    }

    if (file) {
        formState.value[fieldName] = file;
        previewUrlState.value = URL.createObjectURL(file);
    } else {
        formState.value[fieldName] = null;
        previewUrlState.value = null;
    }
};


// --- COMPOSABLE CORE ---

export function usePegawaiActions(allData, refreshTooltipsAndIcons) {
    const isSubmitting = ref(false);
    const isEditMode = ref(false);

    // State untuk form 'Tambah'
    const form = ref({
        nip: '', nama: '', alamat: '', kontak: '', jabatan: null,
        image_pegawai: null, // File yang diunggah
    });
    const errors = ref({});
    const imagePreviewUrl = ref(null); // URL pratinjau untuk form TAMBAH

    // State untuk form 'Edit'
    const editForm = ref({
        id: null, nip: '', nama: '', alamat: '', kontak: '', jabatan: null,
        image_pegawai: null, // Nama file gambar dari database
        new_image_file: null // File baru yang diunggah
    });
    const editErrors = ref({});
    const newImagePreviewUrl = ref(null); // URL pratinjau untuk file baru di form EDIT

    // Computed property untuk menampilkan pratinjau gambar di form EDIT
    const editImageUrl = computed(() => {
        // Prioritaskan gambar yang baru diunggah
        if (newImagePreviewUrl.value) {
            return newImagePreviewUrl.value;
        }
        // Jika tidak ada, gunakan gambar dari database
        if (editForm.value.image_pegawai) {
            // FIX: Pastikan ada '/' pemisah antara AVATAR_BASE_URL dan nama file gambar.
            // Tambahkan timestamp untuk menghindari caching saat gambar diperbarui
            return `${AVATAR_BASE_URL}/${editForm.value.image_pegawai}?t=${new Date().getTime()}`;
        }
        return null;
    });

    // --- LOGIKA FETCH DATA ---

    const fetchDataFromApi = async () => {
        try {
            const responseData = await pegawaiService.getPegawai();
            allData.value = responseData.map(item => ({
                ...item,
                // Menggabungkan logika gambar
                image: item.image_pegawai
                    ? `${AVATAR_BASE_URL}/${item.image_pegawai}?t=${new Date().getTime()}`
                    : '/src/assets/img/avatar/defaultuser.png',
                status_label: item.status === 1 ? 'Aktif' : 'Tidak Aktif',
                status_class: item.status === 1 ? 'bg-soft-success' : 'bg-soft-danger'
            }));
            // Panggil refresh setelah data dimuat
            refreshTooltipsAndIcons();
        } catch (error) {
            toast.error('Gagal memuat data pegawai.');
        }
    };


    // --- LOGIKA TAMBAH ---

    // *DIUPDATE MENGGUNAKAN HELPER*
    const handleImageChange = (file) => {
        updateImageState(file, form, imagePreviewUrl, 'image_pegawai');
    };

    const handleStorePegawai = async () => {
        if (!validateForm(form.value, errors)) {
            toast.error('Mohon periksa kembali input Anda!');
            return;
        }

        const formData = new FormData();
        formData.append('nip', form.value.nip);
        formData.append('nama', form.value.nama);
        formData.append('alamat', form.value.alamat);
        formData.append('kontak', form.value.kontak);
        // FIX: Mengganti 'jabatan' menjadi 'jabatan_id' agar sesuai dengan konvensi backend
        formData.append('jabatan', form.value.jabatan.id);
        if (form.value.image_pegawai) { formData.append('imagePegawai', form.value.image_pegawai); }

        isSubmitting.value = true;
        try {
            await pegawaiService.storePegawai(formData);
            toast.success('Data pegawai berhasil ditambahkan!');
            hideModal('pegawaiModal'); // Gunakan ID modal yang sama untuk Add/Edit
            await fetchDataFromApi();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                errors.value = error.response.data.errors;
                toast.error('Gagal menyimpan data. Mohon periksa kembali formulir.');
            } else {
                console.error('Gagal menyimpan data pegawai:', error);
                toast.error('Terjadi kesalahan saat menyimpan data pegawai.');
            }
        } finally {
            isSubmitting.value = false;
        }
    };


    // --- LOGIKA EDIT ---

    // *DIUPDATE MENGGUNAKAN HELPER*
    const handleEditImageChange = (file) => {
        updateImageState(file, editForm, newImagePreviewUrl, 'new_image_file');
    };

    const setCurrentEditItem = (item) => {
        isEditMode.value = true;

        // Mengisi form dengan data pegawai yang dipilih
        editForm.value.id = item.id;
        editForm.value.nip = item.nip;
        editForm.value.nama = item.nama;
        editForm.value.alamat = item.alamat;
        editForm.value.kontak = item.kontak;
        editForm.value.jabatan = item.jabatan; // Asumsi item.jabatan adalah objek lengkap

        // Salin nama file gambar lama
        editForm.value.image_pegawai = item.image_pegawai;

        // Reset file yang baru diunggah dan URL pratinjau (revoke URL lama jika ada)
        editForm.value.new_image_file = null;
        if (newImagePreviewUrl.value) {
            URL.revokeObjectURL(newImagePreviewUrl.value);
            newImagePreviewUrl.value = null;
        }

        // Reset error
        editErrors.value = {};
    };

    const handleUpdatePegawai = async () => {
        if (!validateForm(editForm.value, editErrors)) {
            toast.error('Mohon periksa kembali input Anda!');
            return;
        }

        const formData = new FormData();
        // FIX: Hapus '_method', 'PUT' karena sudah ditambahkan di pegawaiService.js untuk menghindari duplikasi
        // formData.append('_method', 'PUT');
        formData.append('nip', editForm.value.nip);
        formData.append('nama', editForm.value.nama);
        formData.append('alamat', editForm.value.alamat);
        formData.append('kontak', editForm.value.kontak);
        // FIX: Mengganti 'jabatan' menjadi 'jabatan_id' agar sesuai dengan konvensi backend
        formData.append('jabatan', editForm.value.jabatan.id);

        if (editForm.value.new_image_file) {
            formData.append('imagePegawai', editForm.value.new_image_file);
        }

        isSubmitting.value = true;

        try {
            await pegawaiService.updatePegawai(editForm.value.id, formData);
            toast.success('Data pegawai berhasil diperbarui!');
            hideModal('pegawaiModal');
            await fetchDataFromApi();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                editErrors.value = error.response.data.errors;
                toast.error('Gagal memperbarui data. Mohon periksa kembali formulir.');
            } else {
                console.error('Gagal memperbarui data pegawai:', error);
                toast.error('Terjadi kesalahan saat memperbarui data pegawai.');
            }
        } finally {
            isSubmitting.value = false;
        }
    };


    // --- LOGIKA DELETE ---

    const handleDeletePegawai = async (item) => {
        Swal.fire({
            title: "Apakah Anda Yakin?",
            text: `Anda akan menghapus pegawai ${item.nama}!`,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal"
        }).then(async (result) => {
            if (result.isConfirmed) {
              const payload = { id: item.id };
                try {
                    await pegawaiService.deletePegawai(payload);
                    await fetchDataFromApi();
                    toast.success("Data pegawai berhasil dihapus.");
                } catch (error) {
                    console.error("Error saat menghapus data:", error);
                    const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat menghubungi server.";
                    toast.error(errorMessage);
                }
            }
        });
    };

    // --- LOGIKA RESET ---

    const resetForm = () => {
        // Revoke Object URLs untuk mencegah memory leak sebelum reset state
        if (imagePreviewUrl.value) URL.revokeObjectURL(imagePreviewUrl.value);
        if (newImagePreviewUrl.value) URL.revokeObjectURL(newImagePreviewUrl.value);

        // Reset form TAMBAH
        form.value = { nip: '', nama: '', alamat: '', kontak: '', jabatan: null, image_pegawai: null };
        errors.value = {};
        imagePreviewUrl.value = null;

        // Reset form EDIT
        editForm.value = { id: null, nip: '', nama: '', alamat: '', kontak: '', jabatan: null, image_pegawai: null, new_image_file: null };
        editErrors.value = {};
        newImagePreviewUrl.value = null;

        isEditMode.value = false;
    };

    // Cleanup saat komponen dibongkar (unmounted)
    onBeforeUnmount(() => {
        if (imagePreviewUrl.value) URL.revokeObjectURL(imagePreviewUrl.value);
        if (newImagePreviewUrl.value) URL.revokeObjectURL(newImagePreviewUrl.value);
    });


    return {
        form, errors, imagePreviewUrl, editForm, editErrors, newImagePreviewUrl,
        isSubmitting, isEditMode, editImageUrl,
        fetchDataFromApi, handleStorePegawai, handleImageChange,
        handleUpdatePegawai, handleEditImageChange, setCurrentEditItem,
        handleDeletePegawai, resetForm
    };
}
