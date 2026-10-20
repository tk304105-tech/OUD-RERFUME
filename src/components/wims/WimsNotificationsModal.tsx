import React from 'react';
import { Bell, X, Check, Trash2, AlertTriangle, AlertOctagon, CheckCheck, Boxes } from 'lucide-react';
import { WimsNotification, wimsDb, WimsProduct } from '../../services/supabase';

interface WimsNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: WimsNotification[];
  onRefreshNotifs: () => void;
  onSelectProductById: (productId: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export function WimsNotificationsModal({
  isOpen,
  onClose,
  notifications,
  onRefreshNotifs,
  onSelectProductById,
  showToast
}: WimsNotificationsModalProps) {
  if (!isOpen) return null;

  const handleMarkRead = (id: string) => {
    wimsDb.markNotificationRead(id);
    onRefreshNotifs();
  };

  const handleClearAll = () => {
    wimsDb.clearAllNotifications();
    onRefreshNotifs();
    showToast('All notifications cleared.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#FFFFFF] border border-[#E8E0D4] rounded-lg shadow-xl p-6 space-y-4 font-mono-data text-xs text-[#111111]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D4]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#8A6D2F]" />
            <h3 className="font-serif-luxury text-base font-bold text-[#111111] uppercase">
              Inventory Notifications & Depletion Alerts ({notifications.filter(n => !n.is_read).length} Unread)
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#6B6B6B] hover:text-[#111111]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clear All & Mark All */}
        <div className="flex items-center justify-between text-[11px] text-[#6B6B6B]">
          <span>Triggered automatically by atomic stock calculations</span>
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-[#B33939] hover:underline flex items-center gap-1 font-bold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1">
          {notifications.length === 0 ? (
            <div className="py-10 text-center text-[#6B6B6B]">
              <Check className="w-7 h-7 mx-auto mb-2 text-[#2E7D32]" />
              <div className="font-serif-luxury text-sm font-bold text-[#111111]">No notifications currently pending.</div>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-3 rounded border transition-all ${
                  notif.is_read 
                    ? 'bg-[#F8F5EF]/60 border-[#E8E0D4] opacity-70' 
                    : 'bg-[#FFF9F0] border-[#C8A96B]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    {notif.type === 'OUT_OF_STOCK' ? (
                      <AlertOctagon className="w-4 h-4 text-[#B33939] flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#F57F17] flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold text-[#111111]">{notif.title}</div>
                      <div className="text-[11px] text-[#333333] mt-0.5 leading-relaxed font-mono-data">
                        {notif.message}
                      </div>
                      <div className="text-[10px] text-[#6B6B6B] mt-1">
                        {new Date(notif.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {notif.product_id && (
                      <button
                        onClick={() => {
                          onSelectProductById(notif.product_id!);
                          onClose();
                        }}
                        className="px-2 py-1 bg-[#111111] text-[#FFE09D] rounded text-[10px] font-bold hover:bg-[#8A6D2F]"
                        title="Inspect Product"
                      >
                        Inspect
                      </button>
                    )}
                    {!notif.is_read && (
                      <button
                        onClick={() => handleMarkRead(notif.id)}
                        className="p-1 bg-[#F8F5EF] hover:bg-[#E8E0D4] text-[#111111] rounded border border-[#E8E0D4]"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#E8E0D4] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#111111] text-[#FFE09D] hover:bg-[#8A6D2F] rounded text-xs font-syne font-bold uppercase tracking-wider"
          >
            Close Feed
          </button>
        </div>
      </div>
    </div>
  );
}
