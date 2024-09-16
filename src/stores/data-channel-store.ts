import { create } from 'zustand';

interface IRTCDataChannelStore {
    dataChannel: RTCDataChannel | null,
    setDataChannel: (players: RTCDataChannel) => void
}

const DataChannelStore = create<IRTCDataChannelStore>((set) => ({
    dataChannel: null,
    setDataChannel: (dataChannel) => set(() => ({ dataChannel: dataChannel })),    
}))

export default DataChannelStore;