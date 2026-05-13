'use client';
import { useState } from 'react';
import { i12 } from '@/constants/ImagePath';
import Image from 'next/image';
import { i18 } from '@/constants/ImagePath';

const inputCls =
  'w-full bg-[#131313] border border-[#53443c] px-4 py-3 text-[#e4e2e1] text-sm focus:outline-none focus:border-[#ffb68c] transition-colors placeholder:text-[#a08d83]/50';
const labelCls = 'block text-[10px] font-semibold tracking-[0.1em] text-[#d8c2b7] mb-2';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    firstName: 'first name',
    lastName: 'last name',
    email: 'email@example.com',
    phone: '+1 (212) 555-0142',
    dob: '1990-03-15',
    preferredBarber: 'elias',
  });

  const [notifs, setNotifs] = useState({
    emailBooking: true,
    emailReminder: true,
    emailPromo: false,
    smsReminder: true,
    smsConfirm: true,
  });

  const [passwords, setPasswords] = useState({ current: '', newPwd: '', confirm: '' });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e4e2e1] overflow-x-hidden">
      <div className="flex min-h-screen">
        {/* MAIN */}
        <main className="flex-1 p-4 md:p-12 min-w-0">
          <div className="max-w-full">
            <div className="mb-10">
              <span className="text-[10px] tracking-[0.3em] text-[#ffb68c]">CLIENT PORTAL</span>
              <h1
                className="text-[36px] font-bold tracking-tight mt-1"
                style={{ fontFamily: 'Noto Serif, serif' }}
              >
                My Profile
              </h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-[#53443c] mb-8 overflow-x-auto scrollbar-hide">
              {[
                ['profile', 'Profile'],
                ['notifications', 'Notifications'],
                ['change_password', 'Change Password'],
                ['account', 'Account'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-5 py-3 text-[11px] tracking-widest border-b-2 transition-colors -mb-px whitespace-nowrap ${activeTab === key ? 'border-[#ffb68c] text-[#ffb68c]' : 'border-transparent text-[#a08d83] hover:text-[#e4e2e1]'}`}
                >
                  {label.toUpperCase()}
                </button>
              ))}
            </div>

            {/* ── PROFILE TAB ── */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20 bg-[#2a2a2a] border border-[#53443c] flex items-center justify-center">
                    {/* Initials */}
                    <span className="text-[28px] font-bold text-[#ffb68c] leading-none">JW</span>

                    {/* Edit Button */}
                    <button className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-7 h-7 bg-[#ffb68c] rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shadow-md">
                      <Image
                        src={i12}
                        alt="edit"
                        width={14}
                        height={14}
                        className="object-contain invert brightness-100"
                      />
                    </button>
                  </div>
                  <div>
                    <p className="text-[11px] tracking-widest text-[#a08d83] mb-1">
                      MEMBER SINCE 2022
                    </p>
                    <p className="text-[#ffb68c] text-[11px] tracking-wider">
                      PREMIUM MEMBER · 1,840 PTS
                    </p>
                  </div>
                </div>

                <div className="bg-[#1f2020] border border-[#53443c] p-4 md:p-8 space-y-6 overflow-hidden">
                  <p className="text-[10px] tracking-[0.2em] text-[#a08d83]">
                    PERSONAL INFORMATION
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>FIRST NAME</label>
                      <input
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>LAST NAME</label>
                      <input
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>PHONE NUMBER</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>DATE OF BIRTH</label>
                    <input
                      type="date"
                      value={profile.dob}
                      onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                      className={inputCls + ' text-[#ffb68c] date-input'}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>PREFERRED BARBER</label>
                    <select
                      value={profile.preferredBarber}
                      onChange={(e) => setProfile({ ...profile, preferredBarber: e.target.value })}
                      className={inputCls + ' cursor-pointer w-full min-w-0'}
                    >
                      <option value="">No preference</option>
                      <option value="elias">Elias Thorne — Master Barber</option>
                      <option value="marcus">Marcus Reid — Master Barber</option>
                      <option value="leo">Leo Santos — Senior Stylist</option>
                      <option value="victor">Victor Cole — Senior Stylist</option>
                      <option value="silas">Silas Kane — Barber</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full bg-[#ffb68c] text-[#532200] py-4 text-[12px] font-semibold tracking-[0.2em] hover:opacity-90 active:scale-95 transition-all"
                >
                  {saved ? '✓ CHANGES SAVED' : 'SAVE CHANGES'}
                </button>
              </div>
            )}

            {/* ── NOTIFICATIONS TAB ── */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                {[
                  {
                    key: 'emailBooking',
                    label: 'Booking Confirmations',
                    desc: 'Receive email when a booking is confirmed or modified.',
                    group: 'EMAIL',
                  },
                  {
                    key: 'emailReminder',
                    label: 'Appointment Reminders',
                    desc: 'Receive a reminder email 24 hours before your appointment.',
                    group: 'EMAIL',
                  },
                ].reduce((acc, item) => {
                  if (!acc[item.group]) acc[item.group] = [];
                  acc[item.group].push(item);
                  return acc;
                }, {}) &&
                  Object.entries(
                    [
                      {
                        key: 'emailBooking',
                        label: 'Booking Confirmations',
                        desc: 'Receive email when a booking is confirmed or modified.',
                        group: 'EMAIL',
                      },
                      {
                        key: 'emailReminder',
                        label: 'Appointment Reminders',
                        desc: 'Receive a reminder email 24 hours before your appointment.',
                        group: 'EMAIL',
                      },
                    ].reduce((acc, item) => {
                      if (!acc[item.group]) acc[item.group] = [];
                      acc[item.group].push(item);
                      return acc;
                    }, {}),
                  ).map(([group, items]) => (
                    <div
                      key={group}
                      className="bg-[#1f2020] border border-[#53443c] overflow-hidden"
                    >
                      <div className="px-6 py-3 border-b border-[#53443c] bg-[#1b1c1c]">
                        <p className="text-[10px] tracking-[0.2em] text-[#a08d83]">
                          {group} NOTIFICATIONS
                        </p>
                      </div>
                      {items.map((item, i) => (
                        <div
                          key={item.key}
                          className={`flex items-center justify-between p-6 ${i < items.length - 1 ? 'border-b border-[#53443c]' : ''}`}
                        >
                          <div>
                            <p className="text-[#e4e2e1] text-sm font-medium">{item.label}</p>
                            <p className="text-[#a08d83] text-[12px] mt-1">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => setNotifs({ ...notifs, [item.key]: !notifs[item.key] })}
                            className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ml-4 ${notifs[item.key] ? 'bg-[#ffb68c]' : 'bg-[#53443c]'}`}
                          >
                            <div
                              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifs[item.key] ? 'translate-x-6' : 'translate-x-0.5'}`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                <button
                  onClick={handleSave}
                  className="w-full bg-[#ffb68c] text-[#532200] py-4 text-[12px] font-semibold tracking-[0.2em] hover:opacity-90 transition-opacity"
                >
                  {saved ? '✓ SAVED' : 'SAVE PREFERENCES'}
                </button>
              </div>
            )}

            {/* ── Change Password TAB ── */}
            {activeTab === 'change_password' && (
              <div className="space-y-6">
                <div className="bg-[#1f2020] border border-[#53443c] p-4 md:p-8 space-y-6 overflow-hidden">
                  <p className="text-[10px] tracking-[0.2em] text-[#a08d83]">CHANGE PASSWORD</p>
                  <div>
                    <label className={labelCls}>CURRENT PASSWORD</label>
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      className={inputCls}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>NEW PASSWORD</label>
                    <input
                      type="password"
                      value={passwords.newPwd}
                      onChange={(e) => setPasswords({ ...passwords, newPwd: e.target.value })}
                      className={inputCls}
                      placeholder="Min. 8 characters"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>CONFIRM NEW PASSWORD</label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className={inputCls}
                      placeholder="Re-enter new password"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    className="w-full bg-[#ffb68c] text-[#532200] py-4 text-[12px] font-semibold tracking-[0.2em] hover:opacity-90 transition-opacity"
                  >
                    {saved ? '✓ PASSWORD UPDATED' : 'UPDATE PASSWORD'}
                  </button>
                </div>
              </div>
            )}

            {/* ── Account ── */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="bg-[#1f2020] border border-[#ffb4ab]/30 p-8">
                  <div className="flex items-start gap-4">
                    <Image src={i18} alt="Warning" width={50} height={50} />
                    <div className="flex-1">
                      <h3 className="text-[#e4e2e1] font-medium mb-2">Delete Account</h3>
                      <p className="text-[#a08d83] text-sm leading-relaxed mb-6">
                        This will permanently delete your account, all booking history, and loyalty
                        points. This action{' '}
                        <strong className="text-[#e4e2e1]">cannot be undone</strong>.
                      </p>
                      <button className="border border-[#ffb4ab]/50 text-[#ffb4ab] px-6 py-3 text-[11px] tracking-widest hover:bg-[#93000a]/20 transition-colors">
                        DELETE MY ACCOUNT
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
