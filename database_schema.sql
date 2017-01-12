--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.4
-- Dumped by pg_dump version 9.6.1

-- Started on 2017-01-12 14:14:49

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 7 (class 2615 OID 307206)
-- Name: ocr; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA ocr;


SET search_path = ocr, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 197 (class 1259 OID 307307)
-- Name: address; Type: TABLE; Schema: ocr; Owner: -
--

CREATE TABLE address (
    id bigint NOT NULL,
    street character varying(64),
    city character varying(32),
    state character varying(16),
    zip bit varying(16)
);


--
-- TOC entry 196 (class 1259 OID 307305)
-- Name: address_id_seq; Type: SEQUENCE; Schema: ocr; Owner: -
--

CREATE SEQUENCE address_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3095 (class 0 OID 0)
-- Dependencies: 196
-- Name: address_id_seq; Type: SEQUENCE OWNED BY; Schema: ocr; Owner: -
--

ALTER SEQUENCE address_id_seq OWNED BY address.id;


--
-- TOC entry 199 (class 1259 OID 307315)
-- Name: company; Type: TABLE; Schema: ocr; Owner: -
--

CREATE TABLE company (
    id bigint NOT NULL,
    address bigint,
    name character varying(64)
);


--
-- TOC entry 198 (class 1259 OID 307313)
-- Name: company_id_seq; Type: SEQUENCE; Schema: ocr; Owner: -
--

CREATE SEQUENCE company_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3096 (class 0 OID 0)
-- Dependencies: 198
-- Name: company_id_seq; Type: SEQUENCE OWNED BY; Schema: ocr; Owner: -
--

ALTER SEQUENCE company_id_seq OWNED BY company.id;


--
-- TOC entry 195 (class 1259 OID 307290)
-- Name: ocrresult; Type: TABLE; Schema: ocr; Owner: -
--

CREATE TABLE ocrresult (
    id bigint NOT NULL,
    result jsonb,
    "timestamp" timestamp without time zone DEFAULT now(),
    receipt bigint,
    quality numeric(5,4),
    psm smallint,
    lang character varying(64),
    url character varying(256)
);


--
-- TOC entry 194 (class 1259 OID 307288)
-- Name: ocr_result_id_seq; Type: SEQUENCE; Schema: ocr; Owner: -
--

CREATE SEQUENCE ocr_result_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3097 (class 0 OID 0)
-- Dependencies: 194
-- Name: ocr_result_id_seq; Type: SEQUENCE OWNED BY; Schema: ocr; Owner: -
--

ALTER SEQUENCE ocr_result_id_seq OWNED BY ocrresult.id;


--
-- TOC entry 189 (class 1259 OID 307245)
-- Name: product; Type: TABLE; Schema: ocr; Owner: -
--

CREATE TABLE product (
    id bigint NOT NULL,
    name character varying(64)
);


--
-- TOC entry 188 (class 1259 OID 307243)
-- Name: product_id_seq; Type: SEQUENCE; Schema: ocr; Owner: -
--

CREATE SEQUENCE product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3098 (class 0 OID 0)
-- Dependencies: 188
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: ocr; Owner: -
--

ALTER SEQUENCE product_id_seq OWNED BY product.id;


--
-- TOC entry 183 (class 1259 OID 307207)
-- Name: receipt; Type: TABLE; Schema: ocr; Owner: -
--

CREATE TABLE receipt (
    id bigint NOT NULL,
    store bigint,
    "user" bigint,
    amount money,
    date timestamp without time zone
);


--
-- TOC entry 185 (class 1259 OID 307216)
-- Name: receipt_id_seq; Type: SEQUENCE; Schema: ocr; Owner: -
--

CREATE SEQUENCE receipt_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3099 (class 0 OID 0)
-- Dependencies: 185
-- Name: receipt_id_seq; Type: SEQUENCE OWNED BY; Schema: ocr; Owner: -
--

ALTER SEQUENCE receipt_id_seq OWNED BY receipt.id;


--
-- TOC entry 184 (class 1259 OID 307212)
-- Name: receiptitem; Type: TABLE; Schema: ocr; Owner: -
--

CREATE TABLE receiptitem (
    receipt bigint NOT NULL,
    id bigint NOT NULL,
    product bigint NOT NULL,
    price money,
    quantity smallint
);


--
-- TOC entry 187 (class 1259 OID 307235)
-- Name: receipt_item_id_seq; Type: SEQUENCE; Schema: ocr; Owner: -
--

CREATE SEQUENCE receipt_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3100 (class 0 OID 0)
-- Dependencies: 187
-- Name: receipt_item_id_seq; Type: SEQUENCE OWNED BY; Schema: ocr; Owner: -
--

ALTER SEQUENCE receipt_item_id_seq OWNED BY receiptitem.id;


--
-- TOC entry 186 (class 1259 OID 307224)
-- Name: receipt_item_receipt_id_seq; Type: SEQUENCE; Schema: ocr; Owner: -
--

CREATE SEQUENCE receipt_item_receipt_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3101 (class 0 OID 0)
-- Dependencies: 186
-- Name: receipt_item_receipt_id_seq; Type: SEQUENCE OWNED BY; Schema: ocr; Owner: -
--

ALTER SEQUENCE receipt_item_receipt_id_seq OWNED BY receiptitem.receipt;


--
-- TOC entry 191 (class 1259 OID 307253)
-- Name: store; Type: TABLE; Schema: ocr; Owner: -
--

CREATE TABLE store (
    id bigint NOT NULL,
    name character varying(64),
    company bigint,
    address bigint
);


--
-- TOC entry 190 (class 1259 OID 307251)
-- Name: store_id_seq; Type: SEQUENCE; Schema: ocr; Owner: -
--

CREATE SEQUENCE store_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3102 (class 0 OID 0)
-- Dependencies: 190
-- Name: store_id_seq; Type: SEQUENCE OWNED BY; Schema: ocr; Owner: -
--

ALTER SEQUENCE store_id_seq OWNED BY store.id;


--
-- TOC entry 193 (class 1259 OID 307277)
-- Name: user; Type: TABLE; Schema: ocr; Owner: -
--

CREATE TABLE "user" (
    id bigint NOT NULL
);


--
-- TOC entry 192 (class 1259 OID 307275)
-- Name: user_id_seq; Type: SEQUENCE; Schema: ocr; Owner: -
--

CREATE SEQUENCE user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3103 (class 0 OID 0)
-- Dependencies: 192
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: ocr; Owner: -
--

ALTER SEQUENCE user_id_seq OWNED BY "user".id;


--
-- TOC entry 2951 (class 2604 OID 307310)
-- Name: address id; Type: DEFAULT; Schema: ocr; Owner: -
--

ALTER TABLE ONLY address ALTER COLUMN id SET DEFAULT nextval('address_id_seq'::regclass);


--
-- TOC entry 2952 (class 2604 OID 307318)
-- Name: company id; Type: DEFAULT; Schema: ocr; Owner: -
--

ALTER TABLE ONLY company ALTER COLUMN id SET DEFAULT nextval('company_id_seq'::regclass);


--
-- TOC entry 2949 (class 2604 OID 307293)
-- Name: ocrresult id; Type: DEFAULT; Schema: ocr; Owner: -
--

ALTER TABLE ONLY ocrresult ALTER COLUMN id SET DEFAULT nextval('ocr_result_id_seq'::regclass);


--
-- TOC entry 2946 (class 2604 OID 307248)
-- Name: product id; Type: DEFAULT; Schema: ocr; Owner: -
--

ALTER TABLE ONLY product ALTER COLUMN id SET DEFAULT nextval('product_id_seq'::regclass);


--
-- TOC entry 2943 (class 2604 OID 307218)
-- Name: receipt id; Type: DEFAULT; Schema: ocr; Owner: -
--

ALTER TABLE ONLY receipt ALTER COLUMN id SET DEFAULT nextval('receipt_id_seq'::regclass);


--
-- TOC entry 2945 (class 2604 OID 307264)
-- Name: receiptitem receipt; Type: DEFAULT; Schema: ocr; Owner: -
--

ALTER TABLE ONLY receiptitem ALTER COLUMN receipt SET DEFAULT nextval('receipt_item_receipt_id_seq'::regclass);


--
-- TOC entry 2944 (class 2604 OID 307237)
-- Name: receiptitem id; Type: DEFAULT; Schema: ocr; Owner: -
--

ALTER TABLE ONLY receiptitem ALTER COLUMN id SET DEFAULT nextval('receipt_item_id_seq'::regclass);


--
-- TOC entry 2947 (class 2604 OID 307256)
-- Name: store id; Type: DEFAULT; Schema: ocr; Owner: -
--

ALTER TABLE ONLY store ALTER COLUMN id SET DEFAULT nextval('store_id_seq'::regclass);


--
-- TOC entry 2948 (class 2604 OID 307280)
-- Name: user id; Type: DEFAULT; Schema: ocr; Owner: -
--

ALTER TABLE ONLY "user" ALTER COLUMN id SET DEFAULT nextval('user_id_seq'::regclass);


--
-- TOC entry 2966 (class 2606 OID 307312)
-- Name: address address