import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const colors = {
  bg: '#0B1220',
  panel: '#121A2B',
  panel2: '#192335',
  text: '#F8FAFC',
  muted: '#A7B2C3',
  line: '#2D3A52',
  accent: '#2563EB',
  accent2: '#1D4ED8',
  success: '#16A34A',
  warn: '#F59E0B',
  danger: '#EF4444',
};

const TEXTS = {
  de: {
    adminTitle: 'Quanturion Admin',
    loginTitle: 'Admin Login',
    loginBody: 'Melde dich mit einem internen Firebase-Account an.',
    email: 'E-Mail',
    password: 'Passwort',
    login: 'Anmelden',
    logout: 'Abmelden',
    loading: 'Lade…',
    search: 'Suche nach Name oder E-Mail',
    allPlans: 'Alle Tarife',
    allStatuses: 'Alle Stati',
    single: 'Single',
    family: 'Familie',
    active: 'Aktiv',
    inactive: 'Inaktiv',
    pending: 'Offen',
    customers: 'Kunden',
    noCustomers: 'Keine Kunden gefunden.',
    memberArea: 'Mitgliederverwaltung',
    customerDetail: 'Kundendetail',
    back: 'Zurück',
    profile: 'Profil',
    uploads: 'Uploads',
    decisions: 'Admin Entscheidung',
    memberData: 'Mitgliedsdaten',
    status: 'Mitgliedschaft',
    plan: 'Tarif',
    language: 'Sprache',
    save: 'Speichern',
    activate: 'Aktivieren',
    deactivate: 'Deaktivieren',
    reviewStatus: 'Review-Status',
    reviewStatusPlaceholder: 'z. B. pending / approved / rejected',
    adminNotes: 'Admin-Notiz',
    notesPlaceholder: 'Interne Notiz für diesen Kunden',
    saveOk: 'Gespeichert.',
    saveFailed: 'Speichern fehlgeschlagen.',
    notAdmin: 'Dieser Account hat keinen Admin-Claim.',
    authError: 'Login fehlgeschlagen. Prüfe E-Mail, Passwort und Firebase-Konfiguration.',
    customerName: 'Name',
    customerEmail: 'E-Mail',
    customerUid: 'UID',
    createdAt: 'Erstellt',
    sectionProfile: 'Profil',
    sectionMobile: 'Mobilfunk',
    sectionHome: 'Home Bundle',
    sectionElectricity: 'Strom',
    sectionGas: 'Gas',
    sectionStreaming: 'Streaming',
    sectionLoan: 'Darlehen',
    openFile: 'Datei öffnen',
    noUploads: 'Keine Uploads vorhanden.',
    noData: 'Keine Daten vorhanden.',
  },
  en: {
    adminTitle: 'Quanturion Admin',
    loginTitle: 'Admin Login',
    loginBody: 'Sign in with an internal Firebase account.',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    logout: 'Logout',
    loading: 'Loading…',
    search: 'Search by name or email',
    allPlans: 'All plans',
    allStatuses: 'All statuses',
    single: 'Single',
    family: 'Family',
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    customers: 'Customers',
    noCustomers: 'No customers found.',
    memberArea: 'Members management',
    customerDetail: 'Customer detail',
    back: 'Back',
    profile: 'Profile',
    uploads: 'Uploads',
    decisions: 'Admin decision',
    memberData: 'Member data',
    status: 'Membership',
    plan: 'Plan',
    language: 'Language',
    save: 'Save',
    activate: 'Activate',
    deactivate: 'Deactivate',
    reviewStatus: 'Review status',
    reviewStatusPlaceholder: 'e.g. pending / approved / rejected',
    adminNotes: 'Admin note',
    notesPlaceholder: 'Internal note for this customer',
    saveOk: 'Saved.',
    saveFailed: 'Saving failed.',
    notAdmin: 'This account does not have the admin claim.',
    authError: 'Login failed. Check email, password and Firebase configuration.',
    customerName: 'Name',
    customerEmail: 'Email',
    customerUid: 'UID',
    createdAt: 'Created',
    sectionProfile: 'Profile',
    sectionMobile: 'Mobile',
    sectionHome: 'Home Bundle',
    sectionElectricity: 'Electricity',
    sectionGas: 'Gas',
    sectionStreaming: 'Streaming',
    sectionLoan: 'Loans',
    openFile: 'Open file',
    noUploads: 'No uploads found.',
    noData: 'No data found.',
  },
  he: {
    adminTitle: 'Quanturion Admin',
    loginTitle: 'כניסת אדמין',
    loginBody: 'התחבר עם חשבון Firebase פנימי.',
    email: 'אימייל',
    password: 'סיסמה',
    login: 'התחברות',
    logout: 'התנתקות',
    loading: 'טוען…',
    search: 'חיפוש לפי שם או אימייל',
    allPlans: 'כל המסלולים',
    allStatuses: 'כל הסטטוסים',
    single: 'יחיד',
    family: 'משפחה',
    active: 'פעיל',
    inactive: 'לא פעיל',
    pending: 'ממתין',
    customers: 'לקוחות',
    noCustomers: 'לא נמצאו לקוחות.',
    memberArea: 'ניהול חברים',
    customerDetail: 'פרטי לקוח',
    back: 'חזרה',
    profile: 'פרופיל',
    uploads: 'העלאות',
    decisions: 'החלטת אדמין',
    memberData: 'נתוני חבר',
    status: 'מנוי',
    plan: 'מסלול',
    language: 'שפה',
    save: 'שמירה',
    activate: 'הפעלה',
    deactivate: 'כיבוי',
    reviewStatus: 'סטטוס בדיקה',
    reviewStatusPlaceholder: 'למשל pending / approved / rejected',
    adminNotes: 'הערת אדמין',
    notesPlaceholder: 'הערה פנימית עבור הלקוח',
    saveOk: 'נשמר.',
    saveFailed: 'השמירה נכשלה.',
    notAdmin: 'לחשבון הזה אין admin claim.',
    authError: 'ההתחברות נכשלה. בדוק אימייל, סיסמה והגדרות Firebase.',
    customerName: 'שם',
    customerEmail: 'אימייל',
    customerUid: 'UID',
    createdAt: 'נוצר',
    sectionProfile: 'פרופיל',
    sectionMobile: 'סלולר',
    sectionHome: 'חבילת בית',
    sectionElectricity: 'חשמל',
    sectionGas: 'גז',
    sectionStreaming: 'סטרימינג',
    sectionLoan: 'הלוואות',
    openFile: 'פתיחת קובץ',
    noUploads: 'אין העלאות.',
    noData: 'אין נתונים.',
  },
};

const MEMBER_SECTION_ORDER = ['profile', 'mobile', 'home', 'electricity', 'gas', 'streaming', 'loan'];

function useT(language) {
  return TEXTS[language] || TEXTS.de;
}

function formatDate(value) {
  const seconds = value?.seconds;
  if (!seconds) return '—';
  return new Date(seconds * 1000).toLocaleString();
}

export default function App() {
  const [language, setLanguage] = useState('de');
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [decisionState, setDecisionState] = useState({ reviewStatus: '', adminNotes: '' });

  const t = useT(language);
  const isRTL = language === 'he';

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }
      const token = await firebaseUser.getIdTokenResult(true);
      const adminFlag = token?.claims?.admin === true;
      setIsAdmin(adminFlag);
      setAuthReady(true);
      if (!adminFlag) {
        Alert.alert('Admin', t.notAdmin);
      }
    });
    return unsub;
  }, [language]);

  useEffect(() => {
    if (authReady && user && isAdmin) {
      loadCustomers();
    }
  }, [authReady, user, isAdmin]);

  async function handleLogin() {
    try {
      setLoggingIn(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      console.error(err);
      Alert.alert('Auth', t.authError);
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    setSelectedCustomer(null);
    setDetail(null);
    setCustomers([]);
  }

  async function loadCustomers() {
    const snap = await getDocs(collection(db, 'customers'));
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    items.sort((a, b) => {
      const aTs = a.createdAt?.seconds || 0;
      const bTs = b.createdAt?.seconds || 0;
      return bTs - aTs;
    });
    setCustomers(items);
  }

  async function openCustomer(customer) {
    setSelectedCustomer(customer);
    setDetailLoading(true);
    try {
      const memberData = {};
      for (const section of MEMBER_SECTION_ORDER) {
        const snap = await getDoc(doc(db, 'customers', customer.id, 'memberData', section));
        memberData[section] = snap.exists() ? snap.data() : null;
      }

      const uploadsSnap = await getDocs(collection(db, 'customers', customer.id, 'uploads'));
      const uploads = uploadsSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.uploadedAt?.seconds || 0) - (a.uploadedAt?.seconds || 0));

      const customerSnap = await getDoc(doc(db, 'customers', customer.id));
      const customerData = customerSnap.exists() ? customerSnap.data() : customer;

      const reviewStatus = customerData?.adminReviewStatus || '';
      const adminNotes = customerData?.adminNotes || '';
      setDecisionState({ reviewStatus, adminNotes });
      setDetail({ customer: customerData, memberData, uploads });
    } finally {
      setDetailLoading(false);
    }
  }

  async function setMembershipStatus(value) {
    if (!selectedCustomer) return;
    try {
      await updateDoc(doc(db, 'customers', selectedCustomer.id), {
        membershipStatus: value,
        adminUpdatedAt: serverTimestamp(),
        adminUpdatedBy: user?.email || '',
      });
      await loadCustomers();
      await openCustomer({ ...selectedCustomer, membershipStatus: value });
      Alert.alert('Admin', t.saveOk);
    } catch (err) {
      console.error(err);
      Alert.alert('Admin', t.saveFailed);
    }
  }

  async function saveDecision() {
    if (!selectedCustomer) return;
    try {
      await setDoc(
        doc(db, 'customers', selectedCustomer.id),
        {
          adminReviewStatus: decisionState.reviewStatus,
          adminNotes: decisionState.adminNotes,
          lastReviewedAt: serverTimestamp(),
          lastReviewedBy: user?.email || '',
        },
        { merge: true }
      );
      await loadCustomers();
      await openCustomer(selectedCustomer);
      Alert.alert('Admin', t.saveOk);
    } catch (err) {
      console.error(err);
      Alert.alert('Admin', t.saveFailed);
    }
  }

  const filteredCustomers = useMemo(() => {
    return customers.filter((item) => {
      const hay = `${item.fullName || ''} ${item.email || ''}`.toLowerCase();
      const matchesSearch = !search.trim() || hay.includes(search.trim().toLowerCase());
      const matchesPlan = planFilter === 'all' || item.plan === planFilter;
      const matchesStatus = statusFilter === 'all' || item.membershipStatus === statusFilter;
      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [customers, search, planFilter, statusFilter]);

  if (!authReady) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CenteredText text={t.loading} />
      </SafeAreaView>
    );
  }

  if (!user || !isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="light" />
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <Text style={[styles.brand, align(isRTL)]}>{t.adminTitle}</Text>
            <Text style={[styles.h1, align(isRTL)]}>{t.loginTitle}</Text>
            <Text style={[styles.body, align(isRTL)]}>{t.loginBody}</Text>

            <LangRow language={language} setLanguage={setLanguage} />

            <Input label={t.email} value={email} onChangeText={setEmail} isRTL={isRTL} keyboardType="email-address" />
            <Input label={t.password} value={password} onChangeText={setPassword} isRTL={isRTL} secureTextEntry />

            <Pressable style={[styles.submit, loggingIn && { opacity: 0.7 }]} onPress={handleLogin} disabled={loggingIn}>
              <Text style={styles.submitText}>{loggingIn ? t.loading : t.login}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.brand, align(isRTL)]}>{t.adminTitle}</Text>
            <Text style={[styles.h1, align(isRTL)]}>{t.memberArea}</Text>
          </View>
          <View style={{ gap: 12 }}>
            <LangRow language={language} setLanguage={setLanguage} />
            <Pressable style={styles.secondaryBtn} onPress={handleLogout}>
              <Text style={styles.secondaryBtnText}>{t.logout}</Text>
            </Pressable>
          </View>
        </View>

        {!selectedCustomer ? (
          <>
            <View style={styles.card}>
              <Text style={[styles.cardTitle, align(isRTL)]}>{t.customers}</Text>
              <Input label={t.search} value={search} onChangeText={setSearch} isRTL={isRTL} />
              <View style={styles.filterRow}>
                <FilterChip label={t.allPlans} active={planFilter === 'all'} onPress={() => setPlanFilter('all')} />
                <FilterChip label={t.single} active={planFilter === 'single'} onPress={() => setPlanFilter('single')} />
                <FilterChip label={t.family} active={planFilter === 'family'} onPress={() => setPlanFilter('family')} />
              </View>
              <View style={styles.filterRow}>
                <FilterChip label={t.allStatuses} active={statusFilter === 'all'} onPress={() => setStatusFilter('all')} />
                <FilterChip label={t.active} active={statusFilter === 'active'} onPress={() => setStatusFilter('active')} />
                <FilterChip label={t.inactive} active={statusFilter === 'inactive'} onPress={() => setStatusFilter('inactive')} />
              </View>
            </View>

            {filteredCustomers.length === 0 ? (
              <View style={styles.card}><Text style={[styles.body, align(isRTL)]}>{t.noCustomers}</Text></View>
            ) : filteredCustomers.map((customer) => (
              <Pressable key={customer.id} style={styles.card} onPress={() => openCustomer(customer)}>
                <Text style={[styles.cardTitle, align(isRTL)]}>{customer.fullName || '—'}</Text>
                <Text style={[styles.body, align(isRTL)]}>{customer.email || '—'}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>{t.plan}: {customer.plan || '—'}</Text>
                  <Text style={styles.metaText}>{t.status}: {customer.membershipStatus || '—'}</Text>
                  <Text style={styles.metaText}>{t.language}: {customer.language || '—'}</Text>
                </View>
              </Pressable>
            ))}
          </>
        ) : (
          <>
            <Pressable style={styles.secondaryBtn} onPress={() => { setSelectedCustomer(null); setDetail(null); }}>
              <Text style={styles.secondaryBtnText}>{t.back}</Text>
            </Pressable>

            {detailLoading || !detail ? (
              <View style={styles.card}><Text style={[styles.body, align(isRTL)]}>{t.loading}</Text></View>
            ) : (
              <>
                <View style={styles.card}>
                  <Text style={[styles.cardTitle, align(isRTL)]}>{t.customerDetail}</Text>
                  <DetailRow label={t.customerName} value={detail.customer?.fullName} isRTL={isRTL} />
                  <DetailRow label={t.customerEmail} value={detail.customer?.email} isRTL={isRTL} />
                  <DetailRow label={t.customerUid} value={selectedCustomer.id} isRTL={isRTL} />
                  <DetailRow label={t.plan} value={detail.customer?.plan} isRTL={isRTL} />
                  <DetailRow label={t.status} value={detail.customer?.membershipStatus} isRTL={isRTL} />
                  <DetailRow label={t.language} value={detail.customer?.language} isRTL={isRTL} />
                  <DetailRow label={t.createdAt} value={formatDate(detail.customer?.createdAt)} isRTL={isRTL} />
                  <View style={styles.actionRow}>
                    <Pressable style={styles.primaryBtn} onPress={() => setMembershipStatus('active')}>
                      <Text style={styles.primaryBtnText}>{t.activate}</Text>
                    </Pressable>
                    <Pressable style={styles.secondaryBtn} onPress={() => setMembershipStatus('inactive')}>
                      <Text style={styles.secondaryBtnText}>{t.deactivate}</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.card}>
                  <Text style={[styles.cardTitle, align(isRTL)]}>{t.decisions}</Text>
                  <Input label={t.reviewStatus} value={decisionState.reviewStatus} onChangeText={(v) => setDecisionState((p) => ({ ...p, reviewStatus: v }))} isRTL={isRTL} placeholder={t.reviewStatusPlaceholder} />
                  <Input label={t.adminNotes} value={decisionState.adminNotes} onChangeText={(v) => setDecisionState((p) => ({ ...p, adminNotes: v }))} isRTL={isRTL} placeholder={t.notesPlaceholder} multiline />
                  <Pressable style={styles.primaryBtn} onPress={saveDecision}>
                    <Text style={styles.primaryBtnText}>{t.save}</Text>
                  </Pressable>
                </View>

                <View style={styles.card}>
                  <Text style={[styles.cardTitle, align(isRTL)]}>{t.memberData}</Text>
                  {MEMBER_SECTION_ORDER.map((section) => (
                    <SectionCard
                      key={section}
                      title={sectionTitle(section, t)}
                      data={detail.memberData?.[section]}
                      noDataText={t.noData}
                      isRTL={isRTL}
                    />
                  ))}
                </View>

                <View style={styles.card}>
                  <Text style={[styles.cardTitle, align(isRTL)]}>{t.uploads}</Text>
                  {detail.uploads?.length ? detail.uploads.map((upload) => (
                    <View key={upload.id} style={styles.uploadCard}>
                      <Text style={[styles.uploadTitle, align(isRTL)]}>{upload.fileName || '—'}</Text>
                      <Text style={[styles.body, align(isRTL)]}>{upload.category || '—'} • {upload.documentType || '—'}</Text>
                      <Text style={[styles.body, align(isRTL)]}>{formatDate(upload.uploadedAt)}</Text>
                      {!!upload.downloadURL && (
                        <Text selectable style={[styles.link, align(isRTL)]}>{upload.downloadURL}</Text>
                      )}
                    </View>
                  )) : <Text style={[styles.body, align(isRTL)]}>{t.noUploads}</Text>}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function sectionTitle(section, t) {
  const map = {
    profile: t.sectionProfile,
    mobile: t.sectionMobile,
    home: t.sectionHome,
    electricity: t.sectionElectricity,
    gas: t.sectionGas,
    streaming: t.sectionStreaming,
    loan: t.sectionLoan,
  };
  return map[section] || section;
}

function align(isRTL) {
  return { textAlign: isRTL ? 'right' : 'left' };
}

function LangRow({ language, setLanguage }) {
  return (
    <View style={styles.langRow}>
      {['de', 'en', 'he'].map((lang) => (
        <Pressable key={lang} onPress={() => setLanguage(lang)} style={[styles.langChip, language === lang && styles.langChipActive]}>
          <Text style={styles.langChipText}>{lang.toUpperCase()}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function Input({ label, value, onChangeText, isRTL, keyboardType = 'default', secureTextEntry = false, placeholder = '', multiline = false }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.label, align(isRTL)]}>{label}</Text>
      <TextInput
        value={String(value ?? '')}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={[styles.input, align(isRTL), multiline && styles.textArea]}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
      />
    </View>
  );
}

function FilterChip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.filterChip, active && styles.filterChipActive]}>
      <Text style={styles.filterChipText}>{label}</Text>
    </Pressable>
  );
}

function DetailRow({ label, value, isRTL }) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.metaText, align(isRTL)]}>{label}</Text>
      <Text style={[styles.body, align(isRTL)]}>{value || '—'}</Text>
    </View>
  );
}

function SectionCard({ title, data, noDataText, isRTL }) {
  return (
    <View style={styles.sectionCard}>
      <Text style={[styles.sectionTitle, align(isRTL)]}>{title}</Text>
      {!data ? (
        <Text style={[styles.body, align(isRTL)]}>{noDataText}</Text>
      ) : Object.entries(data)
          .filter(([key]) => !['updatedAt'].includes(key))
          .map(([key, value]) => (
            <View key={key} style={styles.detailRow}>
              <Text style={[styles.metaText, align(isRTL)]}>{key}</Text>
              <Text style={[styles.body, align(isRTL)]}>{String(value ?? '—')}</Text>
            </View>
          ))}
    </View>
  );
}

function CenteredText({ text }) {
  return (
    <View style={styles.centered}><Text style={styles.body}>{text}</Text></View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 16, gap: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' },
  brand: { color: '#93C5FD', fontSize: 14, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase' },
  h1: { color: colors.text, fontSize: 30, fontWeight: '900' },
  body: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  card: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 24, padding: 18, gap: 12 },
  cardTitle: { color: colors.text, fontSize: 22, fontWeight: '800' },
  fieldWrap: { gap: 6 },
  label: { color: colors.text, fontWeight: '700', fontSize: 14 },
  input: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel2, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: colors.text },
  textArea: { minHeight: 110, textAlignVertical: 'top' },
  langRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  langChip: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel2 },
  langChipActive: { backgroundColor: colors.accent },
  langChipText: { color: colors.text, fontWeight: '800' },
  submit: { marginTop: 10, backgroundColor: colors.accent, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  submitText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  secondaryBtn: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 14, backgroundColor: colors.panel2, borderRadius: 999, borderWidth: 1, borderColor: colors.line },
  secondaryBtnText: { color: colors.text, fontWeight: '800' },
  primaryBtn: { alignSelf: 'flex-start', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: colors.accent, borderRadius: 16 },
  primaryBtnText: { color: '#FFF', fontWeight: '800' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel2, borderRadius: 999, paddingVertical: 10, paddingHorizontal: 12 },
  filterChipActive: { backgroundColor: colors.accent2, borderColor: colors.accent },
  filterChipText: { color: colors.text, fontWeight: '700' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metaText: { color: '#93C5FD', fontSize: 13, fontWeight: '700' },
  detailRow: { gap: 4, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#25324A' },
  actionRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 6 },
  sectionCard: { borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 14, backgroundColor: colors.panel2, gap: 6 },
  sectionTitle: { color: colors.text, fontWeight: '800', fontSize: 18 },
  uploadCard: { borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 14, backgroundColor: colors.panel2, gap: 6 },
  uploadTitle: { color: colors.text, fontWeight: '800', fontSize: 16 },
  link: { color: '#93C5FD', fontSize: 13 },
});
