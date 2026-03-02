--
-- PostgreSQL database dump
--

\restrict B9POxnwMRtfqI5jq5JTpE3RKjtkmCzipt32uiG7bISbes9bdlbs9iGTWyVWbeqA

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: appointment_status; Type: TYPE; Schema: public; Owner: drex
--

CREATE TYPE public.appointment_status AS ENUM (
    'függőben',
    'jóváhagyva',
    'kész',
    'visszamodva'
);


ALTER TYPE public.appointment_status OWNER TO drex;

--
-- Name: coat_type; Type: TYPE; Schema: public; Owner: drex
--

CREATE TYPE public.coat_type AS ENUM (
    'rövid',
    'közepes',
    'hosszú',
    'göndör'
);


ALTER TYPE public.coat_type OWNER TO drex;

--
-- Name: error_severity; Type: TYPE; Schema: public; Owner: drex
--

CREATE TYPE public.error_severity AS ENUM (
    'DEBUG',
    'INFO',
    'WARN',
    'ERROR',
    'FATAL'
);


ALTER TYPE public.error_severity OWNER TO drex;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: drex
--

CREATE TYPE public.user_role AS ENUM (
    'customer',
    'admin'
);


ALTER TYPE public.user_role OWNER TO drex;

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: drex
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO drex;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: drex
--

CREATE TABLE public.appointments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    dog_id uuid NOT NULL,
    service_id integer NOT NULL,
    scheduled_at timestamp with time zone NOT NULL,
    status public.appointment_status DEFAULT 'függőben'::public.appointment_status NOT NULL,
    customer_notes text,
    staff_notes text,
    price_charged numeric(8,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.appointments OWNER TO drex;

--
-- Name: dogs; Type: TABLE; Schema: public; Owner: drex
--

CREATE TABLE public.dogs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name character varying(100) NOT NULL,
    breed character varying(100),
    date_of_birth date,
    coat_type public.coat_type,
    weight_kg numeric(5,2),
    allergies text,
    medical_notes text,
    behaviour_notes text,
    photo_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.dogs OWNER TO drex;

--
-- Name: errors; Type: TABLE; Schema: public; Owner: drex
--

CREATE TABLE public.errors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    error_code character varying(50) NOT NULL,
    message text NOT NULL,
    stack_trace text,
    severity public.error_severity DEFAULT 'ERROR'::public.error_severity NOT NULL,
    layer character varying(20) DEFAULT 'API'::character varying NOT NULL,
    user_id uuid,
    occurred_at timestamp with time zone DEFAULT now() NOT NULL,
    resolved_at timestamp with time zone
);


ALTER TABLE public.errors OWNER TO drex;

--
-- Name: services; Type: TABLE; Schema: public; Owner: drex
--

CREATE TABLE public.services (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    price numeric(8,2) NOT NULL,
    duration_min integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.services OWNER TO drex;

--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: drex
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.services_id_seq OWNER TO drex;

--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: drex
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: staff_availability; Type: TABLE; Schema: public; Owner: drex
--

CREATE TABLE public.staff_availability (
    id integer NOT NULL,
    date date NOT NULL,
    start_time time without time zone DEFAULT '08:00:00'::time without time zone NOT NULL,
    end_time time without time zone DEFAULT '20:00:00'::time without time zone NOT NULL,
    is_blocked boolean DEFAULT false NOT NULL,
    note character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_times CHECK ((end_time > start_time))
);


ALTER TABLE public.staff_availability OWNER TO drex;

--
-- Name: staff_availability_id_seq; Type: SEQUENCE; Schema: public; Owner: drex
--

CREATE SEQUENCE public.staff_availability_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.staff_availability_id_seq OWNER TO drex;

--
-- Name: staff_availability_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: drex
--

ALTER SEQUENCE public.staff_availability_id_seq OWNED BY public.staff_availability.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: drex
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    phone character varying(20),
    role public.user_role DEFAULT 'customer'::public.user_role NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO drex;

--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: drex
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: staff_availability id; Type: DEFAULT; Schema: public; Owner: drex
--

ALTER TABLE ONLY public.staff_availability ALTER COLUMN id SET DEFAULT nextval('public.staff_availability_id_seq'::regclass);


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: drex
--

COPY public.appointments (id, user_id, dog_id, service_id, scheduled_at, status, customer_notes, staff_notes, price_charged, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: dogs; Type: TABLE DATA; Schema: public; Owner: drex
--

COPY public.dogs (id, user_id, name, breed, date_of_birth, coat_type, weight_kg, allergies, medical_notes, behaviour_notes, photo_url, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: errors; Type: TABLE DATA; Schema: public; Owner: drex
--

COPY public.errors (id, error_code, message, stack_trace, severity, layer, user_id, occurred_at, resolved_at) FROM stdin;
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: drex
--

COPY public.services (id, name, description, price, duration_min, is_active, created_at) FROM stdin;
1	Teljes ápolás	fürdetés, szárítás, szörvágás, karom vágás, fültisztítás	4500.00	120	t	2026-03-02 21:37:25.178068+01
2	Furdetés & Brush	Fürdetés, Szárítás,	2500.00	60	t	2026-03-02 21:37:25.178068+01
3	Karomvágás		1500.00	20	t	2026-03-02 21:37:25.178068+01
4	Fültisztítás		1000.00	15	t	2026-03-02 21:37:25.178068+01
5	Fogmosás	Fogmosás kutyabarát fogkrémmel	1500.00	15	t	2026-03-02 21:37:25.178068+01
6	Kiskutyus első kozmetika	Finom kozmetika 6 hónap alatti kutyusoknak	3000.00	60	t	2026-03-02 21:37:25.178068+01
\.


--
-- Data for Name: staff_availability; Type: TABLE DATA; Schema: public; Owner: drex
--

COPY public.staff_availability (id, date, start_time, end_time, is_blocked, note, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: drex
--

COPY public.users (id, email, password_hash, first_name, last_name, phone, role, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: drex
--

SELECT pg_catalog.setval('public.services_id_seq', 6, true);


--
-- Name: staff_availability_id_seq; Type: SEQUENCE SET; Schema: public; Owner: drex
--

SELECT pg_catalog.setval('public.staff_availability_id_seq', 1, false);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: drex
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: dogs dogs_pkey; Type: CONSTRAINT; Schema: public; Owner: drex
--

ALTER TABLE ONLY public.dogs
    ADD CONSTRAINT dogs_pkey PRIMARY KEY (id);


--
-- Name: errors errors_pkey; Type: CONSTRAINT; Schema: public; Owner: drex
--

ALTER TABLE ONLY public.errors
    ADD CONSTRAINT errors_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: drex
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: staff_availability staff_availability_pkey; Type: CONSTRAINT; Schema: public; Owner: drex
--

ALTER TABLE ONLY public.staff_availability
    ADD CONSTRAINT staff_availability_pkey PRIMARY KEY (id);


--
-- Name: staff_availability uq_availability_date; Type: CONSTRAINT; Schema: public; Owner: drex
--

ALTER TABLE ONLY public.staff_availability
    ADD CONSTRAINT uq_availability_date UNIQUE (date);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: drex
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: drex
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_appt_dog_id; Type: INDEX; Schema: public; Owner: drex
--

CREATE INDEX idx_appt_dog_id ON public.appointments USING btree (dog_id);


--
-- Name: idx_appt_no_double_book; Type: INDEX; Schema: public; Owner: drex
--

CREATE UNIQUE INDEX idx_appt_no_double_book ON public.appointments USING btree (scheduled_at) WHERE (status = ANY (ARRAY['függőben'::public.appointment_status, 'jóváhagyva'::public.appointment_status]));


--
-- Name: idx_appt_scheduled_at; Type: INDEX; Schema: public; Owner: drex
--

CREATE INDEX idx_appt_scheduled_at ON public.appointments USING btree (scheduled_at);


--
-- Name: idx_appt_status; Type: INDEX; Schema: public; Owner: drex
--

CREATE INDEX idx_appt_status ON public.appointments USING btree (status);


--
-- Name: idx_appt_user_id; Type: INDEX; Schema: public; Owner: drex
--

CREATE INDEX idx_appt_user_id ON public.appointments USING btree (user_id);


--
-- Name: idx_availability_date; Type: INDEX; Schema: public; Owner: drex
--

CREATE INDEX idx_availability_date ON public.staff_availability USING btree (date);


--
-- Name: idx_dogs_user_id; Type: INDEX; Schema: public; Owner: drex
--

CREATE INDEX idx_dogs_user_id ON public.dogs USING btree (user_id);


--
-- Name: idx_errors_code; Type: INDEX; Schema: public; Owner: drex
--

CREATE INDEX idx_errors_code ON public.errors USING btree (error_code);


--
-- Name: idx_errors_occurred; Type: INDEX; Schema: public; Owner: drex
--

CREATE INDEX idx_errors_occurred ON public.errors USING btree (occurred_at DESC);


--
-- Name: idx_errors_severity; Type: INDEX; Schema: public; Owner: drex
--

CREATE INDEX idx_errors_severity ON public.errors USING btree (severity);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: drex
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: appointments trg_appointments_updated_at; Type: TRIGGER; Schema: public; Owner: drex
--

CREATE TRIGGER trg_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: dogs trg_dogs_updated_at; Type: TRIGGER; Schema: public; Owner: drex
--

CREATE TRIGGER trg_dogs_updated_at BEFORE UPDATE ON public.dogs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: users trg_users_updated_at; Type: TRIGGER; Schema: public; Owner: drex
--

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: appointments appointments_dog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: drex
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_dog_id_fkey FOREIGN KEY (dog_id) REFERENCES public.dogs(id) ON DELETE RESTRICT;


--
-- Name: appointments appointments_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: drex
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE RESTRICT;


--
-- Name: appointments appointments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: drex
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: dogs dogs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: drex
--

ALTER TABLE ONLY public.dogs
    ADD CONSTRAINT dogs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: errors errors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: drex
--

ALTER TABLE ONLY public.errors
    ADD CONSTRAINT errors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict B9POxnwMRtfqI5jq5JTpE3RKjtkmCzipt32uiG7bISbes9bdlbs9iGTWyVWbeqA

