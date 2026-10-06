/**
 * Filename:    repository.test.ts  [ src/services/__tests__ ]
 * Description: Unit tests for StaticRepository + the wired domain repositories.
 * Purpose:     Prove getAll() returns the seed and a DEFENSIVE COPY (mutating
 *              the result cannot corrupt the seed), and that each domain repo
 *              is wired to non-empty seed data.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { StaticRepository } from '@/services/repository';
import {
  governanceRepository,
  newsHeadlineRepository,
  scannerRepository,
  strategyRepository,
} from '@/services/dataRepositories';

describe('StaticRepository', () => {
  it('returns the seed contents', () => {
    const repo = new StaticRepository([1, 2, 3]);
    expect(repo.getAll()).toEqual([1, 2, 3]);
  });

  it('returns a defensive copy that cannot mutate the seed', () => {
    const repo = new StaticRepository([1, 2, 3]);
    repo.getAll().push(4);
    expect(repo.getAll()).toEqual([1, 2, 3]);
  });
});

describe('domain repositories', () => {
  it('are each wired to non-empty seed data', () => {
    expect(scannerRepository.getAll().length).toBeGreaterThan(0);
    expect(strategyRepository.getAll().length).toBeGreaterThan(0);
    expect(newsHeadlineRepository.getAll().length).toBeGreaterThan(0);
    expect(governanceRepository.getAll().length).toBeGreaterThan(0);
  });
});
