import { Server, Socket } from "socket.io";
import {
    GameState,
    GameAction,
    Song,
    ActionType,
    PresetType,
    PhaseOrder,
    SocketEvent,
    RevealPermission,
} from "../../lib/types";
import fullData from "../data/maimai_song.json";
import top16Data from "../data/presets/top_16.json";
import top8Data from "../data/presets/top_8.json";
import qfData from "../data/presets/quarter_finals.json";
import sfData from "../data/presets/semi_finals.json";
import finalsData from "../data/presets/finals.json";
import testData from "../data/pool_test.json";

export class GameManager {
    private io: Server;
    private state: GameState;
    private allSongs: Song[];

    constructor(io: Server) {
        this.io = io;
        this.allSongs = (fullData as unknown as { songs: Song[] }).songs;
        this.state = {
            phase: PhaseOrder.Waiting,
            songs: this.getRandomSongs(8),
            revealedSongs: [],
            bannedSongs: [],
            pickedSongs: [],
            protectedSong: null,
            protectedBy: null,
            rpsWinner: null,
            activePlayer: null,
            preset: "random",
            revealPermission: RevealPermission.Admin,
        };
    }

    private getRandomSongs(count: number): Song[] {
        const shuffled = [...this.allSongs].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    private getSongsForTheme(theme: string): Song[] {
        const allTestSongs = (testData as unknown as { songs: Song[] }).songs;
        const filteredSongs = allTestSongs.filter((song: any) => song.theme === theme);
        
        const shuffled = [...filteredSongs].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 8);
    }

    private getSongsForPreset(preset: PresetType): Song[] {
        let pool: Song[] = [];
        switch (preset) {
            case "tests": {
                pool = this.getSongsForTheme("Metropolis");
                break;
            }
            case "top_16":
                pool = top16Data.songs as unknown as Song[];
                break;
            case "top_8":
                pool = top8Data.songs as unknown as Song[];
                break;
            case "quarter_finals":
                pool = qfData.songs as unknown as Song[];
                break;
            case "semi_finals":
                pool = sfData.songs as unknown as Song[];
                break;
            case "finals":
                pool = finalsData.songs as unknown as Song[];
                break;
            case "random":
            default:
                return this.getRandomSongs(8);
        }

        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 8);
    }

    public handleConnection(socket: Socket) {
        // initial send
        socket.emit<SocketEvent>("game_state_update", this.state);

        socket.on<SocketEvent>("game_action", (action: GameAction) => {
            this.processAction(socket, action);
            this.io.emit<SocketEvent>("game_state_update", this.state);
        });

        socket.on<SocketEvent>("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    }

    private processAction(socket: Socket, action: GameAction) {
        switch (action.type) {
            case ActionType.START_GAME:
                this.state.phase = PhaseOrder.RPS;
                this.state.revealedSongs = [];
                break;
            case ActionType.REVEAL_SONG:
                if (this.state.phase !== PhaseOrder.Revealing) return;
                if (action.payload?.songId) {
                    const songId = action.payload.songId;
                    if (!this.state.revealedSongs.includes(songId)) {
                        // Check permission
                        const allowed = (this.state.revealPermission === RevealPermission.Admin && socket.data.role === "admin") ||
                                        (this.state.revealPermission === RevealPermission.Player && socket.data.role === "player");

                        if (!allowed) return;

                        this.state.revealedSongs.push(songId);
                        // Move to banning phase if all songs are revealed (except protected one)
                        if (
                            this.state.revealedSongs.length >=
                            this.state.songs.length - (this.state.protectedSong ? 1 : 0)
                        ) {
                            this.state.phase = PhaseOrder.Banning;
                        }
                    }
                }
                break;
            case ActionType.SET_PRESET:
                if (action.payload?.preset) {
                    this.state.preset = action.payload.preset;
                    this.state.songs = this.getSongsForPreset(
                        this.state.preset
                    );
                    // fresh start for preset change
                    this.state.phase = PhaseOrder.Waiting;
                    this.state.revealedSongs = [];
                    this.state.bannedSongs = [];
                    this.state.pickedSongs = [];
                    this.state.protectedSong = null;
                    this.state.protectedBy = null;
                    this.state.rpsWinner = null;
                    this.state.activePlayer = null;
                }
                break;
            case ActionType.SET_RPS_WINNER:
                if (this.state.phase !== PhaseOrder.RPS) return;
                if (action.payload?.winner) {
                    this.state.rpsWinner = action.payload.winner;
                    this.state.phase = PhaseOrder.Protecting;
                }
                break;
            case ActionType.PROTECT_SONG:
                if (this.state.phase !== PhaseOrder.Protecting) return;
                if (action.payload?.songId && this.state.rpsWinner) {
                    const songId = action.payload.songId;
                    this.state.protectedSong = songId;
                    this.state.protectedBy = this.state.rpsWinner;
                    this.state.phase = PhaseOrder.Revealing;
                }
                break;
            case ActionType.BAN_SONG:
                if (this.state.phase !== PhaseOrder.Banning) return;
                if (action.payload?.songId) {
                    const songId = action.payload.songId;
                    if (songId === this.state.protectedSong) return; // cant ban protected song
                    if (
                        !this.state.bannedSongs.includes(songId) &&
                        !this.state.pickedSongs.includes(songId)
                    ) {
                        this.state.bannedSongs.push(songId);
                        if (this.state.bannedSongs.length >= 2) {
                            this.state.phase = PhaseOrder.Picking;
                        }
                    }
                }
                break;
            case ActionType.PICK_SONG:
                if (this.state.phase !== PhaseOrder.Picking) return;
                if (action.payload?.songId) {
                    const songId = action.payload.songId;
                    if (songId === this.state.protectedSong) return; // cant pick protected song
                    if (
                        !this.state.bannedSongs.includes(songId) &&
                        !this.state.pickedSongs.includes(songId)
                    ) {
                        this.state.pickedSongs.push(songId);
                        if (this.state.pickedSongs.length >= 2) {
                            this.state.phase = PhaseOrder.Finished;
                        }
                    }
                }
                break;
            case ActionType.SET_REVEAL_PERMISSION:
                this.state = {
                    ...this.state,
                    revealPermission: action.payload?.permission ?? this.state.revealPermission,
                }
                break;
            case ActionType.RESET:
                this.state.phase = PhaseOrder.Waiting;
                this.state.revealedSongs = [];
                this.state.bannedSongs = [];
                this.state.pickedSongs = [];
                this.state.protectedSong = null;
                this.state.protectedBy = null;
                this.state.rpsWinner = null;
                this.state.songs = this.getSongsForPreset(this.state.preset);
                break;
        }
    }
}
