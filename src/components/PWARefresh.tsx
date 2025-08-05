import type React from 'react';
import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Chip } from '@mui/material';
import { Refresh, Update, CloudSync } from '@mui/icons-material';
import { dataService } from '../services/enhancedDataService';

interface PWARefreshProps {
  onRefresh?: () => void;
}

export const PWARefresh: React.FC<PWARefreshProps> = ({ onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<{ version: string; timestamp: number | null }>({
    version: '',
    timestamp: null,
  });

  useEffect(() => {
    // Get initial cache info
    setCacheInfo(dataService.getCacheInfo());

    // Check for PWA updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowUpdateDialog(true);
      });
    }
  }, []);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      // Clear data cache and refresh
      await dataService.refreshData();
      
      // Also clear service worker cache if available
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          if (event.data.type === 'DATA_CACHE_CLEARED') {
            // Cache cleared successfully
          }
        };
        navigator.serviceWorker.controller.postMessage(
          { type: 'REFRESH_DATA' },
          [messageChannel.port2]
        );
      }
      
      // Update cache info
      setCacheInfo(dataService.getCacheInfo());
      
      // Trigger app refresh if callback provided
      onRefresh?.();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUpdateApp = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
    setShowUpdateDialog(false);
  };

  const formatCacheDate = (timestamp: number | null) => {
    if (!timestamp) return 'Nincs gyorsítótár';
    return new Intl.DateTimeFormat('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CloudSync color="primary" />
          <Typography variant="h6">Adatok frissítése</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="textSecondary">
              Verzió:
            </Typography>
            <Chip label={cacheInfo.version} size="small" color="primary" />
          </Box>
          <Typography variant="body2" color="textSecondary">
            Utolsó frissítés: {formatCacheDate(cacheInfo.timestamp)}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefreshData}
          disabled={isRefreshing}
          fullWidth
        >
          {isRefreshing ? 'Frissítés...' : 'Adatok frissítése'}
        </Button>
        
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
          Ez frissíti a program és előadó információkat a legújabb verzióra.
        </Typography>
      </Box>

      <Dialog open={showUpdateDialog} onClose={() => setShowUpdateDialog(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Update color="primary" />
          Új verzió elérhető
        </DialogTitle>
        <DialogContent>
          <Typography>
            Új verzió érhető el az alkalmazásból. Szeretnéd most frissíteni?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateDialog(false)}>
            Később
          </Button>
          <Button onClick={handleUpdateApp} variant="contained" autoFocus>
            Frissítés most
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};