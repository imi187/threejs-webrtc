import { create } from "zustand";

export interface IPlayer {
  position: [number, number];
  theta: number;
  animation: number;
}

export interface IPlayers {
  [s: string]: IPlayer;
}

interface IPlayersStore {
  players: IPlayers;
  setPlayers: (players: IPlayers) => void;
}

const playersStore = create<IPlayersStore>((set) => ({
  players: {},
  setPlayers: (players) => set(() => ({ players: players })),
}));

export default playersStore;

