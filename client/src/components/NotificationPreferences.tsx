import { useState } from "react";
import { Bell, Mail, MessageSquare, Loader2, Check } from "lucide-react";

interface NotificationSettings {
  emailOrderUpdates: boolean;
  emailNewProducts: boolean;
  emailPromotions: boolean;
  smsSmsOrderUpdates: boolean;
  pushNotifications: boolean;
}

interface NotificationPreferencesProps {
  onSave?: (settings: NotificationSettings) => Promise<void>;
}

export function NotificationPreferences({ onSave }: NotificationPreferencesProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailOrderUpdates: true,
    emailNewProducts: false,
    emailPromotions: false,
    smsSmsOrderUpdates: true,
    pushNotifications: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(settings);
      } else {
        // Mock save
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const preferences = [
    {
      id: "emailOrderUpdates",
      label: "Order Updates",
      description: "Get notified about order status changes",
      icon: Mail,
      category: "Email",
    },
    {
      id: "emailNewProducts",
      label: "New Products",
      description: "Be the first to know about new parts and products",
      icon: Bell,
      category: "Email",
    },
    {
      id: "emailPromotions",
      label: "Promotions & Offers",
      description: "Receive exclusive deals and promotional offers",
      icon: Mail,
      category: "Email",
    },
    {
      id: "smsSmsOrderUpdates",
      label: "SMS Order Updates",
      description: "Get SMS notifications for order status changes",
      icon: MessageSquare,
      category: "SMS",
    },
    {
      id: "pushNotifications",
      label: "Push Notifications",
      description: "Receive browser notifications for important updates",
      icon: Bell,
      category: "Push",
    },
  ];

  const categories = ["Email", "SMS", "Push"];

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category}>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">
            {category} Notifications
          </h3>
          <div className="space-y-3">
            {preferences
              .filter((pref) => pref.category === category)
              .map((pref) => {
                const Icon = pref.icon;
                const key = pref.id as keyof NotificationSettings;
                const isEnabled = settings[key];

                return (
                  <div
                    key={pref.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="text-gray-400" size={20} />
                      <div>
                        <p className="font-semibold text-gray-900">{pref.label}</p>
                        <p className="text-xs text-gray-600">{pref.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle(key)}
                      className={`relative w-12 h-7 rounded-full transition-colors ${
                        isEnabled ? "bg-[#E42933]" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                          isEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {/* Save Button */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check size={18} />
              Saved
            </>
          ) : (
            "Save Preferences"
          )}
        </button>
      </div>
    </div>
  );
}
