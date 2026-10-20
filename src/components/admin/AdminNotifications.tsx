import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';
import { 
  getNotifications, 
  markNotificationRead, 
  deleteNotification, 
  clearAllNotifications, 
  addNotification 
} from '../../api/mockApi';
import { playAlertChime } from '../../utils/audioAlert';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  Bell, 
  Check, 
  Trash2, 
  AlertTriangle, 
  ShieldAlert, 
  ShoppingBag, 
  Boxes, 
  Volume2, 
  VolumeX, 
  Plus, 
  CheckCheck,
  RefreshCw,
  X
} from 'lucide-react';

export function AdminNotifications() {
  const { showToast, setAdminView } = useApp();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'inventory' | 'orders' | 'security' | 'system'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newCategory, setNewCategory] = useState<'inventory' | 'orders' | 'security' | 'system'>('inventory');
  const [newSeverity, setNewSeverity] = useState<'high' | 'medium' | 'low'>('high');

  const loadNotifs = async () => {
    setLoading(true);
    const data = await getNotifications();
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifs();
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    showToast('Notification marked as read', 'info');
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification deleted', 'info');
  };

  const [isClearAllOpen, setIsClearAllOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearAll = () => {
    setIsClearAllOpen(true);
  };

  const handleConfirmClearAll = async () => {
    setIsClearing(true);
    try {
      await clearAllNotifications();
      setNotifications([]);
      showToast('All notifications cleared', 'info');
    } catch (err: any) {
      showToast(err?.message || 'Failed to clear notifications', 'error');
    } finally {
      setIsClearing(false);
      setIsClearAllOpen(false);
    }
  };

  const handlePlayTestSound = () => {
    playAlertChime('critical');
    showToast('Playing warning chime audio...', 'info');
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    const created = await addNotification({
      title: newTitle.trim(),
      message: newMessage.trim(),
      category: newCategory,
      severity: newSeverity,
      action_label: newCategory === 'inventory' ? 'View Inventory' : 'Review'
    });

    setNotifications(prev => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewMessage('');
    if (soundEnabled && newSeverity === 'high') {
      playAlertChime('critical');
    }
    showToast('Alert broadcasted successfully', 'success');
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.category === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col w-full bg-[#111418] text-[#e1e2e8] min-h-screen">
      {/* Top Header */}
      <div className="px-6 py-6 bg-[#0b0e12]/90 border-b border-[#4d4639]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-[#999080] uppercase tracking-widest">
            <Bell className="w-4 h-4 text-[#ffe09d]" />
            <span>Vault Intelligence & Alarm Center</span>
          </div>
          <h1 className="font-syne text-2xl sm:text-3xl font-bold uppercase text-[#e1e2e8] mt-1">
            Notifications & Alerts
          </h1>
          <p className="text-xs text-[#999080] font-mono-data mt-0.5">
            {unreadCount} unread notices · Real-time inventory thresholds, payment confirmations & security logs
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playAlertChime('warning');
            }}
            className={`px-3 py-2 text-xs font-mono-data uppercase flex items-center gap-2 border transition-all ${
              soundEnabled 
                ? 'bg-[#191c20] border-[#e5c378]/40 text-[#ffe09d]' 
                : 'bg-[#191c20]/50 border-gray-700 text-[#999080]'
            }`}
            title="Toggle audio alert on low stock warnings"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#ffe09d]" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Alert Sound ON' : 'Alert Sound MUTED'}</span>
          </button>

          <button
            onClick={handlePlayTestSound}
            className="px-3 py-2 bg-[#191c20] hover:bg-[#272a2e] border border-[#e5c378]/30 text-xs font-mono-data uppercase text-[#e1e2e8] flex items-center gap-2 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#e5c378]" />
            <span>Test Chime</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-[#8A6D2F] hover:bg-[#C8A96B] text-white text-xs font-syne uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Broadcast Alert</span>
          </button>

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-2 bg-[#93000a]/20 hover:bg-[#93000a]/40 border border-[#93000a]/50 text-xs font-mono-data text-[#ffdad6] flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="px-6 py-3 bg-[#191c20]/60 border-b border-[#4d4639]/20 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono-data uppercase text-[#999080] mr-2">Filter by:</span>
        {[
          { key: 'all', label: 'All Notices', count: notifications.length },
          { key: 'inventory', label: 'Low Stock & Vault', count: notifications.filter(n => n.category === 'inventory').length },
          { key: 'orders', label: 'Orders & Payments', count: notifications.filter(n => n.category === 'orders').length },
          { key: 'security', label: 'Security & Access', count: notifications.filter(n => n.category === 'security').length },
          { key: 'system', label: 'System & Lab', count: notifications.filter(n => n.category === 'system').length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-3 py-1.5 text-xs font-mono-data transition-all flex items-center gap-2 ${
              filter === tab.key
                ? 'bg-[#ffe09d] text-[#111111] font-bold'
                : 'bg-[#111418] text-[#999080] hover:text-[#e1e2e8] border border-[#4d4639]/30'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filter === tab.key ? 'bg-[#111111] text-[#ffe09d]' : 'bg-[#191c20] text-[#999080]'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main List */}
      <div className="p-6 max-w-5xl space-y-3">
        {loading ? (
          <div className="flex items-center justify-center p-16 text-[#999080] font-mono-data text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
            Loading real-time notifications...
          </div>
        ) : filteredNotifs.length === 0 ? (
          <div className="p-12 text-center bg-[#191c20]/40 border border-[#4d4639]/30 font-mono-data">
            <Bell className="w-8 h-8 text-[#999080] mx-auto mb-3 opacity-50" />
            <h3 className="text-sm font-bold text-[#e1e2e8] uppercase">No Notifications in this Category</h3>
            <p className="text-xs text-[#999080] mt-1">All vault operations and order events are currently nominal.</p>
          </div>
        ) : (
          filteredNotifs.map(notif => {
            const isHigh = notif.severity === 'high';
            return (
              <div
                key={notif.id}
                className={`p-4 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !notif.read 
                    ? isHigh
                      ? 'bg-[#93000a]/10 border-[#93000a]/50 text-[#ffdad6]' 
                      : 'bg-[#191c20] border-[#e5c378]/50 text-[#e1e2e8]'
                    : 'bg-[#111418] border-[#4d4639]/30 text-[#999080]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 mt-0.5 border ${
                    isHigh 
                      ? 'bg-[#93000a]/20 border-[#93000a] text-[#ffdad6]' 
                      : notif.category === 'orders' 
                        ? 'bg-[#e5c378]/10 border-[#e5c378]/40 text-[#ffe09d]' 
                        : 'bg-[#191c20] border-[#4d4639] text-[#999080]'
                  }`}>
                    {notif.category === 'inventory' ? (
                      <Boxes className="w-5 h-5" />
                    ) : notif.category === 'orders' ? (
                      <ShoppingBag className="w-5 h-5" />
                    ) : (
                      <ShieldAlert className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono-data font-bold uppercase px-1.5 py-0.5 ${
                        isHigh ? 'bg-[#93000a] text-white' : 'bg-[#191c20] text-[#ffe09d] border border-[#e5c378]/30'
                      }`}>
                        {notif.category}
                      </span>
                      <span className="text-[11px] font-mono-data text-[#999080]">
                        {notif.timestamp}
                      </span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#ffe09d] animate-pulse" />
                      )}
                    </div>

                    <h4 className={`font-syne text-sm font-bold uppercase mt-1 ${!notif.read ? 'text-[#ffe09d]' : 'text-[#e1e2e8]'}`}>
                      {notif.title}
                    </h4>
                    <p className="text-xs font-mono-data mt-1 leading-relaxed max-w-2xl text-[#d0c5b4]">
                      {notif.message}
                    </p>
                  </div>
                </div>

                {/* Notification Item Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {notif.action_label && (
                    <button
                      onClick={() => {
                        if (notif.category === 'inventory') setAdminView('inventory-list');
                        else if (notif.category === 'orders') setAdminView('purchases-orders');
                        else setAdminView('dashboard');
                      }}
                      className="px-2.5 py-1.5 bg-[#191c20] hover:bg-[#272a2e] border border-[#e5c378]/40 text-[#ffe09d] text-xs font-mono-data uppercase transition-all"
                    >
                      {notif.action_label}
                    </button>
                  )}

                  {!notif.read && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      className="p-1.5 hover:bg-[#272a2e] text-[#999080] hover:text-[#ffe09d] transition-all"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-1.5 hover:bg-[#93000a]/20 text-[#999080] hover:text-[#ffdad6] transition-all"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Broadcast Alert Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111418] border border-[#e5c378]/40 p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-[#999080] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-syne text-lg font-bold uppercase text-[#ffe09d] mb-4">
              Broadcast Operational Alert
            </h3>

            <form onSubmit={handleCreateNotification} className="space-y-4 font-mono-data text-xs">
              <div>
                <label className="block text-[#999080] uppercase mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Critical Stock Depletion in Vault B"
                  className="w-full h-10 px-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#999080] uppercase mb-1">Message Details</label>
                <textarea
                  required
                  rows={3}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Detail the inventory or order event requiring attention..."
                  className="w-full p-3 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:border-[#ffe09d] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#999080] uppercase mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full h-10 px-2 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none"
                  >
                    <option value="inventory">Inventory</option>
                    <option value="orders">Orders</option>
                    <option value="security">Security</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#999080] uppercase mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={e => setNewSeverity(e.target.value as any)}
                    className="w-full h-10 px-2 bg-[#191c20] border border-[#4d4639] text-[#e1e2e8] focus:outline-none"
                  >
                    <option value="high">High (Audible Siren)</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low (Info)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#191c20] text-[#999080] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#8A6D2F] hover:bg-[#C8A96B] text-white font-syne uppercase font-bold"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear All Notifications Confirm Modal */}
      <ConfirmModal
        isOpen={isClearAllOpen}
        title="Clear All System Notifications"
        message="Are you sure you want to dismiss all telemetry alerts, inventory alerts, and security logs? This action cannot be reversed."
        confirmLabel="Clear All Notifications"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isClearing}
        onConfirm={handleConfirmClearAll}
        onCancel={() => setIsClearAllOpen(false)}
      />
    </div>
  );
}
