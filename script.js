console.log('Akwadra Super Builder Initialized - Haraj Mode');

// Check if Tailwind loaded - wait for CDN to initialize
const TAILWIND_LOAD_TIMEOUT = 100;
setTimeout(() => {
    const testElement = document.createElement('div');
    testElement.className = 'bg-white';
    document.body.appendChild(testElement);
    const hasBackground = window.getComputedStyle(testElement).backgroundColor !== 'rgba(0, 0, 0, 0)';
    document.body.removeChild(testElement);
    
    if (!hasBackground) {
        console.warn('Tailwind CSS not loaded, using fallback styles');
    } else {
        console.log('Tailwind CSS loaded successfully');
    }
}, TAILWIND_LOAD_TIMEOUT);

// --- Data & State ---
const categories = [
    { id: 'all', name: 'الكل', icon: 'fa-border-all' },
    { id: 'cars', name: 'سيارات', icon: 'fa-car' },
    { id: 'real_estate', name: 'عقارات', icon: 'fa-building' },
    { id: 'devices', name: 'أجهزة', icon: 'fa-mobile-screen' },
    { id: 'furniture', name: 'أثاث', icon: 'fa-couch' },
    { id: 'animals', name: 'مواشي', icon: 'fa-cow' },
];

let listings = [
    {
        id: 1,
        title: 'تويوتا كامري 2023 فل كامل',
        price: 95000,
        city: 'الرياض',
        time: 'منذ ساعتين',
        category: 'cars',
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&w=800&q=80',
        user: 'سعود محمد'
    },
    {
        id: 2,
        title: 'ايفون 14 برو ماكس 256 جيجا',
        price: 4200,
        city: 'جدة',
        time: 'منذ 15 دقيقة',
        category: 'devices',
        image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=800&q=80',
        user: 'متجر التقنية'
    },
    {
        id: 3,
        title: 'فيلا مودرن للبيع حي العارض',
        price: 2500000,
        city: 'الرياض',
        time: 'منذ 5 ساعات',
        category: 'real_estate',
        image: 'https://images.unsplash.com/photo-1600596542815-22b5c1275efb?auto=format&fit=crop&w=800&q=80',
        user: 'مكتب الإنجاز'
    },
    {
        id: 4,
        title: 'طقم كنب أمريكي فاخر',
        price: 1500,
        city: 'الدمام',
        time: 'منذ يوم',
        category: 'furniture',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        user: 'أبو خالد'
    },
    {
        id: 5,
        title: 'ماك بوك برو M2 جديد',
        price: 8900,
        city: 'مكة',
        time: 'منذ 30 دقيقة',
        category: 'devices',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=800&q=80',
        user: 'علي الحربي'
    },
    {
        id: 6,
        title: 'مزرعة نخيل بالقصيم',
        price: 1200000,
        city: 'بريدة',
        time: 'منذ 3 أيام',
        category: 'real_estate',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        user: 'أبو صالح'
    }
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderListings(listings);
    setupEventListeners();
});

// --- Rendering Functions ---
function renderCategories() {
    const container = document.getElementById('categoriesContainer');
    container.innerHTML = categories.map((cat, index) => `
        <button 
            onclick="filterByCategory('${cat.id}', this)"
            class="category-btn flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all duration-300 font-bold shadow-sm ${index === 0 ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-white text-gray-600 hover:bg-emerald-50'}"
        >
            <i class="fa-solid ${cat.icon}"></i>
            <span>${cat.name}</span>
        </button>
    `).join('');
}

function renderListings(data) {
    const grid = document.getElementById('listingsGrid');
    const emptyState = document.getElementById('emptyState');

    if (data.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
        emptyState.classList.add('flex');
        return;
    }

    emptyState.classList.add('hidden');
    emptyState.classList.remove('flex');

    grid.innerHTML = data.map((item, index) => `
        <div class="card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover-effect cursor-pointer group animate-slide-up" style="animation-delay: ${index * 0.05}s">
            <div class="relative h-48 overflow-hidden">
                <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
                <div class="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                    <i class="fa-solid fa-camera me-1"></i> صور
                </div>
            </div>
            <div class="card-content p-4">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">${item.title}</h3>
                </div>
                <div class="flex items-center gap-2 mb-3">
                    <span class="price text-xl font-black text-emerald-600">${item.price.toLocaleString()}</span>
                    <span class="text-xs font-bold text-gray-400 mt-1">ريال</span>
                </div>
                <div class="flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-3">
                    <div class="flex items-center gap-1">
                        <i class="fa-solid fa-location-dot text-emerald-400"></i>
                        ${item.city}
                    </div>
                    <div class="flex items-center gap-1">
                        <i class="fa-regular fa-clock"></i>
                        ${item.time}
                    </div>
                </div>
                <div class="mt-3 flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <span class="text-xs text-gray-400">${item.user}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// --- Logic & Helpers ---
function filterByCategory(catId, btn) {
    // Update Active Button UI
    document.querySelectorAll('.category-btn').forEach(b => {
        b.classList.remove('bg-emerald-600', 'text-white', 'shadow-emerald-200');
        b.classList.add('bg-white', 'text-gray-600');
    });
    btn.classList.remove('bg-white', 'text-gray-600');
    btn.classList.add('bg-emerald-600', 'text-white', 'shadow-emerald-200');

    // Filter Data
    if (catId === 'all') {
        renderListings(listings);
    } else {
        const filtered = listings.filter(item => item.category === catId);
        renderListings(filtered);
    }
}

function setupEventListeners() {
    // Search
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = listings.filter(item => item.title.toLowerCase().includes(term));
        renderListings(filtered);
    };
    
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('mobileSearchInput').addEventListener('input', handleSearch);

    // Add Form Submit
    document.getElementById('addForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const inputs = e.target.elements;
        const newAd = {
            id: Date.now(),
            title: inputs[0].value,
            price: Number(inputs[1].value),
            category: inputs[2].value,
            city: inputs[3].value,
            image: inputs[4].value || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
            time: 'الآن',
            user: 'أنا'
        };

        listings.unshift(newAd);
        renderListings(listings);
        closeAddModal();
        e.target.reset();
        showToast('تم إضافة إعلانك بنجاح');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- Modals ---
function openAddModal() {
    const modal = document.getElementById('addModal');
    modal.classList.remove('hidden');
    modal.classList.add('active'); // For fallback styles
}

function closeAddModal() {
    const modal = document.getElementById('addModal');
    modal.classList.add('hidden');
    modal.classList.remove('active'); // For fallback styles
}

function openCommissionModal() {
    const modal = document.getElementById('commissionModal');
    modal.classList.remove('hidden');
    modal.classList.add('active'); // For fallback styles
    document.getElementById('salePrice').value = '';
    document.getElementById('commissionResult').innerText = '0';
}

function closeCommissionModal() {
    const modal = document.getElementById('commissionModal');
    modal.classList.add('hidden');
    modal.classList.remove('active'); // For fallback styles
}

// --- Commission Logic (1% Rule) ---
function calculateCommission() {
    const price = parseFloat(document.getElementById('salePrice').value) || 0;
    const commission = price * 0.01;
    // Format to max 2 decimal places
    document.getElementById('commissionResult').innerText = commission % 1 === 0 ? commission : commission.toFixed(2);
}

// --- Utilities ---
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').innerText = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('show'); // For fallback styles
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
        toast.classList.remove('show'); // For fallback styles
    }, 3000);
}
