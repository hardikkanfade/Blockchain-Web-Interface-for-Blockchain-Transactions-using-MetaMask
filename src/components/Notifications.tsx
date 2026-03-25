import React, { useEffect, useRef } from 'react';
import { NotificationState } from '../types';

interface NotificationsProps {
    notification: NotificationState;
    onDismiss: () => void;
}

const ICONS: Record<string, string> = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
};

const TYPE_STYLES: Record<string, string> = {
    success: 'notif-success',
    error: 'notif-error',
    info: 'notif-info',
    warning: 'notif-warning',
};

const Notifications: React.FC<NotificationsProps> = ({ notification, onDismiss }) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (notification.visible) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(onDismiss, 4500);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [notification.visible, notification.id, onDismiss]);

    if (!notification.visible) return null;

    return (
        <div
            id="notification-toast"
            className={`notification-toast ${TYPE_STYLES[notification.type]} animate-slide-up`}
            role="alert"
        >
            <span className="text-lg">{ICONS[notification.type]}</span>
            <span className="flex-1 text-sm">{notification.message}</span>
            <button onClick={onDismiss} className="notif-close-btn">✕</button>
        </div>
    );
};

export default Notifications;
