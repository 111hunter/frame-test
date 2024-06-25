import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther } from 'viem';
import { baseSepolia, base } from 'viem/chains';
// import BuyMeACoffeeABI from '../../_contracts/BuyMeACoffeeABI';
// import BadgeABI from '../../_contracts/BadgeABI';
// import { BUY_MY_COFFEE_CONTRACT_ADDR, BADGE_ADDR } from '../../config';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  // Remember to replace 'NEYNAR_ONCHAIN_KIT' with your own Neynar API key
  const { isValid } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const badgeABI = [
    {
        stateMutability: 'nonpayable',
        type: 'function',
        inputs: [],
        name: 'safeMint',
        outputs: [],
    },
  ];

  const BADGE_ADDR = '0x7721693d0529199d4B68aB4c00f1213b16092Bf9';

  const safeMintData = encodeFunctionData({
    abi: badgeABI,
    functionName: 'safeMint',
    args: [],
  });

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${base.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: [],
      data: safeMintData,
      to: BADGE_ADDR,
      value: '0',
    },
  };
  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
