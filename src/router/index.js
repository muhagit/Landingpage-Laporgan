
import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

const Home = () => import('@/views/Home.vue')
const LandingPage = () => import('@/views/LandingPage.vue')
const Tentang = () => import('@/views/Tentang.vue')
const Daftar = () => import('@/views/Daftar.vue')
const Login = () => import('@/views/Login.vue')
const FormPengaduan = () => import('@/views/FormPengaduan.vue')
const LacakPengaduan = () => import('@/views/LacakPengaduan.vue')
const FormContact = () => import('@/views/FormContact.vue')

const routes = [
    {
        path: "/",
        name: "Home",
        component: LandingPage,
        children: [
            {
                path: "tentang",
                name: "Tentang",
                component: Tentang,
            },
        ],
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/lacakpengaduan",
        name: "LacakPengaduan",
        component: LacakPengaduan,
    },
    {
        path: "/daftar",
        name   : "Daftar",
        component: Daftar,
    },
    {
        path: "/formpengaduan",
        name: "FormPengaduan",
        component: FormPengaduan,
    },

    {
        path: "/admin",
        component: () => import("@/layouts/AdminLayout.vue"),
        meta: { requiresAuth: true },
        children: [
            {
                path: "",
                redirect: { name: "AdminDashboard" }
            },
            {
                path: "dashboard",
                name: "AdminDashboard",
                component: () => import("@/views/admin/Dashboard.vue")
            },
            {
                path: "pengaduan",
                name: "AdminPengaduan",
                component: () => import("@/views/admin/PengaduanList.vue")
            },
            {
                path: "kategori",
                name: "AdminKategori",
                component: () => import("@/views/admin/KategoriList.vue")
            },
            {
                path: "editor",
                name: "AdminEditor",
                component: () => import("@/views/admin/LandingPageEditor.vue")
            }
        ]
    },

    {
        path: "/pusatbantuan",
        name: "Pusatbantuan",
        component: () => import("@/views/PusatBantuan.vue")
    },
    {
        path: "/formcontact",
        name: "Formcontact",
        component: () => import("@/views/FormContact.vue")
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("@/views/NotFound.vue")
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: () => ({ top: 0 })
})

router.beforeEach(async (to, from, next) => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Jika rute butuh autentikasi admin dan token tidak ada, arahkan ke login
        if (to.matched.some(record => record.meta.requiresAuth)) {
            if (!session) {
                next('/login');
            } else {
                next();
            }
        } else {
            // Jika sudah login admin, dan mencoba mengakses halaman login kembali, arahkan ke dashboard
            if (to.path === '/login' && session) {
                next('/admin/dashboard');
            } else {
                next();
            }
        }
    } catch (err) {
        console.error('Routing check session error:', err);
        // Jika terjadi error, biarkan halaman dimuat normal atau redirect ke login jika butuh auth
        if (to.matched.some(record => record.meta.requiresAuth)) {
            next('/login');
        } else {
            next();
        }
    }
})

export default router;