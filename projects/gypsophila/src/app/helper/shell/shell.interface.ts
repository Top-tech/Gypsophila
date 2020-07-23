export interface Tangerine {
    /**
     * In Shell environment, (Only UWP for now), exit the whole app.
     */
    exit(): void;
}

export interface WindowWithExtension extends Window {
    TangerineClient: Tangerine;
};
