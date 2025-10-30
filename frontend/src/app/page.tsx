"use client";

import Image from "next/image";
import styles from "./page.module.css";

import Link from 'next/link';
import { Gamepad2, Users, BookOpen, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      setIsLoggedIn(!!user);
    } catch {}
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gradient mb-4">
            Cờ Thú Online
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Trò chơi chiến thuật cổ điển với giao diện hiện đại. 
            Thách thức bạn bè và trở thành cao thủ cờ thú!
          </p>
        </div>

        <div className="grid grid-3 gap-8 max-w-4xl mx-auto">
          {!isLoggedIn && (
          <Link href="/auth/register" className="card p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Đăng Ký</h3>
            <p className="text-gray-600">Tạo tài khoản mới để bắt đầu chơi</p>
          </Link>
          )}

          {!isLoggedIn && (
          <Link href="/auth/login" className="card p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Đăng Nhập</h3>
            <p className="text-gray-600">Đăng nhập vào tài khoản của bạn</p>
          </Link>
          )}

          <Link href="/lobby" className="card p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Phòng Chơi</h3>
            <p className="text-gray-600">Tạo hoặc tham gia phòng chơi</p>
          </Link>

          <Link href="/rules" className="card p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Quy Luật</h3>
            <p className="text-gray-600">Tìm hiểu cách chơi cờ thú</p>
          </Link>
        </div>

        <div className="text-center mt-12">
          <div className="card p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Tính Năng Nổi Bật</h2>
            <div className="grid grid-2 gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                <span>Chơi trực tuyến với bạn bè</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-full"></div>
                <span>Hệ thống tích điểm</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></div>
                <span>Giao diện đẹp mắt</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
                <span>Quy luật chi tiết</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
