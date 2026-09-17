import { HeadcountExceededError, AlreadyScannedError } from '../errors/DomainError';

export class Headcount {
  public readonly maxGuests: number;
  public readonly scannedCount: number;

  constructor(maxGuests: number, scannedCount: number = 0) {
    this.maxGuests = Math.max(1, maxGuests);
    this.scannedCount = Math.max(0, scannedCount);
  }

  public get remainingAllowance(): number {
    return Math.max(0, this.maxGuests - this.scannedCount);
  }

  public get isFullyScanned(): boolean {
    return this.scannedCount >= this.maxGuests;
  }

  /**
   * Validates partial check-in and returns updated headcount or throws domain error.
   */
  public evaluateAdmit(requestedCount?: number): { newScannedCount: number; admittedCount: number } {
    if (this.isFullyScanned) {
      throw new AlreadyScannedError();
    }

    const requested = requestedCount !== undefined && requestedCount > 0 ? requestedCount : this.maxGuests;
    
    if (requested > this.maxGuests) {
      throw new HeadcountExceededError(this.maxGuests, requested);
    }

    const availableToAdmit = this.remainingAllowance;
    if (availableToAdmit <= 0) {
      throw new AlreadyScannedError();
    }

    const actualAdmit = Math.min(requested, availableToAdmit);
    const newScannedCount = this.scannedCount + actualAdmit;

    return {
      newScannedCount,
      admittedCount: actualAdmit,
    };
  }
}
