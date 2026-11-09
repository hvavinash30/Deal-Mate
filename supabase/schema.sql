-- ========================================================
-- DealMate Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. DEALS TABLE (Tracks negotiated prices, savings & status)
create table if not exists public.deals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  product_name text not null,
  original_price numeric(10, 2) not null,
  negotiated_price numeric(10, 2) not null,
  savings_amount numeric(10, 2) not null,
  savings_percentage numeric(5, 2) not null,
  coupon_code text,
  merchant_name text default 'Online Store',
  product_url text,
  status text not null default 'deal_secured' check (status in ('negotiating', 'deal_secured', 'purchased', 'expired')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. USER SHOPPING PREFERENCES TABLE
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  preferred_currency text default 'INR',
  total_savings numeric(12, 2) default 0.00,
  deals_count integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.deals enable row level security;
alter table public.user_profiles enable row level security;

-- Policies for deals
create policy "Users can view their own deals"
  on public.deals for select
  using (auth.uid() = user_id or user_id is null);

create policy "Users can insert their own deals"
  on public.deals for insert
  with check (auth.uid() = user_id or user_id is null);

-- Realtime enablement
alter publication supabase_realtime add table public.deals;
