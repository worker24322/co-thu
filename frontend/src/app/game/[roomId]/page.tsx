'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import { ArrowLeft, Users, MessageSquare, Gamepad2 } from 'lucide-react';
import { getUserWithAvatar } from '@/lib/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || API_URL;

// Piece types and their Vietnamese names (with emoji icons)
const PIECE_TYPES = {
  elephant: { name: 'Voi', rank: 8, symbol: '🐘' },
  lion: { name: 'Sư tử', rank: 7, symbol: '🦁' },
  tiger: { name: 'Hổ', rank: 6, symbol: '🐯' },
  leopard: { name: 'Báo', rank: 5, symbol: '🐆' },
  dog: { name: 'Chó', rank: 4, symbol: '🐶' },
  wolf: { name: 'Sói', rank: 3, symbol: '🐺' },
  cat: { name: 'Mèo', rank: 2, symbol: '🐱' },
  rat: { name: 'Chuột', rank: 1, symbol: '🐭' }
};

interface Piece {
  type: keyof typeof PIECE_TYPES;
  owner: 'A' | 'B';
}

export default function GamePage({ params }: { params: Promise<{ roomId: string }> }) {
  const [roomId, setRoomId] = useState<string>('');
  const [events, setEvents] = useState<string[]>([]);
  const [gameState, setGameState] = useState<any>(null);
  const [selectedPiece, setSelectedPiece] = useState<{x: number, y: number} | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'A' | 'B'>('A');
  const [gameOver, setGameOver] = useState<{ winner: 'A' | 'B' | null } | null>(null);
  const [selfUser, setSelfUser] = useState<{ id: string; name?: string; email?: string; avatar?: string } | null>(null);
  const [hostUserId, setHostUserId] = useState<string | null>(null);
  const [guestUserId, setGuestUserId] = useState<string | null>(null);

  // Initialize board with all pieces
  const [board, setBoard] = useState<(Piece | null)[][]>(() => {
    const initialBoard: (Piece | null)[][] = Array.from({ length: 7 }, () => 
      Array.from({ length: 9 }, () => null)
    );

    // Player B pieces (top side)
    // Row 0 (no pieces on traps at (2,0) and (4,0))
    initialBoard[0][0] = { type: 'lion', owner: 'B' };      // (0,0)
    initialBoard[6][0] = { type: 'tiger', owner: 'B' };     // (6,0)
    // Row 1 (avoid trap at (3,1))
    initialBoard[1][1] = { type: 'dog', owner: 'B' };       // (1,1)
    initialBoard[5][1] = { type: 'cat', owner: 'B' };       // (5,1)
    // Row 2
    initialBoard[0][2] = { type: 'rat', owner: 'B' };       // (0,2)
    initialBoard[2][2] = { type: 'leopard', owner: 'B' };   // (2,2)
    initialBoard[4][2] = { type: 'wolf', owner: 'B' };      // (4,2)
    initialBoard[6][2] = { type: 'elephant', owner: 'B' };  // (6,2)

    // Player A pieces (bottom side)
    // Row 6
    initialBoard[0][6] = { type: 'elephant', owner: 'A' };  // (0,6)
    initialBoard[2][6] = { type: 'wolf', owner: 'A' };      // (2,6)
    initialBoard[4][6] = { type: 'leopard', owner: 'A' };   // (4,6)
    initialBoard[6][6] = { type: 'rat', owner: 'A' };       // (6,6)
    // Row 7 (avoid trap at (3,7))
    initialBoard[1][7] = { type: 'cat', owner: 'A' };       // (1,7)
    initialBoard[5][7] = { type: 'dog', owner: 'A' };       // (5,7)
    // Row 8 (avoid traps at (2,8) and (4,8))
    initialBoard[0][8] = { type: 'tiger', owner: 'A' };     // (0,8)
    initialBoard[6][8] = { type: 'lion', owner: 'A' };      // (6,8)

    return initialBoard;
  });

  // Resolve params Promise
  useEffect(() => {
    params.then((resolvedParams) => {
      setRoomId(resolvedParams.roomId);
    });
  }, [params]);

  // Load self user
  useEffect(() => {
    const u = getUserWithAvatar();
    setSelfUser(u);
  }, []);

  // Fetch room participants from list endpoint
  useEffect(() => {
    if (!roomId) return;
    fetch(`${API_URL}/rooms`)
      .then(async (res) => {
        try {
          const list = await res.json();
          const room = Array.isArray(list) ? list.find((r: any) => r.id === roomId) : null;
          if (room) {
            setHostUserId(room.hostUserId || null);
            setGuestUserId(room.guestUserId || null);
          }
        } catch {}
      })
      .catch(() => {});
  }, [roomId]);

  const avatarFor = (seed?: string) => {
    const s = encodeURIComponent(seed || 'guest');
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${s}`;
  };

  const socket: Socket | null = useMemo(() => {
    if (typeof window === 'undefined' || !roomId) return null;
    return io(WS_URL, { withCredentials: true });
  }, [roomId]);

  useEffect(() => {
    if (!socket || !roomId) return;
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    socket.emit('join-room', { roomId, userId: user?.id });
    
    socket.on('player-joined', (userId: string) => setEvents((e) => [
      `Người chơi tham gia: ${userId}`,
      ...e,
    ]));
    
    socket.on('move', (move: { from: { x: number; y: number }; to: { x: number; y: number } }) => {
      setEvents((e) => [`Nước đi: ${JSON.stringify(move)}`, ...e]);
      // Apply opponent move to local board
      setBoard((prev) => {
        const next = prev.map((col) => col.slice());
        const piece = next[move.from.x][move.from.y];
        next[move.to.x][move.to.y] = piece;
        next[move.from.x][move.from.y] = null;
        return next;
      });
      setCurrentPlayer((p) => (p === 'A' ? 'B' : 'A'));
    });

    socket.on('game-over', (payload: { winner: 'A' | 'B' }) => {
      setGameOver({ winner: payload.winner });
      setEvents((e) => [`${payload.winner} chiến thắng!`, ...e]);
    });
    
    return () => {
      socket.disconnect();
    };
  }, [socket, roomId]);

  function sendMockMove() {
    if (!socket || !roomId) return;
    socket.emit('move', { roomId, move: { from: { x: 0, y: 0 }, to: { x: 0, y: 1 } } });
  }

  const isRiver = (x: number, y: number) => {
    return (x >= 1 && x <= 2 && y >= 3 && y <= 5) || 
           (x >= 4 && x <= 5 && y >= 3 && y <= 5);
  };

  const isTrap = (x: number, y: number) => {
    return (x === 2 && y === 8) || (x === 4 && y === 8) || (x === 3 && y === 7) ||
           (x === 2 && y === 0) || (x === 4 && y === 0) || (x === 3 && y === 1);
  };

  const isDen = (x: number, y: number) => {
    return (x === 3 && y === 8) || (x === 3 && y === 0);
  };

  const isOpponentDenFor = (owner: 'A' | 'B', x: number, y: number) => {
    if (owner === 'A') return x === 3 && y === 0; // B's den
    return x === 3 && y === 8; // A's den
  };

  const hasOpponentPieces = (owner: 'A' | 'B') => {
    const opponent = owner === 'A' ? 'B' : 'A';
    for (let x = 0; x < 7; x++) {
      for (let y = 0; y < 9; y++) {
        const p = board[x][y];
        if (p && p.owner === opponent) return true;
      }
    }
    return false;
  };

  const isValidMove = (fromX: number, fromY: number, toX: number, toY: number): boolean => {
    const piece = board[fromX][fromY];
    if (!piece) return false;

    // Check if it's the current player's turn
    if (piece.owner !== currentPlayer) return false;

    // Cannot move to own den
    if (piece.owner === 'A' && isDen(toX, toY) && toY === 8) return false;
    if (piece.owner === 'B' && isDen(toX, toY) && toY === 0) return false;

    // Basic movement validation
    const dx = Math.abs(toX - fromX);
    const dy = Math.abs(toY - fromY);

    // Must move orthogonally
    if (dx + dy !== 1) {
      // Check for lion/tiger river jump
      if ((piece.type === 'lion' || piece.type === 'tiger') && (dx === 0 || dy === 0)) {
        return isValidRiverJump(fromX, fromY, toX, toY);
      }
      return false;
    }

    // Only rat can enter river
    if (isRiver(toX, toY) && piece.type !== 'rat') return false;

    // Check capture rules
    const targetPiece = board[toX][toY];
    if (targetPiece && !canCapture(piece, targetPiece, fromX, fromY, toX, toY)) {
      return false;
    }

    return true;
  };

  const isValidRiverJump = (fromX: number, fromY: number, toX: number, toY: number): boolean => {
    const dx = Math.sign(toX - fromX);
    const dy = Math.sign(toY - fromY);
    
    let x = fromX + dx;
    let y = fromY + dy;
    let hasRiver = false;

    while (x !== toX || y !== toY) {
      if (isRiver(x, y)) {
        hasRiver = true;
        // Check if there's a rat blocking the path
        if (board[x][y] && board[x][y]?.type === 'rat') {
          return false;
        }
      }
      x += dx;
      y += dy;
    }

    return hasRiver; // Must jump over river
  };

  const canCapture = (attacker: Piece, defender: Piece, fromX: number, fromY: number, toX: number, toY: number): boolean => {
    // Cannot capture own pieces
    if (attacker.owner === defender.owner) return false;

    // Special rat rules
    if (attacker.type === 'rat') {
      const attackerInWater = isRiver(fromX, fromY);
      const defenderInWater = isRiver(toX, toY);
      
      // Rat in water cannot capture piece on land (except adjacent water rat)
      if (attackerInWater && !defenderInWater) return false;
      
      // Rat can capture elephant
      if (defender.type === 'elephant') return true;
    }

    if (defender.type === 'rat') {
      // Elephant cannot capture rat
      if (attacker.type === 'elephant') return false;
      
      // Rat in water can only be captured by rat also in water
      const attackerInWater = isRiver(fromX, fromY);
      const defenderInWater = isRiver(toX, toY);
      if (defenderInWater && !(attacker.type === 'rat' && attackerInWater)) {
        return false;
      }
    }

    // Trap rule: defender in opponent trap is rank 0
    const defenderIsTrapped = isTrap(toX, toY) && attacker.owner !== defender.owner;
    if (defenderIsTrapped) return true;

    // Normal rank comparison
    return PIECE_TYPES[attacker.type].rank >= PIECE_TYPES[defender.type].rank;
  };

  function handleCellClick(x: number, y: number) {
    if (gameOver) return; // no moves after finish
    if (selectedPiece) {
      // Try to move piece
      if (isValidMove(selectedPiece.x, selectedPiece.y, x, y)) {
        const newBoard = [...board];
        const piece = newBoard[selectedPiece.x][selectedPiece.y];
        
        // Move piece
        newBoard[x][y] = piece;
        newBoard[selectedPiece.x][selectedPiece.y] = null;
        
        setBoard(newBoard);
        const mover = piece!.owner;

        // Win conditions
        const enteredOpponentDen = isOpponentDenFor(mover, x, y);
        const opponentStillHasPieces = hasOpponentPieces(mover);

        if (enteredOpponentDen || !opponentStillHasPieces) {
          setGameOver({ winner: mover });
          setEvents(prev => [`${mover} chiến thắng!`, ...prev]);
          // Notify opponent via socket
          socket?.emit('game-over', { roomId, winner: mover });
          // Notify backend to update score
          try {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            fetch(`${API_URL}/rooms/finish`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ roomId, winnerUserId: user?.id }),
            }).catch(() => {});
          } catch {}
        } else {
          setCurrentPlayer(currentPlayer === 'A' ? 'B' : 'A');
        }
        
        // Send move to server
        if (socket && roomId) {
          socket.emit('move', {
            roomId,
            move: { from: selectedPiece, to: { x, y } },
          });
        }
        
        setEvents(prev => [`${piece?.owner} di chuyển ${PIECE_TYPES[piece!.type].name} từ (${selectedPiece.x},${selectedPiece.y}) đến (${x},${y})`, ...prev]);
      }
      setSelectedPiece(null);
    } else {
      // Select piece
      const piece = board[x][y];
      if (!gameOver && piece && piece.owner === currentPlayer) {
        setSelectedPiece({ x, y });
      }
    }
  }

  if (!roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen p-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Ván Chơi: #{roomId.slice(0, 8)}
          </h1>
          <p className="text-white/90">Chúc bạn chơi vui vẻ!</p>
        </div>

        <div className="grid grid-2 gap-6">
          {/* Game Board */}
          <div className="card p-6">
            {/* Top player: later joiner (guest) */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <img
                  src={guestUserId ? avatarFor(guestUserId) : avatarFor('opponent')}
                  alt="opponent"
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-sm text-gray-600">
                  {guestUserId ? `Người chơi (vào sau): ${guestUserId.slice(0,8)}...` : 'Chờ đối thủ tham gia'}
                </div>
              </div>
              <span className="status-badge status-playing">Đối thủ</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Bàn Cờ
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Lượt: </span>
                <span className={`px-2 py-1 rounded text-sm font-semibold ${
                  currentPlayer === 'A' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  Người chơi {currentPlayer}
                </span>
              </div>
            </div>
            
            <div className="game-board mx-auto">
              {Array.from({ length: 9 }).map((_, y) => 
                Array.from({ length: 7 }).map((__, x) => {
                  const cellClass = [
                    'game-cell',
                    isRiver(x, y) ? 'river' : '',
                    isTrap(x, y) ? 'trap' : '',
                    isDen(x, y) ? 'den' : '',
                    selectedPiece?.x === x && selectedPiece?.y === y ? 'selected' : ''
                  ].filter(Boolean).join(' ');
                  
                  const piece = board[x][y];
                  
                  return (
                    <div 
                      key={`${x}-${y}`} 
                      className={cellClass}
                      onClick={() => handleCellClick(x, y)}
                      title={piece ? `${PIECE_TYPES[piece.type].name} (${piece.owner})` : ''}
                    >
                      {piece && (
                        <div className={`piece ${piece.owner === 'A' ? 'player-a' : 'player-b'}`}>
                          {PIECE_TYPES[piece.type].symbol}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {selectedPiece ? 
                  `Đã chọn ${board[selectedPiece.x][selectedPiece.y] ? PIECE_TYPES[board[selectedPiece.x][selectedPiece.y]!.type].name : 'ô'} (${selectedPiece.x}, ${selectedPiece.y}) - Click ô đích để di chuyển` :
                  'Click vào quân cờ để chọn, sau đó click ô đích để di chuyển'
                }
              </p>
            </div>

            {/* Bottom player: always self */}
            <div className="flex items-center justify-between mt-4">
              <span className="status-badge status-playing">Bạn</span>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">{selfUser?.name || selfUser?.email || 'Bạn'}</div>
                  <div className="text-xs text-gray-500">{selfUser?.id ? selfUser.id.slice(0,8) + '...' : ''}</div>
                </div>
                <img
                  src={selfUser?.avatar || avatarFor(selfUser?.id)}
                  alt="me"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Game Info & Events */}
          <div className="space-y-4">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Thông Tin Phòng
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Phòng:</span>
                  <span className="font-mono">{roomId.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="status-badge status-playing">Đang chơi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lượt chơi:</span>
                  <span className={`font-semibold ${currentPlayer === 'A' ? 'text-red-600' : 'text-blue-600'}`}>
                    Người chơi {currentPlayer}
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Sự Kiện Trò Chơi
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {events.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Chưa có sự kiện nào
                  </p>
                ) : (
                  events.map((event, i) => (
                    <div key={i} className="text-sm bg-gray-50 p-2 rounded">
                      {event}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Hướng Dẫn</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Sông - chỉ Chuột có thể vào</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Bẫy - quân trong bẫy bị yếu đi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-800 rounded"></div>
                  <span>Hang - mục tiêu để thắng</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                  <span>Ô được chọn</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Thứ Hạng Quân Cờ</h3>
              <div className="grid grid-2 gap-2 text-xs">
                {Object.entries(PIECE_TYPES).map(([type, info]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span>{info.symbol}</span>
                    <span className="text-gray-600">{info.name}</span>
                    <span className="text-gray-400">({info.rank})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/lobby" className="btn btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Về phòng chơi
          </Link>
        </div>
      </div>
    </div>
    {gameOver && (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          zIndex: 50,
        }}
      >
        <div className="card" style={{ maxWidth: 420, width: '100%', padding: 24, textAlign: 'center' }}>
          <h2 className="text-2xl font-bold text-gradient" style={{ marginBottom: 12 }}>Kết quả ván chơi</h2>
          <p style={{ color: '#444', marginBottom: 16 }}>
            Người chơi <span style={{ fontWeight: 700 }}>{gameOver.winner}</span> chiến thắng!
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/lobby" className="btn btn-success">Về phòng</Link>
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>Chơi lại</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
