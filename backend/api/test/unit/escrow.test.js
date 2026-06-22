/**
 * Unit tests for backend/api/src/services/escrow.js
 *
 * Coverage:
 *   - getEscrowBookingId: output shape, determinism, prefix, uniqueness
 *   - buildDepositTx: graceful fallback when contract is unconfigured,
 *     invalid address validation, invalid amount validation
 *
 * Run with:  npm test -- test/unit/escrow.test.js
 */
import { describe, it, expect } from 'vitest';
import { getEscrowBookingId, buildDepositTx, ESCROW_MATIC_PER_PAISA } from '../../src/services/escrow.js';

describe('escrow service — getEscrowBookingId', () => {
  it('returns a hex string prefixed with 0x', () => {
    const result = getEscrowBookingId('#FF20260521');
    expect(typeof result).toBe('string');
    expect(result.startsWith('0x')).toBe(true);
  });

  it('returns a 66-character hex string (bytes32)', () => {
    const result = getEscrowBookingId('#FF20260521');
    expect(result.length).toBe(66);
    expect(/^0x[0-9a-f]{64}$/.test(result)).toBe(true);
  });

  it('is deterministic for the same input', () => {
    const id = '#FF20260521';
    const first = getEscrowBookingId(id);
    const second = getEscrowBookingId(id);
    expect(first).toBe(second);
  });

  it('produces different outputs for different inputs', () => {
    const id1 = '#FF20260521';
    const id2 = '#FF20260522';
    expect(getEscrowBookingId(id1)).not.toBe(getEscrowBookingId(id2));
  });

  it('ESCROW_MATIC_PER_PAISA defaults to 0.01 when env var is absent', () => {
    expect(ESCROW_MATIC_PER_PAISA).toBe(0.01);
  });
});

describe('escrow service — buildDepositTx (contract unconfigured)', () => {
  // escrowContract is null when POLYGON_RPC_URL / ESCROW_CONTRACT_ADDRESS /
  // RELAYER_WALLET_PRIVATE_KEY are not set (CI / dev environments).
  // In that state buildDepositTx must return { txData: null, bookingId }.

  it('returns txData: null when escrowContract is not initialised', async () => {
    const { txData, bookingId } = await buildDepositTx(
      '#FF20260521',
      '0x0000000000000000000000000000000000000001',
      '0x0000000000000000000000000000000000000002',
      '1000000000000000000'
    );
    expect(txData).toBeNull();
    expect(typeof bookingId).toBe('string');
    expect(bookingId.startsWith('0x')).toBe(true);
  });

  it('returns txData: null and a valid bookingId for an invalid customer wallet address', async () => {
    const { txData, bookingId } = await buildDepositTx(
      '#FF20260522',
      'not-an-address',
      '0x0000000000000000000000000000000000000002',
      '1000000000000000000'
    );
    expect(txData).toBeNull();
    expect(typeof bookingId).toBe('string');
    expect(bookingId.startsWith('0x')).toBe(true);
  });

  it('returns txData: null for an invalid driver wallet address', async () => {
    const { txData, bookingId } = await buildDepositTx(
      '#FF20260523',
      '0x0000000000000000000000000000000000000001',
      'invalid-driver',
      '1000000000000000000'
    );
    expect(txData).toBeNull();
    expect(typeof bookingId).toBe('string');
    expect(bookingId.startsWith('0x')).toBe(true);
  });

  it('returns txData: null when amountWei is zero', async () => {
    const { txData, bookingId } = await buildDepositTx(
      '#FF20260524',
      '0x0000000000000000000000000000000000000001',
      '0x0000000000000000000000000000000000000002',
      '0'
    );
    expect(txData).toBeNull();
    expect(typeof bookingId).toBe('string');
    expect(bookingId.startsWith('0x')).toBe(true);
  });

  it('returns txData: null when amountWei is falsy', async () => {
    const { txData, bookingId } = await buildDepositTx(
      '#FF20260525',
      '0x0000000000000000000000000000000000000001',
      '0x0000000000000000000000000000000000000002',
      null
    );
    expect(txData).toBeNull();
    expect(typeof bookingId).toBe('string');
    expect(bookingId.startsWith('0x')).toBe(true);
  });

  it('returns txData: null when amountWei is negative (BigInt)', async () => {
    const { txData, bookingId } = await buildDepositTx(
      '#FF20260526',
      '0x0000000000000000000000000000000000000001',
      '0x0000000000000000000000000000000000000002',
      '-1000000000000000000'
    );
    expect(txData).toBeNull();
    expect(typeof bookingId).toBe('string');
    expect(bookingId.startsWith('0x')).toBe(true);
  });
});
