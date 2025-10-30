'use client';

import { useEffect, useState } from 'react';
import { getUserWithAvatar } from '@/lib/user';
import Link from 'next/link';
import { Plus, RefreshCw, Users, ArrowLeft, Trophy, Clock } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Room {
  id: string;
  status: string;
  hostUserId: string;
  guestUserId?: string | null;
}

export default function LobbyPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const user = typeof window !== 'undefined' ? getUserWithAvatar() : null;

  async function loadRooms() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/rooms`);
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  async function createRoom() {
    if (!user) return alert('Vui lòng đăng nhập');
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/rooms/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const room = await res.json();
      window.location.href = `/game/${room.id}`;
    } catch (error) {
      alert('Lỗi tạo phòng');
    } finally {
      setCreating(false);
    }
  }

  function isUserInRoom(room: Room): boolean {
    if (!user) return false;
    return room.hostUserId === user.id || room.guestUserId === user.id;
  }

  async function enterRoom(room: Room) {
    if (!user) return alert('Vui lòng đăng nhập');
    // If user already belongs to the room, just continue
    if (isUserInRoom(room)) {
      window.location.href = `/game/${room.id}`;
      return;
    }
    // Otherwise, attempt to join if room is waiting
    if (room.status !== 'waiting') return alert('Phòng đang chơi, vui lòng chọn phòng khác');
    try {
      await fetch(`${API_URL}/rooms/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: room.id, userId: user.id }),
      });
      window.location.href = `/game/${room.id}`;
    } catch (error) {
      alert('Lỗi tham gia phòng');
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <span className="status-badge status-waiting"><Clock className="w-3 h-3 inline mr-1" />Chờ người chơi</span>;
      case 'playing':
        return <span className="status-badge status-playing"><Trophy className="w-3 h-3 inline mr-1" />Đang chơi</span>;
      case 'finished':
        return <span className="status-badge status-finished">Kết thúc</span>;
      default:
        return <span className="status-badge status-waiting">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="container">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-4">Phòng Chơi</h1>
          <p className="text-xl text-white/90">Tạo phòng mới hoặc tham gia phòng có sẵn</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="card p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-2">
                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                    <span className="text-gray-700 font-semibold">{user.name || user.email || 'Người chơi'}</span>
                  </div>
                ) : (
                  <div className="text-gray-600">
                    <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                      Đăng nhập để chơi
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={createRoom}
                  disabled={!user || creating}
                  className="btn btn-success"
                >
                  <Plus className="w-4 h-4" />
                  {creating ? 'Đang tạo...' : 'Tạo phòng'}
                </button>
                
                <button onClick={loadRooms} className="btn btn-secondary">
                  <RefreshCw className="w-4 h-4" />
                  Tải lại
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="card p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách phòng...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="card p-8 text-center">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có phòng nào</h3>
              <p className="text-gray-500 mb-4">Hãy tạo phòng đầu tiên để bắt đầu chơi!</p>
              <button
                onClick={createRoom}
                disabled={!user}
                className="btn btn-success"
              >
                <Plus className="w-4 h-4" />
                Tạo phòng đầu tiên
              </button>
            </div>
          ) : (
            <div className="grid grid-2 gap-4">
              {rooms.map((room) => (
                <div key={room.id} className="room-card">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Phòng #{room.id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Host: {room.hostUserId.slice(0, 8)}...
                      </p>
                    </div>
                    {getStatusBadge(room.status)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>
                        {room.guestUserId ? '2/2 người chơi' : '1/2 người chơi'}
                      </span>
                    </div>
                    {(() => {
                      const userCanEnter = !!user && (room.status === 'waiting' || isUserInRoom(room));
                      const label = room.status === 'waiting' ? 'Tham gia' : (isUserInRoom(room) ? 'Tiếp tục' : 'Đang chơi');
                      const btnClass = userCanEnter ? 'btn-success' : 'btn-secondary';
                      return (
                        <button
                          onClick={() => enterRoom(room)}
                          disabled={!userCanEnter}
                          className={`btn ${btnClass} text-sm`}
                        >
                          {label}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-6">
            <Link href="/" className="btn btn-secondary">
              <ArrowLeft className="w-4 h-4" />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
