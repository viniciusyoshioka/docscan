/* eslint-disable @typescript-eslint/no-explicit-any */


export type transportFunctionProps = {
    msg: string;
    rawMsg: Array<string>;
    level: {
        severity: number;
        text: string;
    };
    extension?: string | null;
}


export type Logger = {
    /**
     * Disable an extension
     */
    disable: (extension: string) => boolean;

    /**
     * Enable an extension
     */
    enable: (extension: string) => boolean;

    /**
     * Extend logger with a new extension
     */
    extend: (extension: string) => (...msgs: any[]) => boolean | any;

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
