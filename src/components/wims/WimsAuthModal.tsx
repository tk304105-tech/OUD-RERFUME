import React from 'react';
import { WimsUser } from '../../services/supabase';

interface WimsAuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: (user: WimsUser) => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export function WimsAuthModal(_props: WimsAuthModalProps) {
  return null;
}
