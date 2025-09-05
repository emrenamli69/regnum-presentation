import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  
  const validEmail = process.env.NEXT_PUBLIC_AUTH_EMAIL
  const validPassword = process.env.AUTH_PASSWORD
  
  if (email === validEmail && password === validPassword) {
    const response = NextResponse.json({ success: true })
    response.cookies.set('authenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    return response
  }
  
  return NextResponse.json(
    { success: false, message: 'Invalid credentials' },
    { status: 401 }
  )
}