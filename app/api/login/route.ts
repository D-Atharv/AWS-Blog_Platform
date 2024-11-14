import { NextResponse } from 'next/server';
import { comparePassword, generateToken } from '@/lib/auth';
import { triggerLambdaToSendEmail } from '@/lib/emailService';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = generateToken(user.id);

  const response = NextResponse.json({ token });
  response.cookies.set('token', token, { path: '/', httpOnly: true, maxAge: 3600 });

  //Send the welcome email asynchronously (no `await` - it's asynchronous)
  triggerLambdaToSendEmail(email);

  return response;
}
