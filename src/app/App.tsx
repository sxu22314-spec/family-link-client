import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-rose-900 flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl w-full max-w-[420px] sm:max-w-[480px] md:max-w-[520px]">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 sm:w-40 h-7 bg-black rounded-b-3xl z-10"></div>
        
        {/* Phone Screen */}
        <div className="relative w-full min-h-[700px] sm:min-h-[780px] bg-white rounded-[2.5rem] overflow-hidden">
          <RouterProvider router={router} />
        </div>
        
        {/* Phone Power Button */}
        <div className="absolute right-0 top-32 w-1 h-16 bg-gray-800 rounded-l"></div>
        
        {/* Phone Volume Buttons */}
        <div className="absolute left-0 top-28 w-1 h-12 bg-gray-800 rounded-r"></div>
        <div className="absolute left-0 top-44 w-1 h-12 bg-gray-800 rounded-r"></div>
      </div>
    </div>
  );
}

// 这是一个“手机外壳”容器，它负责把你的网页内容按照指定的尺寸锁死在一个手机框里，
// 并利用 React Router 来管理内部页面的切换。