-- ============================================================
-- StockSim JP — Supabase Schema
-- Run this in the Supabase SQL Editor (Tokyo region project)
-- ============================================================

-- ── Tables ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  cash_balance DECIMAL(12,2) DEFAULT 10000.00,
  initial_balance DECIMAL(12,2) DEFAULT 10000.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  shares DECIMAL(10,4) NOT NULL DEFAULT 0,
  avg_cost DECIMAL(10,4) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(portfolio_id, ticker)
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('buy', 'sell')),
  shares DECIMAL(10,4) NOT NULL,
  price DECIMAL(10,4) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, ticker)
);

-- ── Row Level Security ───────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- portfolios
CREATE POLICY "portfolios_select_own" ON public.portfolios
  FOR SELECT USING (auth.uid() = user_id);

-- holdings (read-only via RLS; writes go through SECURITY DEFINER RPCs)
CREATE POLICY "holdings_select_own" ON public.holdings
  FOR SELECT USING (
    portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid())
  );

-- transactions
CREATE POLICY "transactions_select_own" ON public.transactions
  FOR SELECT USING (
    portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid())
  );

-- watchlists
CREATE POLICY "watchlists_select_own" ON public.watchlists
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "watchlists_insert_own" ON public.watchlists
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "watchlists_delete_own" ON public.watchlists
  FOR DELETE USING (user_id = auth.uid());

-- ── Trigger: auto-create profile + portfolio on sign-up ─────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      split_part(NEW.email, '@', 1)
    )
  );

  INSERT INTO public.portfolios (user_id, cash_balance, initial_balance)
  VALUES (NEW.id, 10000.00, 10000.00);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── RPC: execute_buy ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.execute_buy(
  p_user_id UUID,
  p_ticker TEXT,
  p_company_name TEXT,
  p_shares DECIMAL(10,4),
  p_price DECIMAL(10,4)
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_portfolio_id UUID;
  v_cash_balance DECIMAL(12,2);
  v_total_amount DECIMAL(12,2);
  v_existing_shares DECIMAL(10,4);
  v_existing_avg_cost DECIMAL(10,4);
  v_new_avg_cost DECIMAL(10,4);
BEGIN
  v_total_amount := p_shares * p_price;

  SELECT id, cash_balance INTO v_portfolio_id, v_cash_balance
  FROM public.portfolios
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_portfolio_id IS NULL THEN
    RETURN json_build_object('error', 'ポートフォリオが見つかりません');
  END IF;

  IF v_cash_balance < v_total_amount THEN
    RETURN json_build_object('error', '残高が不足しています');
  END IF;

  UPDATE public.portfolios
  SET cash_balance = cash_balance - v_total_amount,
      updated_at = NOW()
  WHERE id = v_portfolio_id;

  SELECT shares, avg_cost INTO v_existing_shares, v_existing_avg_cost
  FROM public.holdings
  WHERE portfolio_id = v_portfolio_id AND ticker = p_ticker;

  IF FOUND THEN
    v_new_avg_cost := (
      (v_existing_shares * v_existing_avg_cost) + (p_shares * p_price)
    ) / (v_existing_shares + p_shares);

    UPDATE public.holdings
    SET shares = shares + p_shares,
        avg_cost = v_new_avg_cost,
        updated_at = NOW()
    WHERE portfolio_id = v_portfolio_id AND ticker = p_ticker;
  ELSE
    INSERT INTO public.holdings (portfolio_id, ticker, company_name, shares, avg_cost)
    VALUES (v_portfolio_id, p_ticker, p_company_name, p_shares, p_price);
  END IF;

  INSERT INTO public.transactions
    (portfolio_id, ticker, company_name, transaction_type, shares, price, total_amount)
  VALUES
    (v_portfolio_id, p_ticker, p_company_name, 'buy', p_shares, p_price, v_total_amount);

  RETURN json_build_object('success', true, 'total_amount', v_total_amount);
END;
$$;

-- ── RPC: execute_sell ────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.execute_sell(
  p_user_id UUID,
  p_ticker TEXT,
  p_company_name TEXT,
  p_shares DECIMAL(10,4),
  p_price DECIMAL(10,4)
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_portfolio_id UUID;
  v_holding_shares DECIMAL(10,4);
  v_total_amount DECIMAL(12,2);
BEGIN
  v_total_amount := p_shares * p_price;

  SELECT id INTO v_portfolio_id
  FROM public.portfolios
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_portfolio_id IS NULL THEN
    RETURN json_build_object('error', 'ポートフォリオが見つかりません');
  END IF;

  SELECT shares INTO v_holding_shares
  FROM public.holdings
  WHERE portfolio_id = v_portfolio_id AND ticker = p_ticker
  FOR UPDATE;

  IF NOT FOUND OR v_holding_shares < p_shares THEN
    RETURN json_build_object('error', '保有株数が不足しています');
  END IF;

  UPDATE public.portfolios
  SET cash_balance = cash_balance + v_total_amount,
      updated_at = NOW()
  WHERE id = v_portfolio_id;

  IF v_holding_shares - p_shares < 0.0001 THEN
    DELETE FROM public.holdings
    WHERE portfolio_id = v_portfolio_id AND ticker = p_ticker;
  ELSE
    UPDATE public.holdings
    SET shares = shares - p_shares,
        updated_at = NOW()
    WHERE portfolio_id = v_portfolio_id AND ticker = p_ticker;
  END IF;

  INSERT INTO public.transactions
    (portfolio_id, ticker, company_name, transaction_type, shares, price, total_amount)
  VALUES
    (v_portfolio_id, p_ticker, p_company_name, 'sell', p_shares, p_price, v_total_amount);

  RETURN json_build_object('success', true, 'total_amount', v_total_amount);
END;
$$;

-- ── RPC: reset_portfolio ─────────────────────────────────────

CREATE OR REPLACE FUNCTION public.reset_portfolio(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_portfolio_id UUID;
BEGIN
  SELECT id INTO v_portfolio_id
  FROM public.portfolios
  WHERE user_id = p_user_id
  FOR UPDATE;

  DELETE FROM public.holdings WHERE portfolio_id = v_portfolio_id;
  DELETE FROM public.transactions WHERE portfolio_id = v_portfolio_id;

  UPDATE public.portfolios
  SET cash_balance = 10000.00,
      updated_at = NOW()
  WHERE id = v_portfolio_id;
END;
$$;
