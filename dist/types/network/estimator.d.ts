/**
 * Simple and fast stats: mean, S2, stdev (estimated standard deviation).
 * Parsec uses it for clock synchronization which is often used in its
 * application protocols.
 *
 * It uses effective estimation algorithms that do not store the whole series
 * so could be same effective used with tiny arrays and large streams of samples.
 */
export declare class Estimator {
    #private;
    constructor();
    /**
     * Current number of samples
     */
    get count(): number;
    /**
     * current mean value
     */
    get mean(): number;
    /**
     * Current Sample Variance estimation, e.g. 𝛔²(n-1)
     */
    get s2(): number;
    /**
     * Estimated standard deviation, √𝛔² (square root of sample variance estimation)
     */
    get stdev(): number;
    /**
     * Add next sample to series.
     *
     * @param x value to add.
     */
    addSample(x: number): void;
    /**
     * clear current series so it can restart calulation
     */
    clear(): void;
    toString(): string;
}
//# sourceMappingURL=estimator.d.ts.map