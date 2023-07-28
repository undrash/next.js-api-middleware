import { NextResponse } from 'next/server'
import { handler } from '../../middleware/handler'
 
// export async function GET() {
  
//   return NextResponse.json({ data: 'Hello World' })
// }

// export const GET = async () => {
//   return NextResponse.json({ data: 'Hello World' })
// };


const mw = async (req, res, next) => {
  console.log('middleware running????')
  next();
};

const hello = async (req, res, next) => {
  console.log('hello running????')
  return NextResponse.json({ data: 'Hello World' })
  // res.status(200).json({ data: 'Hello World' })
}



export const GET = handler(mw, hello as any);
// export const GET = (req ) => {
//   console.log('req', req)
//   return NextResponse.json({ data: 'Hello World' })
// };


