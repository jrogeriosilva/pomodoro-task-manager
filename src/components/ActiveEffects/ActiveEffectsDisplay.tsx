import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { useApp } from '../../context/AppContext';

export const ActiveEffectsDisplay: React.FC = () => {
  const { inventory, storeItems } = useApp();

  if (inventory.activeEffects.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        Active Effects:
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {inventory.activeEffects.map((effect: any, index: number) => {
          const item = storeItems.find((i: any) => i.id === effect.itemId);
          return (
            <Chip
              key={index}
              size="small"
              label={`${item?.icon} ${item?.name} (${effect.remainingUses} left)`}
              color="secondary"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          );
        })}
      </Box>
    </Box>
  );
};