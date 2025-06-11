import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-6 sm:mb-8">
        <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-teal-500" />
        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-500 to-sky-500 bg-clip-text text-transparent">
          MindFuel
        </span>
      </Link>

      <Card className="w-full max-w-sm sm:max-w-md border-slate-200 dark:border-slate-800">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl sm:text-2xl font-bold">Create an account</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter your information to get started with MindFuel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm">
                First name
              </Label>
              <Input id="firstName" placeholder="John" className="h-10 sm:h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm">
                Last name
              </Label>
              <Input id="lastName" placeholder="Doe" className="h-10 sm:h-11" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input id="email" type="email" placeholder="hello@example.com" className="h-10 sm:h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm">
              Password
            </Label>
            <Input id="password" type="password" className="h-10 sm:h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm">
              Confirm Password
            </Label>
            <Input id="confirmPassword" type="password" className="h-10 sm:h-11" />
          </div>
          <Button className="w-full h-10 sm:h-11 bg-gradient-to-r from-teal-500 to-sky-500">Create Account</Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-500 hover:text-teal-600">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
