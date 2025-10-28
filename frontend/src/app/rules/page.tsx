import Link from 'next/link';
import { ArrowLeft, BookOpen, Target, Users, Zap, Shield } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-4">Quy Luật Cờ Thú</h1>
          <p className="text-xl text-white/90">Tìm hiểu cách chơi và chiến thắng trong trò chơi cờ thú</p>
        </div>

        <div className="card p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Mục Tiêu Trò Chơi</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            Mục tiêu của cờ thú là <strong>vào hang đối thủ</strong> hoặc <strong>ăn hết tất cả quân cờ của đối thủ</strong>. 
            Người chơi nào đạt được một trong hai điều kiện này sẽ thắng cuộc.
          </p>
        </div>

        <div className="grid grid-2 gap-6 mb-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">Bàn Cờ</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• Bàn cờ có kích thước <strong>7 cột × 9 hàng</strong></li>
              <li>• Hai khối <strong>sông</strong> ở giữa bàn cờ</li>
              <li>• Mỗi bên có <strong>3 ô bẫy</strong> và <strong>1 hang</strong></li>
              <li>• Người chơi A ở dưới, người chơi B ở trên</li>
            </ul>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-800">Quân Cờ & Cấp Bậc</h3>
            </div>
            <div className="space-y-1 text-gray-700">
              <p><strong>Thứ tự mạnh dần:</strong></p>
              <p>Chuột(1) → Mèo(2) → Chó(3) → Sói(4) → Báo(5) → Hổ(6) → Sư tử(7) → Voi(8)</p>
              <p className="text-sm text-gray-600 mt-2">
                Mỗi người chơi có 8 quân cờ đại diện cho các loài động vật khác nhau.
              </p>
            </div>
          </div>
        </div>

        <div className="card p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Cách Di Chuyển</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-semibold text-lg mb-2">Di chuyển cơ bản:</h4>
              <ul className="space-y-1 ml-4">
                <li>• Đi <strong>1 ô</strong> theo hàng ngang hoặc dọc</li>
                <li>• <strong>Chuột</strong> có thể xuống nước; quân khác không thể</li>
                <li>• Không được vào <strong>hang của chính mình</strong></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-2">Nhảy qua sông:</h4>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Sư tử</strong> và <strong>Hổ</strong> có thể nhảy qua sông theo hàng/dọc</li>
                <li>• Chỉ được nhảy nếu không có <strong>Chuột</strong> chặn trong sông</li>
                <li>• Phải nhảy qua toàn bộ khối sông</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-800">Quy Tắc Bắt Quân</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-semibold text-lg mb-2">Quy tắc chung:</h4>
              <ul className="space-y-1 ml-4">
                <li>• Quân <strong>mạnh</strong> bắt được quân <strong>yếu hơn</strong> hoặc <strong>bằng cấp</strong></li>
                <li>• Quân đứng trong <strong>bẫy đối thủ</strong> bị coi như cấp 0</li>
                <li>• Quân trong bẫy có thể bị bắt bởi bất kỳ quân nào</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-2">Ngoại lệ đặc biệt:</h4>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Chuột có thể bắt Voi</strong> (ngược lại với quy tắc thông thường)</li>
                <li>• <strong>Voi không thể bắt Chuột</strong></li>
                <li>• Chuột ở dưới nước <strong>không được bắt</strong> quân trên bờ</li>
                <li>• Chuột ở dưới nước chỉ có thể bắt Chuột khác cũng ở dưới nước</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">Điều Kiện Thắng</h2>
          </div>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <p><strong>Vào hang đối thủ:</strong> Di chuyển bất kỳ quân nào vào hang của đối phương</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <p><strong>Ăn hết quân đối thủ:</strong> Bắt được tất cả quân cờ của đối phương</p>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-3">💡 Mẹo Chơi</h3>
            <div className="grid grid-2 gap-4 text-sm text-gray-700">
              <div>• Sử dụng Chuột để chặn đường nhảy của Sư tử/Hổ</div>
              <div>• Bảo vệ hang bằng cách đặt quân mạnh ở các ô bẫy</div>
              <div>• Tận dụng quy tắc bẫy để bắt quân mạnh của đối thủ</div>
              <div>• Chuột là quân cờ quan trọng nhất trong trò chơi</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="btn btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
