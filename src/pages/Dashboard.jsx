import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProducts, addProduct, updateProduct, deleteProduct, getOrders } from '../services/api'; 
import { LogOut, Plus, Trash2, Pencil, Image as ImageIcon, X, ShoppingBag, Coffee, Home, Clock } from 'lucide-react';

const Dashboard = () => {
  // State Navigasi Tab
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' atau 'orders'
  
  // State Data
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // State Form CRUD
  const [editingId, setEditingId] = useState(null); 
  const [form, setForm] = useState({ name: '', category: 'Coffee', price: '', stock: '', image: '' });
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // --- 1. FETCH DATA & REALTIME ORDERS ---
  const fetchData = () => {
    getProducts().then(res => setProducts(res.data));
    getOrders().then(res => setOrders(res.data.reverse())); // Order baru paling atas
  };

  useEffect(() => {
    fetchData();
    // Refresh order setiap 5 detik
    const interval = setInterval(() => {
        getOrders().then(res => setOrders(res.data.reverse()));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- 2. AUTH HANDLER ---
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // --- 3. CRUD HANDLERS ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProduct(editingId, form);
        alert('✅ Menu berhasil diperbarui!');
      } else {
        await addProduct(form);
        alert('✅ Menu berhasil ditambahkan!');
      }
      
      // Reset Form
      setEditingId(null);
      setForm({ name: '', category: 'Coffee', price: '', stock: '', image: '' });
      document.getElementById('fileInput').value = "";
      fetchData();
    } catch (error) {
      alert('Gagal menyimpan data. Pastikan server nyala.');
    }
  };

  const handleDelete = async (id) => {
    if(confirm('Yakin ingin menghapus menu ini?')) {
      await deleteProduct(id);
      fetchData();
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm(item);
    setActiveTab('menu'); // Pindah ke tab menu jika sedang di tab order
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* --- SIDEBAR (Desktop) --- */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-amber-800 flex items-center gap-2">
                <Coffee strokeWidth={2.5}/> SENJA<span className="text-gray-800 font-light">ADMIN</span>
            </h2>
        </div>
        
        {/* Tombol Lihat Website */}
        <Link to="/" target="_blank" className="flex items-center gap-3 text-sm font-bold text-gray-600 hover:text-amber-700 bg-gray-50 hover:bg-amber-50 p-3 rounded-xl transition mb-6 border border-gray-100 hover:border-amber-200">
            <Home size={18} /> Lihat Website
        </Link>
        
        <div className="space-y-1 flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2 px-3 tracking-wider">Menu Utama</p>
            
            <button onClick={() => setActiveTab('menu')} className={`w-full text-left p-3 rounded-xl font-bold flex items-center gap-3 transition ${activeTab === 'menu' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Coffee size={18}/> Kelola Menu
            </button>
            
            <button onClick={() => setActiveTab('orders')} className={`w-full text-left p-3 rounded-xl font-bold flex items-center gap-3 transition ${activeTab === 'orders' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30' : 'text-gray-600 hover:bg-gray-100'}`}>
                <ShoppingBag size={18}/> Pesanan
                {orders.length > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">{orders.length}</span>}
            </button>
        </div>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 text-sm font-bold px-4 py-3 rounded-xl transition w-full">
            <LogOut size={18} /> Keluar Sistem
        </button>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        
        {/* Header Mobile & Desktop */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4 z-20">
            <div className="mb-4 md:mb-0 text-center md:text-left">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                    {activeTab === 'menu' ? 'Manajemen Produk' : 'Daftar Pesanan Masuk'}
                </h1>
                <p className="text-sm text-gray-500">Halo, <span className="font-bold text-amber-700">{user?.name}</span>. Selamat bekerja!</p>
            </div>
            
            <div className="flex items-center gap-4">
                {/* Mobile Menu Buttons */}
                <div className="flex md:hidden gap-2 bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setActiveTab('menu')} className={`p-2 rounded ${activeTab === 'menu' ? 'bg-white shadow' : ''}`}><Coffee size={20}/></button>
                    <button onClick={() => setActiveTab('orders')} className={`p-2 rounded ${activeTab === 'orders' ? 'bg-white shadow' : ''}`}><ShoppingBag size={20}/></button>
                </div>

                <Link to="/" className="md:hidden p-2 bg-gray-100 rounded-full text-gray-600">
                    <Home size={20}/>
                </Link>
                <button onClick={handleLogout} className="md:hidden text-red-600 bg-red-50 p-2 rounded-full"><LogOut size={20}/></button>
            </div>
        </div>

        {/* --- KONTEN TAB: MANAJEMEN MENU --- */}
        {activeTab === 'menu' && (
            <div className="animate-fade-in-up">
                {/* Form Input */}
                <div className={`p-6 rounded-2xl shadow-sm mb-8 border transition-all duration-300 ${editingId ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-100' : 'bg-white border-gray-100'}`}>
                    <h3 className="font-bold mb-6 flex items-center gap-2 text-gray-800 border-b pb-4">
                        {editingId ? <Pencil size={20} className="text-blue-600"/> : <Plus size={20} className="text-amber-600"/>} 
                        {editingId ? 'Edit Menu' : 'Tambah Menu Baru'}
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Kolom Kiri (Text Inputs) - Span 8 */}
                        <div className="md:col-span-8 space-y-5">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nama Menu</label>
                                <input required placeholder="Contoh: Espresso" className="w-full mt-1 border border-gray-200 p-3 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Kategori</label>
                                    <select className="w-full mt-1 border border-gray-200 p-3 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none transition" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                                        <option>Coffee</option>
                                        <option>Non-Coffee</option>
                                        <option>Food</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Stok Awal</label>
                                    <input required type="number" placeholder="0" className="w-full mt-1 border border-gray-200 p-3 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none transition" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Harga (Rp)</label>
                                <input required type="number" placeholder="Contoh: 25000" className="w-full mt-1 border border-gray-200 p-3 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none transition font-bold text-gray-700" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                            </div>
                        </div>

                        {/* Kolom Kanan (Image Upload) - Span 4 */}
                        <div className="md:col-span-4 flex flex-col">
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Foto Menu</label>
                            <div className="flex-1 min-h-[160px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden relative group hover:border-amber-400 transition">
                                {form.image ? (
                                    <img src={form.image} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <ImageIcon className="mx-auto mb-2 opacity-50" size={32}/>
                                        <span className="text-xs font-medium">Klik untuk upload</span>
                                    </div>
                                )}
                                <input id="fileInput" type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="md:col-span-12 flex gap-3 pt-2">
                            <button type="submit" className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg transition transform active:scale-95 flex justify-center items-center gap-2 ${editingId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-amber-700 hover:bg-amber-800 shadow-amber-600/20'}`}>
                                {editingId ? <><Pencil size={18}/> Update Perubahan</> : <><Plus size={18}/> Simpan Menu Baru</>}
                            </button>
                            {editingId && (
                                <button type="button" onClick={() => {setEditingId(null); setForm({ name: '', category: 'Coffee', price: '', stock: '', image: '' })}} className="px-6 bg-gray-100 rounded-xl text-gray-600 font-bold hover:bg-gray-200 transition">
                                    Batal
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Table Menu */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Foto</th>
                                    <th className="p-4 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Detail Menu</th>
                                    <th className="p-4 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Harga & Stok</th>
                                    <th className="p-4 text-xs font-extrabold text-gray-400 uppercase tracking-wider text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map(item => (
                                    <tr key={item.id} className="hover:bg-amber-50/30 transition group">
                                        <td className="p-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                                                {item.image && <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition"/>}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-gray-800 text-lg">{item.name}</p>
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-500 font-medium border border-gray-200">{item.category}</span>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-amber-700">Rp {parseInt(item.price).toLocaleString()}</p>
                                            <p className={`text-xs mt-1 ${item.stock < 5 ? 'text-red-500 font-bold' : 'text-green-600'}`}>
                                                Stok: {item.stock} {item.stock < 5 && '(Menipis!)'}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleEdit(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition border border-blue-100"><Pencil size={18}/></button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition border border-red-100"><Trash2 size={18}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {products.length === 0 && <p className="text-center py-10 text-gray-400">Belum ada menu.</p>}
                </div>
            </div>
        )}

        {/* --- KONTEN TAB: PESANAN MASUK --- */}
        {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in-up">
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="bg-gray-50 p-6 rounded-full mb-4 animate-pulse">
                            <ShoppingBag size={48} className="text-gray-300"/>
                        </div>
                        <p className="text-gray-500 font-bold text-lg">Belum ada pesanan masuk.</p>
                        <p className="text-xs text-gray-400 mt-2">Menunggu pesanan dari customer...</p>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-lg transition duration-300">
                            <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                            
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pl-4">
                                <div>
                                    <h3 className="font-extrabold text-xl text-gray-800 flex items-center gap-3">
                                        {order.customerName} 
                                        <span className="text-[10px] font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">ID: #{order.id}</span>
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 font-medium"><Clock size={12}/> {order.date}</p>
                                </div>
                                <div className="mt-4 md:mt-0 text-left md:text-right">
                                    <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-extrabold border border-green-200 mb-1">
                                        STATUS: LUNAS
                                    </div>
                                    <p className="text-2xl font-black text-gray-800">Rp {order.total.toLocaleString()}</p>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50/50 p-4 rounded-xl ml-4 border border-dashed border-gray-200">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">Item Dipesan</p>
                                <ul className="space-y-3">
                                    {order.items.map((item, idx) => (
                                        <li key={idx} className="text-sm flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-white bg-amber-600 w-6 h-6 flex items-center justify-center rounded-md text-xs shadow-sm">{item.qty}</span>
                                                <span className="font-medium text-gray-700">{item.name}</span>
                                            </div>
                                            <span className="text-gray-500 font-medium">Rp {(item.price * item.qty).toLocaleString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;