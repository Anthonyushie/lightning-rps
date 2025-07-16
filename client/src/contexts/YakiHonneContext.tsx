import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import SWHandler from 'smart-widget-handler';

interface NostrUser {
  pubkey: string;
  display_name?: string;
  name?: string;
  picture?: string;
  banner?: string;
  nip05?: string;
  lud16?: string;
  lud06?: string;
  website?: string;
}

interface YakiHonneContextType {
  user: NostrUser | null;
  isReady: boolean;
  signEvent: (eventDraft: any) => void;
  publishEvent: (eventDraft: any) => void;
  sendCustomData: (data: any) => void;
}

const YakiHonneContext = createContext<YakiHonneContextType | undefined>(undefined);

export const useYakiHonne = () => {
  const context = useContext(YakiHonneContext);
  if (!context) {
    throw new Error('useYakiHonne must be used within a YakiHonneProvider');
  }
  return context;
};

interface YakiHonneProviderProps {
  children: ReactNode;
}

export const YakiHonneProvider: React.FC<YakiHonneProviderProps> = ({ children }) => {
  const [user, setUser] = useState<NostrUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Notify parent that widget is ready
    SWHandler.client.ready();

    // Listen for messages from the YakiHonne parent
    const listener = SWHandler.client.listen((data) => {
      console.log('Received message from YakiHonne:', data);

      if (data.kind === 'user-metadata') {
        setUser(data.data.user);
        setIsReady(true);
      } else if (data.kind === 'nostr-event') {
        // Handle signed/published events
        if (data.data.status === 'success') {
          console.log('Event successfully processed:', data.data.event);
        } else if (data.data.status === 'error') {
          console.error('Event processing failed:', data.data.error);
        }
      }
    });

    return () => listener.close();
  }, []);

  const signEvent = (eventDraft: any) => {
    if (!isReady) {
      console.warn('YakiHonne not ready, cannot sign event');
      return;
    }

    SWHandler.client.requestEventSign(
      eventDraft,
      window.location.ancestorOrigins?.[0] || '*'
    );
  };

  const publishEvent = (eventDraft: any) => {
    if (!isReady) {
      console.warn('YakiHonne not ready, cannot publish event');
      return;
    }

    SWHandler.client.requestEventPublish(
      eventDraft,
      window.location.ancestorOrigins?.[0] || '*'
    );
  };

  const sendCustomData = (data: any) => {
    if (!isReady) {
      console.warn('YakiHonne not ready, cannot send custom data');
      return;
    }

    SWHandler.client.sendContext(
      JSON.stringify(data),
      window.location.ancestorOrigins?.[0] || '*'
    );
  };

  const value: YakiHonneContextType = {
    user,
    isReady,
    signEvent,
    publishEvent,
    sendCustomData
  };

  return (
    <YakiHonneContext.Provider value={value}>
      {children}
    </YakiHonneContext.Provider>
  );
};