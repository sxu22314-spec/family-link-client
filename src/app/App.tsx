import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return (
    /** * 1. 去掉居中对齐的 flex 布局，让内容从顶部开始流式排列
     * 2. 使用 selection-none 防止长按图片时弹出系统菜单（对拼图体验更好）
     */
    <div className="min-h-screen bg-white selection:bg-amber-200">
      
      {/* 2. 移除了所有 Gray-900 的手机外壳 div 
         3. w-full 和 min-h-screen 确保铺满整个手机屏幕
         4. max-w-md mx-auto 保证在 Pad 或 PC 上浏览时，内容不会拉伸得过宽，依然保持手机质感
      */}
      <div className="w-full max-w-md mx-auto min-h-screen shadow-none sm:shadow-lg bg-white relative">
        
        {/* 5. 移除固定的 h-[780px]，改用 flex-col 
           6. 确保 RouterProvider 渲染的页面能够根据内容自动撑开高度
        */}
        <main className="min-h-screen w-full relative overflow-x-hidden">
          <RouterProvider router={router} />
        </main>

      </div>
    </div>
  );
}

// 这是一个“手机外壳”容器，它负责把你的网页内容按照指定的尺寸锁死在一个手机框里，
// 并利用 React Router 来管理内部页面的切换。