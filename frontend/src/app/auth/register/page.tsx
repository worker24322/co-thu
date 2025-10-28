'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserPlus, ArrowLeft, Mail, Lock } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setMessage(data.message || 'Đăng ký thất bại');
        return;
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage('Đăng ký thành công! Chuyển hướng đến trang chủ...');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      setMessage('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="container max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Đăng Ký</h1>
            <p className="text-gray-600">Tạo tài khoản mới để bắt đầu chơi</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Nhập email của bạn"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock className="w-4 h-4 inline mr-2" />
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn w-full justify-center"
            >
              {loading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
            </button>
          </form>

          {message && (
            <div className={`alert ${message.includes('thành công') ? 'alert-success' : 'alert-error'} mt-4`}>
              {message}
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Đã có tài khoản?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          <div className="text-center mt-4">
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
