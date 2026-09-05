--
-- PostgreSQL database dump
--

\restrict 6BCmBDEDlIHafeKGgoHs0kphriP5kWEIW2b1cVE1wRn6PEpuGipvQgxMLre4iGA

-- Dumped from database version 18.6 (Debian 18.6-1.pgdg12+2)
-- Dumped by pg_dump version 18.6

-- Started on 2026-09-04 22:40:05

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
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: tjb_cse340_db
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO tjb_cse340_db;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16399)
-- Name: organization; Type: TABLE; Schema: public; Owner: tjb_cse340_db
--

CREATE TABLE public.organization (
    organization_id integer NOT NULL,
    name character varying(150) NOT NULL,
    description text CONSTRAINT organization_desription_not_null NOT NULL,
    contact_email character varying(255) CONSTRAINT "organization_contact-email_not_null" NOT NULL,
    logo_filename character varying(255) NOT NULL
);


ALTER TABLE public.organization OWNER TO tjb_cse340_db;

--
-- TOC entry 220 (class 1259 OID 16411)
-- Name: organization_organization_id_seq; Type: SEQUENCE; Schema: public; Owner: tjb_cse340_db
--

ALTER TABLE public.organization ALTER COLUMN organization_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.organization_organization_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3378 (class 0 OID 16399)
-- Dependencies: 219
-- Data for Name: organization; Type: TABLE DATA; Schema: public; Owner: tjb_cse340_db
--

COPY public.organization (organization_id, name, description, contact_email, logo_filename) FROM stdin;
1	BrightFuture Builders	A nonprofit focused on improving community infrastructure through sustainable construction projects.	info@brightfuturebuilders.org	brightfuture-logo.png
2	GreenHarvest Growers	An urban farming collective promoting food sustainability and education in local neighborhoods.	contact@greenharvest.org	greenharvest-logo.png
3	UnityServe Volunteers	A volunteer coordination group supporting local charities and service initiatives.	hello@unityserve.org	unityserve-logo.png
\.


--
-- TOC entry 3385 (class 0 OID 0)
-- Dependencies: 220
-- Name: organization_organization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tjb_cse340_db
--

SELECT pg_catalog.setval('public.organization_organization_id_seq', 3, true);


--
-- TOC entry 3230 (class 2606 OID 16410)
-- Name: organization organization_pkey; Type: CONSTRAINT; Schema: public; Owner: tjb_cse340_db
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (organization_id);


--
-- TOC entry 2053 (class 826 OID 16391)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO tjb_cse340_db;


--
-- TOC entry 2055 (class 826 OID 16393)
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO tjb_cse340_db;


--
-- TOC entry 2054 (class 826 OID 16392)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO tjb_cse340_db;


--
-- TOC entry 2052 (class 826 OID 16390)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO tjb_cse340_db;


-- Completed on 2026-09-04 22:40:10

--
-- PostgreSQL database dump complete
--

\unrestrict 6BCmBDEDlIHafeKGgoHs0kphriP5kWEIW2b1cVE1wRn6PEpuGipvQgxMLre4iGA

