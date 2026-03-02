CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =============================================================
--  ENUMS — define before tables that use them
-- =============================================================

CREATE TYPE user_role        AS ENUM ('customer', 'admin');
CREATE TYPE coat_type        AS ENUM ('rövid', 'közepes', 'hosszú', 'göndör');
CREATE TYPE appointment_status AS ENUM ('függőben', 'jóváhagyva', 'kész', 'visszamodva');
CREATE TYPE error_severity   AS ENUM ('DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL');


-- =============================================================
--  1. USERS
--     Customers and admin accounts
-- =============================================================

CREATE TABLE users (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   TEXT            NOT NULL,
    first_name      VARCHAR(100)    NOT NULL,
    last_name       VARCHAR(100)    NOT NULL,
    phone           VARCHAR(20),
    role            user_role       NOT NULL DEFAULT 'customer',
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);


-- =============================================================
--  2. DOGS
--     Each user can have multiple dogs
-- =============================================================

CREATE TABLE dogs (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(100)    NOT NULL,
    breed           VARCHAR(100),
    date_of_birth   DATE,
    coat_type       coat_type,
    weight_kg       NUMERIC(5,2),                      -- helps staff prepare
    allergies       TEXT,                               -- free text, e.g. "lavender, oatmeal"
    medical_notes   TEXT,                               -- vet notes, special conditions
    behaviour_notes TEXT,                               -- e.g. "nervous around dryers"
    photo_url       TEXT,                               -- Cloudinary URL
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dogs_user_id ON dogs(user_id);


-- =============================================================
--  3. SERVICES
--     Grooming services the shop offers
-- =============================================================

CREATE TABLE services (
    id              SERIAL          PRIMARY KEY,
    name            VARCHAR(150)    NOT NULL,
    description     TEXT,
    price           NUMERIC(8,2)    NOT NULL,
    duration_min    INTEGER         NOT NULL,           -- how long the slot blocks (e.g. 60)
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Seed with common dog grooming services
INSERT INTO services (name, description, price, duration_min) VALUES
    ('Teljes ápolás',      'fürdetés, szárítás, szörvágás, karom vágás, fültisztítás',    4500, 120),
    ('Furdetés & Brush',    'Fürdetés, Szárítás,',                2500, 60),
    ('Karomvágás',       '',                           1500, 20),
    ('Fültisztítás',    '',                         1000, 15),
    ('Fogmosás',  'Fogmosás kutyabarát fogkrémmel',              1500, 15),
    ('Kiskutyus első kozmetika','Finom kozmetika 6 hónap alatti kutyusoknak',   3000, 60);


-- =============================================================
--  4. STAFF_AVAILABILITY
--     Working hours and blocked dates (holidays, etc.)
-- =============================================================

CREATE TABLE staff_availability (
    id              SERIAL          PRIMARY KEY,
    date            DATE            NOT NULL,
    start_time      TIME            NOT NULL DEFAULT '08:00',
    end_time        TIME            NOT NULL DEFAULT '20:00',
    is_blocked      BOOLEAN         NOT NULL DEFAULT FALSE, -- TRUE = closed that day
    note            VARCHAR(255),                           -- e.g. "Public holiday"
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_times CHECK (end_time > start_time),
    CONSTRAINT uq_availability_date UNIQUE (date)
);

CREATE INDEX idx_availability_date ON staff_availability(date);


-- =============================================================
--  5. APPOINTMENTS
--     A booking links a user, their dog, and a service
-- =============================================================

CREATE TABLE appointments (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID                NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    dog_id          UUID                NOT NULL REFERENCES dogs(id) ON DELETE RESTRICT,
    service_id      INTEGER             NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    scheduled_at    TIMESTAMPTZ         NOT NULL,          -- exact start date + time
    status          appointment_status  NOT NULL DEFAULT 'függőben',
    customer_notes  TEXT,                                  -- anything the customer wants staff to know
    staff_notes     TEXT,                                  -- internal notes added after the visit
    price_charged   NUMERIC(8,2),                         -- snapshot of price at time of booking
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appt_user_id      ON appointments(user_id);
CREATE INDEX idx_appt_dog_id       ON appointments(dog_id);
CREATE INDEX idx_appt_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appt_status       ON appointments(status);

-- Prevent double-booking: no two confirmed/pending appointments at the same time
CREATE UNIQUE INDEX idx_appt_no_double_book
    ON appointments(scheduled_at)
    WHERE status IN ('függőben', 'jóváhagyva');


-- =============================================================
--  6. ERRORS
--     Application error log (from your earlier error schema)
-- =============================================================

CREATE TABLE errors (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    error_code      VARCHAR(50)     NOT NULL,
    message         TEXT            NOT NULL,
    stack_trace     TEXT,
    severity        error_severity  NOT NULL DEFAULT 'ERROR',
    layer           VARCHAR(20)     NOT NULL DEFAULT 'API',  -- FRONTEND / API / DB / INFRA
    user_id         UUID            REFERENCES users(id) ON DELETE SET NULL,
    occurred_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    resolved_at     TIMESTAMPTZ
);

CREATE INDEX idx_errors_code      ON errors(error_code);
CREATE INDEX idx_errors_severity  ON errors(severity);
CREATE INDEX idx_errors_occurred  ON errors(occurred_at DESC);


-- =============================================================
--  AUTO-UPDATE updated_at TRIGGER
--  Automatically keeps updated_at fresh on users, dogs, appointments
-- =============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_dogs_updated_at
    BEFORE UPDATE ON dogs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

