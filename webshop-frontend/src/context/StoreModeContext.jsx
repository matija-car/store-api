import { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/axios';

const StoreModeContext = createContext({ mode: 'STORE', loading: true, setMode: () => {} });

export function StoreModeProvider({ children }) {
    const [mode, setMode] = useState('STORE');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        API.get('/store-settings')
            .then((response) => {
                if (mounted && (response.data?.mode === 'CATALOG' || response.data?.mode === 'STORE')) {
                    setMode(response.data.mode);
                }
            })
            .catch(() => {
                // Keep STORE as the safe compatibility default if settings are unavailable.
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => {
            mounted = false;
        };
    }, []);

    return <StoreModeContext.Provider value={{ mode, loading, setMode }}>{children}</StoreModeContext.Provider>;
}

export const useStoreMode = () => useContext(StoreModeContext);
