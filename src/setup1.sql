--
-- PostgreSQL database dump
--

\restrict KwONqQo5QlMWB6bf0ka1Ly1LH3SjMESg6oAEPtDCV1D92lTW5FKh8qqvpc2uEEm

-- Dumped from database version 18.6 (Debian 18.6-1.pgdg12+2)
-- Dumped by pg_dump version 18.6

-- Started on 2026-09-15 17:48:38

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
-- TOC entry 5 (class 2615 OID 16560)
-- Name: public; Type: SCHEMA; Schema: -; Owner: tjb_cse340_db
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO tjb_cse340_db;

--
-- TOC entry 3414 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: tjb_cse340_db
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16561)
-- Name: categories; Type: TABLE; Schema: public; Owner: tjb_cse340_db
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.categories OWNER TO tjb_cse340_db;

--
-- TOC entry 220 (class 1259 OID 16566)
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: tjb_cse340_db
--

ALTER TABLE public.categories ALTER COLUMN category_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.categories_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 16567)
-- Name: organizations; Type: TABLE; Schema: public; Owner: tjb_cse340_db
--

CREATE TABLE public.organizations (
    organization_id integer CONSTRAINT organization_organization_id_not_null NOT NULL,
    name character varying(150) CONSTRAINT organization_name_not_null NOT NULL,
    description text CONSTRAINT organization_desription_not_null NOT NULL,
    contact_email character varying(255) CONSTRAINT "organization_contact-email_not_null" NOT NULL,
    logo_filename character varying(255) CONSTRAINT organization_logo_filename_not_null NOT NULL
);


ALTER TABLE public.organizations OWNER TO tjb_cse340_db;

--
-- TOC entry 222 (class 1259 OID 16577)
-- Name: organization_organization_id_seq; Type: SEQUENCE; Schema: public; Owner: tjb_cse340_db
--

ALTER TABLE public.organizations ALTER COLUMN organization_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.organization_organization_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 16578)
-- Name: project_categories; Type: TABLE; Schema: public; Owner: tjb_cse340_db
--

CREATE TABLE public.project_categories (
    project_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.project_categories OWNER TO tjb_cse340_db;

--
-- TOC entry 224 (class 1259 OID 16583)
-- Name: projects; Type: TABLE; Schema: public; Owner: tjb_cse340_db
--

CREATE TABLE public.projects (
    project_id integer NOT NULL,
    organization_id integer NOT NULL,
    title character varying(250) NOT NULL,
    description text NOT NULL,
    location character varying(250) NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.projects OWNER TO tjb_cse340_db;

--
-- TOC entry 225 (class 1259 OID 16595)
-- Name: projects_project_id_seq; Type: SEQUENCE; Schema: public; Owner: tjb_cse340_db
--

ALTER TABLE public.projects ALTER COLUMN project_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.projects_project_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3402 (class 0 OID 16561)
-- Dependencies: 219
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: tjb_cse340_db
--

COPY public.categories (category_id, name) FROM stdin;
2	Educational
3	Community Service
4	Health & Wellness
1	Environmental
\.


--
-- TOC entry 3404 (class 0 OID 16567)
-- Dependencies: 221
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: tjb_cse340_db
--

COPY public.organizations (organization_id, name, description, contact_email, logo_filename) FROM stdin;
1	BrightFuture Builders	A nonprofit focused on improving community infrastructure through sustainable construction projects.	info@brightfuturebuilders.org	brightfuture-logo.png
2	GreenHarvest Growers	An urban farming collective promoting food sustainability and education in local neighborhoods.	contact@greenharvest.org	greenharvest-logo.png
3	UnityServe Volunteers	A volunteer coordination group supporting local charities and service initiatives.	hello@unityserve.org	unityserve-logo.png
\.


--
-- TOC entry 3406 (class 0 OID 16578)
-- Dependencies: 223
-- Data for Name: project_categories; Type: TABLE DATA; Schema: public; Owner: tjb_cse340_db
--

COPY public.project_categories (project_id, category_id) FROM stdin;
16	1
17	2
18	3
19	1
20	2
21	3
22	1
23	2
24	3
25	1
26	2
27	3
28	1
29	2
30	3
18	1
24	2
24	4
25	4
\.


--
-- TOC entry 3407 (class 0 OID 16583)
-- Dependencies: 224
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: tjb_cse340_db
--

COPY public.projects (project_id, organization_id, title, description, location, date) FROM stdin;
16	1	Northern District Housing Development	Residential housing development in the northern district	Chicago, USA	2027-02-14
17	1	City Bridge Renovation	City bridge renovation and structural reinforcement	Dublin, Ireland	2027-07-22
18	1	Municipal Sports Complex Construction	Construction of a new municipal sports complex	Amsterdam, Netherlands	2026-11-09
19	1	Office Tower Modernization	Commercial office tower modernization project	London, UK	2027-05-30
20	1	Smart Traffic Infrastructure	Smart traffic infrastructure implementation	Singapore	2027-01-17
21	2	Precision Irrigation Deployment	Precision irrigation system deployment across farming sites	Toronto, Canada	2026-12-03
22	2	Greenhouse Automation & Climate Monitoring	Greenhouse automation and climate monitoring project	Frankfurt, Germany	2027-08-11
23	2	Satellite Crop Yield Prediction	Crop yield prediction using satellite imagery	Copenhagen, Denmark	2027-03-08
24	2	Agricultural Renewable Energy Integration	Renewable energy integration for agricultural facilities	Melbourne, Australia	2027-06-19
25	2	Sustainable Fertilizer Optimization Research	Research initiative on sustainable fertilizer optimization	Oslo, Norway	2026-10-27
26	3	Volunteer Coordination Platform Redesign	Volunteer coordination platform redesign	Zurich, Switzerland	2027-04-15
27	3	Food Bank Logistics Improvement	Community food bank logistics improvement project	Dubai, UAE	2027-09-01
28	3	Digital Case Management System	Digital case management system for social services	Madrid, Spain	2027-02-28
29	3	Neighborhood Outreach Mobile App	Mobile app for neighborhood outreach programs	Stockholm, Sweden	2026-12-20
30	3	Online Donation & Fundraising Portal	Online donation and fundraising portal development	Seoul, South Korea	2027-07-05
\.


--
-- TOC entry 3416 (class 0 OID 0)
-- Dependencies: 220
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tjb_cse340_db
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 4, true);


--
-- TOC entry 3417 (class 0 OID 0)
-- Dependencies: 222
-- Name: organization_organization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tjb_cse340_db
--

SELECT pg_catalog.setval('public.organization_organization_id_seq', 3, true);


--
-- TOC entry 3418 (class 0 OID 0)
-- Dependencies: 225
-- Name: projects_project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tjb_cse340_db
--

SELECT pg_catalog.setval('public.projects_project_id_seq', 30, true);


--
-- TOC entry 3245 (class 2606 OID 16597)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: tjb_cse340_db
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- TOC entry 3247 (class 2606 OID 16599)
-- Name: organizations organization_pkey; Type: CONSTRAINT; Schema: public; Owner: tjb_cse340_db
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organization_pkey PRIMARY KEY (organization_id);


--
-- TOC entry 3249 (class 2606 OID 16601)
-- Name: project_categories pk_projekt_categories; Type: CONSTRAINT; Schema: public; Owner: tjb_cse340_db
--

ALTER TABLE ONLY public.project_categories
    ADD CONSTRAINT pk_projekt_categories PRIMARY KEY (project_id, category_id);


--
-- TOC entry 3251 (class 2606 OID 16603)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: tjb_cse340_db
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (project_id);


--
-- TOC entry 3252 (class 2606 OID 16604)
-- Name: project_categories fk_category; Type: FK CONSTRAINT; Schema: public; Owner: tjb_cse340_db
--

ALTER TABLE ONLY public.project_categories
    ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- TOC entry 3253 (class 2606 OID 16609)
-- Name: project_categories fk_project; Type: FK CONSTRAINT; Schema: public; Owner: tjb_cse340_db
--

ALTER TABLE ONLY public.project_categories
    ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(project_id);


--
-- TOC entry 3254 (class 2606 OID 16614)
-- Name: projects fk_projects_organization; Type: FK CONSTRAINT; Schema: public; Owner: tjb_cse340_db
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_projects_organization FOREIGN KEY (organization_id) REFERENCES public.organizations(organization_id) NOT VALID;


--
-- TOC entry 3415 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: tjb_cse340_db
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- TOC entry 2067 (class 826 OID 16391)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO tjb_cse340_db;


--
-- TOC entry 2069 (class 826 OID 16393)
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO tjb_cse340_db;


--
-- TOC entry 2068 (class 826 OID 16392)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO tjb_cse340_db;


--
-- TOC entry 2066 (class 826 OID 16390)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO tjb_cse340_db;


-- Completed on 2026-09-15 17:48:40

--
-- PostgreSQL database dump complete
--

\unrestrict KwONqQo5QlMWB6bf0ka1Ly1LH3SjMESg6oAEPtDCV1D92lTW5FKh8qqvpc2uEEm

