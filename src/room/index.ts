import { Socket } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';

interface IRoomParams {
  roomId: string;
  peerId: string;
}

const rooms: Record<string, string[]> = {};

export const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];
    socket.emit('room-created', { roomId });
    console.log('room created', rooms);
  };
  const joinRoom = ({ roomId, peerId }: IRoomParams) => {
    console.log(rooms);
    if (rooms.hasOwnProperty(roomId)) {
      console.log('user joined the room', roomId, peerId);
      rooms[roomId]?.push(peerId);
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', { peerId });
      socket.emit('get-users', {
        roomId,
        participants: rooms[roomId],
      });
      console.log('join roomId');
    } else {
      createRoom();
      console.log('create roomId');
    }

    socket.on('disconnect', () => {
      console.log('user left the room', peerId);
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ peerId, roomId }: IRoomParams) => {
    rooms[roomId] = rooms[roomId]?.filter((id) => id !== peerId);
    socket.to(roomId).emit('user-disconnected', peerId);
  };

  const startSharing = ({ peerId, roomId }: IRoomParams) => {
    console.log('start sharing', peerId, ' room ', roomId);
    socket.to(roomId).emit('user-shared-screen', peerId);
  };

  const stopSharing = (roomId: string) => {
    socket.to(roomId).emit('user-stopped-sharing');
  };
  socket.on('create-room', createRoom);
  socket.on('join-room', joinRoom);
  socket.on('start-sharing', startSharing);
  socket.on('stop-sharing', stopSharing);
};

