// PlayerContext.tsx
import { createContext, useState, ReactNode } from "react";

// Definieer het type van de context
interface PlayerContextType {
  players: string[];
  setPlayers: (players: string[]) => void;
}

// Maak de context aan
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const [players, setPlayers] = useState<string[]>([]);

  return (
    <PlayerContext.Provider value={{ players, setPlayers }}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContext;

