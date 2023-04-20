
export type TransportFunctionProps = {
    msg: string;
    rawMsg: string[];
    level: {
        severity: number;
        text: string;
    };
    extension?: string | null;
}


export type Logger = {
    /**
     * Disable an extension
     *
     * @param extension name of an extension to be disabled
     */
    disable: (extension: string) => boolean;

    /**
     * Enable an extension
     *
     * @param extension name of an extension to be enabled
     */
    enable: (extension: string) => boolean;

    /**
     * Extend logger with a new extension
     *
     * @param extension name of an extension to be added to logger
     */
    extend: (extension: string) => (...msgs: unknown[]) => boolean | unknown;

    /**
     * Return all created extensions
     */
    getExtensions: () => string[];

    /**
     * Get current log severity API
     */
    getSeverity: () => string;

    /**
     * Set log severity API
     */
    setSeverity: (level: string) => string;

    /**
     * Log @param message as debug message
     */
    debug: (message: string) => void;

    /**
     * Log @param message as info message
     */
    info: (message: string) => void;

    /**
     * Log @param message as warn message
     */
    warn: (message: string) => void;

    /**
     * Log @param message as error message
     */
    error: (message: string) => void;
}