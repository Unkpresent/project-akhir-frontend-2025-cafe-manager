import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, createOrder } from '../services/api';
import { Coffee, ShoppingCart, X, Plus, CreditCard, ArrowRight, MapPin, Clock, Wifi, Star, Instagram, Facebook, Twitter } from 'lucide-react';
import QRCode from 'react-qr-code';

const Landing = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Ambil data produk saat halaman dibuka
  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
  }, []);

  // --- LOGIC KERANJANG & TRANSAKSI ---
  const addToCart = (product, qty = 1) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + qty } : item));
    } else {
      setCart([...cart, { ...product, qty }]);
    }
    setSelectedItem(null); // Tutup modal detail
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!customerName || cart.length === 0) return;

    const newOrder = {
      customerName,
      items: cart,
      total: totalAmount,
      date: new Date().toLocaleString(),
      status: 'Paid'
    };

    try {
      await createOrder(newOrder);
      setOrderSuccess(newOrder);
      setCart([]);
      setCustomerName('');
      setIsCartOpen(false);
    } catch (error) {
      alert("Gagal membuat pesanan. Pastikan server database nyala!");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-amber-200 scroll-smooth">
      
      {/* --- 1. NAVBAR (Sticky) --- */}
      <nav className="fixed w-full top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-extrabold text-2xl text-amber-800 tracking-tighter">
            <Coffee strokeWidth={2.5} /> SENJA<span className="text-gray-800 font-light">COFFEE</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#about" className="hidden md:block text-sm font-bold text-gray-600 hover:text-amber-800 transition">TENTANG</a>
            <a href="#menu" className="hidden md:block text-sm font-bold text-gray-600 hover:text-amber-800 transition">MENU</a>
            
            {/* Tombol Keranjang */}
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 bg-amber-50 rounded-full hover:bg-amber-100 transition group">
              <ShoppingCart size={22} className="text-amber-900 group-hover:scale-110 transition" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">{cart.length}</span>}
            </button>
            
            {/* Link ke Admin */}
            <Link to="/login" className="px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-900/20">
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1974&auto=format&fit=crop" 
                className="w-full h-full object-cover filter brightness-[0.4]"
                alt="Cafe Ambience" 
            />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold mb-6 backdrop-blur-md">
                <Star size={12} fill="currentColor"/> THE BEST COFFEE IN TOWN
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
                Rasakan Cerita di <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Setiap Cangkir.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                Tempat di mana aroma kopi berkualitas bertemu dengan kenyamanan. Disangrai dengan hati, disajikan dengan presisi.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <a href="#menu" className="px-8 py-4 bg-amber-600 text-white rounded-full font-bold hover:bg-amber-700 transition transform hover:scale-105 shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2">
                    Lihat Menu <ArrowRight size={18}/>
                </a>
                <a href="#about" className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-full font-bold hover:bg-white/20 transition">
                    Tentang Kami
                </a>
            </div>
        </div>
      </header>

      {/* --- 3. ABOUT SECTION --- */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                {/* Images */}
                <div className="relative">
                    <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1947&auto=format&fit=crop" className="w-full h-80 object-cover rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition duration-500" alt="Interior"/>
                    <div className="absolute -bottom-6 -right-6 bg-amber-100 p-6 rounded-2xl shadow-lg hidden md:block">
                        <p className="text-amber-800 font-bold text-2xl">4.9/5</p>
                        <p className="text-amber-600 text-sm">Rating Pelanggan</p>
                    </div>
                </div>
                
                {/* Text */}
                <div>
                    <h2 className="text-amber-700 font-bold tracking-widest uppercase mb-2">Kenapa Senja?</h2>
                    <h3 className="text-4xl font-extrabold text-gray-900 mb-6">Lebih Dari Sekadar Kafe</h3>
                    <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                        Senja Coffee hadir sebagai ruang bagi mereka yang ingin "melambat" sejenak. Kami bekerja sama langsung dengan petani kopi lokal dari Gayo dan Toraja untuk memastikan setiap biji kopi yang Anda nikmati adalah yang terbaik, sekaligus mensejahterakan petani.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-50 rounded-xl text-amber-700"><Wifi /></div>
                            <div>
                                <h4 className="font-bold text-gray-900">High Speed WiFi</h4>
                                <p className="text-sm text-gray-500">Cocok untuk WFC</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-50 rounded-xl text-amber-700"><Clock /></div>
                            <div>
                                <h4 className="font-bold text-gray-900">Buka Tiap Hari</h4>
                                <p className="text-sm text-gray-500">08:00 - 22:00 WIB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 4. MENU SECTION --- */}
      <section id="menu" className="py-24 bg-stone-50 border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
                <span className="text-amber-600 font-bold tracking-widest uppercase text-sm">Order & Pay</span>
                <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Menu Favorit Kami</h2>
                <p className="text-gray-500 mt-4 max-w-xl mx-auto">Pilih menu, pesan lewat web, bayar scan QR, dan pesanan akan diantar ke mejamu.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((item) => (
                <div key={item.id} onClick={() => setSelectedItem(item)} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition duration-300 cursor-pointer group overflow-hidden border border-gray-100 flex flex-col h-full">
                    <div className="h-64 bg-gray-100 relative overflow-hidden">
                        {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50"><Coffee size={48} /></div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-amber-800 shadow-sm">
                            {item.category}
                        </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1 justify-between">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-amber-700 transition">{item.name}</h3>
                            <p className="text-xs text-gray-400">Klik untuk detail</p>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                            <p className="text-amber-700 font-extrabold text-xl">Rp {parseInt(item.price).toLocaleString()}</p>
                            <button className="bg-gray-900 text-white p-2 rounded-full hover:bg-amber-600 transition shadow-lg transform active:scale-90">
                                <Plus size={20}/>
                            </button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- 5. FOOTER --- */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-1 md:col-span-2">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white"><Coffee /> SENJA COFFEE</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                    Kami percaya secangkir kopi yang baik dapat mengubah hari yang biasa menjadi luar biasa. Datang dan rasakan sendiri.
                </p>
                <div className="flex gap-4 mt-6">
                    <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-amber-600 transition"><Instagram size={18}/></a>
                    <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-amber-600 transition"><Facebook size={18}/></a>
                    <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-amber-600 transition"><Twitter size={18}/></a>
                </div>
            </div>
            <div>
                <h4 className="font-bold text-lg mb-6 text-amber-500">Kunjungi Kami</h4>
                <p className="text-gray-400 text-sm flex gap-2 mb-3"><MapPin size={16} className="shrink-0 text-amber-600"/> Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan</p>
                <p className="text-gray-400 text-sm flex gap-2"><Clock size={16} className="shrink-0 text-amber-600"/> Setiap Hari: 08:00 - 22:00</p>
            </div>
            <div>
                <h4 className="font-bold text-lg mb-6 text-amber-500">Kontak</h4>
                <p className="text-gray-400 text-sm mb-3">hello@senjacoffee.id</p>
                <p className="text-gray-400 text-sm">+62 812-3456-7890</p>
            </div>
        </div>
        <div className="text-center text-gray-600 text-xs border-t border-gray-800 pt-8">
            © 2025 Senja Coffee Manager. Dibuat dengan React & Tailwind.
        </div>
      </footer>


      {/* --- MODALS (POP-UP) --- */}

      {/* 1. Detail Produk Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
             <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 bg-white/50 p-2 rounded-full hover:bg-red-500 hover:text-white transition z-10"><X size={20}/></button>
             
             <div className="md:w-1/2 h-64 md:h-auto bg-gray-100">
                {selectedItem.image ? <img src={selectedItem.image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><Coffee size={64}/></div>}
             </div>
             
             <div className="p-8 md:w-1/2 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedItem.name}</h2>
                  <div className="flex gap-2 mb-6">
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded font-bold">{selectedItem.category}</span>
                      <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-bold"><Star size={12} fill="currentColor"/> 4.8</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Kombinasi rasa yang pas untuk menemani aktivitasmu. Dibuat fresh saat dipesan.
                  </p>
                  <p className="text-4xl font-bold text-amber-700">Rp {parseInt(selectedItem.price).toLocaleString()}</p>
                </div>
                <button onClick={() => addToCart(selectedItem)} className="mt-8 w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-amber-700 transition flex items-center justify-center gap-2 shadow-lg transform active:scale-95">
                  <ShoppingCart size={20}/> Masukkan Keranjang
                </button>
             </div>
          </div>
        </div>
      )}

      {/* 2. Keranjang Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex justify-end backdrop-blur-sm">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col animate-slide-in-right">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><ShoppingCart /> Pesanan Anda</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                      <ShoppingCart size={64} className="mb-4 opacity-20"/>
                      <p>Keranjang masih kosong.</p>
                      <button onClick={() => setIsCartOpen(false)} className="mt-4 text-amber-700 font-bold text-sm hover:underline">Mulai Pesan</button>
                  </div>
              ) : cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border">
                    {item.image && <img src={item.image} className="w-full h-full object-cover"/>}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                    <p className="text-amber-700 text-sm font-bold">Rp {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white border rounded-full px-2 py-1 shadow-sm">
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 rounded-full p-1"><X size={14}/></button>
                    <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6 mt-4">
               <div className="flex justify-between text-xl font-bold mb-6 text-gray-800">
                 <span>Total</span>
                 <span>Rp {totalAmount.toLocaleString()}</span>
               </div>
               
               {cart.length > 0 && (
                 <form onSubmit={handleCheckout} className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Pemesan</label>
                     <input required placeholder="Contoh: Budi" className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-amber-500 outline-none transition font-medium" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                   </div>
                   <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 shadow-xl shadow-green-600/20 flex justify-center items-center gap-2 transition transform active:scale-95">
                     <CreditCard size={20}/> Bayar Sekarang
                   </button>
                 </form>
               )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Success (QR Code) Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl relative overflow-hidden animate-bounce-in">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CreditCard size={40} />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Pesanan Masuk!</h2>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                Halo <b>{orderSuccess.customerName}</b>, silakan scan QR di bawah ini untuk membayar.
                <br/><span className="text-xs text-gray-400">(Tunjukkan ke kasir jika bayar tunai)</span>
            </p>
            
            <div className="bg-white p-4 border-2 border-dashed border-gray-200 rounded-2xl inline-block mb-8 shadow-sm group hover:border-amber-500 transition">
              <QRCode value={`PAYMENT-${orderSuccess.customerName}-${orderSuccess.total}`} size={160} />
            </div>
            
            <div className="bg-green-50 text-green-800 font-bold py-2 px-4 rounded-lg mb-6 text-lg">
                Total: Rp {orderSuccess.total.toLocaleString()}
            </div>
            
            <button onClick={() => setOrderSuccess(null)} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg">
              Tutup & Pesan Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;