

export interface IsCameraActive {
    hasPermission: boolean | undefined;
    isForeground: boolean;
    isFocused: boolean;
}


export function useIsCameraActive(attributes: IsCameraActive): boolean {
    return (attributes.hasPermission === true)
        && attributes.isForeground
        && attributes.isFocused
}
