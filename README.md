
# User Management App

"User Manager" is a simple application that displays a list of users from DummyJSON, allows searching for users, and provides a form to add a new user with email or phone validation using AbstractAPI.

### Live Preview
https://user-management-app-psi-gold.vercel.app/

### Environment
Proyek ini menggunakan beberapa library dan framework berikut:

- **Next.js**: `15.5.0` – Framework React untuk SSR dan SSG.
- **React**: `19.1.0` – Library UI utama.
- **React DOM**: `19.1.0` – Package untuk rendering React di DOM.
- **Redux Toolkit**: `^2.8.2` – Untuk state management yang lebih mudah.
- **React Redux**: `^9.2.0` – Binding antara React dan Redux.
- **Axios**: `^1.11.0` – Untuk melakukan HTTP request.
- **Date-fns**: `^4.1.0` – Library manipulasi tanggal.
- **Lucide React**: `^0.540.0` – Ikon untuk React.
- **React Hot Toast**: `^2.6.0` – Untuk notifikasi toast.  

### Fitur utama
1.  **Hybrid Data Management**
   - **Local Users:** Data yang ditambahkan sendiri melalui form (`add`, `edit`, `delete`). Data disimpan di `localStorage`.
   - **API Users:** Data fetch dari API `dummyjson` sesuai page & limit.
   - **Gabungan Data:** Halaman pertama menampilkan local users + sisanya dari API. Halaman berikutnya menampilkan API users saja.

2.  **Pagination**
   - Limit & page bisa diatur (`limit = 3` atau 5).
   - Logika:
     - Halaman pertama = local users + sisa API sesuai limit.
     - Halaman berikutnya = API users.
   - Total pages dihitung dari jumlah gabungan data local + API.

3.  **Search**
   - Bisa mencari user berdasarkan **Full Name (`firstName + lastName`)** atau **Email**.
   - Filter berjalan di gabungan local + API data.

4.  **CRUD Lokal**
   - **Add User:** Tambah user baru ke local storage.
   - **Edit User:** Edit data user lokal.
   - **Delete User:** Hapus user lokal.
   - **Load Local Users:** Memuat data dari localStorage saat komponen dimount.

5.  **Async Fetch**
   - Mengambil data dari API dummyjson menggunakan `createAsyncThunk`.
   - Mengatur `skip` agar jumlah data halaman pertama tidak melebihi limit setelah dikurangi local users.

6.  **UI Components**
   - **UserTable:** Menampilkan table user dengan photo, nama, email, phone, dan action button (edit/delete).  
   - **Pagination:** Navigasi prev/next dengan disable otomatis di page pertama & terakhir.  
   - **SearchBar:** Input untuk search data user secara real-time.


### Instalasi
-  `git clone https://github.com/akusyaiful/user-management-app.git`
- `npm install`
