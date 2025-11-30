--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-09-30 10:15:55

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 90580)
-- Name: article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.article (
    id integer NOT NULL,
    creation_date timestamp(6) with time zone NOT NULL,
    last_modified_date timestamp(6) with time zone,
    codearticle character varying(255),
    designation character varying(255),
    identreprise integer,
    photo character varying(255),
    prixunitaireht numeric(38,2),
    prixunitairettc numeric(38,2),
    tauxtva numeric(38,2),
    idcategory integer
);


ALTER TABLE public.article OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 90674)
-- Name: article_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.article_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.article_seq OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 90587)
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id integer NOT NULL,
    creation_date timestamp(6) with time zone NOT NULL,
    last_modified_date timestamp(6) with time zone,
    code character varying(255),
    designation character varying(255),
    identreprise integer
);


ALTER TABLE public.category OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 90675)
-- Name: category_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.category_seq OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 90594)
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
    id integer NOT NULL,
    creation_date timestamp(6) with time zone NOT NULL,
    last_modified_date timestamp(6) with time zone,
    adresse1 character varying(255),
    adresse2 character varying(255),
    codepostale character varying(255),
    pays character varying(255),
    ville character varying(255),
    identreprise integer,
    mail character varying(255),
    nom character varying(255),
    num_tel character varying(255),
    photo character varying(255),
    prenom character varying(255)
);


ALTER TABLE public.client OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 90676)
-- Name: client_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.client_seq OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 90601)
-- Name: commandeclient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commandeclient (
    id integer NOT NULL,
    creation_date timestamp(6) with time zone NOT NULL,
    last_modified_date timestamp(6) with time zone,
    code character varying(255),
    datecommande timestamp(6) with time zone,
    etatcommande character varying(255),
    identreprise integer,
    idclient integer,
    CONSTRAINT commandeclient_etatcommande_check CHECK (((etatcommande)::text = ANY ((ARRAY['EN_PREPARATION'::character varying, 'VALIDEE'::character varying, 'LIVREE'::character varying])::text[])))
);


ALTER TABLE public.commandeclient OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 90677)
-- Name: commandeclient_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.commandeclient_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commandeclient_seq OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 90609)
-- Name: commandefournisseur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commandefournisseur (
    id integer NOT NULL,
    creation_date timestamp(6) with time zone NOT NULL,
    last_modified_date timestamp(6) with time zone,
    code character varying(255),
    datecommande timestamp(6) with time zone,
    etatcommande character varying(255),
    identreprise integer,
    idfournisseur integer,
    CONSTRAINT commandefournisseur_etatcommande_check CHECK (((etatcommande)::text = ANY ((ARRAY['EN_PREPARATION'::character varying, 'VALIDEE'::character varying, 'LIVREE'::character varying])::text[])))
);


ALTER TABLE public.commandefournisseur OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 90678)
-- Name: commandefournisseur_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.commandefournisseur_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commandefournisseur_seq OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 90617)
-- Name: entreprise; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.entreprise (
    id integer NOT NULL,
    creation_date timestamp(6) with time zone NOT NULL,
    last_modified_date timestamp(6) with time zone,
    adresse1 character varying(255),
    adresse2 character varying(255),
    codepostale character varying(255),
    pays character varying(255),
    ville character varying(255),
    codefiscal character varying(255),
    description character varying(255),
    email character varying(255),
    nom character varying(255),
    numtel character varying(255),
    photo character varying(255),
    siteweb character varying(255)
);


ALTER TABLE public.entreprise OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 90679)
-- Name: entreprise_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.entreprise_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.entreprise_seq OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 90624)
-- Name: fournisseur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fournisseur (
    id integer NOT NULL,
    creation_date timestamp(6) with time zone NOT NULL,
    last_modified_date timestamp(6) with time zone,
    adresse1 character varying(255),
    adresse2 character varying(255),
    codepostale character varying(255),
    pays character varying(255),
    ville character varying(255),
    identreprise integer,
    mail character varying(255),
    nom character varying(255),
    num_tel character varying(255),
    photo character varying(255),
    prenom character varying(255)
);


ALTER TABLE public.fournisseur OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 90680)
-- Name: fournisseur_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fournisseur_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fournisseur_seq OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 90631)
-- Name: lignecommandeclient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lignecommandeclient (
    id integer NOT NULL,
    creation_date timestamp(6) with time zone NOT NULL,
    last_modified_date timestamp(6) with time zone,
    identreprise integer,
    prixunitaire numeric(38,2),
    quantite numeric(38,2),
    idarticle integer,
    idcommandeclient integer
);


ALTER TABLE public.lignecommandeclient OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 90681)
-- Name: lignecommandeclient_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lignecommandeclient_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lignecommandeclient_seq OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 90636)
-- Name: lignecommandefournisseur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lignecommandefournisseur (
    id integer NOT NULL,
    creation_date timestamp(6) with time zone NOT NULL,
    last_modified_date timestamp(6) with time zone,
    identreprise integer,
    prixunitaire numeric(38,2),
    quantite numeric(38,2),
    idarticle integer,
    idcommandefournisseur integer
);


ALTER TABLE public.lignecommandefournisseur OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 90682)
-- Name: lignecommandefournisseur_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lignecommandefournisseur_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lignecommandefournisseur_seq OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 90641)
-- Name: lignevente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lignevente (
    id integer NOT NULL,
    creation_date timestamp(6) with time zone NOT NULL,
    last_modified_date timestamp(6) with time zone,
    identreprise integer,
    prixunitaire numeric(38,2),
    quantite numeric(38,2),
    idarticle integer,
    idvente integer
);


ALTER TABLE public.lignevente OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 90683)
-- Name: lignevente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lignevente_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lignevente_seq OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 90646)
-- Name: mvtstk; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mvtstk (
    id integer NOT NULL,
    creation_date timestamp(6) with time zone NOT NULL,
    last_modified_date timestamp(6) with time zone,
    datemvt timestamp(6) with time zone,
    identreprise integer,
    quantite numeric(38,2),
    sourcemvt character varying(255),
    typemvt character varying(255),
    idarticle integer,
    CONSTRAINT mvtstk_sourcemvt_check CHECK (((sourcemvt)::text = ANY ((ARRAY['COMMANDE_CLIENT'::character varying, 'COMMANDE_FOURNISSEUR'::character varying, 'VENTE'::character varying])::text[]))),
    CONSTRAINT mvtstk_typemvt_check CHECK (((typemvt)::text = ANY ((ARRAY['ENTREE'::character varying, 'SORTIE'::character varying, 'CORRECTION_POS'::character varying, 'CORRECTION_NEG'::character varying])::text[])))
);


ALTER TABLE public.mvtstk OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 90684)
-- Name: mvtstk_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mvtstk_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mvtstk_seq OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 90655)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    creation_date timestamp(6) with time zone NOT NULL,
    last_modified_date timestamp(6) with time zone,
    rolename character varying(255),
    idutilisateur integer
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 90685)
-- Name: roles_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_seq OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 90660)
-- Name: utilisateur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateur (
    id integer NOT NULL,
    creation_date timestamp(6) with time zone NOT NULL,
    last_modified_date timestamp(6) with time zone,
    adresse1 character varying(255),
    adresse2 character varying(255),
    codepostale character varying(255),
    pays character varying(255),
    ville character varying(255),
    datedenaissance timestamp(6) with time zone,
    email character varying(255),
    motdepasse character varying(255),
    nom character varying(255),
    photo character varying(255),
    prenom character varying(255),
    identreprise integer
);


ALTER TABLE public.utilisateur OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 90686)
-- Name: utilisateur_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateur_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateur_seq OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 90667)
-- Name: ventes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ventes (
    id integer NOT NULL,
    creation_date timestamp(6) with time zone NOT NULL,
    last_modified_date timestamp(6) with time zone,
    code character varying(255),
    commentaire character varying(255),
    datevente timestamp(6) with time zone,
    identreprise integer
);


ALTER TABLE public.ventes OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 90687)
-- Name: ventes_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ventes_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ventes_seq OWNER TO postgres;

--
-- TOC entry 4895 (class 0 OID 90580)
-- Dependencies: 217
-- Data for Name: article; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.article (id, creation_date, last_modified_date, codearticle, designation, identreprise, photo, prixunitaireht, prixunitairettc, tauxtva, idcategory) FROM stdin;
4	2025-09-28 15:38:23.898519+02	2025-09-28 15:38:23.898519+02	INF02	chaussure de tennis	\N		120.00	139.20	169.00	1
5	2025-09-28 15:54:33.134159+02	2025-09-28 15:55:01.085898+02	INF03	souris	\N	https://farm66.staticflickr.com/65535/54817362716_0c28e40cd0_z.jpg	123.00	124.23	12.00	1
52	2025-09-29 12:43:02.61374+02	2025-09-29 12:43:32.356948+02	SM-GALAXY-S10	téléphone	\N	https://farm66.staticflickr.com/65535/54818697187_67bcdd92a6_z.jpg	1000.00	1010.00	1.30	1
102	2025-09-29 14:11:34.792856+02	2025-09-29 14:11:41.454328+02	SM-GALAXY-S11	samsung s11	\N	https://farm66.staticflickr.com/65535/54820017135_9e5f0060ab_z.jpg	2000.00	2020.00	1.30	1
202	2025-09-29 19:56:31.403951+02	2025-09-29 19:56:48.027759+02	IT-GALAXY-S10	itel s23	\N	https://farm66.staticflickr.com/65535/54820893685_af9801caf2_z.jpg	10002.00	10102.02	0.00	1
\.


--
-- TOC entry 4896 (class 0 OID 90587)
-- Dependencies: 218
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (id, creation_date, last_modified_date, code, designation, identreprise) FROM stdin;
1	2025-09-28 14:45:12.180909+02	2025-09-28 14:45:12.180909+02	INF	informatique	\N
\.


--
-- TOC entry 4897 (class 0 OID 90594)
-- Dependencies: 219
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client (id, creation_date, last_modified_date, adresse1, adresse2, codepostale, pays, ville, identreprise, mail, nom, num_tel, photo, prenom) FROM stdin;
1	2025-09-28 15:09:47.605292+02	2025-09-28 15:09:47.605292+02	yaoundé	yaoundé	\N	Cameroun	yaoundé	\N	diminzali@gmail.com	nzali fankem	652755554	\N	vladimir
2	2025-09-28 16:25:31.465473+02	2025-09-28 16:25:40.563743+02	yde	yde1	\N	Cameroun	dla	\N	diop@gmail.com	diop	564564	https://farm66.staticflickr.com/65535/54817686623_e99aa6a71f_z.jpg	kembeu
\.


--
-- TOC entry 4898 (class 0 OID 90601)
-- Dependencies: 220
-- Data for Name: commandeclient; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.commandeclient (id, creation_date, last_modified_date, code, datecommande, etatcommande, identreprise, idclient) FROM stdin;
1	2025-09-28 16:41:40.210929+02	2025-09-28 16:41:40.210929+02	CMD003	2025-09-28 16:41:39.307603+02	EN_PREPARATION	1	2
2	2025-09-28 17:46:38.063721+02	2025-09-28 17:46:38.063721+02	CMD005	2025-09-28 17:46:35.607318+02	VALIDEE	1	1
\.


--
-- TOC entry 4899 (class 0 OID 90609)
-- Dependencies: 221
-- Data for Name: commandefournisseur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.commandefournisseur (id, creation_date, last_modified_date, code, datecommande, etatcommande, identreprise, idfournisseur) FROM stdin;
1	2025-09-28 17:03:21.409793+02	2025-09-28 17:03:21.409793+02	CMD004	2025-09-28 17:03:21.405794+02	EN_PREPARATION	1	1
\.


--
-- TOC entry 4900 (class 0 OID 90617)
-- Dependencies: 222
-- Data for Name: entreprise; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.entreprise (id, creation_date, last_modified_date, adresse1, adresse2, codepostale, pays, ville, codefiscal, description, email, nom, numtel, photo, siteweb) FROM stdin;
1	2025-09-28 14:18:15.726514+02	2025-09-28 14:18:15.726514+02	123 Rue Test	1234 Rue Test	\N	France	Paris	CF123456	Description test	test@entreprise.com	Mon Entreprise	0123456789	\N	\N
2	2025-09-28 15:04:46.118404+02	2025-09-28 15:04:46.118404+02	123 Rue Test	1234 Rue Test	\N	France	Paris	CF123456	Description test	test1@entreprise.com	Mon Entreprise2	0123456788	\N	\N
52	2025-09-29 10:44:21.232309+02	2025-09-29 10:44:21.232309+02	15 Avenue des Champs-Élysées	Bâtiment A, 3ème étage	\N	Cameroun	Paris	FR12345678901	Société spécialisée dans le développement de solutions logicielles et la gestion de stock pour les entreprises.	admin@techsolutions.fr	TechSolutions SARL	652755554	\N	\N
102	2025-09-29 14:16:53.720733+02	2025-09-29 14:16:53.720733+02	yde	yde	10001	Cameroun	dla	iccsoftyde1	solution informatiques	iccsoft@gmail.com	iccsoft	652755554	\N	\N
103	2025-09-29 14:34:01.479259+02	2025-09-29 14:34:01.479259+02	yde	yde1	1001	Cameroun	dla	FR12345678901	sdfsdfdsf	irma@gmail	irma	652755554	\N	\N
152	2025-09-29 16:18:09.30546+02	2025-09-29 16:18:09.30546+02	yde	yde	10001	Cameroun	dla	FR12345678901	sdfsdf	chantal@gmail.com	chantal	652755554	\N	\N
202	2025-09-29 17:11:43.463637+02	2025-09-29 17:11:43.463637+02	yde	yde	10001	Cameroun	dla	TS2024001	fgdfvdv	chantal@gmail.com	chantal	652755554	\N	\N
252	2025-09-29 19:40:05.846173+02	2025-09-29 19:40:05.846173+02	yaoundé	émana	10001	Cameroun	yaoundé	vladimir	sfsdf	diminzali@gmail.com	nzali fankem vladimir	652755554	\N	\N
\.


--
-- TOC entry 4901 (class 0 OID 90624)
-- Dependencies: 223
-- Data for Name: fournisseur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fournisseur (id, creation_date, last_modified_date, adresse1, adresse2, codepostale, pays, ville, identreprise, mail, nom, num_tel, photo, prenom) FROM stdin;
1	2025-09-28 17:02:26.192735+02	2025-09-28 17:02:33.287388+02	yde	yde	\N	cameroun	dla	\N	lo@gmail.com	loriane	321313	https://farm66.staticflickr.com/65535/54817758504_323d6e6282_z.jpg	wou
\.


--
-- TOC entry 4902 (class 0 OID 90631)
-- Dependencies: 224
-- Data for Name: lignecommandeclient; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lignecommandeclient (id, creation_date, last_modified_date, identreprise, prixunitaire, quantite, idarticle, idcommandeclient) FROM stdin;
\.


--
-- TOC entry 4903 (class 0 OID 90636)
-- Dependencies: 225
-- Data for Name: lignecommandefournisseur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lignecommandefournisseur (id, creation_date, last_modified_date, identreprise, prixunitaire, quantite, idarticle, idcommandefournisseur) FROM stdin;
\.


--
-- TOC entry 4904 (class 0 OID 90641)
-- Dependencies: 226
-- Data for Name: lignevente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lignevente (id, creation_date, last_modified_date, identreprise, prixunitaire, quantite, idarticle, idvente) FROM stdin;
\.


--
-- TOC entry 4905 (class 0 OID 90646)
-- Dependencies: 227
-- Data for Name: mvtstk; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mvtstk (id, creation_date, last_modified_date, datemvt, identreprise, quantite, sourcemvt, typemvt, idarticle) FROM stdin;
1	2025-09-28 18:52:32.587485+02	2025-09-28 18:52:32.587485+02	2025-09-28 18:52:27.729+02	1	299.00	COMMANDE_FOURNISSEUR	ENTREE	5
2	2025-09-28 18:53:31.851302+02	2025-09-28 18:53:31.851302+02	2025-09-28 18:53:31.324+02	1	1.00	COMMANDE_CLIENT	CORRECTION_POS	5
3	2025-09-28 18:54:33.457931+02	2025-09-28 18:54:33.457931+02	2025-09-28 18:54:33.37+02	1	-299.00	COMMANDE_FOURNISSEUR	SORTIE	5
4	2025-09-28 18:55:12.138544+02	2025-09-28 18:55:12.138544+02	2025-09-28 18:55:12.079+02	1	-1.00	VENTE	SORTIE	5
\.


--
-- TOC entry 4906 (class 0 OID 90655)
-- Dependencies: 228
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, creation_date, last_modified_date, rolename, idutilisateur) FROM stdin;
154	2025-09-29 14:16:53.843459+02	2025-09-29 14:16:53.843459+02	ADMIN	\N
155	2025-09-29 14:34:01.595693+02	2025-09-29 14:34:01.595693+02	ADMIN	\N
202	2025-09-29 16:18:11.423555+02	2025-09-29 16:18:11.423555+02	ADMIN	\N
353	2025-09-29 19:35:39.519805+02	2025-09-29 19:35:39.519805+02	ADMIN	352
354	2025-09-29 19:40:05.979353+02	2025-09-29 19:40:05.979353+02	ADMIN	353
\.


--
-- TOC entry 4907 (class 0 OID 90660)
-- Dependencies: 229
-- Data for Name: utilisateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateur (id, creation_date, last_modified_date, adresse1, adresse2, codepostale, pays, ville, datedenaissance, email, motdepasse, nom, photo, prenom, identreprise) FROM stdin;
353	2025-09-29 19:40:05.975359+02	2025-09-29 19:40:32.378085+02	yaoundé	émana	10001	Cameroun	yaoundé	2025-09-29 19:40:05.85317+02	diminzali@gmail.com	$2a$10$z9F3jWr6VwXewaRTnvM1luPKUJvJGydVwq7JgEPtJ852wC8CcJ1I6	nzali fankem vladimir	\N	vladimir	252
352	2025-09-29 19:35:10.568192+02	2025-09-29 19:35:38.829207+02	yaoundé	\N	75008	France	yaoundé	2000-01-07 01:00:00+01	diminzali1@gmail.com	$2a$10$NOcQplSn0Pw8qWVVk1GiaeaBViiaGUS/GaAib//jgrhMEF9sz0RQK	vladimir	https://images.pexels.com/photos/1181346/pexels-photo-1181346.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1	nzali	202
\.


--
-- TOC entry 4908 (class 0 OID 90667)
-- Dependencies: 230
-- Data for Name: ventes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ventes (id, creation_date, last_modified_date, code, commentaire, datevente, identreprise) FROM stdin;
\.


--
-- TOC entry 4928 (class 0 OID 0)
-- Dependencies: 231
-- Name: article_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.article_seq', 251, true);


--
-- TOC entry 4929 (class 0 OID 0)
-- Dependencies: 232
-- Name: category_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_seq', 1, true);


--
-- TOC entry 4930 (class 0 OID 0)
-- Dependencies: 233
-- Name: client_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_seq', 51, true);


--
-- TOC entry 4931 (class 0 OID 0)
-- Dependencies: 234
-- Name: commandeclient_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.commandeclient_seq', 51, true);


--
-- TOC entry 4932 (class 0 OID 0)
-- Dependencies: 235
-- Name: commandefournisseur_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.commandefournisseur_seq', 1, true);


--
-- TOC entry 4933 (class 0 OID 0)
-- Dependencies: 236
-- Name: entreprise_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.entreprise_seq', 301, true);


--
-- TOC entry 4934 (class 0 OID 0)
-- Dependencies: 237
-- Name: fournisseur_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fournisseur_seq', 1, true);


--
-- TOC entry 4935 (class 0 OID 0)
-- Dependencies: 238
-- Name: lignecommandeclient_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lignecommandeclient_seq', 1, false);


--
-- TOC entry 4936 (class 0 OID 0)
-- Dependencies: 239
-- Name: lignecommandefournisseur_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lignecommandefournisseur_seq', 1, false);


--
-- TOC entry 4937 (class 0 OID 0)
-- Dependencies: 240
-- Name: lignevente_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lignevente_seq', 1, false);


--
-- TOC entry 4938 (class 0 OID 0)
-- Dependencies: 241
-- Name: mvtstk_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mvtstk_seq', 51, true);


--
-- TOC entry 4939 (class 0 OID 0)
-- Dependencies: 242
-- Name: roles_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_seq', 401, true);


--
-- TOC entry 4940 (class 0 OID 0)
-- Dependencies: 243
-- Name: utilisateur_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateur_seq', 401, true);


--
-- TOC entry 4941 (class 0 OID 0)
-- Dependencies: 244
-- Name: ventes_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ventes_seq', 1, false);


--
-- TOC entry 4711 (class 2606 OID 90586)
-- Name: article article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_pkey PRIMARY KEY (id);


--
-- TOC entry 4713 (class 2606 OID 90593)
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- TOC entry 4715 (class 2606 OID 90600)
-- Name: client client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id);


--
-- TOC entry 4717 (class 2606 OID 90608)
-- Name: commandeclient commandeclient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commandeclient
    ADD CONSTRAINT commandeclient_pkey PRIMARY KEY (id);


--
-- TOC entry 4719 (class 2606 OID 90616)
-- Name: commandefournisseur commandefournisseur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commandefournisseur
    ADD CONSTRAINT commandefournisseur_pkey PRIMARY KEY (id);


--
-- TOC entry 4721 (class 2606 OID 90623)
-- Name: entreprise entreprise_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entreprise
    ADD CONSTRAINT entreprise_pkey PRIMARY KEY (id);


--
-- TOC entry 4723 (class 2606 OID 90630)
-- Name: fournisseur fournisseur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fournisseur
    ADD CONSTRAINT fournisseur_pkey PRIMARY KEY (id);


--
-- TOC entry 4725 (class 2606 OID 90635)
-- Name: lignecommandeclient lignecommandeclient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lignecommandeclient
    ADD CONSTRAINT lignecommandeclient_pkey PRIMARY KEY (id);


--
-- TOC entry 4727 (class 2606 OID 90640)
-- Name: lignecommandefournisseur lignecommandefournisseur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lignecommandefournisseur
    ADD CONSTRAINT lignecommandefournisseur_pkey PRIMARY KEY (id);


--
-- TOC entry 4729 (class 2606 OID 90645)
-- Name: lignevente lignevente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lignevente
    ADD CONSTRAINT lignevente_pkey PRIMARY KEY (id);


--
-- TOC entry 4731 (class 2606 OID 90654)
-- Name: mvtstk mvtstk_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mvtstk
    ADD CONSTRAINT mvtstk_pkey PRIMARY KEY (id);


--
-- TOC entry 4733 (class 2606 OID 90659)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4735 (class 2606 OID 90666)
-- Name: utilisateur utilisateur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_pkey PRIMARY KEY (id);


--
-- TOC entry 4737 (class 2606 OID 90673)
-- Name: ventes ventes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventes
    ADD CONSTRAINT ventes_pkey PRIMARY KEY (id);


--
-- TOC entry 4749 (class 2606 OID 90743)
-- Name: utilisateur fk1lqyf8cuumbj0iku4axqklfu3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT fk1lqyf8cuumbj0iku4axqklfu3 FOREIGN KEY (identreprise) REFERENCES public.entreprise(id);


--
-- TOC entry 4741 (class 2606 OID 90703)
-- Name: lignecommandeclient fk29ctec6walxsuc2jcixedf15s; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lignecommandeclient
    ADD CONSTRAINT fk29ctec6walxsuc2jcixedf15s FOREIGN KEY (idarticle) REFERENCES public.article(id);


--
-- TOC entry 4739 (class 2606 OID 90693)
-- Name: commandeclient fk2t3ma3ko3u9hoiuqafjai8f9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commandeclient
    ADD CONSTRAINT fk2t3ma3ko3u9hoiuqafjai8f9 FOREIGN KEY (idclient) REFERENCES public.client(id);


--
-- TOC entry 4748 (class 2606 OID 90738)
-- Name: roles fk71xd67w89vvcotymi95xc1k59; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT fk71xd67w89vvcotymi95xc1k59 FOREIGN KEY (idutilisateur) REFERENCES public.utilisateur(id);


--
-- TOC entry 4740 (class 2606 OID 90698)
-- Name: commandefournisseur fkatj6buy5fvy1cuf1wsm95dgvw; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commandefournisseur
    ADD CONSTRAINT fkatj6buy5fvy1cuf1wsm95dgvw FOREIGN KEY (idfournisseur) REFERENCES public.fournisseur(id);


--
-- TOC entry 4743 (class 2606 OID 90718)
-- Name: lignecommandefournisseur fkk0l9s5k2stvo3i2s71jrdmlal; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lignecommandefournisseur
    ADD CONSTRAINT fkk0l9s5k2stvo3i2s71jrdmlal FOREIGN KEY (idcommandefournisseur) REFERENCES public.commandefournisseur(id);


--
-- TOC entry 4738 (class 2606 OID 90688)
-- Name: article fknwo5h4bghmo8jk7jpavwtwi6i; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT fknwo5h4bghmo8jk7jpavwtwi6i FOREIGN KEY (idcategory) REFERENCES public.category(id);


--
-- TOC entry 4745 (class 2606 OID 90723)
-- Name: lignevente fkobnh6mrbkqliny3g58mfpheqj; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lignevente
    ADD CONSTRAINT fkobnh6mrbkqliny3g58mfpheqj FOREIGN KEY (idarticle) REFERENCES public.article(id);


--
-- TOC entry 4747 (class 2606 OID 90733)
-- Name: mvtstk fkpt75sr5je032y1ppv8rw9nqh2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mvtstk
    ADD CONSTRAINT fkpt75sr5je032y1ppv8rw9nqh2 FOREIGN KEY (idarticle) REFERENCES public.article(id);


--
-- TOC entry 4744 (class 2606 OID 90713)
-- Name: lignecommandefournisseur fks25oxp23762ei310opvngg5v1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lignecommandefournisseur
    ADD CONSTRAINT fks25oxp23762ei310opvngg5v1 FOREIGN KEY (idarticle) REFERENCES public.article(id);


--
-- TOC entry 4746 (class 2606 OID 90728)
-- Name: lignevente fktdh351xwh8t4r8omustgvg2y0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lignevente
    ADD CONSTRAINT fktdh351xwh8t4r8omustgvg2y0 FOREIGN KEY (idvente) REFERENCES public.ventes(id);


--
-- TOC entry 4742 (class 2606 OID 90708)
-- Name: lignecommandeclient fkthsj2spmxb6ygsyj39osvie55; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lignecommandeclient
    ADD CONSTRAINT fkthsj2spmxb6ygsyj39osvie55 FOREIGN KEY (idcommandeclient) REFERENCES public.commandeclient(id);


-- Completed on 2025-09-30 10:15:57

--
-- PostgreSQL database dump complete
--

