你需要设计三个页面的html，如下

1、负责主页的设计，现在主页是这样的，基于现在这样的来设计
这个是现有代码
import { SignIn } from "@/components/sign-in"

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">We0</h1>
          </div>
          <SignIn />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Welcome to We0</h2>
          <p className="text-muted-foreground">Your creative platform</p>
        </div>
      </main>
    </div>
  )
}


2、商品页或者是出售产品页
可以基于商品接口进行设计这个页面，暂时没有前端代码


3、博客页或者公司宣传页
可以基于商品接口进行设计页面，暂时没有前端代码