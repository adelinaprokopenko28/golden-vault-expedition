import fs from 'fs';
import path from 'path';
import * as config from '../src/constants/config';

const SRC = path.join(__dirname, '..', 'src');

function walk(dir: string): string[] {
  return fs.readdirSync(dir).reduce((acc: string[], entry) => {
    const full = path.join(dir, entry);
    return fs.statSync(full).isDirectory()
      ? acc.concat(walk(full))
      : acc.concat(/\.(ts|tsx)$/.test(entry) ? [full] : []);
  }, []);
}

describe('18+ fictional, no gambling', () => {
  it('exposes no bet, stake, wager, payout or purchase field', () => {
    const keys = Object.keys(config).join(' ').toLowerCase();
    ['bet', 'stake', 'wager', 'payout', 'rtp', 'jackpot', 'purchase', 'coin'].forEach(word => {
      expect(keys).not.toContain(word);
    });
  });

  it('carries the disclaimer the brief asks for', () => {
    expect(config.DISCLAIMER_SHORT).toContain('18+');
    expect(config.DISCLAIMER_SHORT).toContain('NO REAL MONEY');
    expect(config.DISCLAIMER_LONG).toContain('NO BETTING');
  });

  it('never mentions a real-money or casino mechanic in the source', () => {
    const banned = /\b(placeBet|wager|realMoney|inAppPurchase|billing|paywall)\b/;
    walk(SRC).forEach(file => {
      expect(fs.readFileSync(file, 'utf8')).not.toMatch(banned);
    });
  });

  it('uses no tofu-prone glyph in any user-visible string', () => {
    const banned = /[\u2039\u203A\u25B8\u25B6\u25BE\u25B4\u2192\u2190\u21D2\u27F6\u27F5]/;
    walk(SRC).forEach(file => {
      expect(fs.readFileSync(file, 'utf8')).not.toMatch(banned);
    });
  });

  it('holds the splash for the full eight seconds', () => {
    expect(config.LOADER_DURATION_MS).toBe(8000);
  });
});
