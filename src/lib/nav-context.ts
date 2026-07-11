import { createContext, useContext } from "react";

interface NavContextType {
  openServers: () => void;
}

export const NavContext = createContext<NavContextType>({
  openServers: () => {},
});

export function useNavContext() {
  return useContext(NavContext);
}
