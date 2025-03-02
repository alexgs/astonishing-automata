/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved.
 */

--[ # EXTENSIONS # ]--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--[ # TRIGGERS # ]--

-- See https://x-team.com/blog/automatic-timestamps-with-postgresql/
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
  RETURNS TRIGGER AS
$$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

--[ # EVENT STORE TABLES # ]--

--[ ## TABLE public.events ## ]--

CREATE TABLE IF NOT EXISTS public.events
(
  id         CHAR(26)                                                 NOT NULL
    CONSTRAINT events_pk
      PRIMARY KEY,
  created_at TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  data       JSONB                                                    NOT NULL,
  stream_id  UUID                                                     NOT NULL,
  type       TEXT                                                     NOT NULL,
  version    INT                                                      NOT NULL
);

DROP PUBLICATION IF EXISTS event_publication;
CREATE PUBLICATION event_publication FOR TABLE public.events;

--[ ## TABLE public.streams ## ]--

CREATE TABLE IF NOT EXISTS public.streams
(
  id      UUID NOT NULL
    CONSTRAINT streams_pk
      PRIMARY KEY,
  type    TEXT NOT NULL,
  version INT  NOT NULL
);

--[ # PROJECTION TABLES # ]--

--[ ## TABLE public.user_accounts ## ]--

-- CREATE TABLE IF NOT EXISTS public.user_accounts
-- (
--   id                UUID                                                     NOT NULL
--     CONSTRAINT user_accounts_pk
--       PRIMARY KEY,
--   default_budget_id UUID,
--   email             TEXT                                                     NOT NULL,
--   first_name        TEXT                                                     NOT NULL,
--   last_name         TEXT                                                     NOT NULL,
--   username          TEXT                                                     NOT NULL,
--   created_at        TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
--   updated_at        TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
--   version           INT                                                      NOT NULL
-- );
--
-- CREATE TRIGGER set_user_accounts_updated_at
--   BEFORE UPDATE
--   ON user_accounts
--   FOR EACH ROW
-- EXECUTE PROCEDURE trigger_set_updated_at();

--[ ## TABLE public.budgets ## ]--

-- CREATE TABLE IF NOT EXISTS public.budgets
-- (
--   id         UUID                                                     NOT NULL
--     CONSTRAINT budgets_pk
--       PRIMARY KEY,
--   name       TEXT                                                     NOT NULL,
--   owner_id   UUID                                                     NOT NULL
--     CONSTRAINT budgets_owner_id_fk
--       REFERENCES user_accounts,
--   slug       TEXT                                                     NOT NULL,
--   created_at TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
--   updated_at TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
--   version    INT                                                      NOT NULL
-- );
--
-- CREATE TRIGGER set_budgets_updated_at
--   BEFORE UPDATE
--   ON budgets
--   FOR EACH ROW
-- EXECUTE PROCEDURE trigger_set_updated_at();

--[ ## TABLE public.financial_accounts ## ]--

-- CREATE TABLE IF NOT EXISTS public.financial_accounts
-- (
--   id           UUID                                                         NOT NULL
--     CONSTRAINT financial_accounts_pk
--       PRIMARY KEY,
--   account_type TEXT                           DEFAULT 'account-types.other' NOT NULL,
--   balance      INTEGER                        DEFAULT 0                     NOT NULL,
--   budget_id    UUID                                                         NOT NULL
--     CONSTRAINT financial_accounts_budget_id_fk
--       REFERENCES budgets,
--   description  TEXT                                                         NOT NULL,
--   is_system    BOOLEAN                        DEFAULT false                 NOT NULL,
--   created_at   TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP     NOT NULL,
--   updated_at   TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP     NOT NULL,
--   version      INT                                                          NOT NULL
-- );
--
-- CREATE TRIGGER set_accounts_updated_at
--   BEFORE UPDATE
--   ON financial_accounts
--   FOR EACH ROW
-- EXECUTE PROCEDURE trigger_set_updated_at();

--[ ## TABLE public.categories ## ]--

-- CREATE TABLE IF NOT EXISTS public.categories
-- (
--   id         UUID                                                     NOT NULL
--     CONSTRAINT categories_pk
--       PRIMARY KEY,
--   balance    INTEGER                        DEFAULT 0                 NOT NULL,
--   budget_id  UUID                                                     NOT NULL
--     CONSTRAINT categories_budget_id_fk
--       REFERENCES budgets,
--   name       TEXT                                                     NOT NULL,
--   "order"    INTEGER,
--   parent_id  UUID
--     CONSTRAINT categories_parent_id_fk
--       REFERENCES categories,
--   is_system  BOOLEAN                        DEFAULT false             NOT NULL,
--   created_at TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
--   updated_at TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
--   version    INT                                                      NOT NULL
-- );
--
-- CREATE TRIGGER set_categories_updated_at
--   BEFORE UPDATE
--   ON categories
--   FOR EACH ROW
-- EXECUTE PROCEDURE trigger_set_updated_at();

--[ ## TABLE public.transaction_records ## ]--

-- CREATE SEQUENCE IF NOT EXISTS public.transaction_records_order_sequence
--   AS INTEGER
--   START 1000;
--
-- CREATE TABLE IF NOT EXISTS public.transaction_records
-- (
--   id          UUID                                                     NOT NULL
--     CONSTRAINT transaction_records_pk
--       PRIMARY KEY,
--   budget_id   UUID                                                     NOT NULL
--     CONSTRAINT transaction_records_budget_id_fk
--       REFERENCES budgets,
--   "date"      DATE                                                     NOT NULL,
--   description TEXT                                                     NOT NULL,
--   "order"     INTEGER                                                  NOT NULL,
--   type        TEXT                                                     NOT NULL,
--   created_at  TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
--   updated_at  TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
--   version     INT                                                      NOT NULL
-- );
--
-- CREATE TRIGGER set_transaction_records_updated_at
--   BEFORE UPDATE
--   ON transaction_records
--   FOR EACH ROW
-- EXECUTE PROCEDURE trigger_set_updated_at();
--
-- ALTER SEQUENCE transaction_records_order_sequence
--   OWNED BY transaction_records."order";

--[ ## TABLE public.account_subrecords ## ]--

-- CREATE TABLE IF NOT EXISTS public.account_subrecords
-- (
--   id                    UUID                           DEFAULT uuid_generate_v4() NOT NULL
--     CONSTRAINT account_subrecords_pk
--       PRIMARY KEY,
--   account_id            UUID                                                      NOT NULL
--     CONSTRAINT account_subrecords_account_id_fk
--       REFERENCES financial_accounts,
--   transaction_record_id UUID                                                      NOT NULL
--     CONSTRAINT account_subrecords_transaction_record_id_fk
--       REFERENCES transaction_records,
--   credit                INTEGER                                                   NOT NULL,
--   debit                 INTEGER                                                   NOT NULL,
--   created_at            TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP  NOT NULL,
--   updated_at            TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP  NOT NULL,
--   version               INT                                                       NOT NULL
-- );
--
-- CREATE TRIGGER set_account_subrecords_updated_at
--   BEFORE UPDATE
--   ON account_subrecords
--   FOR EACH ROW
-- EXECUTE PROCEDURE trigger_set_updated_at();

--[ ## TABLE public.category_subrecords ## ]--

-- CREATE TABLE IF NOT EXISTS public.category_subrecords
-- (
--   id                    UUID                           DEFAULT uuid_generate_v4() NOT NULL
--     CONSTRAINT category_subrecords_pk
--       PRIMARY KEY,
--   category_id           UUID                                                      NOT NULL
--     CONSTRAINT category_subrecords_category_id_fk
--       REFERENCES categories,
--   transaction_record_id UUID                                                      NOT NULL
--     CONSTRAINT category_subrecords_transaction_record_id_fk
--       REFERENCES transaction_records,
--   credit                INTEGER                                                   NOT NULL,
--   debit                 INTEGER                                                   NOT NULL,
--   notes                 TEXT,
--   created_at            TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP  NOT NULL,
--   updated_at            TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP  NOT NULL,
--   version               INT                                                       NOT NULL
-- );
--
-- CREATE TRIGGER set_category_subrecords_updated_at
--   BEFORE UPDATE
--   ON category_subrecords
--   FOR EACH ROW
-- EXECUTE PROCEDURE trigger_set_updated_at();
