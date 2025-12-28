'use client';

import React from 'react';
import { BeerDeposit, Receipt as ReceiptType } from './types';

interface POSStore {
  // ... existing fields ...
  beerDeposits: BeerDeposit[];
  history: ReceiptType[];
  
  addBeerDeposit: (deposit: Omit<BeerDeposit, 'id' | 'depositedAt'>) => void;
  addToHistory: (receipt: ReceiptType) => void;
}

// I will update the existing store.ts instead of creating a new one
