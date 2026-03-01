export enum BoardMode {
    Admin,
    Player,
    Spectator,
}

export interface NoteCounts {
    tap?: number;
    hold?: number;
    slide?: number;
    touch?: number;
    break?: number;
    total?: number;
}

export interface Sheet {
    type: string;
    difficulty: string;
    level: string;
    levelValue: number;
    internalLevel?: string | null;
    internalLevelValue: number;
    noteDesigner: string;
    noteCounts: NoteCounts;
    regions: {
        jp: boolean;
        intl: boolean;
        cn: boolean;
    };
    isSpecial: boolean;
    version: string;
}

export interface Song {
    songId: string;
    category: string;
    title: string;
    artist: string;
    bpm: number;
    imageName: string;
    version: string;
    theme: string;
    releaseDate: string;
    isNew: boolean;
    isLocked: boolean;
    comment?: string | null;
    sheets: Sheet[];
}

export enum PhaseOrder {
    Waiting,
    Revealing,
    RPS,
    Protecting,
    Banning,
    Picking,
    Finished,
}

export type PlayerSide = "player1" | "player2" | null;

export type PresetType =
    | "random"
    | "tests"
    | "top_16"
    | "top_8"
    | "quarter_finals"
    | "semi_finals"
    | "finals";

export interface GameState {
    phase: PhaseOrder;
    songs: Song[];
    revealedSongs: string[];
    bannedSongs: string[];
    pickedSongs: string[];
    protectedSong: string | null;
    protectedBy: PlayerSide;
    rpsWinner: PlayerSide;
    activePlayer: string | null;
    preset: PresetType;
    revealPermission: RevealPermission;
}

export enum ActionType {
    START_GAME,
    REVEAL_SONG,
    SET_RPS_WINNER,
    PROTECT_SONG,
    BAN_SONG,
    PICK_SONG,
    RESET,
    SET_PRESET,
    SET_REVEAL_PERMISSION,
}

export interface GameAction {
    type: ActionType;
    payload?: {
        songId?: string;
        playerId?: string;
        winner?: PlayerSide;
        preset?: PresetType;
        permission?: RevealPermission
    };
}

export enum RevealPermission {
    Admin,
    Player
}

export type SocketEvent =
    | "connect"
    | "disconnect"
    | "game_state_update"
    | "game_action";
