/**
 * Filename:    repository.ts  [ src/services ]
 * Description: Generic read-repository abstraction for domain data sources.
 * Purpose:     Give the Zustand stores an interface to depend on (SOLID / DIP)
 *              instead of importing seed modules directly, so a live market /
 *              news / audit feed can replace the static seed later without
 *              touching store logic. v1 backing is StaticRepository (in-memory
 *              seed); a LiveRepository can implement the same contract later.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

/**
 * Read-only repository contract every domain data source implements.
 *
 * Stores depend on this interface, never on a concrete data module, so the
 * backing source is swappable (static seed today, live feed tomorrow).
 *
 * @typeParam T - the domain entity list element type.
 */
export interface Repository<T> {
  /**
   * Return every entity the source currently holds, synchronously.
   *
   * For a static seed this is the seed; for a live source it is the last known
   * snapshot (seed until the first successful fetch). Always a defensive copy.
   *
   * @returns A defensive copy so callers cannot mutate the backing store.
   */
  getAll(): T[];

  /**
   * Fetch the freshest entities, awaiting a live source when one exists.
   *
   * Live repositories perform the network call here and MUST degrade
   * gracefully — on any failure they return the last known snapshot (seed)
   * rather than throwing, so a backend outage never breaks a screen. The
   * static repository simply resolves {@link getAll}. Optional so existing
   * synchronous callers keep working unchanged.
   *
   * @returns A promise of a defensive copy of the freshest entities.
   */
  getAllAsync?(): Promise<T[]>;
}

/**
 * In-memory repository backed by a static seed array.
 *
 * Used for v1 while screens render synthetic seed data. Returns a shallow copy
 * on every read so store state never aliases the module-level seed constant.
 *
 * @typeParam T - the domain entity list element type.
 */
export class StaticRepository<T> implements Repository<T> {
  private readonly seed: readonly T[];

  /**
   * @param seed - the immutable seed array to serve reads from.
   */
  constructor(seed: readonly T[]) {
    this.seed = seed;
  }

  /** @inheritDoc */
  getAll(): T[] {
    return [...this.seed];
  }
}
