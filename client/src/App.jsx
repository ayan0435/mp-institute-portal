import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

const defaultHome = {
  stats: [
    { label: 'Programmes', value: '8' },
    { label: 'Total Seats', value: '1,290' },
    { label: 'Green Campus', value: '7-acre' },
    { label: 'Alumni', value: '10,000+' },
  ],
  institution: {
    name: 'MP Institute of Management and Computer Application',
    tagline: 'Affiliated to Mahatma Gandhi Kashi Vidyapith (MGKVP), Varanasi',
    address: 'Bhagatua, Balua Ghat Main Road, Varanasi – 221104, Uttar Pradesh',
    established: '2004',
    approved: 'AICTE & NCTE',
    partnership: 'AIT, Bangkok, Thailand',
  },
  programmes: [
    { name: 'BCA', slug: 'bca', duration: '3 years', description: 'Foundational computer application programme.' },
    { name: 'BBA', slug: 'bba', duration: '3 years', description: 'Business and management education.' },
    { name: 'B.Com', slug: 'b-com', duration: '3 years', description: 'Commerce and finance study.' },
  ],
  notices: [
    { title: 'Admissions Open for 2025-26', body: 'Apply now for all available programmes.' },
  ],
  people: [],
  newsPosts: [],
};

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/academics', label: 'Academics' },
  { to: '/people', label: 'Our People' },
  { to: '/admissions', label: 'Admissions' },
  { to: '/campus-life', label: 'Campus Life' },
  { to: '/news', label: 'News & Events' },
  { to: '/contact', label: 'Contact' },
  { to: '/login', label: 'Login' },
];

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('mp-dark') === 'true');
  const [site, setSite] = useState(defaultHome);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('mp-dark', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    API.get('/public/site')
      .then(({ data }) => setSite(data))
      .catch(() => setSite(defaultHome))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`app-shell ${darkMode ? 'dark' : ''}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <Routes>
        <Route path="/" element={<HomePage site={site} loading={loading} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/academics" element={<AcademicsPage programmes={site.programmes} />} />
        <Route path="/programme/:slug" element={<ProgrammePage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/admissions" element={<AdmissionsPage />} />
        <Route path="/campus-life" element={<CampusLifePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/portal/*" element={<PortalRoutes />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

function Header({ darkMode, setDarkMode }) {
  return (
    <header className="topbar">
      <div className="container nav-wrap">
        <Link to="/" className="brand">
          <span className="brand-mark">MP</span>
          <div>
            <strong>MP Institute</strong>
            <small>Bhagatua, Varanasi</small>
          </div>
        </Link>
        <nav className="main-nav">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to}>{item.label}</Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="toggle-theme" onClick={() => setDarkMode(!darkMode)}>{darkMode ? 'Light' : 'Dark'}</button>
          <Link className="primary-btn small" to="/login">Apply Now</Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h4>MP Institute</h4>
          <p>Affiliated to MGKVP, Varanasi. Established 2004.</p>
        </div>
        <div>
          <h5>Quick Links</h5>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/admissions">Admissions</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h5>Contact</h5>
          <p>Bhagatua, Balua Ghat Main Road,<br />Varanasi – 221104</p>
        </div>
      </div>
    </footer>
  );
}

function SectionLabel({ children }) {
  return <span className="section-label">{children}</span>;
}

function HomePage({ site, loading }) {
  const [notices, setNotices] = useState(site.notices || []);
  useEffect(() => {
    if (!loading && site.notices) setNotices(site.notices);
  }, [site, loading]);

  return (
    <main>
      <section className="hero container">
        <div className="hero-copy">
          <SectionLabel>01</SectionLabel>
          <h1>Shape your future at <span>MP Institute</span></h1>
          <p>Professional education, global perspective and value-driven learning for careers in management, commerce, technology and education.</p>
          <div className="cta-row">
            <Link className="primary-btn" to="/admissions">Admissions Open</Link>
            <Link className="ghost-btn" to="/academics">Explore Programs</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="photo-card">
            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80" alt="Students on campus" />
          </div>
          <div className="glass-card">
            <strong>35+</strong>
            <span>Faculty & Staff</span>
          </div>
        </div>
      </section>

      <section className="ticker-wrap">
        <div className="ticker">
          {notices.map((n, idx) => <span key={idx}>{n.title}</span>)}
        </div>
      </section>

      <section className="stats-strip container">
        {site.stats.map((stat) => (
          <div key={stat.label} className="stat-box">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="container section-block">
        <div className="section-head">
          <SectionLabel>02</SectionLabel>
          <h2>About the Institute</h2>
        </div>
        <div className="split-panel">
          <div>
            <p>MP Institute of Management and Computer Application is a student-centred institution committed to academic excellence, innovation and holistic development.</p>
            <p>We offer a blend of industry-aware curriculum, practical exposure and leadership development in a green 7-acre campus.</p>
          </div>
          <div className="info-list">
            <div><strong>Established</strong><span>{site.institution.established}</span></div>
            <div><strong>Approved</strong><span>{site.institution.approved}</span></div>
            <div><strong>Affiliation</strong><span>{site.institution.tagline}</span></div>
          </div>
        </div>
      </section>

      <section className="container section-block">
        <div className="section-head">
          <SectionLabel>03</SectionLabel>
          <h2>Notice Board</h2>
        </div>
        <div className="notice-list">
          {notices.map((item) => (
            <article key={item.title} className="notice-card">
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section-block">
        <div className="section-head">
          <SectionLabel>04</SectionLabel>
          <h2>Popular Programmes</h2>
        </div>
        <div className="card-grid three">
          {(site.programmes || []).slice(0, 6).map((programme) => (
            <Link key={programme.slug} className="programme-card" to={`/programme/${programme.slug}`}>
              <span className="tiny-pill">{programme.name}</span>
              <h3>{programme.name}</h3>
              <p>{programme.description}</p>
              <small>{programme.duration}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section-block">
        <div className="section-head">
          <SectionLabel>05</SectionLabel>
          <h2>Why Choose MP Institute</h2>
        </div>
        <div className="card-grid four">
          <div className="feature-card"><h4>Industry Ready</h4><p>Professional learning with practical exposure and mentoring.</p></div>
          <div className="feature-card"><h4>Global Linkages</h4><p>International student exchange and internship tie-ups.</p></div>
          <div className="feature-card"><h4>Campus Life</h4><p>Green campus, clubs, activities and vibrant student experience.</p></div>
          <div className="feature-card"><h4>Career Focus</h4><p>Strong placement support and entrepreneurship mentoring.</p></div>
        </div>
      </section>

      <section className="container section-block md-message">
        <div className="small-badge">Managing Director</div>
        <h3>Welcome to MP Institute</h3>
        <p>Our commitment is to nurture talent, encourage integrity and build leadership for a changing world.</p>
      </section>

      <section className="container section-block">
        <div className="section-head">
          <SectionLabel>06</SectionLabel>
          <h2>Student Voices</h2>
        </div>
        <div className="card-grid three">
          {['The mentoring and culture at MP Institute helped me grow academically and personally.', 'Practical learning and international exposure shaped my career direction.', 'A warm, inspiring campus with excellent faculty guidance.'].map((txt, idx) => (
            <div key={idx} className="testimonial-card">
              <p>“{txt}”</p>
              <strong>Student</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="container section-block">
        <div className="section-head">
          <SectionLabel>07</SectionLabel>
          <h2>Campus Gallery</h2>
        </div>
        <div className="gallery-grid">
          <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80" alt="Campus" />
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80" alt="Students in classroom" />
          <img src="https://images.unsplash.com/photo-1517486800579-88a1367d0f6a?auto=format&fit=crop&w=900&q=80" alt="Library" />
        </div>
      </section>
    </main>
  );
}

function AboutPage() {
  return (
    <main className="container content-page">
      <SectionLabel>About</SectionLabel>
      <h1>Our Story</h1>
      <p>Founded in 2004, MP Institute of Management and Computer Application emerged as a leading institution dedicated to management, computer applications and teacher education in the region. Affiliated to MGKVP, Varanasi, and approved by AICTE & NCTE, the institute emphasises academic quality, ethics, and student growth.</p>
      <div className="two-columns">
        <div className="info-panel">
          <h3>Vision</h3>
          <p>To become a centre of academic excellence producing responsible professionals and leaders.</p>
        </div>
        <div className="info-panel">
          <h3>Mission</h3>
          <p>To provide accessible, innovative and value-based education that develops skills, confidence and community responsibility.</p>
        </div>
      </div>
      <div className="info-panel">
        <h3>Managing Director Message</h3>
        <p>“We strive to create an environment where students develop not just knowledge but also character, discipline, and a sense of purpose.”</p>
      </div>
      <div className="info-panel">
        <h3>Director Message</h3>
        <p>“The institute remains committed to quality teaching, research orientation, and holistic student experiences.”</p>
      </div>
      <div className="section-block">
        <h3>Guiding Force</h3>
        <div className="tag-list">
          {['Dr Gorakhnath Tiwari', 'Dr NP Sharma', 'Dr UD Tripathi', 'Mr Ram Narain Lal', 'Mr Arun Agarwal'].map((name) => <span key={name} className="tag">{name}</span>)}
        </div>
      </div>
    </main>
  );
}

function AcademicsPage({ programmes }) {
  return (
    <main className="container content-page">
      <SectionLabel>Academics</SectionLabel>
      <h1>Programmes & Learning</h1>
      <div className="card-grid three">
        {programmes.map((programme) => (
          <Link key={programme.slug} className="programme-card" to={`/programme/${programme.slug}`}>
            <span className="tiny-pill">{programme.name}</span>
            <h3>{programme.name}</h3>
            <p>{programme.description}</p>
            <small>{programme.duration}</small>
          </Link>
        ))}
      </div>
    </main>
  );
}

function ProgrammePage() {
  const { slug } = useParams();
  const [programme, setProgramme] = useState(null);

  useEffect(() => {
    API.get(`/programmes/${slug}`).then(({ data }) => setProgramme(data.programme)).catch(() => setProgramme(null));
  }, [slug]);

  if (!programme) return <main className="container content-page"><h2>Loading programme details...</h2></main>;

  return (
    <main className="container content-page">
      <SectionLabel>{programme.code}</SectionLabel>
      <h1>{programme.name}</h1>
      <p>{programme.description}</p>
      <div className="two-columns">
        <div className="info-panel"><h3>Duration</h3><p>{programme.duration}</p></div>
        <div className="info-panel"><h3>Eligibility</h3><p>{programme.eligibility}</p></div>
      </div>
      <div className="info-panel">
        <h3>Career Scope</h3>
        <p>Graduates can pursue careers in software development, business operations, management, education, finance, entrepreneurship and research.</p>
      </div>
      <div className="info-panel">
        <h3>Semester Structure</h3>
        <ul className="inline-list">
          {programme.subjects.map((subject) => <li key={subject}>{subject}</li>)}
        </ul>
      </div>
      <div className="info-panel">
        <h3>Fee Summary</h3>
        <p>Detailed fee structures are maintained in the portal and can be reviewed by the admissions team.</p>
      </div>
    </main>
  );
}

function PeoplePage() {
  const [people, setPeople] = useState([]);
  useEffect(() => {
    API.get('/people').then(({ data }) => setPeople(data.people)).catch(() => setPeople([]));
  }, []);

  return (
    <main className="container content-page">
      <SectionLabel>People</SectionLabel>
      <h1>Leadership, Mentors & Faculty</h1>
      <div className="card-grid three">
        {people.map((person) => (
          <div key={person.name} className="person-card">
            <div className="avatar">{person.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}</div>
            <h3>{person.name}</h3>
            <small>{person.role}</small>
          </div>
        ))}
      </div>
    </main>
  );
}

function AdmissionsPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    API.post('/enquiries', form).then(() => {
      setStatus('Your enquiry has been submitted successfully.');
      setForm({ name: '', phone: '', email: '', message: '' });
    }).catch((err) => setStatus(err.response?.data?.message || 'Unable to submit enquiry.'));
  };

  return (
    <main className="container content-page">
      <SectionLabel>Admissions</SectionLabel>
      <h1>Admissions 2025-26</h1>
      <div className="two-columns">
        <div className="info-panel">
          <h3>Application Steps</h3>
          <ol>
            <li>Choose programme and check eligibility.</li>
            <li>Submit online or offline application form.</li>
            <li>Attend counselling and document verification.</li>
            <li>Pay fees and confirm admission.</li>
          </ol>
        </div>
        <div className="info-panel">
          <h3>Modes</h3>
          <p>Online admission portal and direct offline counselling at campus office.</p>
        </div>
      </div>
      <div className="info-panel">
        <h3>Scholarships & Financial Aid</h3>
        <p>Merit-based scholarships, need-based support and guidance for eligible students are available through the admissions office.</p>
      </div>
      <div className="faqs">
        <h3>FAQs</h3>
        {['What documents are required for admission?', 'Does the institute offer scholarships?', 'Is offline admission available?', 'Can I apply for multiple programmes?', 'What is the intake for BCA?', 'Do you provide hostel support?'].map((q, idx) => (
          <details key={q} open={idx === 0}>
            <summary>{q}</summary>
            <p>Our admissions team will guide you through the process and required documentation.</p>
          </details>
        ))}
      </div>
      <form className="plain-form" onSubmit={handleSubmit}>
        <h3>Admission Enquiry</h3>
        <div className="field-grid">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" rows="4" />
        </div>
        <button className="primary-btn" type="submit">Submit Enquiry</button>
        {status && <p className="status-text">{status}</p>}
      </form>
    </main>
  );
}

function CampusLifePage() {
  return (
    <main className="container content-page">
      <SectionLabel>Campus Life</SectionLabel>
      <h1>Campus Experience</h1>
      <div className="gallery-grid large">
        <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80" alt="Students in campus" />
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80" alt="Student engagement" />
        <img src="https://images.unsplash.com/photo-1517486800579-88a1367d0f6a?auto=format&fit=crop&w=900&q=80" alt="Learning space" />
        <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80" alt="Campus event" />
      </div>
    </main>
  );
}

function NewsPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    API.get('/news').then(({ data }) => setPosts(data.newsPosts)).catch(() => setPosts([]));
  }, []);

  return (
    <main className="container content-page">
      <SectionLabel>News & Events</SectionLabel>
      <h1>Latest Updates</h1>
      <div className="news-list">
        {posts.map((post) => (
          <Link key={post.id} className="news-card" to={`/news/${post.id}`}>
            <span className="tiny-pill">{post.category}</span>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <small>{post.createdAt}</small>
          </Link>
        ))}
      </div>
    </main>
  );
}

function NewsDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  useEffect(() => {
    API.get('/news').then(({ data }) => setPost((data.newsPosts || []).find((item) => item.id === id))); 
  }, [id]);

  if (!post) return <main className="container content-page"><h2>Loading news</h2></main>;

  return (
    <main className="container content-page">
      <SectionLabel>News</SectionLabel>
      <h1>{post.title}</h1>
      <p>{post.excerpt}</p>
      <div className="info-panel"><p>Published on {post.createdAt} by {post.author}.</p></div>
    </main>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    API.post('/contact', form).then(() => {
      setStatus('Message sent successfully.');
      setForm({ name: '', email: '', message: '' });
    }).catch((err) => setStatus(err.response?.data?.message || 'Please try again.'));
  };

  return (
    <main className="container content-page">
      <SectionLabel>Contact</SectionLabel>
      <h1>Reach Us</h1>
      <div className="contact-grid">
        <div className="info-panel">
          <p><strong>Address:</strong> Bhagatua, Balua Ghat Main Road, Varanasi – 221104</p>
          <p><strong>Phone:</strong> +91 543 211 9944</p>
          <p><strong>Email:</strong> admin@mpinstitute.edu.in</p>
        </div>
        <form className="plain-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <textarea name="message" rows="4" placeholder="Your message" value={form.message} onChange={handleChange} />
          <button className="primary-btn" type="submit">Send Message</button>
          {status && <p className="status-text">{status}</p>}
        </form>
      </div>
    </main>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', form);
      localStorage.setItem('mp-user', JSON.stringify(data.user));
      localStorage.setItem('mp-token', data.accessToken);
      if (data.user.role === 'admin') navigate('/portal/admin');
      else if (data.user.role === 'teacher') navigate('/portal/teacher');
      else navigate('/portal/student');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Authentication failed.');
    }
  };

  const demoLogin = async (role) => {
    const map = {
      admin: { email: 'admin@mpinstitute.edu.in', password: 'Admin@123' },
      teacher: { email: 'vishnupriya@mpinstitute.edu.in', password: 'Teacher@123' },
      student: { email: 'aarav.singh@student.mpinstitute.edu.in', password: 'Student@123' },
    };
    setForm(map[role]);
    const { data } = await API.post('/auth/login', map[role]);
    localStorage.setItem('mp-user', JSON.stringify(data.user));
    localStorage.setItem('mp-token', data.accessToken);
    navigate(role === 'admin' ? '/portal/admin' : role === 'teacher' ? '/portal/teacher' : '/portal/student');
  };

  return (
    <main className="container auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        <div className="demo-login-row">
          <button className="ghost-btn small" onClick={() => demoLogin('admin')}>Admin Demo</button>
          <button className="ghost-btn small" onClick={() => demoLogin('teacher')}>Teacher Demo</button>
          <button className="ghost-btn small" onClick={() => demoLogin('student')}>Student Demo</button>
        </div>
        <form onSubmit={handleSubmit} className="plain-form">
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
          <button className="primary-btn" type="submit">Login</button>
        </form>
        <Link to="/forgot-password">Forgot password?</Link>
        {status && <p className="status-text">{status}</p>}
      </div>
    </main>
  );
}

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await API.post('/auth/forgot-password', { email }); setStatus('Reset instructions have been sent.'); }
    catch (error) { setStatus(error.response?.data?.message || 'Unable to process request.'); }
  };
  return (
    <main className="container auth-page"><div className="auth-card"><h1>Forgot Password</h1><form onSubmit={handleSubmit} className="plain-form"><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" /> <button className="primary-btn" type="submit">Send Link</button></form>{status && <p className="status-text">{status}</p>}</div></main>
  );
}

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const query = new URLSearchParams(window.location.search);
  const token = query.get('token');
  const [status, setStatus] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await API.post('/auth/reset-password', { token, password }); setStatus('Password reset successful.'); }
    catch (error) { setStatus(error.response?.data?.message || 'Reset failed.'); }
  };
  return <main className="container auth-page"><div className="auth-card"><h1>Reset Password</h1><form onSubmit={handleSubmit} className="plain-form"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" /><button className="primary-btn" type="submit">Reset</button></form>{status && <p className="status-text">{status}</p>}</div></main>;
}

function NotFoundPage() {
  return <main className="container auth-page"><div className="auth-card"><h1>404</h1><p>The page you are looking for does not exist.</p><Link className="primary-btn" to="/">Go Home</Link></div></main>;
}

function PortalRoutes() {
  const user = JSON.parse(localStorage.getItem('mp-user') || 'null');
  const role = user?.role || 'student';
  if (!user) return <Navigate to="/login" replace />;
  return (
    <Routes>
      <Route path="/admin" element={role === 'admin' ? <AdminPortal /> : <Navigate to="/portal/student" replace />} />
      <Route path="/teacher" element={role === 'teacher' ? <TeacherPortal /> : <Navigate to="/portal/student" replace />} />
      <Route path="/student" element={role === 'student' ? <StudentPortal /> : <Navigate to="/portal/admin" replace />} />
      <Route path="*" element={<Navigate to={`/portal/${role}`} replace />} />
    </Routes>
  );
}

function PortalShell({ children, title, navItems: links }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('mp-user') || 'null');
  const logout = async () => { localStorage.removeItem('mp-user'); localStorage.removeItem('mp-token'); await API.post('/auth/logout'); navigate('/login'); };

  return (
    <div className="portal-shell">
      <aside className="portal-sidebar">
        <div className="portal-brand">MP Portal</div>
        <div className="profile-box">{user?.name || 'User'}<small>{user?.role}</small></div>
        <nav className="portal-nav">
          {links.map((item) => <Link key={item.to} to={item.to}>{item.label}</Link>)}
        </nav>
        <button className="primary-btn" onClick={logout}>Logout</button>
      </aside>
      <main className="portal-main">
        <div className="portal-header"><h1>{title}</h1><span>Welcome back</span></div>
        {children}
      </main>
    </div>
  );
}

function AdminPortal() {
  const [metrics, setMetrics] = useState({ students: 0, teachers: 0, programmeCount: 0, collection: 0 });
  useEffect(() => { API.get('/admin/dashboard', { headers: { Authorization: `Bearer ${localStorage.getItem('mp-token')}` } }).then(({ data }) => setMetrics(data.stats)).catch(() => {}); }, []);
  const cards = [
    { label: 'Students', value: metrics.students },
    { label: 'Teachers', value: metrics.teachers },
    { label: 'Programmes', value: metrics.programmeCount },
    { label: 'Fees Collected', value: `₹${metrics.collection.toLocaleString()}` },
  ];
  return (
    <PortalShell title="Admin Dashboard" navItems={[{ to: '/portal/admin', label: 'Dashboard' }, { to: '/portal/admin/students', label: 'Students' }, { to: '/portal/admin/teachers', label: 'Teachers' }, { to: '/portal/admin/fees', label: 'Fees' }, { to: '/portal/admin/notices', label: 'Notices' }, { to: '/portal/admin/chat', label: 'Chat' }]}>
      <div className="card-grid four">
        {cards.map((card) => (<div className="stat-box white" key={card.label}><strong>{card.value}</strong><span>{card.label}</span></div>))}
      </div>
      <div className="portal-panels">
        <div className="panel"><h3>Attendance Trend</h3><div className="mini-chart">88% / 90% / 92%</div></div>
        <div className="panel"><h3>Fee Collection</h3><div className="mini-chart">₹2.8L / ₹3.1L / ₹3.4L</div></div>
      </div>
    </PortalShell>
  );
}

function TeacherPortal() {
  const [teacher, setTeacher] = useState({});
  useEffect(() => { API.get('/teacher/dashboard', { headers: { Authorization: `Bearer ${localStorage.getItem('mp-token')}` } }).then(({ data }) => setTeacher(data)).catch(() => {}); }, []);
  return (
    <PortalShell title="Teacher Portal" navItems={[{ to: '/portal/teacher', label: 'Dashboard' }, { to: '/portal/teacher/attendance', label: 'Attendance' }, { to: '/portal/teacher/marks', label: 'Marks' }, { to: '/portal/teacher/assignments', label: 'Assignments' }, { to: '/portal/teacher/chat', label: 'Chat' }]}>
      <div className="info-panel"><h3>My Subjects</h3><p>{teacher.subjects?.join(', ') || 'Web Development, DBMS, Software Engineering'}</p></div>
      <div className="portal-panels"><div className="panel"><h3>Today’s Classes</h3><p>{teacher.todayClasses || 4}</p></div><div className="panel"><h3>Class Averages</h3><p>{teacher.averages?.join(' / ') || '85 / 88 / 90'}</p></div></div>
    </PortalShell>
  );
}

function StudentPortal() {
  const [student, setStudent] = useState({});
  useEffect(() => { API.get('/student/dashboard', { headers: { Authorization: `Bearer ${localStorage.getItem('mp-token')}` } }).then(({ data }) => setStudent(data)).catch(() => {}); }, []);
  return (
    <PortalShell title="Student Portal" navItems={[{ to: '/portal/student', label: 'Dashboard' }, { to: '/portal/student/attendance', label: 'Attendance' }, { to: '/portal/student/fees', label: 'Fees' }, { to: '/portal/student/results', label: 'Results' }, { to: '/portal/student/library', label: 'Library' }, { to: '/portal/student/chat', label: 'Chat' }]}>
      <div className="card-grid four">
        <div className="stat-box white"><strong>{student.attendance || 92}%</strong><span>Attendance</span></div>
        <div className="stat-box white"><strong>₹{student.dues || 28000}</strong><span>Dues</span></div>
        <div className="stat-box white"><strong>{student.notices?.length || 3}</strong><span>Notices</span></div>
        <div className="stat-box white"><strong>{student.assignments?.length || 2}</strong><span>Assignments</span></div>
      </div>
    </PortalShell>
  );
}

export default App;
