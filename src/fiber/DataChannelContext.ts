import { createContext } from "react";
const dataChannelContext = createContext<RTCDataChannel | null>(null);
export default dataChannelContext;