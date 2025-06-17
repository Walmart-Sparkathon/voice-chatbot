import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { product, color, price } = await req.json();

  const result = [{ name: `${color} ${product}`, price: price }];

  return NextResponse.json({ results: result });
}

