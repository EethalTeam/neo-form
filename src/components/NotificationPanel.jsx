import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotificationPanel = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('/mockdata/notifications.json')
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error('Error loading notifications:', err));
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="text-red-500" size={16} />;
      case 'session':
        return <Calendar className="text-blue-500" size={16} />;
      case 'review':
        return <CheckCircle className="text-green-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border z-50"
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 border-b hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start space-x-3">
              {getNotificationIcon(notification.type)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {notification.title}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {notification.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" size="sm">
          View All Notifications
        </Button>
      </div>
    </motion.div>
  );
};

export default NotificationPanel;