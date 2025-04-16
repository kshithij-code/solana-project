import { Program, AnchorProvider, Wallet, setProvider, BN } from "@coral-xyz/anchor";
import { Solanaproject } from "@project/anchor";
import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions";
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SendTransactionError, Transaction } from "@solana/web3.js";

export const OPTIONS = GET;

const IDL = require('@/../anchor/target/idl/solanaproject.json');



export async function GET(request: Request) {
  const actionMata: ActionGetResponse = {
    icon: "https://placehold.co/400",
    title: "Counter",
    description: "click to change counter",
    label: "Click",
    links: {
      actions: [{
        href: "/api/counter?count=Increment",
        label: "Increment",
        type: "post",
      },
      {
        href: "/api/counter?count=Decrement",
        label: "Decrement",
        type: "post"
      }]
    }
  };
  return Response.json(actionMata, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(request: Request) {

  const url = new URL(request.url);
  const count = url.searchParams.get("count");
  if (count !== "Increment" && count !== "Decrement") {
    return new Response("invaild", { status: 400, headers: ACTIONS_CORS_HEADERS });
  }
  const connection = new Connection("http://localhost:8899", "confirmed");
  const program: Program<Solanaproject> = new Program(IDL, { connection });
  // const provider = AnchorProvider.env()
  // setProvider(provider)
  // const payer = provider.wallet as Wallet

  const body: ActionPostRequest = await request.json();
  let counter;

  try {
    counter = new PublicKey(body.account);
    console.log(counter);
  } catch (error) {
    return new Response("Invalid account", { status: 400, headers: ACTIONS_CORS_HEADERS });
  }

  let instruction;
  if (count == "Increment") {
    instruction = await program.methods.increment().accounts({ solanaproject: counter }).instruction();
  } else {
    instruction = await program.methods.decrement().accounts({ solanaproject: counter}).instruction();
  }

  const blockhash = await connection.getLatestBlockhash();

  const transaction = new Transaction({
    feePayer: counter,
    blockhash: blockhash.blockhash,
    lastValidBlockHeight: blockhash.lastValidBlockHeight,
  }).add(instruction);
  // await sendAndConfirmTransaction(connection,transaction);
  const response = await createPostResponse({
    fields: {
      transaction: transaction,
      type: "transaction"
    }
  });

  return Response.json(response, { headers: ACTIONS_CORS_HEADERS });

}


