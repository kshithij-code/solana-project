#![allow(warnings)]
#![allow(clippy::result_large_err)]
use anchor_lang::prelude::*;

declare_id!("2esSSY3A9G7DgR6gUp4zWg4iYhYmWVDZyPgw7cjqcQLR");

#[program]
pub mod solanaproject {
    use super::*;

  pub fn close(_ctx: Context<CloseSolanaproject>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solanaproject.count = ctx.accounts.solanaproject.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solanaproject.count = ctx.accounts.solanaproject.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeSolanaproject>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.solanaproject.count = value.clone();
    Ok(())
  }

  pub fn zero(ctx:Context<Update>)->Result<()>{
    ctx.accounts.solanaproject.count=0;
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeSolanaproject<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Solanaproject::INIT_SPACE,
  payer = payer
  )]
  pub solanaproject: Account<'info, Solanaproject>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseSolanaproject<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub solanaproject: Account<'info, Solanaproject>,
}


#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub solanaproject: Account<'info, Solanaproject>,
}

#[account]
#[derive(InitSpace)]
pub struct Solanaproject {
    count: u8,
}
