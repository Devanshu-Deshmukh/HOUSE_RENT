import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../App";
import AllUsers from "./AllUsers";
import AllProperty from "./AllProperty";
import AllBookings from "./AllBookings";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const S = {
  page: { minHeight: '100vh', background: '#F5F0E8', fontFamily: "'DM Sans', sans-serif" },
  nav: { position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,252,247,0.94)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E2DBD0', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2.5rem' },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#1C1C1E' },
  logoSpan: { color: '#C4622D' },
  navRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  greeting: { fontSize: '0.875rem', color: '#7A7470' },
  adminBadge: { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(196,98,45,0.1)', color: '#C4622D', padding: '0.2rem 0.6rem', borderRadius: '4px' },
  logoutBtn: { background: '#1C1C1E', color: 'white', padding: '0.45rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.2s' },
  content: { maxWidth: '1300px', margin: '0 auto', padding: '2.5rem 2rem' },
  header: { marginBottom: '2rem' },
  eyebrow: { fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4622D', marginBottom: '0.4rem' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#1C1C1E' },
  tabs: { display: 'flex', gap: 0, borderBottom: '2px solid #E2DBD0', marginBottom: '1.5rem' },
  tab: (active) => ({ padding: '0.75rem 1.5rem', fontSize: '0.875rem', fontWeight: 500, color: active ? '#C4622D' : '#7A7470', background: 'none', border: 'none', cursor: 'pointer', borderBottom: active ? '2px solid #C4622D' : '2px solid transparent', marginBottom: '-2px', transition: 'color 0.2s', fontFamily: "'DM Sans', sans-serif" }),
  panel: { background: '#FFFCF7', border: '1px solid #E2DBD0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(28,28,30,0.04)' },

  /* Dashboard Stats */
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' },
  statCard: (color) => ({
    background: '#FFFCF7', border: '1.5px solid #E2DBD0', borderRadius: '14px',
    padding: '1.5rem', position: 'relative', overflow: 'hidden', transition: 'all 0.3s',
    borderLeft: `4px solid ${color}`
  }),
  statIcon: { fontSize: '1.5rem', marginBottom: '0.5rem' },
  statNum: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '0.2rem' },
  statLabel: { fontSize: '0.78rem', color: '#7A7470', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' },

  /* Recent Activity */
  actSection: { marginBottom: '2rem' },
  actTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '1rem' },
  actList: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  actItem: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem', background: '#FFFCF7', border: '1px solid #E2DBD0', borderRadius: '10px', transition: 'all 0.2s' },
  actDot: (color) => ({ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }),
  actText: { fontSize: '0.85rem', color: '#1C1C1E', flex: 1 },
  actTime: { fontSize: '0.75rem', color: '#7A7470' },
  actBadge: (bg, color) => ({ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700, background: bg, color: color }),

  /* Quick actions */
  quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' },
  quickCard: { background: '#FFFCF7', border: '1.5px solid #E2DBD0', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' },
  quickIcon: { fontSize: '1.5rem', marginBottom: '0.5rem' },
  quickTitle: { fontSize: '0.9rem', fontWeight: 600, color: '#1C1C1E', marginBottom: '0.3rem' },
  quickDesc: { fontSize: '0.78rem', color: '#7A7470' },
};

/* ─── Dashboard Overview Component ─── */
const DashboardOverview = ({ onTabSwitch }) => {
  const [stats, setStats] = useState({ users: 0, properties: 0, bookings: 0, pending: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [usersRes, propsRes, bookingsRes] = await Promise.all([
          axios.get(`${API_URL}/api/admin/users`, { headers }),
          axios.get(`${API_URL}/api/admin/properties`, { headers }),
          axios.get(`${API_URL}/api/admin/bookings`, { headers }),
        ]);
        const users = usersRes.data.success ? usersRes.data.data : [];
        const props = propsRes.data.success ? propsRes.data.data : [];
        const bookings = bookingsRes.data.success ? bookingsRes.data.data : [];
        const pending = bookings.filter(b => b.status === 'pending').length;

        setStats({ users: users.length, properties: props.length, bookings: bookings.length, pending });
        setRecentBookings(bookings.slice(-5).reverse());
        setRecentUsers(users.slice(-5).reverse());
      } catch (err) { console.error("Dashboard fetch error:", err); }
    };
    fetchData();
  }, []);

  const statCards = [
    { icon: '👥', label: 'Total Users', value: stats.users, color: '#C4622D' },
    { icon: '🏠', label: 'Properties', value: stats.properties, color: '#D4A853' },
    { icon: '📋', label: 'Bookings', value: stats.bookings, color: '#2563EB' },
    { icon: '⏳', label: 'Pending', value: stats.pending, color: '#B45309' },
  ];

  const statusColors = {
    pending: { bg: 'rgba(180,83,9,0.1)', color: '#B45309', dot: '#B45309' },
    confirmed: { bg: 'rgba(21,128,61,0.1)', color: '#15803D', dot: '#15803D' },
    rejected: { bg: 'rgba(185,28,28,0.1)', color: '#B91C1C', dot: '#B91C1C' },
  };

  return (
    <div>
      {/* Stats Cards */}
      <div style={S.statsGrid}>
        {statCards.map((s, i) => (
          <div key={i} style={S.statCard(s.color)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(28,28,30,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={S.statIcon}>{s.icon}</div>
            <div style={S.statNum}>{s.value}</div>
            <div style={S.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div style={S.actSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={S.actTitle}>Recent Bookings</div>
          <button onClick={() => onTabSwitch("bookings")} style={{ background: 'none', border: 'none', color: '#C4622D', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>View All →</button>
        </div>
        <div style={S.actList}>
          {recentBookings.length > 0 ? recentBookings.map((b, i) => {
            const sc = statusColors[b.status] || statusColors.pending;
            return (
              <div key={i} style={S.actItem}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,98,45,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = '#FFFCF7'}>
                <div style={S.actDot(sc.dot)}></div>
                <div style={S.actText}>
                  <strong>{b.tenant}</strong> booked <strong>{b.property?.address || 'a property'}</strong> — ₹{b.rentAmount?.toLocaleString() || b.totalAmount?.toLocaleString() || '0'}
                </div>
                <span style={S.actBadge(sc.bg, sc.color)}>{b.status}</span>
                <div style={S.actTime}>{new Date(b.bookingStartDate).toLocaleDateString()}</div>
              </div>
            );
          }) : <div style={{ textAlign: 'center', padding: '2rem', color: '#7A7470' }}>No bookings yet</div>}
        </div>
      </div>

      {/* Recent Users */}
      <div style={S.actSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={S.actTitle}>Recent Users</div>
          <button onClick={() => onTabSwitch("users")} style={{ background: 'none', border: 'none', color: '#C4622D', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>View All →</button>
        </div>
        <div style={S.actList}>
          {recentUsers.length > 0 ? recentUsers.map((u, i) => (
            <div key={i} style={S.actItem}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,98,45,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = '#FFFCF7'}>
              <div style={S.actDot(u.isVerified ? '#15803D' : '#B45309')}></div>
              <div style={S.actText}>
                <strong>{u.name}</strong> — {u.email}
              </div>
              <span style={S.actBadge('rgba(196,98,45,0.1)', '#C4622D')}>{u.role}</span>
              <span style={S.actBadge(u.isVerified ? 'rgba(21,128,61,0.1)' : 'rgba(180,83,9,0.1)', u.isVerified ? '#15803D' : '#B45309')}>
                {u.isVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          )) : <div style={{ textAlign: 'center', padding: '2rem', color: '#7A7470' }}>No users yet</div>}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={S.actSection}>
        <div style={S.actTitle}>Quick Actions</div>
        <div style={S.quickGrid}>
          <div style={S.quickCard} onClick={() => onTabSwitch("users")}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(196,98,45,0.1)'; e.currentTarget.style.borderColor = '#C4622D'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E2DBD0'; }}>
            <div style={S.quickIcon}>✅</div>
            <div style={S.quickTitle}>Verify Users</div>
            <div style={S.quickDesc}>Review and verify new user registrations</div>
          </div>
          <div style={S.quickCard} onClick={() => onTabSwitch("bookings")}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(196,98,45,0.1)'; e.currentTarget.style.borderColor = '#C4622D'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E2DBD0'; }}>
            <div style={S.quickIcon}>📋</div>
            <div style={S.quickTitle}>Manage Bookings</div>
            <div style={S.quickDesc}>Approve or reject pending booking requests</div>
          </div>
          <div style={S.quickCard} onClick={() => onTabSwitch("properties")}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(196,98,45,0.1)'; e.currentTarget.style.borderColor = '#C4622D'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E2DBD0'; }}>
            <div style={S.quickIcon}>🏘️</div>
            <div style={S.quickTitle}>Review Properties</div>
            <div style={S.quickDesc}>Monitor and manage all listed properties</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main AdminHome ─── */
const AdminHome = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (user) {
      user.setUserData(null);
      user.setUserLoggedIn(false);
    }
    navigate("/login");
  };

  if (!user || !user.userData) return null;

  const tabs = [
    { key: "dashboard", label: "📊 Dashboard" },
    { key: "users", label: "👥 All Users" },
    { key: "properties", label: "🏠 All Properties" },
    { key: "bookings", label: "📋 All Bookings" },
  ];

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <div style={S.logo}>Rent<span style={S.logoSpan}>Ease</span></div>
        <div style={S.navRight}>
          <span style={S.adminBadge}>Admin</span>
          <span style={S.greeting}>Hi, {user.userData.name}</span>
          <button onClick={handleLogOut} style={S.logoutBtn}
            onMouseEnter={e => e.target.style.background = '#C4622D'}
            onMouseLeave={e => e.target.style.background = '#1C1C1E'}>
            Log Out
          </button>
        </div>
      </nav>

      <div style={S.content}>
        <div style={S.header}>
          <div style={S.eyebrow}>Control Panel</div>
          <h1 style={S.title}>Admin Dashboard</h1>
        </div>

        <div style={S.tabs}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={S.tab(activeTab === t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={S.panel}>
          {activeTab === "dashboard" && <DashboardOverview onTabSwitch={setActiveTab} />}
          {activeTab === "users" && <AllUsers />}
          {activeTab === "properties" && <AllProperty />}
          {activeTab === "bookings" && <AllBookings />}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
