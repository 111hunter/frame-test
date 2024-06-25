import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther } from 'viem';
import { baseSepolia, base } from 'viem/chains';
// import BuyMeACoffeeABI from '../../_contracts/BuyMeACoffeeABI';
import BadgeABI from '../../_contracts/BadgeABI';
import { BUY_MY_COFFEE_CONTRACT_ADDR, BADGE_ADDR } from '../../config';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  // Remember to replace 'NEYNAR_ONCHAIN_KIT' with your own Neynar API key
  const { isValid } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  // const data = encodeFunctionData({
  //   abi: BuyMeACoffeeABI,
  //   functionName: 'buyCoffee',
  //   args: [parseEther('0.00006'), 'Coffee all day!'],
  // });

  const safeMintData = encodeFunctionData({
    abi: BadgeABI,
    functionName: 'safeMint',
    args: [],
  });

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${base.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: BadgeABI,
      data: safeMintData,
      // to: BUY_MY_COFFEE_CONTRACT_ADDR,
      to: BADGE_ADDR,
      // value: parseEther('0.00004').toString(), // 0.00004 ETH
      value: '0',
    },
  };
  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
