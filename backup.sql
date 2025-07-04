--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: answer; Type: TABLE; Schema: public; Owner: hc_user
--

CREATE TABLE public.answer (
    answer_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    requirement_id character varying(255) NOT NULL,
    answer_value_text text,
    answer_value_number numeric(18,4),
    answer_value_boolean boolean,
    answer_value_date date,
    answer_value_json jsonb,
    answered_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_edited_at timestamp with time zone,
    status character varying(50) DEFAULT 'DRAFT'::character varying NOT NULL
);


ALTER TABLE public.answer OWNER TO postgres;

--
-- Name: COLUMN answer.answer_value_text; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.answer.answer_value_text IS 'data_required_type이 text, text_long, select인 경우의 답변';


--
-- Name: COLUMN answer.answer_value_number; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.answer.answer_value_number IS 'data_required_type이 number인 경우의 답변';


--
-- Name: COLUMN answer.answer_value_boolean; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.answer.answer_value_boolean IS 'data_required_type이 boolean인 경우의 답변';


--
-- Name: COLUMN answer.answer_value_date; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.answer.answer_value_date IS 'data_required_type이 date인 경우의 답변';


--
-- Name: COLUMN answer.answer_value_json; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.answer.answer_value_json IS 'data_required_type이 table_input, structured_list 등 복합 타입인 경우의 JSON 답변';


--
-- Name: climate_disclosure_concept; Type: TABLE; Schema: public; Owner: hc_user
--

CREATE TABLE public.climate_disclosure_concept (
    concept_id integer NOT NULL,
    concept_name character varying(255) NOT NULL,
    description text NOT NULL,
    category character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.climate_disclosure_concept OWNER TO postgres;

--
-- Name: climate_disclosure_concept_concept_id_seq; Type: SEQUENCE; Schema: public; Owner: hc_user
--

CREATE SEQUENCE public.climate_disclosure_concept_concept_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.climate_disclosure_concept_concept_id_seq OWNER TO postgres;

--
-- Name: climate_disclosure_concept_concept_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hc_user
--

ALTER SEQUENCE public.climate_disclosure_concept_concept_id_seq OWNED BY public.climate_disclosure_concept.concept_id;


--
-- Name: heatwave_summary; Type: TABLE; Schema: public; Owner: hc_user
--

CREATE TABLE public.heatwave_summary (
    id integer NOT NULL,
    scenario character varying(50) NOT NULL,
    region_name character varying(100) NOT NULL,
    year_period character varying(10) NOT NULL,
    heatwave_days real NOT NULL,
    change_amount real,
    change_rate real,
    baseline_value real,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.heatwave_summary OWNER TO postgres;

--
-- Name: TABLE heatwave_summary; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON TABLE public.heatwave_summary IS '폭염일수 요약 데이터';


--
-- Name: COLUMN heatwave_summary.id; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.heatwave_summary.id IS '기본키 (자동증가)';


--
-- Name: COLUMN heatwave_summary.scenario; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.heatwave_summary.scenario IS '기후 시나리오 (SSP1-2.6, SSP2-4.5, SSP3-7.0, SSP5-8.5)';


--
-- Name: COLUMN heatwave_summary.region_name; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.heatwave_summary.region_name IS '지역명 (경기도, 전라남도 등)';


--
-- Name: COLUMN heatwave_summary.year_period; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.heatwave_summary.year_period IS '연도구간 (2025, 2030, 2040, 2050)';


--
-- Name: COLUMN heatwave_summary.heatwave_days; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.heatwave_summary.heatwave_days IS '폭염일수 (평균값)';


--
-- Name: COLUMN heatwave_summary.change_amount; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.heatwave_summary.change_amount IS '변화량(일수) - 2025년 대비';


--
-- Name: COLUMN heatwave_summary.change_rate; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.heatwave_summary.change_rate IS '변화율(%) - 2025년 대비';


--
-- Name: COLUMN heatwave_summary.baseline_value; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.heatwave_summary.baseline_value IS '기준값 (2025년 폭염일수)';


--
-- Name: COLUMN heatwave_summary.created_at; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.heatwave_summary.created_at IS '데이터 생성일시';


--
-- Name: heatwave_summary_id_seq; Type: SEQUENCE; Schema: public; Owner: hc_user
--

CREATE SEQUENCE public.heatwave_summary_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.heatwave_summary_id_seq OWNER TO postgres;

--
-- Name: heatwave_summary_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hc_user
--

ALTER SEQUENCE public.heatwave_summary_id_seq OWNED BY public.heatwave_summary.id;


--
-- Name: issb_adoption_status; Type: TABLE; Schema: public; Owner: hc_user
--

CREATE TABLE public.issb_adoption_status (
    adoption_id integer NOT NULL,
    country character varying(255) NOT NULL,
    regulatory_authority character varying(255),
    applicable_entity character varying(255),
    adoption_timeline text,
    remark text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.issb_adoption_status OWNER TO postgres;

--
-- Name: issb_adoption_status_adoption_id_seq; Type: SEQUENCE; Schema: public; Owner: hc_user
--

CREATE SEQUENCE public.issb_adoption_status_adoption_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.issb_adoption_status_adoption_id_seq OWNER TO postgres;

--
-- Name: issb_adoption_status_adoption_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hc_user
--

ALTER SEQUENCE public.issb_adoption_status_adoption_id_seq OWNED BY public.issb_adoption_status.adoption_id;


--
-- Name: issb_s2_disclosure; Type: TABLE; Schema: public; Owner: hc_user
--

CREATE TABLE public.issb_s2_disclosure (
    disclosure_id character varying(255) NOT NULL,
    section character varying(255) NOT NULL,
    category character varying(255) NOT NULL,
    topic character varying(255),
    disclosure_ko text NOT NULL
);


ALTER TABLE public.issb_s2_disclosure OWNER TO postgres;

--
-- Name: issb_s2_requirement; Type: TABLE; Schema: public; Owner: hc_user
--

CREATE TABLE public.issb_s2_requirement (
    requirement_id character varying(255) NOT NULL,
    disclosure_id character varying(255),
    requirement_order integer DEFAULT 0 NOT NULL,
    requirement_text_ko text NOT NULL,
    data_required_type character varying(50) NOT NULL,
    input_schema jsonb,
    input_placeholder_ko text,
    input_guidance_ko text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.issb_s2_requirement OWNER TO postgres;

--
-- Name: issb_s2_term; Type: TABLE; Schema: public; Owner: hc_user
--

CREATE TABLE public.issb_s2_term (
    term_id integer NOT NULL,
    term_ko character varying(255) NOT NULL,
    term_en character varying(255),
    definition_ko text NOT NULL,
    definition_en text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.issb_s2_term OWNER TO postgres;

--
-- Name: issb_s2_term_term_id_seq; Type: SEQUENCE; Schema: public; Owner: hc_user
--

CREATE SEQUENCE public.issb_s2_term_term_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.issb_s2_term_term_id_seq OWNER TO postgres;

--
-- Name: issb_s2_term_term_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hc_user
--

ALTER SEQUENCE public.issb_s2_term_term_id_seq OWNED BY public.issb_s2_term.term_id;


--
-- Name: member; Type: TABLE; Schema: public; Owner: hc_user
--

CREATE TABLE public.member (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    google_id character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    username character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_login_at timestamp with time zone
);


ALTER TABLE public.member OWNER TO postgres;

--
-- Name: report_template; Type: TABLE; Schema: public; Owner: hc_user
--

CREATE TABLE public.report_template (
    report_content_id character varying(255) NOT NULL,
    section_kr character varying(255) NOT NULL,
    content_order integer NOT NULL,
    depth integer DEFAULT 1,
    content_type character varying(50) NOT NULL,
    content_template text,
    source_requirement_ids jsonb,
    slm_prompt_template text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.report_template OWNER TO postgres;

--
-- Name: COLUMN report_template.report_content_id; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.report_template.report_content_id IS '보고서 콘텐츠의 고유 ID (기본 키)';


--
-- Name: COLUMN report_template.section_kr; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.report_template.section_kr IS '보고서의 대분류 섹션 (예: 지배구조, 전략)';


--
-- Name: COLUMN report_template.content_order; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.report_template.content_order IS '보고서 내 콘텐츠의 전체 순서';


--
-- Name: COLUMN report_template.depth; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.report_template.depth IS '목차의 계층 깊이 (1: 대분류, 2: 중분류 등)';


--
-- Name: COLUMN report_template.content_type; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.report_template.content_type IS '콘텐츠의 유형 (HEADING_1, PARAGRAPH, TABLE, FIGURE 등)';


--
-- Name: COLUMN report_template.content_template; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.report_template.content_template IS '고정적으로 들어가는 텍스트 (제목, 표 캡션, 고정 문단 등)';


--
-- Name: COLUMN report_template.source_requirement_ids; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.report_template.source_requirement_ids IS '이 콘텐츠를 생성하는 데 필요한 requirement_id 목록 (JSON 배열 형식)';


--
-- Name: COLUMN report_template.slm_prompt_template; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.report_template.slm_prompt_template IS 'SLM에게 보낼 프롬프트의 템플릿';


--
-- Name: COLUMN report_template.created_at; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.report_template.created_at IS '행 생성 시간';


--
-- Name: COLUMN report_template.updated_at; Type: COMMENT; Schema: public; Owner: hc_user
--

COMMENT ON COLUMN public.report_template.updated_at IS '행 마지막 수정 시간';


--
-- Name: climate_disclosure_concept concept_id; Type: DEFAULT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.climate_disclosure_concept ALTER COLUMN concept_id SET DEFAULT nextval('public.climate_disclosure_concept_concept_id_seq'::regclass);


--
-- Name: heatwave_summary id; Type: DEFAULT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.heatwave_summary ALTER COLUMN id SET DEFAULT nextval('public.heatwave_summary_id_seq'::regclass);


--
-- Name: issb_adoption_status adoption_id; Type: DEFAULT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.issb_adoption_status ALTER COLUMN adoption_id SET DEFAULT nextval('public.issb_adoption_status_adoption_id_seq'::regclass);


--
-- Name: issb_s2_term term_id; Type: DEFAULT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.issb_s2_term ALTER COLUMN term_id SET DEFAULT nextval('public.issb_s2_term_term_id_seq'::regclass);


--
-- Data for Name: answer; Type: TABLE DATA; Schema: public; Owner: hc_user
--

COPY public.answer (answer_id, user_id, requirement_id, answer_value_text, answer_value_number, answer_value_boolean, answer_value_date, answer_value_json, answered_at, last_edited_at, status) FROM stdin;
acbacb39-45d1-45aa-952c-9d3157fcb580	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-1	ESG위원회	\N	\N	\N	null	2025-07-02 03:39:34.883106+00	2025-07-02 03:39:34.885056+00	DRAFT
2ea797b7-b2d8-4c77-bb26-d76ecefc1db5	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-3	지속가능경영 정책 및 전략 수립	\N	\N	\N	null	2025-07-02 03:39:34.883106+00	2025-07-02 03:39:34.898089+00	DRAFT
00f79164-db26-4749-9b53-a99ec02ef123	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-4	\N	\N	\N	\N	[{"decision_body": "하늘이팬클럽", "decision_date": "2023년 9월", "decision_details": "기후변화 시나리오 기반 리스크/기회 검토"}, {"decision_body": "ESG위원회", "decision_date": "2023년 12월", "decision_details": "기후변화 보고서 발간 합의 "}]	2025-07-02 03:39:34.883106+00	2025-07-02 03:39:34.901887+00	DRAFT
fa189aa7-bcf6-4d25-b260-3b33823cc233	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-5	기후 관련 규제에 대한 이해도	\N	\N	\N	null	2025-07-02 03:39:34.883106+00	2025-07-02 03:39:34.905611+00	DRAFT
a9ab1ac1-076b-4070-9b68-2397c6b9f28f	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-6	신임 이사 선임 시 활용하는 '이사 평가지표'	\N	\N	\N	null	2025-07-02 03:39:34.883106+00	2025-07-02 03:39:34.90936+00	DRAFT
9022264e-ce1b-4364-8cf0-729c997da32c	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-7	\N	\N	\N	\N	[{"member_name": "천준영", "member_title": "사내이사", "competency_details": "지속가능경영학회 KASE 설립자"}]	2025-07-02 03:39:34.883106+00	2025-07-02 03:39:34.913154+00	DRAFT
eef3f6b1-370d-4729-af1a-62dba50c8864	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-8	신임/기존 이사 대상 매년 기후 관련 교육 프로그램 진행	\N	\N	\N	null	2025-07-02 03:39:34.883106+00	2025-07-02 03:39:34.917078+00	DRAFT
76f64e47-c6cb-4fbc-84e2-5e6c52d41f8a	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-9	\N	\N	\N	\N	[{"activity_details": "2025년 고려대학교에서 ESG 관련 전공과목 수강", "member_name_and_title": "천준영 이사"}]	2025-07-02 03:39:34.883106+00	2025-07-02 03:39:34.921561+00	DRAFT
6e83d130-5c2a-4c61-bbb0-732f3c963c03	8b1375e0-c770-4c5e-adf0-bf18067e4999	met-2	\N	\N	\N	\N	[{"scope": "Scope 1", "guideline": "ghg"}, {"scope": "Scope 2", "guideline": "ghg"}, {"scope": "Scope 3", "guideline": "ghg"}]	2025-07-02 03:39:34.883106+00	2025-07-02 03:39:34.936465+00	DRAFT
a4debf29-bffb-49e6-b32f-4ed91326e798	8b1375e0-c770-4c5e-adf0-bf18067e4999	met-4		\N	\N	\N	null	2025-07-02 03:39:34.883106+00	2025-07-02 03:39:34.951427+00	DRAFT
666c5bd6-7823-4d7b-9173-abae183c6a2f	8b1375e0-c770-4c5e-adf0-bf18067e4999	met-5	\N	\N	\N	\N	{"c1": [{"id": "scope3_item_1751261943841", "input_variables": {"activity_data": {"activity_content": ""}}}], "c2": [{"id": "scope3_item_1751261943841"}], "c3": [{"id": "scope3_item_1751261943841"}], "c4": [{"id": "scope3_item_1751261943841"}], "c5": [{"id": "scope3_item_1751261943841"}], "c6": [{"id": "scope3_item_1751261943841"}], "c7": [{"id": "scope3_item_1751261943841"}], "c8": [{"id": "scope3_item_1751261943841"}], "c9": [{"id": "scope3_item_1751261943841"}], "c10": [{"id": "scope3_item_1751261943841"}], "c11": [{"id": "scope3_item_1751261943841"}], "c12": [{"id": "scope3_item_1751261943841"}], "c13": [{"id": "scope3_item_1751261943841"}], "c14": [{"id": "scope3_item_1751261943841"}], "c15": [{"id": "scope3_item_1751261943841"}]}	2025-07-02 03:39:34.883106+00	2025-07-02 03:39:34.955078+00	DRAFT
aec3c2b8-38e4-4fe8-84ef-147db1d2207a	8b1375e0-c770-4c5e-adf0-bf18067e4999	met-24	\N	\N	\N	\N	[{}, {"id": "temp_1751272084007"}, {"id": "temp_1751272089391"}]	2025-07-02 03:39:34.883106+00	2025-07-02 03:39:34.966268+00	DRAFT
3eb9c420-013a-49b6-9469-f27bd529779d	8b1375e0-c770-4c5e-adf0-bf18067e4999	met-25	\N	\N	\N	\N	[{}, {"id": "temp_1751272143319"}, {"id": "temp_1751272144407"}]	2025-07-02 03:39:34.883106+00	2025-07-02 03:39:34.969862+00	DRAFT
be02d157-e314-44ff-b0ce-cb1af61a816e	8b1375e0-c770-4c5e-adf0-bf18067e4999	met-26	\N	\N	\N	\N	[{}, {"id": "temp_1751272240054"}, {"id": "temp_1751272241606"}]	2025-07-02 03:39:34.883106+00	2025-07-02 03:39:34.973529+00	DRAFT
9fed32dc-9c65-44f7-b95f-ac97c8c58583	8b1375e0-c770-4c5e-adf0-bf18067e4999	met-7	\N	\N	\N	\N	[{"vulnerable_asset": "국내 담배부문 사업장"}]	2025-07-02 03:39:34.883106+00	2025-07-02 03:39:34.977073+00	DRAFT
6a2559f6-a659-4865-a00e-f06c3e357646	8b1375e0-c770-4c5e-adf0-bf18067e4999	met-8	\N	\N	\N	\N	[{}]	2025-07-02 03:39:34.883106+00	2025-07-02 03:39:34.980819+00	DRAFT
39e2bb51-18c7-48c4-afa6-5523417e7e04	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-10	전략기획본부 ESG경영실	\N	\N	\N	null	2025-07-02 05:57:22.080973+00	2025-07-02 05:57:22.082457+00	DRAFT
bb2f1ec3-262c-45bb-a37e-ee6141a4fd96	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-20	이행 경과를 관리 감독	\N	\N	\N	null	2025-07-02 03:39:34.883106+00	2025-07-02 05:58:56.428201+00	DRAFT
d2570584-993c-487a-bf27-7dd456974f0e	8b1375e0-c770-4c5e-adf0-bf18067e4999	met-18	\N	2022.0000	\N	\N	null	2025-07-02 03:39:34.883106+00	2025-07-03 01:05:22.501666+00	DRAFT
c9631f29-172a-4747-b9e6-7867f18d7f7d	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-11	의안 내용에 대한 사전보고	\N	\N	\N	null	2025-07-02 05:57:22.080973+00	2025-07-02 05:57:22.087448+00	DRAFT
5818f3bf-23c0-43be-a5bb-8a6f1b536b2f	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-12	외부 전문가 자문	\N	\N	\N	null	2025-07-02 05:57:22.080973+00	2025-07-02 05:57:22.095099+00	DRAFT
9f083543-f16b-4368-979a-e9e84dc690ee	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-13	이사회 규정에 따라 ESG위원회에 보고	\N	\N	\N	null	2025-07-02 05:57:22.080973+00	2025-07-02 05:57:22.098703+00	DRAFT
08b8c584-a370-4da8-bc3c-4cd9ae1618a6	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-14	결의일로부터 3일 이내에 통지	\N	\N	\N	null	2025-07-02 05:57:22.080973+00	2025-07-02 05:57:22.102496+00	DRAFT
acd063ce-e297-4131-a625-365584e33df1	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-15	연 2회	\N	\N	\N	null	2025-07-02 05:57:22.080973+00	2025-07-02 05:57:22.106456+00	DRAFT
120cea71-34e8-4ccd-8b40-7b84c804eb87	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-17	ESG위원회의 정기적인 개최를 통해	\N	\N	\N	null	2025-07-02 05:58:29.537656+00	2025-07-02 05:58:29.538939+00	DRAFT
cce2b688-ed11-49f0-8d2b-2a0fb2bd1fa4	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-18	대규모의 시설 투자와 관련된 안건	\N	\N	\N	null	2025-07-02 05:58:29.537656+00	2025-07-02 05:58:29.543607+00	DRAFT
f6f3fb72-b42f-4b3f-a518-ccba76486f9c	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-21	정기적인 성과 모니터링 실시	\N	\N	\N	null	2025-07-02 05:58:56.426827+00	2025-07-02 05:58:56.432827+00	DRAFT
dadd5e5d-5858-4fa2-8f77-a49c32bf0f4b	8b1375e0-c770-4c5e-adf0-bf18067e4999	gen-1	\N	\N	\N	\N	[{"end_date": "2024-12-31", "start_date": "2024-01-01", "report_year": "2025", "company_name": "ConanAI"}]	2025-07-02 03:39:34.883106+00	2025-07-03 01:05:22.471304+00	DRAFT
c3c2b33c-22de-49d6-a939-7e48b71118bd	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-16	\N	\N	\N	\N	[{"meeting_date": "2023-02-04", "related_info": "보고서에 담을 ESG 데이터 검토", "agenda_details": "2023년 지속가능경영보고서 발간 구성"}]	2025-07-02 05:57:22.080973+00	2025-07-03 01:05:22.485321+00	DRAFT
d39aa61d-1fcc-42aa-905a-90b250c12473	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-19	\N	\N	\N	\N	[{"category": "ESG위원회", "decision_date": "2024-04-06", "agenda_details": "2024년도 ESG경영 보고서 작성", "approval_status": "가결", "climate_considerations": "저탄소 기술 관련 투자 리스크"}]	2025-07-02 05:58:29.537656+00	2025-07-03 01:05:22.489259+00	DRAFT
0eca9785-fb55-4fe2-a125-451da7f507da	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-2	\N	\N	\N	\N	[{"gender": "남", "division": "사내이사", "position": "위원", "full_name": "천준영", "appointment_date": "2024-02-01"}, {"gender": "여", "division": "사내이사", "position": "위원", "full_name": "김하늘", "appointment_date": "2025-06-26"}]	2025-07-02 03:39:34.883106+00	2025-07-03 01:05:22.492901+00	DRAFT
0b8c4a21-3c07-4054-9655-5a98be472fb7	8b1375e0-c770-4c5e-adf0-bf18067e4999	met-1	\N	\N	\N	\N	[{"year": "2023", "value": 123456, "category": "Scope 1"}, {"year": "2023", "value": 456123, "category": "Scope 2"}, {"year": "2023", "value": 1187608, "category": "Scope 3"}, {"year": "2023", "value": 12345, "category": " C1 제품 및 서비스 구매"}, {"year": "2023", "value": 789456, "category": " C2 자본재"}, {"year": "2023", "value": 123123, "category": " C3 구매연료 및 에너지"}, {"year": "2023", "value": 3433, "category": " C4 업스트림 운송&유통"}, {"year": "2023", "value": 123450, "category": " C5 사업장 발생 폐기물"}, {"year": "2023", "value": 12345, "category": " C6 임직원 출장"}, {"year": "2023", "value": 123456, "category": " C7 통근"}, {"year": "2023", "value": 0, "category": " C8 임차자산(Upstream)"}, {"year": "2023", "value": 0, "category": " C9 Downstream 운송&유통"}, {"year": "2023", "value": 0, "category": " C10 판매제품 가공"}, {"year": "2023", "value": 0, "category": " C11 판매 제품 사용"}, {"year": "2023", "value": 0, "category": " C12 판매 제품 폐기"}, {"year": "2023", "value": 0, "category": " C13 임대자산(Downstream)"}, {"year": "2023", "value": 0, "category": " C14 프랜차이즈"}, {"year": "2023", "value": 0, "category": " C15 투자"}, {"year": "2023", "value": 1767187, "category": "합계"}]	2025-07-02 03:39:34.883106+00	2025-07-03 01:05:22.497087+00	DRAFT
51993024-85c2-4166-b2b2-e4e1b8872be2	8b1375e0-c770-4c5e-adf0-bf18067e4999	met-19	\N	2040.0000	\N	\N	null	2025-07-02 03:39:34.883106+00	2025-07-03 01:05:22.505806+00	DRAFT
716457b3-94a9-4ee5-822f-c22faf975317	8b1375e0-c770-4c5e-adf0-bf18067e4999	met-20	\N	2050.0000	\N	\N	null	2025-07-02 03:39:34.883106+00	2025-07-03 01:05:22.509735+00	DRAFT
325f7cfe-4a1b-497a-9bfc-38ab6f60f96e	8b1375e0-c770-4c5e-adf0-bf18067e4999	met-21	\N	\N	\N	\N	[{"scope": "전사", "final_value": "0", "target_type": "절대량 목표", "interim_value": "11400", "target_metric": "Scope1 배출량", "baseline_value": "19700"}, {"id": "temp_1751272066199", "target_metric": "Scope2 배출량"}, {"id": "temp_1751272090255", "target_metric": "Scope3 배출량"}]	2025-07-02 03:39:34.883106+00	2025-07-03 01:05:22.513505+00	DRAFT
ffded13b-6a9a-4f8e-85c9-8bd04aa3d456	8b1375e0-c770-4c5e-adf0-bf18067e4999	met-3	\N	\N	\N	\N	{"scope1": {"ch4": true, "co2": true, "n2o": true}, "scope2": {"ch4": true, "co2": true, "n2o": true}, "scope3": {"ch4": true, "co2": true, "n2o": true}}	2025-07-02 03:39:34.883106+00	2025-07-03 01:05:22.517664+00	DRAFT
4931cfe6-9a1d-4f6a-bba4-4491c743e732	8b1375e0-c770-4c5e-adf0-bf18067e4999	met-6	\N	\N	\N	\N	[{"usage_mwh": "", "energy_source": "", "contract_period": "", "contract_instrument": ""}]	2025-07-02 03:39:34.883106+00	2025-07-03 01:05:22.521618+00	DRAFT
409e3670-aa58-49a4-ad4f-ce4e9b1a2727	8b1375e0-c770-4c5e-adf0-bf18067e4999	rsk-1	\N	\N	\N	\N	[{"data_source": "회사 내부 데이터", "input_variable": "온실가스 배출량 추이"}]	2025-07-02 03:39:34.883106+00	2025-07-03 01:05:22.525348+00	DRAFT
bb7444ed-a080-4826-abad-2ee745ab23db	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-22	\N	\N	\N	\N	[{"activity_date": "2023-04-13", "activity_details": "2022년 2020년 대비 그룹 온실가스 감축 성과, 재생에너지 달성 현황 등", "activity_category": "진척도 관리·감독"}, {"id": "temp_1751504481743", "activity_date": "2023-08-03", "activity_details": "2050년1) 그룹 Scope 1, 2, 3 Net-Zero 달성", "activity_category": "목표 설정"}]	2025-07-03 01:05:22.468014+00	2025-07-03 01:05:22.52892+00	DRAFT
3eeb7ec9-3d6e-4204-ad79-597482199225	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-23	‘사내이사의 보수 지급 규정’에 근거하여 기후 관련 대응을 포함한 지속가능성 성과를 사내이사의 보수와 연계	\N	\N	\N	null	2025-07-03 01:05:22.468014+00	2025-07-03 01:05:22.533233+00	DRAFT
92743953-0944-4f24-996b-775c0a6d0cb3	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-24	매출액, 영업이익, ESG 평가결과 등으로 구성된 계량지표와   ESG 경영고도화, 핵심성장사업 강화, 사업 기반 고도화, 사업 포트폴리오 확대 등으로 구성된 비계량 지표를 종합적으로 평가	\N	\N	\N	null	2025-07-03 01:05:22.468014+00	2025-07-03 01:05:22.537361+00	DRAFT
fadc2b95-d2fa-4e97-a2e6-5b6320307677	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-25	경영진	\N	\N	\N	null	2025-07-03 01:05:22.468014+00	2025-07-03 01:05:22.541009+00	DRAFT
35397d6c-84db-4f63-b3c0-18177d5b9522	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-26	\N	\N	\N	\N	[{"responsibilities": "기후변화 전략 이행 및 총괄", "management_position": "CEO"}, {"id": "item_1751504673167", "responsibilities": "ESG 이슈에 대한 주요 재무계획 검토", "management_position": "CFO"}]	2025-07-03 01:05:22.468014+00	2025-07-03 01:05:22.544635+00	DRAFT
3149e3b4-81ed-4509-a239-7afb3f2e6fc4	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-27	사외이사로 구성된 감사위원회를 통해 전사 리스크 관리 현황을 점검하며, 감사위원회 산하 감사단에서 ESG 경영 추진사항에 대한 독립적인 내부감사를 수행	\N	\N	\N	null	2025-07-03 01:06:02.121387+00	2025-07-03 01:06:02.122539+00	DRAFT
5b710edb-5d9f-41c1-a42f-be8dbd1250da	8b1375e0-c770-4c5e-adf0-bf18067e4999	gov-28	연간 감사계획 수립 시, 감사단 자체 리스크 평가를 통해 선정	\N	\N	\N	null	2025-07-03 01:06:02.121387+00	2025-07-03 01:06:02.126509+00	DRAFT
948046ec-4c5d-4520-86c1-e60fd3a61d72	8b1375e0-c770-4c5e-adf0-bf18067e4999	str-1	SASB	\N	\N	\N	null	2025-07-03 01:11:08.720994+00	2025-07-03 01:11:08.72317+00	DRAFT
f0f5a270-2aa0-4aaa-adcb-f96292ba963f	8b1375e0-c770-4c5e-adf0-bf18067e4999	str-2	식음료 부문의 담배(Tobacco) 및 가공식품(Processed_Foods)	\N	\N	\N	null	2025-07-03 01:11:08.720994+00	2025-07-03 01:11:08.72805+00	DRAFT
f9edda07-073f-4721-a673-bc846dcc59fa	8b1375e0-c770-4c5e-adf0-bf18067e4999	str-3	식음료 부문의 농산물(Agricultural Products), 자원변환 부문의 용기 및 포장(Containers Packaging), 화학(Chemicals)	\N	\N	\N	null	2025-07-03 01:11:08.720994+00	2025-07-03 01:11:08.731947+00	DRAFT
e15ab583-da1f-4e9e-bf1c-0cef4dac773b	8b1375e0-c770-4c5e-adf0-bf18067e4999	str-4	\N	\N	\N	\N	[{"type": "정책", "factor": "탄소가격제", "category": "전환", "description": "정부나 국제기구가 탄소 배출에 비용을 부과하여 온실가스 감축을 유도하는 제도입니다. 이는 KT&G의 담배 제조 공정 및 원료 공급 과정에서 발생하는 탄소 배출 비용을 증가시켜, 생산 원가 상승과 더불어 제품 가격 경쟁력 악화로 이어질 수 있습니다. 또한, 건강기능식품 제조에서도 원료 조달과 가공 과정에서의 탄소 배출을 줄이기 위한 추가적인 비용 부담이 발생할 수 있습니다.", "mid_term_impact": "상", "long_term_impact": "상", "short_term_impact": "중"}, {"id": "temp_1751504975006", "type": "시장", "factor": "원자재 비용 상승", "category": "전환", "description": "기후변화 대응 정책과 규제로 인해 주요 원자재인 잎담배와 건강기능식품의 원료 수급이 불안정해지고, 이에 따른 조달 비용이 상승할 수 있습니다. 이는 KT&G의 제품 생산 비용에 직접적인 영향을 미쳐 가격 경쟁력 약화를 초래할 수 있습니다. ", "mid_term_impact": "상", "long_term_impact": "상", "short_term_impact": "상"}, {"id": "temp_1751505002862", "type": "급성", "factor": "태풍", "category": "물리", "description": "강력한 바람과 폭우를 동반하는 기상 현상으로 인해 KT&G의 국내외 제조 공장과 물류 시설이 피해를 입을 수 있으며, 생산 및 공급망이 중단될 위험이 증가할 수 있습니다. 담배 제품의 경우, 원료 담배 잎의 생산지 피해가 클 수 있으며, 건강기능식품의 원료 공급에도 차질이 생길 수 있습니다.", "mid_term_impact": "중", "long_term_impact": "중", "short_term_impact": " 중"}, {"id": "temp_1751505039005", "type": "점진", "factor": "온도 변화", "category": "물리", "description": "평균 기온 상승으로 인해 담배 재배지의 농업 생산성 저하와 에너지 소비 패턴 변화가 나타나며, 이는 KT&G의 원재료 공급 및 운영 비용에 영향을 미칩니다. 건강기능식품 원료인 식물 및 농산물의 수확량 및 재배지역의 변동 등으로 수급 불안정과 품질 저하가 발생할 수 있습니다.", "mid_term_impact": "중", "long_term_impact": "상", "short_term_impact": "중"}]	2025-07-03 01:11:08.720994+00	2025-07-03 01:11:08.738347+00	DRAFT
9265dad7-7a1a-440b-95cb-07d121989d0c	8b1375e0-c770-4c5e-adf0-bf18067e4999	str-5	1년	\N	\N	\N	null	2025-07-03 01:12:10.699388+00	2025-07-03 01:12:10.700782+00	DRAFT
52e21eeb-6df6-43ae-98d2-61649187fa93	8b1375e0-c770-4c5e-adf0-bf18067e4999	str-6	1년~5년	\N	\N	\N	null	2025-07-03 01:12:10.699388+00	2025-07-03 01:12:10.704924+00	DRAFT
68b1c5b3-26af-4aa3-8760-230ed1883894	8b1375e0-c770-4c5e-adf0-bf18067e4999	str-7	5년 초과	\N	\N	\N	null	2025-07-03 01:12:10.699388+00	2025-07-03 01:12:10.708429+00	DRAFT
e74032ce-054e-4577-b8c4-13296433f08e	8b1375e0-c770-4c5e-adf0-bf18067e4999	str-8	대외 동향 분석 및 내부 현황 진단에서 고려	\N	\N	\N	null	2025-07-03 01:12:10.699388+00	2025-07-03 01:12:10.711894+00	DRAFT
0ecd9120-5ab6-421f-9b4c-91523c4df2df	8b1375e0-c770-4c5e-adf0-bf18067e4999	str-9	\N	\N	\N	\N	[{"segment_name": "담배 부문, 건강 기능 부문", "segment_description": " 궐련 및 차세대 전자담배인 HNB 등의 제조와 판매 사업을 운영"}]	2025-07-03 01:16:21.355101+00	2025-07-03 01:16:21.358623+00	DRAFT
bd1fef57-570e-4bbf-8618-c8a54b59924a	8b1375e0-c770-4c5e-adf0-bf18067e4999	str-10	제품 기획에서 배송, 소비 및 수명종료에 이르기까지 기업의 제품 또는 서비스를 생산하기 위해 사용하고 의존하는 상호작용, 자원 및 관계	\N	\N	\N	null	2025-07-03 01:16:21.355101+00	2025-07-03 01:16:21.363675+00	DRAFT
c3997d77-63f6-421d-81b2-f1ec742e0c2e	8b1375e0-c770-4c5e-adf0-bf18067e4999	str-11	담배부문, 건강 기능 부문	\N	\N	\N	null	2025-07-03 01:16:21.355101+00	2025-07-03 01:16:21.367411+00	DRAFT
328c47a5-5231-4e73-a27c-9682dbc18937	8b1375e0-c770-4c5e-adf0-bf18067e4999	str-12	제품 및 기술 연구개발, 산출물의 생산제조, 영업 및 마케팅	\N	\N	\N	null	2025-07-03 01:16:21.355101+00	2025-07-03 01:16:21.370968+00	DRAFT
2b84afa2-a8a1-4b42-926d-7aaf478bfa1d	8b1375e0-c770-4c5e-adf0-bf18067e4999	str-13	 업스트림에서의 원재료/자재 등 투입물 구매, 투입물 및 산출물에 대한 유통 및 운송, 다운스트림에서의 판매 제품 사용 및 폐기	\N	\N	\N	null	2025-07-03 01:16:21.355101+00	2025-07-03 01:16:21.375618+00	DRAFT
b5dea3ad-3c92-49ac-aad8-68233b4de485	8b1375e0-c770-4c5e-adf0-bf18067e4999	str-14	\N	\N	\N	\N	[{"overview_description": "탄소가격이 급등하거나 엄격하고 강화된 탄소가격 관련 규제가 시행될 경우 온실가스 배출량에 따라 운영 비용이 증가하여 상당한 리스크로 작용할 수 있습니다.", "risk_opportunity_factor": "탄소가격"}]	2025-07-03 01:16:21.355101+00	2025-07-03 01:16:21.379648+00	DRAFT
\.


--
-- Data for Name: climate_disclosure_concept; Type: TABLE DATA; Schema: public; Owner: hc_user
--

COPY public.climate_disclosure_concept (concept_id, concept_name, description, category, created_at, updated_at) FROM stdin;
1	기후공시 프레임워크 주체	IFRS 재단 산하 ISSB는 2021년 COP26에서 출범하여 기존 TCFD·SASB·CDSB 등을 하나로 통합한 ‘글로벌 기본표준’을 제정하고 있습니다. ISSB가 발표한 IFRS S1·S2는 국제자본시장 규제기관(IOSCO)의 승인을 받아 각국에서 법제화가 진행 중이며, 영국·일본·싱가포르·호주 등 20여 개 관할권이 2025년 결산분부터 단계적 의무화를 예고했습니다. 기업은 앞으로 재무제표와 동일한 수준의 신뢰성을 갖춘 기후정보를 보고해야 하며, 이는 투자자·채권자·보험사 등 금융시장 참여자의 의사결정에 직접 활용된다.	기후공시 프레임워크 주체	2025-07-02 03:26:23.294148+00	2025-07-02 03:26:23.294148+00
2	기후 공시 필요성	기후변화로 인한 물리적 손실과 탈탄소 전환 비용이 실물·금융 부문 전반에 파급되면서, 투자자는 기업이 직면한 기후위험을 빠르고 정량적으로 파악하길 요구합니다. 또한 탄소국경조정, 녹색 taxonomy, ESG 투자 가이드라인 등 규제·정책이 확대되면서 공시 미흡 시 자본조달 비용이 상승하고 시장 접근성이 제한될 수 있습니다. 이에 상장사는 물론 대규모 비상장사도 기후공시 체계를 조기 구축해 리스크 노출을 줄이고, 기회 요소(신재생·효율 개선·녹색금융 조달 등)를 명확히 제시해야 합니다.	기후 공시 필요성	2025-07-02 03:26:23.294148+00	2025-07-02 03:26:23.294148+00
3	기후 공시의 원칙	IFRS S2는 ‘연결성(connected information)’과 ‘의사결정 유용성(decision-usefulness)’을 핵심 원칙으로 삼아 기존 재무보고 체계와 기후정보를 하나의 보고 흐름으로 결합했습니다. 즉, 동일한 가정·시나리오·통계 기준을 사용해 재무제표, 관리설명서, 지속가능경영보고서 간 수치 불일치를 최소화해야 하며, 정보는 비교가능·검증가능·시의성·명확성 네 가지 품질 특성을 충족해야 합니다. 또한 산업 특성을 반영한 SASB 템플릿을 통해 업종 간 과잉보고를 방지하고 핵심 지표에 집중하도록 설계되었습니다.	기후 공시의 원칙	2025-07-02 03:26:23.294148+00	2025-07-02 03:26:23.294148+00
4	기후 공시의 원칙 - 지배구조	지배구조 파트는 “누가 기후책임을 지는가”를 다룹니다. 이사회 전체, 감사위원회, 리스크위원회, ESG위원회 등 각 기구의 권한과 책임을 구체적으로 서술하고, 경영진(C-suite)에게 위임된 업무 범위·보고 빈도를 명시해야 합니다. 또한 기후성과가 임원 보상이나 승진 평가에 어떻게 연계되는지, 이해관계자가 감독 현황을 어떻게 점검할 수 있는지 설명해야 합니다. 이를 통해 투자자는 기업의 기후 거버넌스 체계가 의사결정에 실질적으로 내재돼 있는지 판단할 수 있습니다.	지배구조	2025-07-02 03:26:23.294148+00	2025-07-02 03:26:23.294148+00
5	기후 공시의 원칙 - 전략	전략 파트는 “기후가 기업의 비즈니스 모델과 가치창출에 어떻게 영향을 미치는가”를 다룹니다. 우선 단·중·장기로 구분된 주요 기후위험·기회를 식별하고, 각 항목이 매출, 비용, 자본적 지출, 자산 가치, 공급망 안정성에 끼칠 재무적 영향을 정량·정성으로 제시해야 합니다. 더 나아가 1.5 °C, 2 °C, 3 °C 등 복수 시나리오 분석과 탄소가격 가정을 공개하여 전략의 기후 회복력을 입증해야 합니다. 전환계획(감축 목표, 투자 로드맵, 정책 대응 전략)도 포함해 이해관계자가 기업의 장기 가치 보존 가능성을 평가하도록 돕습니다.	전략	2025-07-02 03:26:23.294148+00	2025-07-02 03:26:23.294148+00
6	기후 공시의 원칙 - 위험관리	위험관리 파트는 위험·기회를 “식별→평가→우선순위→모니터링→완화” 전 과정으로 설명합니다. 예컨대 열 스트레스, 수자원 부족, 급격한 정책 변화 같은 물리적·전환 위험을 어떻게 스크리닝하고, 재무·운영 임팩트를 화폐 단위 또는 시뮬레이션 범위로 정량화하는지 기술합니다. 또한 이러한 프로세스가 전사적 위험관리(ERM) 및 내부통제 제도와 어떻게 통합되는지, 스코어링·감시 주기·책임 조직을 제시해야 합니다. 이를 통해 투자자는 위험관리 체계가 선언적 수준을 넘어 실행되며, 개선이력까지 추적되고 있는지 확인할 수 있습니다.	위험관리	2025-07-02 03:26:23.294148+00	2025-07-02 03:26:23.294148+00
7	기후 공시의 원칙 - 지표 및 목표	지표 및 목표 파트는 “어떻게 성과를 측정하고 목표 달성 여부를 검증하는가”가 초점입니다. 필수 지표로는 온실가스 배출량(Scope 1-2-3), 에너지 사용량·집약도, 물 소비, 폐기물, 그리고 전환 비용·자본 투입 등이 포함됩니다. 목표는 과학기반 배출감축(SBTi) 또는 순배출 제로 달성 시점과 절대·집약도 목표치를 명시해야 하고, 진행률·편차·보정 계획을 분석해 연도별 추적 표로 제공해야 합니다. 내부 탄소가격, 녹색매출·녹색CAPEX 비율 같은 보조지표도 활용해 투자자가 기업의 전환 성과를 다각도로 판단할 수 있도록 지원합니다.	지표 및 목표	2025-07-02 03:26:23.294148+00	2025-07-02 03:26:23.294148+00
\.


--
-- Data for Name: heatwave_summary; Type: TABLE DATA; Schema: public; Owner: hc_user
--

COPY public.heatwave_summary (id, scenario, region_name, year_period, heatwave_days, change_amount, change_rate, baseline_value, created_at) FROM stdin;
\.


--
-- Data for Name: issb_adoption_status; Type: TABLE DATA; Schema: public; Owner: hc_user
--

COPY public.issb_adoption_status (adoption_id, country, regulatory_authority, applicable_entity, adoption_timeline, remark, created_at, updated_at) FROM stdin;
1	EU	도입·감독 주체: 유럽연합 집행위원회(EC) ? EFRAG(유럽재무보고자문그룹)이 기준 제정	적용 대상: CSRD법 적용을 받는 모든 대규모 EU 기업 및 상장기업 등 (약 5만여 개 기업)	적용 단계 일정: 2024년 연간보고부터 대규모 기업 단계적 적용 개시, 2025년에는 대상 확대, 2026~2028년에 상장 중소기업 및 비EU기업 자회사까지 순차 확대	유럽연합은 자체적인 지속가능성보고지침(CSRD)에 따라 유럽지속가능성보고기준(ESRS)을 채택하여 공시를 의무화하고 있습니다. ESRS는 ISSB 기준과 병행 개발되어 높은 정합성을 갖추고 있으며, 특히 기후공시요건에서는 IFRS S2와 상당 부분 일치합니다. ESRS는 이중 중대성 개념을 포함해 ISSB보다 광범위한 정보를 다루지만, ESRS 기후변화 기준(E1)을 준수하면 IFRS S2 요건 대부분을 충족하도록 상호운용성 지도가 마련되어 중복보고 부담을 줄이고 있습니다	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
2	영국(UK)	도입·감독 주체: 영국 정부(재무부·기업통상부) 및 금융감독청(FCA)	적용 대상: 대규모 상장사(FCA 규제 대상) 및 추후 지정될 대형 비상장사 등	적용 단계 일정: 2022년 대기업 대상 TCFD 기반 기후공시 의무화 시행; 2024~2025년 ISSB 기준 검토 및 승인 진행 중; 2026년 회계연도 이후부터 ISSB 기준 공시 의무화 예상	영국은 이미 회사법 및 금융당국 규정을 통해 TCFD 권고에 따른 기후공시를 대기업에 의무화하였으며, ISSB 출범 이후 국가 지속가능성 공시기준(Sustainability Disclosure Standards) 제정 절차를 진행 중입니다. 2024년 5월 정부 발표에 따르면 IFRS S1, S2를 영국 기준으로 엔도스먼트(승인)하여 2025년 초에 국내표준으로 제정할 계획이며, 이후 금융감독청(FCA)이 상장사에 대한 의무공시를 감독하고 기타 비상장 기업에도 단계적으로 적용을 검토할 예정입니다. 2024년 12월 영국 공시기준기술위원회(TAC)는 IFRS S1과 S2의 영국 채택을 공식 권고하였으며, 이에 따라 이르면 2026년 회계기간부터는 해당 기준에 따른 공시가 의무화될 전망입니다	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
3	미국(USA)	도입·감독 주체: 미국 증권거래위원회(SEC)	적용 대상: SEC 규제 대상 모든 상장사(미국 공개기업)	적용 단계 일정: 2024년 SEC 기후공시 규칙 제정 승인(TCFD 기반); 다만 2025년 현재 소송으로 시행 연기, 최종 시행시기는 미정	미국은 IFRS S1, S2를 직접 도입하지는 않았으나, SEC가 TCFD 체계에 부합하는 자체 기후공시 규정을 추진하고 있어 ISSB 글로벌 기준과 흐름을 같이하고 있습니다. SEC가 2022년부터 논의해 2024년 3월 승인한 기후공시 규칙안은 기업에 _재무에 미치는 실질적 기후위험_과 재무제표 항목별 기후 영향 등을 공시하도록 요구하며, _Scope1·2 온실가스 배출량_도 중요성 판단하에 공시하도록 했습니다. 그러나 규칙 채택 직후 규제 권한 등을 둘러싼 소송이 제기되어 시행이 일시 중단된 상태이며, 2025년 예정된 소송 결과에 따라 시행 일정이 결정될 전망입니다	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
4	캐나다	도입·감독 주체: 캐나다 지속가능성 기준위원회(CSSB) ? 증권행정청(CSA) 협업	적용 대상: 캐나다 공개기업 및 대기업 (향후 규정 확정 예정)	적용 단계 일정: 2024년 말 CSSB가 캐나다 지속가능성 공시기준(CSDS) 1·2 제정(IFRS S1,S2 기반); 2025년부터 적용 가능하나 Scope3 배출량 2028년까지 면제, 기후 이외 주제 2027년까지 보고유예 등 단계적 적용	캐나다는 2024년 12월 ISSB 기준을 반영한 국가 공시기준(CSDS 1 및 2)을 발표하며 IFRS S1과 S2를 국내에 도입했습니다. CSDS는 2025년 1월부터 적용 가능하도록 제정되었고, 글로벌 기준과 거의 동일하지만 스코프3 배출량 공시를 3년 유예(2028년까지)하고 기후 이외 지속가능성 공시는 2년 유예(2027년까지)하는 등 일부 완화조치를 포함합니다. 다만 캐나다 증권규제당국(CSA)은 당초 계획했던 즉각적 의무화에서 한발 물러서 자발적 적용을 권고하는 입장을 보이고 있어, 실제 의무화는 향후 논의를 거쳐 확정될 것으로 보입니다	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
5	멕시코	도입·감독 주체: 멕시코 은행증권위원회(CNBV)	적용 대상: 멕시코의 모든 증권신고대상 기업(국내외 상장사) 및 일부 대규모 비상장사	적용 단계 일정: 2025년부터 재무제표에 지속가능성 정보를 통합 공시하고, 2026년에는 모든 대상기업에 IFRS S1, S2 공시 의무화 (2025년 보고서부터 적용); 2026년 보고부터 외부 감사인에 의한 검증 의무화	멕시코는 2025년 회계연도부터 상장기업의 재무제표에 IFRS S1, S2에 부합하는 지속가능성 정보를 포함하도록 법규 개정을 완료했습니다. 이에 따라 멕시코 내 모든 주식 발행인은 2026년부터 별도의 지속가능성 보고서를 통해 거버넌스, 전략, 리스크관리 및 지표·목표 등의 정보를 IFRS S1, S2 기준에 맞춰 공시해야 합니다. 또한 2026년 보고 (2025년 데이터)부터는 이러한 지속가능성 공시에 대해 외부 감사인의 한정검토(제한적 검증)를 받도록 요구하여 공시 신뢰성을 제고하고, 향후에는 검증 수준을 단계적으로 강화할 계획입니다	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
6	브라질	도입·감독 주체: 브라질 재무부 및 증권거래위원회(CVM)	적용 대상: CVM 규제 대상 기업 (상장사 및 일부 금융기관 등)	적용 단계 일정: 2024년 자발적 보고 시작, 2025년 준비기간을 거쳐 2026년 1월 1일부로 IFRS S1, S2 공시 의무화 (2026년 회계연도부터 적용)	브라질은 남미 최초로 IFRS S1과 S2의 전면 도입을 발표한 국가로, 2023년 10월 재무부와 CVM이 공동으로 ISSB 공시기준을 국내 규제체계에 편입하겠다는 로드맵을 공개했습니다. 이 로드맵에 따라 브라질 기업들은 2024년에는 ISSB 기준을 자발적으로 적용할 수 있고, 2025년은 준비 단계로 거쳐, 2026년 1월 1일 이후 시작되는 회계연도부터는 의무적으로 IFRS S1, S2에 따른 공시를 제공해야 합니다. 브라질은 이미 회계분야에서 IFRS 기준을 전면 채택 중(2010년 이래)이며, 지속가능성 공시 역시 글로벌 기준을 수용함으로써 자본시장의 투명성과 국제자금 유치에 도움이 될 것으로 기대하고 있습니다	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
7	칠레	도입·감독 주체: 칠레 금융시장위원회(CMF)	적용 대상: 모든 대규모 기업 (다만 소규모 기업 일부 예외)	적용 단계 일정: 2026년 1월 1일부터 IFRS S1, S2 공시 의무화 시작; 평균자산 1백만 UF 미만 기업은 면제, 공시경험이 없는 기업에는 1년간 과도기 완화조치 적용	칠레는 2024년 10월 금융당국(CMF)이 공식적으로 IFRS S1과 S2의 의무적용을 2026년부터 시행할 것을 발표하였습니다. 다만 두 해 동안 평균 총자산이 100만 UF(칠레 화폐단위) 미만인 비교적 소규모 기업들은 적용 대상에서 제외하였고, 기존에 지속가능성이나 거버넌스 정보공시를 해오지 않았던 기업들에 대해서는 1년간의 전환 유예를 두어 준비기간을 부여했습니다. 이로써 칠레는 남미에서 브라질에 이어 ISSB 기준을 빠르게 도입하는 국가 중 하나가 되었으며, 향후 공시품질 제고와 국제 투자자 신뢰 향상을 도모하고 있습니다.	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
8	호주(Australia)	도입·감독 주체: 호주 의회·정부(재무부) ? 호주 회계기준위원회(AASB)가 기준 제정, 증권투자위원회(ASIC)가 감독	적용 대상: 일정 규모 이상의 상장법인 및 대기업 (수익, 자산, 직원수 또는 배출량 임계치 충족 기업)	적용 단계 일정: 2024년 9월 기후공시 법률 통과, 2025년 1월 1일 이후 회계연도부터 대규모 기업 대상 1단계 공시 실시, 이후 수년간 범위를 확대하여 2030년까지 전 기업에 전면 적용 및 합리적 수준 보증 요구	호주는 2024년 회계법 개정을 통해 기후관련 공시를 의무화하여 ISSB 기준과 발맞춘 국가 중 하나입니다. 2024년 9월 통과된 _재무시장 인프라법 개정안_에 따라 AASB(호주회계기준원)는 호주 지속가능성보고기준(ASRS) S1 및 S2를 최종 확정하였으며, 이는 IFRS S1, S2와 거의 동일하되 우선 기후공시에 집중하는 형태로 도입되었습니다. 법령에 명시된 일정에 따라 2025년부터는 매출·자산·직원수 또는 배출량 요건을 충족하는 대형 상장사 및 일부 비상장사가 1단계로 기후관련 공시를 시작하고, 이후 적용 대상을 순차적으로 넓혀 나갑니다. 또한 검증(Assurance) 요구사항도 단계적으로 강화되어, 2030년까지는 모든 대상기업의 공시에 대해 합리적 수준의 보증을 확보하도록 할 예정입니다	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
9	뉴질랜드(New Zealand)	도입·감독 주체: 뉴질랜드 외부보고위원회(XRB) ? 금융감독원(FMA) 및 중앙정부	적용 대상: 기후공시 의무법(2021) 지정 대형 금융기관, 상장사 등 (자산 10억 뉴질랜드달러 이상 은행·보험사, 상장발행인 등 약 200여 개 기업)	적용 단계 일정: 2023년부터 기후공시 의무제 시행 ? XRB가 제정한 NZ CS1~CS3 기준 적용하여 2024년부터 첫 보고서 발행 완료	뉴질랜드는 ISSB 출범 이전인 2021년에 세계 최초로 기후공시 의무화 법안을 통과시켜, 2023년 회계연도부터 약 200개 대기업 및 금융회사에 TCFD 기반 기후관련 재무공시를 요구하고 있습니다. 이에 따라 뉴질랜드 외부보고위원회(XRB)는 2022년에 이미 Aotearoa 뉴질랜드 기후공시기준(NZ CS) 1~3을 제정하였고, 현재 기업들은 동 기준에 따라 최초의 기후관련 공시보고서를 발간하고 있습니다. 이 뉴질랜드 기준은 ISSB의 IFRS S1, S2와 밀접히 정합되도록 마련되어 있으며, XRB는 2023년 ISSB 기준 제정 시 이를 면밀히 모니터링해 뉴질랜드 기준과의 비교 가이드를 발행하는 등 국제정합성 유지를 도모하고 있습니다. 향후 ISSB가 추가 주제의 기준을 내놓을 경우 뉴질랜드도 이에 맞춰 자국 기준을 조정·보완할 계획입니다.	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
10	일본(Japan)	도입·감독 주체: 일본 지속가능성 기준위원회(SSBJ) ? 금융청(FSA) 지원	적용 대상: 유가증권보고의무가 있는 상장법인 (우선 대형기업 중심)	적용 단계 일정: 2024년 4월 SSBJ가 IFRS S1, S2에 기반한 노출초안 공개; 2025년 3월 최종 일본 지속가능성 공시기준 제정 완료; 2026년 일부 대기업부터 자율적 보고 시작, 2027년 3월 결산 분기부터 1차 대상 기업 공시 의무화 예정	일본은 2022년 말 금융청 산하에 지속가능성 기준위원회(SSBJ)를 신설하여 ISSB 기준 도입 작업을 진행하였습니다. 2024년 4월 SSBJ는 지속가능성 공시기준 초안 3종(일반적용기준, 일반공시기준, 기후공시기준)을 발표했는데, 이는 IFRS S1과 S2의 내용을 토대로 일부 일본 상황을 반영한 것이었습니다. 이후 2025년 3월 최종 공시기준(SDS Japan)을 확정하였으며, IFRS S1의 요구사항을 일반공시와 적용기준으로 나누어 제정하는 등 독자적 편제를 취했습니다. 일본 금융당국은 2026년부터 일부 대형 상장사의 조기적용을 유도하고, 2027년 3월 결산부터 1차 대상 기업들이 본 기준에 따른 보고를 개시하도록 단계적 의무화할 방침입니다	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
11	싱가포르(Singapore)	도입·감독 주체: 싱가포르거래소 규제기관(SGX RegCo) ? 지속가능성 보고자문위원회(SRAC) 및 통화청(MAS) 협력	적용 대상: 싱가포르 증권거래소 상장사 및 일정 규모 이상의 비상장사	적용 단계 일정: 2025년 회계연도부터 기후관련 공시 의무화 개시 ? IFRS S2에 완전 부합하는 기후공시를 단계적으로 도입, 2027~2030년 대상 확대 및 Scope3 등 포함 예정	싱가포르는 2024년 9월 싱가포르거래소(SGX)가 발표한 새로운 규정에 따라 기후공시를 의무화하며 ISSB 기준을 적극 수용하고 있습니다. 구체적으로 2025년부터 상장사는 IFRS S2에 준하는 기후관련 재무공시를 제공해야 하며, IFRS S1 일반공시 중 기후와 연관된 원칙들을 적용하도록 규정되었습니다. 다만 Scope 3 배출량 공시는 초기에는 요구되지 않으며, 향후 몇 년 내 기후공시 제도의 안착을 지켜본 뒤 지속가능성의 다른 주제로 공시범위를 넓힐 계획입니다. 이러한 의무공시는 2025~2030년에 걸쳐 단계적으로 확대되어, 상장사뿐 아니라 대형 비상장사에도 적용될 예정이며, 싱가포르는 아시아 최초로 비상장사까지 기후공시를 확대한 사례로 평가됩니다	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
12	홍콩(Hong Kong)	도입·감독 주체: 홍콩 회계사협회(HKICPA) ? 증권선물위원회(SFC) 및 홍콩거래소(HKEX) 협업	적용 대상: 우선 공공책임기업(상장법인 및 규제 금융기관 등) 위주 도입	적용 단계 일정: 2024년 12월 HKICPA가 HKFRS S1·S2 제정(IFRS S1,S2 동일); 2025년 1월부터 HKEX 상장사 기후공시 “준수 또는 설명” 기준 적용, 2026년부터 모든 상장사 기후공시 의무화	홍콩은 기존에 자율적인 ESG공시 제도가 있었으나, ISSB 기준에 맞춰 공시체계를 강화하고 있습니다. 2024년 말 홍콩회계사협회(HKICPA)는 HKFRS S1 및 S2 지속가능성공시기준을 공표하였는데, 이는 IFRS S1, S2와 직결되는 홍콩 버전의 기준입니다. 해당 기준은 우선 상장기업 및 금융기관 등 공공책임기업에 2025년 8월 1일부터 적용 가능하며, 실제 의무적용 여부와 시기는 규제기관(SFC, HKEX)이 결정하도록 하였습니다. 한편 홍콩거래소는 별도로 상장사 기후공시 의무화 로드맵을 발표하여, 2025년에는 IFRS S2에 따른 기후관련 공시를 “준수 또는 설명” 방식으로 요구하고 2026년부터는 전 상장사에 완전 의무화할 계획입니다. 이를 통해 홍콩은 국제기준과 보조를 맞추어 ESG공시 수준을 높이고 있습니다.	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
13	대한민국(South Korea)	도입·감독 주체: 한국 지속가능성기준원(KSSB) ? 금융위원회 및 회계기준원 지원	적용 대상: (미정) 유가증권신고 의무기업 등 대규모 기업 대상 예상	적용 단계 일정: 2024년 5월 KSSB가 한국형 지속가능성 공시기준 KSSB 1·2 및 101 제정(IFRS S1, S2 기준 반영); 구체적 시행시기와 대상은 아직 확정되지 않음	우리나라는 2023년 말 금융당국이 한국 지속가능성 기준원(KSSB)을 신설하고 2024년 5월 첫 지속가능성 공시기준을 발표하면서 IFRS S1, S2 도입 논의를 시작했습니다. 발표된 KSSB 1, KSSB 2 기준은 각각 IFRS S1(지속가능성 일반공시)과 IFRS S2(기후공시)를 거의 그대로 따른 것이며, 추가로 KSSB 101 기준을 별도로 두어 국내 법령상 요구사항 등 특수사항 공시에 대한 지침을 제공하고 있습니다. 다만 현재까지 어떤 기업을 언제부터 의무적용할지에 대해서는 금융위 등 감독당국의 최종 결정이 이루어지지 않아, 관련 법령 개정과 시장 준비 상황에 따라 적용 대상과 일정이 확정될 것으로 보입니다	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
14	말레이시아(Malaysia)	도입·감독 주체: 말레이시아 증권위원회(SC) ? 지속가능공시 자문위원회(ACSR)	적용 대상: 모든 상장법인(Main 시장 및 ACE 시장) + 연 매출 20억 링깃 초과 대형 비상장사	적용 단계 일정: 2024년 9월 국가 지속가능공시 프레임워크(NSRF) 발표로 ISSB 기준 공식 도입; 2025년 메인시장 시가총액 20억 링깃 이상 대기업 1단계 적용, 2026년 나머지 메인시장 상장사 적용 및 ACE시장 상장사와 대형 비상장사까지 확대	말레이시아는 2024년 초 ISSB 기준 도입에 관한 자문보고서를 거쳐, 2024년 9월 국가 지속가능성공시 체계(NSRF)를 발표하며 IFRS S1, S2를 자국 공시기준의 기반으로 공식 채택하였습니다. NSRF에 따르면 모든 상장기업과 매출 20억 링깃 초과 비상장대기업이 ISSB 공시기준을 따라야 하며, 2025년에는 메인시장 상장사 중 시가총액 20억 링깃 이상 기업들이 우선 적용하고, 2026년에는 나머지 모든 메인시장 상장사에 확대 적용됩니다. 또한 2026년까지 ACE 중소기업 시장 상장사들과 대형 비상장사들도 순차적으로 동 기준을 적용하게 되어, 2년에 걸쳐 대상 전반에 ISSB 공시가 도입될 예정입니다.	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
15	대만(Taiwan)	도입·감독 주체: 금융감독위원회(FSC)	적용 대상: 대만 증권거래소 상장법인 (자본 규모에 따른 단계적 적용)	적용 단계 일정: 2023년 8월 FSC가 ISSB 기준 도입 로드맵 발표; 2026년부터 IFRS S1, S2 전면 채택 시작, 이후 ISSB 신규기준도 지속 평가·도입 예정. 2026년 회계연도부터 자본금 규모 큰 기업 순으로 의무공시 시행, ISSB 권고 전환유예 조항 동일 적용	대만 금융감독위원회(FSC)는 2023년 8월 상장사 대상 ISSB 기준 적용 로드맵을 공개하며 IFRS S1과 S2를 2026년부터 도입할 계획을 공식화했습니다. 이에 따르면 대만은 2026년 회계연도부터 ISSB 지속가능성 공시기준을 상장기업에 적용하기 시작하며, 자본 규모 등 일정 기준을 충족하는 기업부터 단계적으로 의무화할 방침입니다. ISSB 기준서의 전환유예(Transition relief) 규정도 그대로 준용하여 기업 부담을 완화하고, ISSB에서 추가로 발행하는 주제별 기준도 신속히 검토하여 도입하겠다는 입장입니다. FSC는 2026년 기후공시를 시작으로 향후 기후기준(IFRS S2)을 2027년까지 시행하고, 2030년까지 전체 지속가능성 공시기준 세트를 완비하여 국제적 정합성을 높일 계획입니다	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
16	파키스탄(Pakistan)	도입·감독 주체: 파키스탄 증권거래위원회(SECP)	적용 대상: 상장법인 (자산·매출·직원 규모에 따른 대형기업부터 단계 적용)	적용 단계 일정: 2023년 12월 국가회계기준위원회 산하 워킹그룹이 ISSB 도입 권고; 2025년 1월 1일부로 IFRS S1, S2 도입 발표, 우선 일부 대형 상장사부터 적용 개시하여 점진적 확대 예정	파키스탄에서는 2023년 말 회계기준위원회 산하 지속가능성 작업반이 ISSB 기준 도입을 위한 연구와 공청회를 거쳐 정책권고를 제시했고, 이를 바탕으로 2025년 1월 1일부로 파키스탄 증권위(SECP)가 IFRS S1, S2의 공식 도입을 발표했습니다. 적용은 상장기업을 대상으로 자산, 매출, 직원수 등의 요건을 충족하는 기업부터 단계적으로 실시될 예정으로, 우선 대규모 상장사들이 새로운 지속가능성 공시를 시작하고 이후 중소규모 상장사로 범위를 넓혀갈 계획입니다. 이러한 접근을 통해 2025년부터 파키스탄 자본시장에서 국제기준에 부합하는 지속가능성 정보공시가 시작될 전망입니다.	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
17	스리랑카(Sri Lanka)	도입·감독 주체: 스리랑카 공인회계사협회(CA Sri Lanka) ? 금융위원회 협력	적용 대상: 콜롬보증권거래소(CSE) 상장기업 및 대형 비상장사	적용 단계 일정: 2025년 1월 1일 Sri Lanka 지속가능공시기준(SLFRS S1, S2) 의무도입 시작, 2030년 전체 대상 전면 적용 목표. 2025년 보고에는 CSE 시총 상위 100대 기업 우선 적용, 2027년까지 모든 Main Board 상장사 확대, 2028~29년 연매출 LKR 100억/50억 초과 비상장사 단계 적용, 2030년 나머지 중소 상장사까지 완료	스리랑카는 2023년 공인회계사협회(CA Sri Lanka)를 통해 ISSB 기준을 채택한 Sri Lanka 지속가능성공시기준(SLFRS S1 및 S2)의 도입을 발표하고, 2025년부터 단계적 의무화에 돌입합니다. 1단계로 2025년 보고분부터 CSE 상장기업 중 시가총액 상위 100대 기업이 우선 IFRS S1, S2 기반 공시를 시행하고, 2단계로 2027년까지 CSE 메인보드의 모든 상장사로 확대됩니다. 이어 3단계에서는 2028년부터 직전 2개년 평균 매출 1,000억 루피 이상 비상장사, 2029년에는 매출 500억 루피 이상 비상장사에 적용하여, 최종적으로 2030년에 모든 상장사(중소기업 보드 포함)가 ISSB 공시기준에 따른 보고체계를 갖추게 될 예정입니다.	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
18	중국(China)	도입·감독 주체: 중국 재정부(MOF) ? 기업회계기준위원회 등 협력	적용 대상: 중국 내 모든 기업 (우선 상장사부터 단계 도입)	적용 단계 일정: 2025년 5월 재정부가 ISSB 기반 기업 지속가능공시 기본기준 초안 발표; 2026년 상장사부터 단계적 적용 시작, 2027년까지 IFRS S2 기반 기후공시 기준 시행 목표, 2030년까지 전체 지속가능공시 기준 세트 완비 및 전면 시행 계획	중국 정부는 2025년 5월 ISSB 기준을 반영한 자국 지속가능성 공시기준안을 공개하며, 글로벌 공시기준 도입에 동참하겠다는 의지를 보였습니다. 재정부가 발표한 초안 「기업 지속가능공시 ? 기본기준」은 모든 중국 기업이 준수해야 할 전반적 공시 요구사항을 담고 있으며, 이후 주제별 기준으로 기후관련 공시기준(IFRS S2 기반) 등을 2027년까지 마련하여 우선 상장사들부터 적용할 예정입니다. 전체 지속가능성 공시기준 체계는 2030년까지 완성하여 순차적으로 상장사 → 비상장 대기업 → 중소기업으로 적용 범위를 넓힐 계획입니다. 중국은 국가 경제 규모를 고려하여 자국 상황에 맞는 완화조치와 단계적 의무화를 병행하면서도, 2030년경에는 글로벌 기준과 조화된 공시체계를 갖추려 하고 있습니다.	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
19	튀르키예(Turkiye)	도입·감독 주체: 공공감독회계감사기구(KGK)	적용 대상: 일정 기준을 충족하는 기업(자산·매출·종업원 규모 기준) 및 은행 등 금융기관	적용 단계 일정: 2023년 12월 KGK가 IFRS S1, S2를 터키어 번역 채택(TSRS 1, TSRS 2 발행); 2024년부터 순차적으로 대상기업들에 공시 의무화 시행, 동시에 2024년부터 지속가능성 정보에 대한 외부검증(한정검증) 의무화 시작	튀르키예는 2023년 말 지속가능성 보고 의무화 계획을 발표하며, ISSB의 IFRS S1과 S2를 번역한 터키 지속가능보고기준(TSRS 1, 2)를 공식 채택했습니다. 대상은 총자산·순매출·직원수 등 일정 요건을 충족하는 기업들과 모든 은행으로서, KGK는 이들 기업에 지속가능성 정보 공시를 단계적으로 의무화할 예정입니다. 특히 튀르키예는 공시뿐 아니라 지속가능성 정보에 대한 외부감사까지도 일찍이 도입하여, 2024년부터 기업 지속가능경영 보고서에 대해 국제감사기준(IAASB)의 향후 ISSA 5000 기준에 따른 보증을 받도록 하고, 그 전에는 한시적으로 기존 감사기준(ISAE 3000 등)에 따른 한정검증을 의무화했습니다. 이는 기업 공시 신뢰성을 담보하기 위한 조치로, 튀르키예는 ISSB 기준 도입과 함께 검증체계도 선제적으로 구축하고 있는 점이 특징입니다.	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
20	나이지리아(Nigeria)	도입·감독 주체: 나이지리아 재무보고위원회(FRC)	적용 대상: 모든 기업 (우선 자발적 적용 후 단계적 의무화)	적용 단계 일정: 2024년 4월 FRC가 지속가능공시 기준 도입 로드맵 확정 ? 현재 2026년까지 자발적 준수 기간, 2027년부터 단계적 의무화 돌입, 2028년 1월 1일 이후 모든 기업에 전면 의무화 목표	나이지리아는 2024년 초 금융보고위원회(FRC)가 ISSB 기준 도입 로드맵을 발표하며 IFRS S1, S2를 국가 공시체계에 통합할 계획을 공식화했습니다. 이 로드맵에 따르면 2026년까지는 기업들이 ISSB 공시기준을 자발적으로 적용하도록 유도하고, 2027년부터는 일정 규모 이상의 기업들에 의무공시를 단계 도입한 후, 2028년 1월 1일부로 모든 기업에 대해 공시를 전면 의무화할 예정입니다. 현재 나이지리아는 ISSB 기준을 권고 차원에서 활용하는 자발적 채택 단계에 있으며, FRC는 공시 모니터링 및 이행지원, 감사·검증 프레임워크 마련 등을 병행하여 2028년 완전 의무화에 차질이 없도록 추진하고 있습니다	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
21	가나(Ghana)	도입·감독 주체: 가나 회계사협회(ICAG) ? 증권위원회 및 중앙은행 협력	적용 대상: 공공이해관계기업(대규모 공기업 등) 및 민간기업 전체 단계 적용	적용 단계 일정: 2023년 ICAG가 IFRS S1, S2 도입 발표 ? 2024년부터 모든 기업 대상 자율적 적용 개시, 2025년 1월부터 주요 공공부문 기관에 공시 의무화, 이후 기타 기업으로 확대 적용; 공공기관의 전면 이행 시기는 국제공공부문회계기준위원회(IPSASB) 권고 일정 준수	가나는 2023년에 회계사협회(ICAG)를 통하여 ISSB 지속가능성 기준의 채택을 공식 발표하고 로드맵을 제시하였습니다. 우선 2024년부터 가나 내 모든 기업들이 IFRS S1, S2 기준에 따른 공시를 _자발적으로 실시_할 수 있도록 장려하고, 2025년 1월 1일부터는 재무제표 공시의무가 있는 주요 공공부문 기관(공기업 등)에 해당 기준을 _우선 의무화_합니다. 이후 다른 민간기업들에도 적용 범위를 넓혀 나가며, 특히 국가 공공부문 전체에 대한 도입은 국제공공부문회계기준위원회(IPSASB)의 지속가능성 공시 권고 일정에 맞춰 진행될 예정입니다. 이처럼 가나는 2025년을 기점으로 대형 공공·공기업 부문부터 ISSB 공시기준을 도입하여 점차 전국적인 지속가능성 보고체계를 구축해 갈 계획입니다.	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
22	방글라데시(Bangladesh)	도입·감독 주체: 방글라데시 중앙은행(Bangladesh Bank)	적용 대상: 방글라데시 내 모든 은행 및 금융기관	적용 단계 일정: 2023년 12월 중앙은행이 IFRS S1, S2 기반 지속가능성 공시 지침 발표; 2024년 6월말 한정된 중간보고 실시, 2024년 12월말 한정된 감독보고 실시, 2025년 연간보고서에 제한적 공시 도입, 2026년 공시 범위 확대, 2027년 완전한 공시 체계 구축	방글라데시 중앙은행은 2023년 말 은행·금융권을 위한 ISSB 공시 지침을 발행하여 IFRS S1과 S2를 기반으로 한 보고 체계를 마련했습니다. 이 지침에 따르면, 2024년에는 은행 등 금융기관이 6월말까지 _제한된 범위의 중간 지속가능성 보고_를 처음 실시하고 12월말까지 _한정된 감독용 보고_를 제출해야 합니다. 이어 2025년부터는 연간보고서에 일부 지속가능성 정보를 포함하는 형태로 공시를 시작하고, 2026년에는 공시 내용을 더욱 상세히 확대하며, 2027년에 가서는 IFRS S1, S2 요건을 거의 완전히 충족하는 보고를 실시하도록 로드맵이 구성되어 있습니다. 방글라데시는 이처럼 3년에 걸친 단계적 이행을 통해 금융권부터 국제적 지속가능성 공시기준에 부합하는 투명성 제고를 도모하고 있습니다.	2025-07-02 03:26:23.310059+00	2025-07-02 03:26:23.310059+00
\.


--
-- Data for Name: issb_s2_disclosure; Type: TABLE DATA; Schema: public; Owner: hc_user
--

COPY public.issb_s2_disclosure (disclosure_id, section, category, topic, disclosure_ko) FROM stdin;
s2-g1	지배구조	기후 관련 위험과 기회에 대한 이사회의 감독 사항	목적	기후 관련 위험 및 기회를 감독할 책임이 있는 의사결정기구(들) 또는 개인(들)을 식별하고, 다음의 정보를 공시해야 합니다.
s2-g2	지배구조	기후 관련 위험과 기회에 대한 이사회의 감독 사항	기후 관련 위험과 기회에 대한 이사회의 감독 사항	기후 관련 위험 및 기회에 대한 책임이 해당 의사결정기구(들) 또는 개인(들)에게 적용되는 기업의 위임사항(terms of reference), 의무사항 (mandates), 역할기술서(role description) 및 기타 관련 정책에 어떻게 반영되는지
s2-g3	지배구조	기후 관련 위험과 기회에 대한 이사회의 감독 사항	기후 관련 위험과 기회에 대한 이사회의 감독 사항	의사결정기구(들) 또는 개인(들)이 기후 관련 위험 및 기회에 대응하기 위해 고안된 전략을 감독할 수 있는 적절한 기술과 역량을 갖추었는지 또는 개발할 것인지를 어떻게 판단하는지
s2-g4	지배구조	기후 관련 위험과 기회에 대한 이사회의 감독 사항	기후 관련 위험과 기회에 대한 이사회의 감독 사항	의사결정기구(들) 또는 개인(들)이 기후 관련 위험 및 기회에 대해 어떻게 통지받는지와 얼마나 자주 통지받는지
s2-g5	지배구조	기후 관련 위험과 기회에 대한 이사회의 감독 사항	기후 관련 위험과 기회에 대한 이사회의 감독 사항	의사결정기구(들) 또는 개인(들)이 기업의 전략, 주요 거래에 대한 의사결정, 위험관리 프로세스 및 관련 정책을 감독할 때 기후 관련 위험 및 기회를 어떻게 고려하는지(의사결정기구(들) 또는 개인(들)이 그러한 위험 및 기회 간의 상충을 고려했는지 여부 포함)
s2-g6	지배구조	기후 관련 위험과 기회에 대한 이사회의 감독 사항	기후 관련 위험과 기회에 대한 이사회의 감독 사항	의사결정기구(들) 또는 개인(들)이 기후 관련 위험 및 기회와 관련된 목표의 설정을 어떻게 감독하는지와 그러한 목표를 향한 진척도를 어떻게 모니터링하는지(관련 성과지표가 보상정책에 포함되는지 여부와 어떻게 포함되는지를 포함
s2-g7	지배구조	기후 관련 위험과 기회에 대한 경영진의 역할	목적	기후 관련 위험 및 기회를 모니터링, 관리 및 감독하는 데 있어서 경영진의 역할을 설명하고, 다음 정보를 공시해야 합니다.
s2-g8	지배구조	기후 관련 위험과 기회에 대한 경영진의 역할	기후 관련 위험과 기회에 대한 경영진의 역할	경영진의 역할이 특정 경영진 수준의 직책 또는 위원회에 위임되는지 여부와 그러한 직책 또는 위원회가 어떻게 감독되는지
s2-g9	지배구조	기후 관련 위험과 기회에 대한 경영진의 역할	기후 관련 위험과 기회에 대한 경영진의 역할	경영진이 기후 관련 위험 및 기회의 감독을 지원하기 위해 통제 및 절차를 사용하는지 여부와 만약 그렇다면, 이러한 통제 및 절차가 다른 내부 기능과 어떻게 통합되는지
s2-s1	전략	위험 및 기회	목적	기업은 일반목적재무보고서의 이용자가 기업 전망에 영향을 미칠 것으로 합리적으로 예상할 수 있는 기후 관련 위험 및 기회를 이해할 수 있도록하는 정보를 공시한다. 구체적으로 기업은 다음을 수행한다.
s2-s2	전략	위험 및 기회	위험 및 기회	기업 전망에 영향을 미칠 것으로 합리적으로 예상할 수 있는 기후 관련 위험 및 기회를 기술한다.
s2-s3	전략	위험 및 기회	위험 및 기회	기업이 '단기', '중기' 및 '장기'를 어떻게 정의하고, 이러한 정의가 기업이 전략적 의사결정을 위해 사용하는 계획기간과 어떻게 연계되는지 설명한다.
s2-s4	전략	사업모형과 가치사슬	목적	기업은 일반목적재무보고서의 이용자가 기후 관련 위험 및 기회가 사업모형 및 가치사슬에 미치는 현재 및 예상 영향을 이해할 수 있도록 정보를 공시한다. 구체적으로 기업은 다음을 공시한다.
s2-s5	전략	사업모형과 가치사슬	사업모형과 가치사슬	기후 관련 위험 및 기회가 기업의 사업 모델 및 가치사슬에 미치는 현재 및 예상 영향에 대한 기술
s2-s6	전략	사업모형과 가치사슬	사업모형과 가치사슬	기업의 사업 모델 및 가치사슬에서 기후 관련 위험 및 기회가 집중되어 있는 부분(예: 지리적 영역, 시설 및 자산의 유형)에 대한 기술
s2-s7	전략	전략 및 의사결정	목적	기업은 일반목적재무보고서의 이용자가 기후 관련 위험 및 기회가 전략과 의사결정에 미치는 영향을 이해할 수 있도록 하는 정보를 공시한다. 구체적으로 기업은 다음을 공시한다.
s2-s8	전략	전략 및 의사결정	전략 및 의사결정	기후 관련 위험 및 기회를 다루기 위한 기업의 현재 및 예상되는 사업 모델의 변화(예: 탄소집약적, 에너지집약적, 또는 수자원집약적인 사업장의 관리 계획 혹은 해체, 수요 또는 공급망의 변화에서 유발되는 자원배분, 자본적 지출 또는 연구개발에 대한 추가적인 지출을 통한 사업 개발에서 발생하는 자원배분, 인수 및 매각)
s2-s9	전략	전략 및 의사결정	전략 및 의사결정	현재 및 예상되는 직접적인 완화 및 적응 노력(예: 생산 공정이나 설비의 변경, 시설 재배치, 인력 조정 및 제품 사양 변경)
s2-s10	전략	전략 및 의사결정	전략 및 의사결정	현재 및 예상되는 간접적인 완화 및 적응 노력(예: 고객 및 공급망과의 협력)
s2-s11	전략	전략 및 의사결정	전략 및 의사결정	온실가스 배출량 목표를 포함하여 기후 관련 전환 계획을 어떻게 설정하고 있는지
s2-s12	전략	전략 및 의사결정	전략 및 의사결정	기후 관련 전환 계획을 개발하는 데 사용된 주요 가정 및 의존 요소에 대한 정보
s2-s13	전략	전략 및 의사결정	전략 및 의사결정	기후 관련 전환 계획 및 목표 달성을 위한 구체적인 감축 수단 및 이행 계획에 대한 정보
s2-s14	전략	전략 및 의사결정	전략 및 의사결정	기업이 자본을 어떻게 조달하고, 활용할 계획인지에 대한 정보
s2-s15	전략	기후회복력	목적	기업은 일반목적재무보고서의 이용자가 기업이 식별한 기후 관련 위험 및 기회를 고려하여 기후 관련 변화, 전개 및 불확실성에 대한 기업 전략 및 사업 모델의 회복력을 이해할 수 있게 하는 정보를 공시한다. 기업은 자신의 상황에 상응하는 방식으로 기후 회복력 평가를 위해 기후 관련 시나리오 분석을 사용한다. 구체적으로 기업은 다음을 공시한다.
s2-s16	전략	기후회복력	기후회복력	분석에 사용한 기후 관련 시나리오 및 그러한 시나리오의 원천
s2-s17	전략	기후회복력	기후회복력	기후 관련 시나리오 분석 절차 및 분석에 활용된 주요 가정과 핵심 변수에 대한 설명
s2-s18	전략	기후회복력	기후회복력	기후 관련 전환 위험 또는 물리적 위험에 대한 시나리오 분석 결과(분석에 사용한 기간 범위와 운영 범위를 포함하여)
s2-s19	전략	기후회복력	기후회복력	기후 관련 위험 및 기회를 관리하기 위한 기업의 전략에 있어서 단기, 중기 및 장기에 걸쳐 기업의 재무성과 및 현금흐름이 어떻게 변화할 것으로 예상하는지
s2-s20	전략	기후회복력	기후회복력	기후 관련 위험 및 기회를 관리하기 위한 기업의 투자 및 처분 계획, 역량이 어떠한지. 여기에는 계약상 약정되지 않은 계획을 포함합니다.
s2-s21	전략	기후회복력	기후회복력	기업이 선택한 기후 관련 시나리오를 바탕으로 분석을 진행할 때 고려한 불확실성의 영역
s2-r1	위험관리	기후 관련 위험 식별 및 평가 프로세스	목적	위험관리에 대한 기후 관련 재무공시의 목적은 일반목적재무보고서의 이용자가 기후 관련 위험 및 기회를 식별, 평가, 우선순위 설정 및 모니터링하는 기업의 프로세스를 이해할 수 있도록 하는 것이며, 여기에는 그러한 프로세스가 기업의 전반적\r\n인 위험관리 프로세스상에 어떻게 통합되고 작용하는지를 포함한다. 이러한 목적을 달성하기 위하여 기업은 다음을 공시한다.
s2-r2	위험관리	기후 관련 위험 식별 및 평가 프로세스	기후 관련 위험 식별 및 평가 프로세스	기업이 사용하는 투입변수 및 매개변수(예: 프로세스에서 다뤄지는 데이터 원천 및 사업장 범위에 대한 정보)
s2-r3	위험관리	기후 관련 위험 식별 및 평가 프로세스	기후 관련 위험 식별 및 평가 프로세스	기업이 기후 관련 위험 식별에 정보를 제공하기 위해 기후 관련 시나리오 분석을 사용하는지 여부와 어떻게 사용하는지
s2-r4	위험관리	기후 관련 위험 식별 및 평가 프로세스	기후 관련 위험 식별 및 평가 프로세스	기업이 그러한 위험의 성격, 발생가능성 및 영향의 크기를 어떻게 평가하는지(예: 질적 요인, 양적 임계치 또는 그 밖의 요건의 고려 여부)
s2-r5	위험관리	기후 관련 위험 식별 및 평가 프로세스	기후 관련 위험 식별 및 평가 프로세스	기업이 다른 유형의 위험과 비교하여 기후 관련 위험을 우선시하는지 여부 및 어떻게 우선시하는지
s2-r6	위험관리	기후 관련 위험 식별 및 평가 프로세스	기후 관련 위험 식별 및 평가 프로세스	기업이 기후 관련 위험 및 기회를 지속적으로 모니터링하기 위해 사용하는 프로세스
s2-r7	위험관리	기후 관련 위험 식별 및 평가 프로세스	기후 관련 위험 식별 및 평가 프로세스	기업이 사용하는 프로세스가 과거 보고기간과 비교하여 변경되었는지 여부와 어떻게 변경되었는지
s2-m1	지표 및 목표	지표 및 목표	목적	지표 및 목표에 대한 기후 관련 재무공시의 목적은 일반목적재무보고서의 이용자가 기후 관련 위험 및 기회와 관련된 기업의 성과를 이해할 수 있도록 하는 것이다. 여기에는 기업이 설정한 기후관련 목표 및 법률이나 규정에 따라 충족해야 하는 목표에 대한 진척도를 포함한다. 이러한 목적을 달성하기 위해 기업은 다음 사항을 공시한다.
s2-m2	지표 및 목표	기후 관련 지표	온실가스	온실가스 총 배출량
s2-m3	지표 및 목표	기후 관련 지표	온실가스	온실가스 배출량 산정 지침
s2-m4	지표 및 목표	기후 관련 지표	온실가스	온실가스 배출량 산정에 포함된 온실가스 종류
s2-m5	지표 및 목표	기후 관련 지표	온실가스	온실가스 배출량 측정을 위해 적용한 접근법, 투입변수, 가정
s2-m6	지표 및 목표	기후 관련 지표	온실가스	기업의 Scope 2 온실가스 배출량과 관련된 계약 상품에 관한 정보를 공시한다.
s2-m7	지표 및 목표	기후 관련 지표	전환 위험	기후 관련 전환 위험에 취약한 자산 또는 사업활동의 금액
s2-m8	지표 및 목표	기후 관련 지표	물리적 위험	기후 관련 물리적 위험에 취약한 자산 또는 사업활동의 금액
s2-m9	지표 및 목표	기후 관련 지표	기회	기후 관련 기회에 부합하는 자산 또는 사업활동의 금액
s2-m10	지표 및 목표	기후 관련 지표	자본 배치	기후 관련 위험 및 기회에 대비하여 배치된 자본적 지출, 자금조달 또는 투자 금액
s2-m11	지표 및 목표	기후 관련 지표	내부 탄소 가격	기업의 내부 탄소 가격과 탄소 가격을 의사결정에 적용하고 있는지 여부와 어떻게 적용하는지에 대한 설명
s2-m12	지표 및 목표	기후 관련 지표	보상	기후 관련 사항이 경영진 보상에 어떻게 고려되는지와 기후 관련 사항과 연계된 당기 경영진 보상의 백분율
s2-m13	지표 및 목표	기후 관련 목표	목적	기업은 온실가스 배출량 목표를 포함하여, 전략적 목표를 달성하기 위한 진척도를 모니터링하기 위해 기업이 설정한 양적 및 질적 기후 관련 목표, 그리고 법률이나 규정에 따라 충족해야 하는 목표를 공시한다. 각 목표에 대하여 다음을 공시한다.
s2-m14	지표 및 목표	기후 관련 목표	목표 설정 프로세스	기후 관련 목표에 대하여 사용된 지표, 적용 범위, 기준연도, 모든 주요 목표
s2-m15	지표 및 목표	기후 관련 목표	목표 검토 프로세스	기업은 각각의 목표를 설정하고 검토하는 접근법 및 각각의 목표에 대한 진척도를 어떻게 모니터링하는지에 대한 정보를 공시한다. 여기에는 다음이 포함된다.
s2-m16	지표 및 목표	기후 관련 목표	목표 검토 프로세스	목표 및 목표 설정 방법에 대한 제3자의 검증 여부
s2-m17	지표 및 목표	기후 관련 목표	목표 검토 프로세스	목표를 검토하기 위한 기업의 프로세스
s2-m18	지표 및 목표	기후 관련 목표	목표 검토 프로세스	목표 달성 진척도를 모니터링하기 위해 사용된 지표
s2-m19	지표 및 목표	기후 관련 목표	목표 검토 프로세스	목표 수정사항 및 그러한 수정사항에 대한 설명
s2-m20	지표 및 목표	기후 관련 목표	목표 검토 프로세스	기업은 각 기후 관련 목표 대비 성과 및 기업 성과의 추세 또는 변화 분석에 대한 정보를 공시한다.
s2-gen	일반 정보	보고서 기본 정보	보고서 기본 정보	보고서의 표지 및 버전을 관리하는 기본 정보를 입력합니다.
\.


--
-- Data for Name: issb_s2_requirement; Type: TABLE DATA; Schema: public; Owner: hc_user
--

COPY public.issb_s2_requirement (requirement_id, disclosure_id, requirement_order, requirement_text_ko, data_required_type, input_schema, input_placeholder_ko, input_guidance_ko, created_at, updated_at) FROM stdin;
gov-1	s2-g2	1	기후 관련 의사결정을 담당하는 위원회 또는 조직의 공식 명칭은 무엇인가요?	text	null	예: 이사회 산하 지속가능경영위원회, ESG위원회		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-2	s2-g2	2	기후 관련 의사결정기구의 인력 현황을 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "division", "type": "text", "label": "구분", "placeholder": "예: 사내이사, 사외이사"}, {"name": "full_name", "type": "text", "label": "성명", "placeholder": "예: 천준영"}, {"name": "position", "type": "text", "label": "직책", "placeholder": "예: 위원장, 위원"}, {"name": "appointment_date", "type": "date", "label": "이사 선임일", "placeholder": "YYYY-MM-DD"}, {"name": "gender", "type": "select", "label": "성별", "options": ["남", "여"]}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-3	s2-g2	3	해당 조직의 주요 권한 및 책임 범위를 구체적으로 설명해주세요.	text_long	null	예: 지속가능경영 정책 및 전략 수립, 중장기 목표 설정 심의, 환경 분야 성과 관리감독 등		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-4	s2-g2	4	이사회 또는 하위 위원회에서 기후 관련 안건을 검토, 심의, 또는 결의한 주요 이력이 있다면 추가하여 작성해주세요.	structured_list	{"fields": [{"name": "decision_date", "type": "text", "label": "의결/검토 일자", "placeholder": "예: 2023년 4월"}, {"name": "decision_body", "type": "text", "label": "의결/검토 주체", "placeholder": "예: 이사회 산하 지속가능경영위원회"}, {"name": "decision_details", "type": "text_long", "label": "주요 내용", "placeholder": "예: 기후변화 시나리오 기반 리스크/기회 검토"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-5	s2-g3	1	의사결정기구가 기후 관련 역량을 보유했는지 판단하는 '기준'은 무엇인가요? (예: 지식, 리더십, 법규 이해도 등)	text	null	예: 환경경영 리더십, 기후변화 관련 법규 및 국제 동향에 대한 이해도 등		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-6	s2-g3	2	위 기준을 충족했는지 판단하는 구체적인 '절차'나 사용하는 '도구'가 있다면 설명해주세요.	text	null	예: 신임 이사 선임 시 활용하는 '이사회 역량지표 등		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-7	s2-g3	3	의사결정기구 구성원의 기후 관련 전문성과 역량을 보여주는 주요 인물의 사례를 추가하여 작성해주세요.	structured_list	{"fields": [{"name": "member_name", "type": "text", "label": "성명", "placeholder": "예: 천준영"}, {"name": "member_title", "type": "text", "label": "직책", "placeholder": "예: 사외이사, 지속가능경영위원회 위원장"}, {"name": "competency_details", "type": "text_long", "label": "핵심 역량 및 경력 사항", "placeholder": "예: 국제기구 경험, 특정 산업 전문가로서의 경력, 위원회 참여 이력 등을 구체적으로 서술"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-8	s2-g3	4	이사회의 기후 관련 역량 향상을 위해 기업에서 전체적으로 실시하는 프로그램이나 제도(교육, 평가 등)가 있다면 설명해주세요.	text_long	null	예: 신임/기존 이사 대상 기후변화 교육 실시, 매년 이사회 평가에 ESG 역량 항목 포함 등		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-9	s2-g3	5	구성원 개인이 역량 강화를 위해 참여한 구체적인 교육이나 활동 사례가 있다면 추가하여 작성해주세요.	structured_list	{"fields": [{"name": "member_name_and_title", "type": "text", "label": "구성원 (이름 및 직책)", "placeholder": "예: 2024년 지속가능경영위원회 위원장 천준영 이사"}, {"name": "activity_details", "type": "text_long", "label": "교육/활동 내용", "placeholder": "예: 기후변화를 포함한 ESG 이슈 대응 역량 강화를 위해 고려대학교에서 관련 과정을 수강"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-10	s2-g4	1	기후 관련 의사결정기구는 주로 어떤 내부 조직 또는 부서로부터 정보를 보고받나요?	text	null	예: 전략기획본부 ESG경영실		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-11	s2-g4	2	위원회 개최 등 공식적인 의사결정 시, 위원들의 이해를 돕기 위한 추가적인 지원 절차가 있다면 설명해주세요.	text_long	null	예: 의안 내용에 대한 사전 보고, 참고 자료 제공 등		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-12	s2-g4	3	필요한 경우, 외부 전문가의 자문을 받을 수 있는 규정이나 절차가 마련되어 있나요?	text	null	예: 기업의 비용으로 외부 전문가 자문 가능		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-13	s2-g4	4	기후 관련 안건은 어떤 규정에 따라 누구에게 보고되나요?	text	null	예: 이사회 규정에 따라 이사회 또는 지속가능경영위원회에 보고		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-14	s2-g4	5	위원회의 결의 사항은 구성원들에게 어떻게, 그리고 언제까지 통지되나요?	text	null	예: 결의일로부터 3일 이내에 각 이사에게 통지		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-15	s2-g4	6	핵심 의사결정기구(위원회)는 연간 몇 회나 개최되나요?	text	null	예: 연 2회 이상		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-16	s2-g4	7	의사결정기구가 기후 관련 정보를 보고받거나 관련 안건을 논의한 주요 현황이 있다면, 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "meeting_date", "type": "date", "label": "개최일자", "placeholder": "YYYY-MM-DD"}, {"name": "agenda_details", "type": "text_long", "label": "의안내용", "placeholder": "예: 2023년 지속가능성보고서 발간 결과"}, {"name": "related_info", "type": "text_long", "label": "관련정보", "placeholder": "예: 보고서 내 ESG 데이터 및 성과 검토"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-17	s2-g5	1	기후 관련 위험 및 기회 모니터링은 어떤 위원회에서 어떤 방식으로 이루어지나요?	text_long	null	예: 지속가능경영위원회의 정기 개최를 통해		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-18	s2-g5	2	특히 어떤 종류의 중대한 안건이 최상위 의사결정기구(이사회)에서 직접 심의·결의되나요?	text_long	null	예: 대규모의 시설투자 등을 수반하는 사항		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-19	s2-g5	3	기후 관련 위험 및 기회를 고려한 주요 의사결정 안건이 있다면, 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "category", "type": "text", "label": "구분", "placeholder": "예: 이사회, 지속가능경영위원회"}, {"name": "decision_date", "type": "date", "label": "일자", "placeholder": "YYYY-MM-DD"}, {"name": "approval_status", "type": "select", "label": "가결 여부", "options": ["가결", "부결", "보고"]}, {"name": "agenda_details", "type": "text_long", "label": "주요 의안 내용", "placeholder": "예: 2024년도 ESG 경영전략 및 목표 승인"}, {"name": "climate_considerations", "type": "text_long", "label": "기후 관련 위험 및 기회 고려사항", "placeholder": "예: 저탄소 기술 투자 관련 리스크 및 기회 요인 검토"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-20	s2-g6	1	기후 관련 목표 설정 및 이행 과정을 총괄하여 관리·감독하는 주체(위원회 등)와 그 역할을 설명해주세요.	text_long	null	예: 지속가능경영위원회를 통해 목표 설정 및 이행경과를 관리·감독		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-21	s2-g6	2	수립된 목표의 진척도와 성과를 구체적으로 어떻게 관리(모니터링)하고 있나요?	text_long	null	예: 정기적인 성과 모니터링 실시		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-22	s2-g6	3	기후 관련 목표 설정 및 진척도 관리·감독과 관련된 주요 현황이 있다면, 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "activity_category", "type": "select", "label": "구분", "options": ["진척도 관리감독", "목표설정"]}, {"name": "activity_date", "type": "date", "label": "일자", "placeholder": "YYYY-MM-DD"}, {"name": "activity_details", "type": "text_long", "label": "내용", "placeholder": "예: 2024년도 온실가스 감축 목표 설정 검토"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-23	s2-g6	4	기후 관련 성과가 경영진의 보상 정책에 어떻게 연계되어 있는지, 그 근거 규정을 포함하여 설명해주세요.	text_long	null	예: '사내이사 보수 지급 규정'에 근거하여 지속가능성 성과를 사내이사 보수와 연계		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-24	s2-g6	5	경영진의 보상과 연계되는 '종합적인 평가'의 세부적인 구성 항목(계량/비계량 지표 등)에 대해 구체적으로 설명해주세요.	text_long	null	예: 계량지표(매출액, ESG 평가결과), 비계량지표(ESG 경영고도화 등)를 종합적으로 평가하며, 특히 ESG 경영고도화 항목에서는...		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-25	s2-g8	1	기후 관련 의사결정기구는 기후 관련 책임을 누구(어떤 조직)에게 위임하나요?	text	null	예: 경영진, ESG 전담부서		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-26	s2-g8	2	경영진 내에서 기후 관련 업무를 담당하는 주요 직책과, 각 직책의 역할 및 책임을 추가하여 작성해주세요.	structured_list	{"fields": [{"name": "management_position", "type": "text", "label": "경영진 직책", "placeholder": "예: CEO, CSO 겸 CFO"}, {"name": "responsibilities", "type": "text_long", "label": "주요 역할 및 책임", "placeholder": "예: 기후변화 전략 이행 총괄 및 관리감독 수행"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-27	s2-g9	1	기후/ESG 관련 내부통제 및 감사 절차에 대해 설명해주세요. (감사 주체, 보고 라인, 지적사항에 대한 개선 및 후속 조치 과정 포함)	text_long	null	예: 감사위원회가 감사를 수행하여 경영진에 보고하며, 지적사항에 대해 현업부서가 개선계획을 제출하고..		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gov-28	s2-g9	2	내부감사의 주제는 어떤 방식으로 선정되나요?	text_long	null	예: 연간 감사계획 수립 시, 감사단 자체 리스크 평가를 통해 선정		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-1	s2-s2	1	기후 관련 위험 및 기회를 식별하고 평가할 때, 어떤 정보 출처 또는 데이터 소스를 주로 활용하셨나요?	text	null	예: SASB 표준, IPCC 보고서, 자체 시장 분석 데이터, 정부 정책 문서 등		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-2	s2-s2	2	만약 SASB와 같이 특정 산업 주제를 가진 프레임워크를 활용하셨다면, '사업모형' 관점에서 고려한 주제는 무엇인가요?	text	null	예: 식음료 부문의 담배(Tobacco) 및 가공식품(Processed_Foods)		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-3	s2-s2	3	만약 SASB와 같이 특정 산업 주제를 가진 프레임워크를 활용하셨다면, '가치사슬' 관점에서 고려한 주제는 무엇인가요?	text	null	예: 농산물(Agricultural Products), 용기 및 포장(Containers Packaging) 등		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-4	s2-s2	4	식별된 주요 기후 관련 위험 및 기회를 아래 표에 모두 추가하여 작성해주세요.	table_input	{"columns": [{"name": "category", "type": "select", "label": "구분", "options": ["전환 리스크", "물리적 리스크", "기회"]}, {"name": "type", "type": "text", "label": "유형", "placeholder": "예: 정책, 기술 등"}, {"name": "factor", "type": "text_long", "label": "위험 및 기회 요인", "placeholder": "예: 탄소배출규제 강화"}, {"name": "description", "type": "text_long", "label": "설명", "placeholder": "위험/기회 요인에 대한 상세 설명"}, {"name": "short_term_impact", "type": "select", "label": "단기", "options": ["상", "중", "하", "해당없음"]}, {"name": "mid_term_impact", "type": "select", "label": "중기", "options": ["상", "중", "하", "해당없음"]}, {"name": "long_term_impact", "type": "select", "label": "장기", "options": ["상", "중", "하", "해당없음"]}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-5	s2-s3	1	보고서에 사용될 '단기(Short-term)'의 기간 및 정의는 무엇인가요?	text	null	예: 1년 이하		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-6	s2-s3	2	보고서에 사용될 '중기(Mid-term)'의 기간 및 정의는 무엇인가요?	text	null	예: 1년 초과 5년 이하		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-7	s2-s3	3	보고서에 사용될 '장기(Long-term)'의 기간 및 정의는 무엇인가요?	text	null	예: 5년 초과		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-8	s2-s3	4	기업의 공식적인 전략 계획 주기(예: 중장기 사업계획)는 어떻게 되며, 이 계획 수립 과정에서 기후 관련 요소를 어떻게 연계하여 고려하는지 설명해주세요	text_long	null	예: 3년 단위의 사업계획과 5년 단위의 중장기 비전을 수립하며, 계획 수립 시 대외 동향 분석 단계에서 기후 관련 위험 및 기회를 고려합니다.		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-9	s2-s5	1	기업의 비즈니스 모델을 구성하는 주요 사업 부문과, 각 부문의 핵심 사업 내용을 추가하여 작성해주세요.	structured_list	{"fields": [{"name": "segment_name", "type": "text", "label": "사업 부문명", "placeholder": "예: 담배부문, 건강기능부문"}, {"name": "segment_description", "type": "text_long", "label": "주요 사업 내용", "placeholder": "예: 궐련 및 차세대 전자담배 등의 제조와 판매 사업을 운영"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-10	s2-s5	2	기업의 '가치사슬(Value Chain)'은 어떤 범위(예: 원자재 수급, 생산, 소비, 폐기 등)를 포함하는지, 그 정의를 설명해주세요.	text_long	null	예: 제품 기획에서 배송, 소비 및 수명종료에 이르기까지 제품/서비스 생산에 사용되는 모든 상호작용, 자원, 관계		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-11	s2-s5	3	기후 관련 위험 및 기회를 중점적으로 식별한 핵심 사업 부문은 어디인가요? (복수일 경우 모두 기재)	text	null	예: 담배부문, 건강기능부문		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-12	s2-s5	4	위에서 답변한 핵심 사업 부문의 '사업 모형'을 구성하는 주요 활동들을 나열해주세요.	text	null	예: 제품 및 기술 연구개발, 산출물의 생산제조, 영업 및 마케팅		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-13	s2-s5	5	위에서 답변한 핵심 사업 부문의 '가치사슬'을 구성하는 주요 활동들을 나열해주세요.	text	null	예: 업스트림에서의 원재료 구매, 유통 및 운송, 다운스트림에서의 제품 사용 및 폐기		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-14	s2-s5	6	위에서 식별한 각 위험 및 기회 요인이 사업모형과 가치사슬에 미치는 영향을 아래 형식에 맞게 추가하여 작성해주세요.	structured_list	{"fields": [{"name": "risk_opportunity_factor", "type": "text", "label": "위험 및 기회 요인", "placeholder": "'위험 및 기회' 카테고리에서 입력한 요인 중 하나를 선택 또는 직접 입력"}, {"name": "overview_description", "type": "text_long", "label": "영향 개요 설명", "placeholder": "해당 위험/기회에 대한 전반적인 설명과 사업에 미치는 주된 영향을 서술해주세요."}, {"name": "impact_details_table", "type": "table_input", "label": "활동별 상세 영향", "schema": {"columns": [{"name": "activity", "type": "text", "label": "활동"}, {"name": "current_impact", "type": "text_long", "label": "현재"}, {"name": "future_impact", "type": "text_long", "label": "예상"}]}, "guidance": "표의 '활동' 컬럼에는 바로 위 항목에서 답변하신 사업모형 및 가치사슬 활동들을 기재해주세요."}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-15	s2-s6	1	기업의 사업 모델, 가치사슬, 지리적 위치, 시설 유형 등 기후 관련 위험 및 기회가 특히 집중되어 있는 영역에 대해 종합적으로 기술해주세요.	text_long	null	예: 원재료·자재 등 투입물 구매와 생산제조, 제품 및 기술 연구개발 / 아시아 지역에 위치한 생산 시설 / 반도체 웨이퍼 등 핵심 자산		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-16	s2-s8	1	가장 최근 보고기간 동안, 기후 관련 요인으로 인해 사업 모델의 자원 배분에 직접적인 변화가 있었나요? 있었다면 그 내용을, 없었다면 "변화 없음"으로 기재해주세요.	text	null	예: 기후변화 관련 위험과 기회에 대한 전략 및 재무계획의 회복탄력성 평가		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-17	s2-s8	2	향후 기후 대응을 위해 자원을 배분할 계획이 있는 주요 분야나 활동 유형은 무엇인가요?	text	null	예: NGFS(금융감독기관협의체), IEA(국제에너지기구), IPCC 등		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-18	s2-s8	3	위 자원배분 계획과 관련된 구체적인 투자나 프로젝트 사례가 있다면, 아래 형식에 맞게 추가하여 작성해주세요.	structured_list	{"fields": [{"name": "project_name", "type": "text", "label": "프로젝트명", "placeholder": "예: 친환경 하수처리공장 신설"}, {"name": "project_location_scale", "type": "text", "label": "위치 및 규모", "placeholder": "예: 고려대학교 경영대학 1,583㎡ 부지"}, {"name": "project_investment", "type": "text", "label": "투자 규모", "placeholder": "예: 약 1,000억 원"}, {"name": "project_timeline", "type": "text", "label": "주요 일정", "placeholder": "예: 2026년 준공 예정"}, {"name": "project_details", "type": "text_long", "label": "프로젝트 상세 내용 및 기대효과", "placeholder": "예: 최첨단 하수처리 자동화 도입, 친환경건축인증(LEED) GOLD 등급 목표 등"}]}	예: 1.5℃ 시나리오, 4℃ 시나리오 등		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-19	s2-s9	1	기후 대응을 위한 '직접적인' 완화 및 적응 노력에 대한 주요 활동들을 그룹별로 추가하여 작성해주세요.	structured_list	{"fields": [{"name": "effort_category", "type": "text", "label": "구분", "placeholder": "예: ① 제품 소재 변경, ② 재생에너지 조달 및 사용 확대"}, {"name": "detailed_actions", "type": "table_input", "label": "세부 활동 내용", "schema": {"columns": [{"name": "action_description", "type": "text_long", "label": "내용"}, {"name": "is_mitigation", "type": "boolean", "label": "완화"}, {"name": "is_adaptation", "type": "boolean", "label": "적응"}, {"name": "is_current", "type": "boolean", "label": "현재"}, {"name": "is_future", "type": "boolean", "label": "예상"}]}}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-20	s2-s9	2	위 표에서 작성한 각 세부 활동에 대한 보고서 본문 내용을 아래 형식에 맞게 작성해주세요.	structured_list	{"fields": [{"name": "narrative_text", "type": "text_long", "label": "상세 서술 내용", "placeholder": "해당 활동의 배경, 구체적인 실행 내용, 정량적 성과, 향후 계획 등을 자유롭게 서술해주세요."}], "source_requirement": "str-19", "source_field_to_display": "action_description"}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-21	s2-s10	1	기후 대응을 위한 '간접적인' 완화 및 적응 노력에 대한 주요 활동들을 그룹별로 추가하여 작성해주세요.	structured_list	{"fields": [{"name": "effort_category", "type": "text", "label": "구분", "placeholder": "예: ① 공급망 관리, ② 지역사회 협력"}, {"name": "detailed_actions", "type": "table_input", "label": "세부 활동 내용", "schema": {"columns": [{"name": "action_description", "type": "text_long", "label": "내용"}, {"name": "is_mitigation", "type": "boolean", "label": "완화"}, {"name": "is_adaptation", "type": "boolean", "label": "적응"}, {"name": "is_current", "type": "boolean", "label": "현재"}, {"name": "is_future", "type": "boolean", "label": "예상"}]}}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-22	s2-s10	2	위 표에서 작성한 각 간접적 세부 활동에 대한 보고서 본문 내용을 아래 형식에 맞게 작성해주세요.	structured_list	{"fields": [{"name": "narrative_text", "type": "text_long", "label": "상세 서술 내용", "placeholder": "해당 활동의 배경, 구체적인 실행 내용, 정량적 성과, 향후 계획 등을 자유롭게 서술해주세요."}], "source_requirement": "str-21", "source_field_to_display": "action_description"}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-23	s2-s11	1	기업의 기후 관련 전환 계획을 수립할 때 기반으로 삼은 주요 원칙, 프레임워크, 그리고 궁극적인 장기 목표(예: Net-Zero)는 무엇인가요?	text_long	null			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-24	s2-s11	2	기업의 주요 기후 관련 정량 목표(온실가스 감축, 재생에너지 사용, Net-Zero 등)가 있다면 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "target_category", "type": "text", "label": "목표 구분", "placeholder": "예: 온실가스 감축, 재생에너지 사용, 탄소중립(Net-Zero)"}, {"name": "scope", "type": "text", "label": "대상 범위", "placeholder": "예: Scope 1+2, 가치사슬 전체"}, {"name": "target_year", "type": "text", "label": "목표 연도", "placeholder": "예: 2030, 2045"}, {"name": "target_details", "type": "text_long", "label": "상세 목표 내용", "placeholder": "예: 2020년 대비 42% 감축, 100% 전환"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-25	s2-s11	3	Scope 3 배출량 관리를 위한 별도의 전략(산정 고도화, 협력사 지원, 감축 목표 등)이 있다면 구체적으로 설명해주세요.	text_long	null			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-26	s2-s12	1	전환 계획 수립 시 고려한 주요 가정과, 해당 가정에 영향을 미치는 의존 요소(또는 종속 변수)가 있다면 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "assumption", "type": "text_long", "label": "주요 가정", "placeholder": "예: 예상 온실가스 배출량 산정 조건"}, {"name": "dependency", "type": "text_long", "label": "의존 요소", "placeholder": "예: 전환 계획 이행을 위한 물리적, 인적 자원의 가용성"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-27	s2-s13	1	기후 목표 달성을 위한 구체적인 감축 수단 및 이행 계획이 있다면, 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "action_category", "type": "text", "label": "구분", "placeholder": "예: 자체 태양광 발전 설비 확대, 고효율 설비 전환"}, {"name": "action_plan", "type": "text_long", "label": "달성 계획", "placeholder": "예: 2023년부터 주요 사업장에 태양광 설비를 가동하여 2030년까지 감축 포트폴리오의 21% 달성"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-28	s2-s14	1	그린본드 발행 등 기후 목표 달성을 위한 친환경 자금 조달 사례가 있다면 추가하여 작성해주세요.	structured_list	{"fields": [{"name": "financing_type", "type": "text", "label": "자금 조달 유형", "placeholder": "예: 그린본드(Green Bond)"}, {"name": "issue_date", "type": "text", "label": "발행/조달 일자", "placeholder": "예: 2024년 4월"}, {"name": "scale", "type": "text", "label": "규모", "placeholder": "예: 1,000억 원"}, {"name": "use_of_proceeds", "type": "text_long", "label": "자금 활용 계획", "placeholder": "예: 신재생에너지, 친환경 건축물 구축 등 프로젝트 투자"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-29	s2-s14	2	내부 탄소가격제 등 기후 관련 투자 의사결정을 지원하는 내부 정책이나 가이드라인이 있다면, 그 내용과 기대효과에 대해 설명해주세요.	text_long	null			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-30	s2-s14	3	비용 효율적인 온실가스 감축 수단을 선정하고 실행하는 방법론(예: 한계감축비용 분석)이 있다면 설명해주세요.	text_long	null			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-31	s2-s14	4	기후변화 대응을 위한 전문 인력 채용 및 운영 계획이 있다면 추가하여 작성해주세요.	structured_list	{"fields": [{"name": "hiring_period", "type": "text", "label": "채용 시기", "placeholder": "예: 2023년 이후"}, {"name": "num_of_hires", "type": "number", "label": "채용 인원", "placeholder": "예: 4"}, {"name": "roles_and_plans", "type": "text_long", "label": "주요 역할 및 운영 계획", "placeholder": "예: 관련 부서에 배치하여 온실가스 저감 계획 수립, 모니터링 등 관련 업무 수행"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-32	s2-s15	1	기업의 기후 시나리오 분석 수행 목적은 무엇인가요?	text_long	null	예: 기후변화가 비즈니스에 미치는 잠재적 영향을 다각적으로 예측하고, 이에 대응하는 중장기 사업 전략 및 재무계획의 견고함을 선제적으로 평가하기 위해		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-33	s2-s16	1	시나리오 분석 시 참고한 외부 기관이나 프레임워크는 무엇인가요?	text	null	예: 국제에너지기구(IEA)의 미래 에너지 전망 시나리오		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-34	s2-s16	2	분석에 활용한 주요 기후 시나리오들은 무엇이며, 각 시나리오를 선택한 이유는 무엇인가요?	text_long	null	예: 전환 리스크와 물리적 리스크의 수준이 상이한 1.5℃ 시나리오와 4℃ 시나리오 두 가지 핵심 시나리오를 활용		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-35	s2-s17	1	기업의 기후 시나리오 분석 절차를 주요 단계별로 순서에 맞게 추가하여 작성해주세요.	structured_list	{"fields": [{"name": "step_description", "type": "text", "label": "분석 단계", "placeholder": "예: 1단계 - 주요 리스크/기회 식별"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-36	s2-s17	2	시나리오 분석에 사용된 각 시나리오별 주요 가정과 핵심 변수(입력변수)를 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "scenario_name", "type": "text", "label": "시나리오", "placeholder": "예: 1.5℃ 시나리오 (NZE)"}, {"name": "key_assumptions", "type": "text_long", "label": "주요 가정", "placeholder": "예: 강력한 탄소 규제 및 저탄소 경제로의 급격한 전환"}, {"name": "input_variables", "type": "text_long", "label": "핵심 변수 (투입변수)", "placeholder": "예: 탄소 가격(Carbon Price), 신재생에너지 비중, 폭염 발생 빈도 등"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-37	s2-s18	1	식별한 각 위험 및 기회 요인에 대한 재무적 영향과 대응 현황을 아래 형식에 맞게 작성해주세요.	structured_list	{"fields": [{"name": "financial_impact", "type": "text_long", "label": "재무적 영향", "placeholder": "해당 요인이 기업의 재무 상태에 미치는 구체적인 영향(비용 증가, 매출 변동 등)을 서술해주세요."}, {"name": "response_strategy", "type": "text_long", "label": "대응 현황", "placeholder": "해당 요인에 대응하기 위한 기업의 현재 및 향후 계획, 전략 등을 서술해주세요."}], "source_requirement": "str-4", "source_field_to_display": "factor"}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-38	s2-s18	2	식별한 각 전환 리스크 요인에 대한 상세 분석 및 재무적 영향 내용을 아래 형식에 맞게 작성해주세요.	structured_list	{"fields": [{"name": "analysis_overview", "type": "text_long", "label": "분석 개요 및 시나리오 분석 결과", "placeholder": "해당 전환 리스크를 중요하게 선정한 이유와, 시나리오 분석을 통해 나타난 리스크 수준의 변화(시기별, 시나리오별)를 설명해주세요."}, {"name": "context_and_impact", "type": "text_long", "label": "시장/규제 동향 및 가치사슬 영향", "placeholder": "해당 리스크와 관련된 외부 동향(규제, 시장 가격 등)과, 이 리스크가 기업의 가치사슬(운영, 물류 등)에 미치는 영향을 설명해주세요."}, {"name": "quantification_methodology", "type": "text_long", "label": "재무적 영향 산출 방법론", "placeholder": "재무적 영향을 추정하기 위해 사용한 기준, 가정, 계산 방법 등을 설명해주세요."}, {"name": "financial_statement_impact", "type": "text_long", "label": "재무제표 영향", "placeholder": "해당 전환 리스크가 손익계산서, 재무상태표, 현금흐름표의 특정 계정(매출원가, 충당부채 등)에 미치는 영향을 구체적으로 서술해주세요."}], "source_filter": {"category": ["전환 리스크"]}, "source_requirement": "str-4", "source_field_to_display": "factor"}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
rsk-9	s2-r6	2	위 지표들의 변화에 따라, 기업의 리스크 평가나 시나리오 분석을 업데이트하는 절차는 어떻게 되나요? 최근의 주요 업데이트 사례가 있다면 함께 설명해주세요.	text_long	null	예: 주요 지표에 중대한 변화 발생 시 시나리오 분석을 업데이트합니다. 2023년에는 물리적 리스크 심화 가능성에 따라 4.0℃ 시나리오 분석을 추가했습니다.		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-39	s2-s18	3	물리적 리스크(폭염, 태풍, 가뭄 등)에 대한 시나리오별 정량 분석 데이터를 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "risk_type", "type": "select", "label": "리스크 유형", "options": ["폭염", "태풍", "가뭄", "홍수", "수자원 스트레스"]}, {"name": "location", "type": "text", "label": "사업장/지역", "placeholder": "예: 청주, 용인, 중국 우시"}, {"name": "scenario", "type": "text", "label": "시나리오", "placeholder": "예: SSP1-2.6, SSP5-8.5"}, {"name": "year", "type": "number", "label": "연도", "placeholder": "예: 2030, 2040, 2050"}, {"name": "value", "type": "number", "label": "측정값 (증가량)", "placeholder": "예: 14.7"}, {"name": "unit", "type": "text", "label": "단위", "placeholder": "예: 일, mm, 건"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-40	s2-s18	4	위 표에서 선택한 각 물리적 리스크에 대해, 잠재적 재무 영향을 산정하기 위해 고려한 상세 항목과 산출 방식을 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "consideration_item", "type": "text", "label": "재무 영향 산정을 위해 고려한 항목", "placeholder": "예: 추가 전력 비용, 근로자 작업능력 저하"}, {"name": "calculation_method", "type": "text_long", "label": "산출 방식", "placeholder": "예: 폭염일수 증가에 따른 추가 전력량 및 설비 면적 기반으로 산출"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-41	s2-s18	5	잠재적 재무 영향에 대한 분석을 바탕으로, 각 물리적 리스크에 대한 시나리오별 연평균 예측 손실액을 아래 표에 추가하여 작성해주세요. (단위: 억원)	table_input	{"columns": [{"name": "risk_type", "type": "select", "label": "물리적 리스크 유형", "options": ["폭염", "태풍", "가뭄", "홍수", "수자원 스트레스"]}, {"name": "scenario", "type": "text", "label": "시나리오", "placeholder": "예: SSP1-2.6, SSP5-8.5"}, {"name": "year", "type": "number", "label": "연도", "placeholder": "예: 2030, 2050"}, {"name": "estimated_loss", "type": "number", "label": "예측 손실액 (억원)", "placeholder": "예: 12, 27"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-42	s2-s19	1	위에서 산정된 물리적 리스크로 인한 잠재적 재무 영향이 재무제표(손익계산서, 재무상태표, 현금흐름표)의 특정 계정에 구체적으로 어떻게 반영되는지 서술해주세요.	text_long	null			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-43	s2-s20	1	기후변화에 대응하여 전략 및 사업모형을 조정하고 적응시키는 기업의 핵심 역량이 있다면, 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "capacity_category", "type": "text", "label": "구분", "placeholder": "예: 그룹사 넷제로 전략 수립, 재무자원의 가용성 및 유연성"}, {"name": "capacity_description", "type": "text_long", "label": "정의", "placeholder": "해당 역량에 대한 구체적인 설명, 관련 활동, 기대효과 등을 서술해주세요."}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
str-44	s2-s21	1	기후 회복력 평가 시 고려한 유의적인 불확실성 영역이 있다면, 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "uncertainty_category", "type": "text", "label": "구분", "placeholder": "예: 탄소 비용, 기후 모델"}, {"name": "definition", "type": "text_long", "label": "정의", "placeholder": "해당 불확실성 영역에 대한 간략한 정의를 서술해주세요."}, {"name": "uncertainty_details", "type": "text_long", "label": "불확실성", "placeholder": "해당 영역에 내재된 구체적인 불확실성 내용을 서술해주세요."}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
rsk-1	s2-r2	1	기후 관련 위험 및 기회 식별/평가 프로세스에 사용한 주요 투입변수, 매개변수 및 해당 데이터의 원천을 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "input_variable", "type": "text", "label": "투입변수 및 매개변수", "placeholder": "예: 정책 이행 수준, 온실가스 배출량 추이"}, {"name": "data_source", "type": "text_long", "label": "데이터 원천", "placeholder": "예: 환경부 및 산업통상자원부, 회사 내부 데이터"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
rsk-2	s2-r3	1	기업이 기후 관련 위험 식별 시, 기후 시나리오 분석을 사용하는지 여부와, 만약 사용한다면 어떻게 활용하는지에 대해 설명해주세요.	text_long	null	예: 기후 시나리오 분석을 통해 잠재적 위험/기회의 영향을 파악하고, 이를 대응 활동 및 관리체계 강화에 활용합니다.		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
rsk-3	s2-r4	1	기업 내부적으로 기후 관련 위험의 '발생가능성'과 '영향'을 평가하는 핵심적인 프로세스나 방법론은 무엇인가요?	text_long	null	예: 기후변화 시나리오 분석을 활용하며, 리스크 식별, 관련성 평가, 시나리오 선정 등의 단계를 거쳐 종합적으로 분석하고, 최종적으로 주요 리스크를 식별하여 대응 전략을 검토합니다.		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
rsk-4	s2-r4	2	위험 평가 과정의 객관성과 전문성을 높이기 위해 활용하는 외부 전문가 자문이나 외부 데이터/분석 도구가 있다면 구체적으로 설명해주세요.	text_long	null	예: 투자 분석가, 교수 등으로 구성된 외부 전문가 패널의 의견을 반영합니다. 또한, 물리적 리스크 분석을 위해 S&P사의 Climanomics 도구를 활용합니다		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
rsk-5	s2-r5	1	기업의 전사적 위험 관리(ERM) 체계에 기후 관련 위험이 어떻게 통합되어 있으며, 일반적인 위험 평가 기준(예: 재무/비재무 영향, 발생가능성)은 무엇인가요?	text_long	null	예: 기후 관련 위험을 전사적 위험 관리 체계에 통합하여, 재무/비재무적 영향과 발생가능성을 종합적으로 고려해 평가합니다.		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
rsk-6	s2-r5	2	기후 위험의 우선순위를 정하기 위해 사용하는 특별한 평가 방법론(예: 이중 중대성 평가)이 있다면, 그 과정(내부 분석, 외부 이해관계자 평가 등)을 설명해주세요.	text_long	null	예: 내부적으로는 시나리오 분석을 통한 재무 영향을, 외부적으로는 이해관계자 서베이를 통한 사회·환경적 영향을 종합하여 우선순위를 결정합니다.		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
rsk-7	s2-r5	3	기후 위험 평가 결과 및 대응 활동은 내부적으로 어떻게 보고되고 외부에 공개되나요?	text	null	예: 경영진 및 관련 위원회에 주기적으로 보고하며, CDP 등 외부 이니셔티브를 통해 공개합니다.		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
rsk-8	s2-r6	1	기업이 기후 관련 위험 및 기회를 지속적으로 모니터링하기 위해 추적하는 주요 지표나 매개변수를 아래에 항목별로 추가하여 작성해주세요.	structured_list	{"fields": [{"name": "parameter_name", "type": "text", "label": "모니터링 지표/매개변수", "placeholder": "예: 정책 이행 수준"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
rsk-10	s2-r6	3	이러한 지속적인 모니터링 과정을 감독하고 검토하는 의사결정기구(위원회, 조직 등)의 역할에 대해 설명해주세요.	text_long	null	예: 지속가능경영위원회는 전반적인 성과와 진행 상황을 모니터링하며, 감사단은 독립적인 점검을 수행하여 감사위원회에 보고합니다.		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
rsk-11	s2-r7	1	과거 보고기간과 비교하여, 기후 관련 위험 및 기회 관리 프로세스에 변경사항이 있다면 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "process_category", "type": "text", "label": "프로세스 구분", "placeholder": "예: 위험 식별 프로세스, 이중 중대성 평가 방법론"}, {"name": "change_description", "type": "text_long", "label": "주요 변경 내용", "placeholder": "구체적으로 어떤 부분이 어떻게 변경되었는지 서술해주세요."}, {"name": "change_reason", "type": "text_long", "label": "변경 사유", "placeholder": "해당 프로세스를 변경한 이유나 배경을 서술해주세요."}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-1	s2-m2	1	기업의 연도별 온실가스 배출량(Scope 1, 2, 3)을 아래의 고정된 양식에 맞춰 입력해주세요. (단위: tCO2eq)	ghg_emissions_input	{"categories": ["Scope 1", "Scope 2", "Scope 3", " C1 제품 및 서비스 구매", " C2 자본재", " C3 구매연료 및 에너지", " C4 업스트림 운송&유통", " C5 사업장 발생 폐기물", " C6 임직원 출장", " C7 통근", " C8 임차자산(Upstream)", " C9 Downstream 운송&유통", " C10 판매제품 가공", " C11 판매 제품 사용", " C12 판매 제품 폐기", " C13 임대자산(Downstream)", " C14 프랜차이즈", " C15 투자", "합계"]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-2	s2-m3	1	Scope별 온실가스 배출량 측정을 위해 적용한 지침을 아래의 고정된 양식에 맞춰 작성해주세요.	ghg_emissions_input	{"rows": [{"key": "scope1", "label": "Scope 1"}, {"key": "scope2", "label": "Scope 2"}, {"key": "scope3", "label": "Scope 3"}], "value_column": {"type": "text_long", "label": "적용 지침", "placeholder": "적용된 산정 방법론, 기준, 지침 등을 서술해주세요."}}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-3	s2-m4	1	Scope별 온실가스 배출량 산정에 포함된 온실가스 종류를 아래 표에 체크하여 표시해주세요.	ghg_gases_input	{"rows": [{"key": "scope1", "label": "Scope 1"}, {"key": "scope2", "label": "Scope 2"}, {"key": "scope3", "label": "Scope 3"}], "columns": [{"key": "co2", "label": "CO₂"}, {"key": "ch4", "label": "CH₄"}, {"key": "n2o", "label": "N₂O"}, {"key": "hfcs", "label": "HFCs"}, {"key": "pfcs", "label": "PFCs"}, {"key": "sf6", "label": "SF?"}, {"key": "nf3", "label": "NF₃"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-4	s2-m5	1	Scope 1, 2 온실가스 배출량 측정을 위해 적용한 접근법, 투입변수, 가정을 아래의 고정된 양식에 맞춰 작성해주세요.	ghg_scope12_approach_input	{"rows": [{"key": "scope1", "label": "Scope 1"}, {"key": "scope2", "label": "Scope 2"}], "columns": [{"key": "input_variables", "label": "투입변수", "sub_columns": [{"key": "activity_data", "label": "활동데이터", "sub_columns": [{"key": "activity_content", "label": "내용"}, {"key": "activity_type", "label": "유형"}]}, {"key": "emission_factor", "label": "배출계수", "sub_columns": [{"key": "factor_content", "label": "내용"}, {"key": "factor_source", "label": "출처"}]}]}, {"key": "key_assumptions", "label": "주요 가정"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-5	s2-m5	2	Scope 3의 15개 카테고리별 온실가스 배출량 측정을 위해 적용한 접근법, 투입변수, 가정을 아래의 고정된 양식에 맞춰 작성해주세요.	ghg_scope3_approach_input	{"rows": [{"key": "c1", "label": "C1 제품 및 서비스 구매"}, {"key": "c2", "label": "C2 자본재"}, {"key": "c3", "label": "C3 구매연료 및 에너지"}, {"key": "c4", "label": "C4 업스트림 운송&유통"}, {"key": "c5", "label": "C5 사업장 발생 폐기물"}, {"key": "c6", "label": "C6 임직원 출장"}, {"key": "c7", "label": "C7 통근"}, {"key": "c8", "label": "C8 임차자산(Upstream)"}, {"key": "c9", "label": "C9 Downstream 운송&유통"}, {"key": "c10", "label": "C10 판매제품 가공"}, {"key": "c11", "label": "C11 판매 제품 사용"}, {"key": "c12", "label": "C12 판매 제품 폐기"}, {"key": "c13", "label": "C13 임대자산(Downstream)"}, {"key": "c14", "label": "C14 프랜차이즈"}, {"key": "c15", "label": "C15 투자"}], "columns": [{"key": "input_variables", "label": "투입변수", "sub_columns": [{"key": "activity_data", "label": "활동데이터", "sub_columns": [{"key": "activity_content", "label": "내용"}, {"key": "activity_type", "label": "유형"}]}, {"key": "emission_factor", "label": "배출계수", "sub_columns": [{"key": "factor_content", "label": "내용"}, {"key": "factor_source", "label": "출처"}]}]}, {"key": "key_assumptions", "label": "주요 가정"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-6	s2-m6	1	Scope 2 온실가스 배출량(시장기준)과 관련된 계약 상품 정보가 있다면, 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "contract_instrument", "type": "text", "label": "계약수단", "placeholder": "예: 녹색프리미엄, REC(재생에너지 공급인증서) 구매"}, {"name": "energy_source", "type": "text", "label": "에너지원", "placeholder": "예: 태양광, 풍력"}, {"name": "usage_mwh", "type": "number", "label": "사용량(MWh)", "placeholder": "예: 12345"}, {"name": "contract_period", "type": "text", "label": "계약기간", "placeholder": "예: 2023-01-01 ~ 2023-12-31"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-7	s2-m7	1	기후 관련 '전환 위험'에 취약한 자산/사업활동, 그에 따른 잠재적 위험, 그리고 대응 노력을 아래에 추가하여 작성해주세요.	structured_list	{"fields": [{"name": "vulnerable_asset", "type": "text", "label": "취약 자산/사업활동", "placeholder": "예: 국내 담배 사업부문 사업장"}, {"name": "potential_risk", "type": "text_long", "label": "잠재적 위험 상세 설명", "placeholder": "어떤 잠재적 위험(규제, 기술, 시장 등)에 노출되어 있는지 구체적으로 서술해주세요."}, {"name": "mitigation_effort", "type": "text_long", "label": "대응 노력", "placeholder": "해당 위험에 대응하기 위한 구체적인 활동 및 계획을 서술해주세요."}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-8	s2-m7	2	위에서 식별된 전환 위험 취약 자산/사업활동의 금액과 그 산정 기준을 작성해주세요.	table_input	{"columns": [{"name": "vulnerable_asset", "type": "text", "label": "자산/사업활동", "placeholder": "예: 국내 전자 사업부문 사업장"}, {"name": "monetary_value", "type": "number", "label": "금액 (단위: 억원)", "placeholder": "금액을 숫자로만 입력"}, {"name": "calculation_basis", "type": "text_long", "label": "산정 기준", "placeholder": "예: 해당 사업장의 장부가액 기준"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-9	s2-m8	1	기후 관련 '물리적 위험'에 취약한 자산/사업활동, 그에 따른 잠재적 위험, 그리고 대응 노력을 아래에 추가하여 작성해주세요.	structured_list	{"fields": [{"name": "vulnerable_asset", "type": "text", "label": "취약 자산/사업활동", "placeholder": "예: 국내 담배 사업부문 사업장"}, {"name": "potential_risk", "type": "text_long", "label": "잠재적 위험 상세 설명", "placeholder": "어떤 잠재적 위험(규제, 기술, 시장 등)에 노출되어 있는지 구체적으로 서술해주세요."}, {"name": "mitigation_effort", "type": "text_long", "label": "대응 노력", "placeholder": "해당 위험에 대응하기 위한 구체적인 활동 및 계획을 서술해주세요."}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-10	s2-m8	2	위에서 식별된 물리적 위험 취약 자산/사업활동의 금액과 그 산정 기준을 작성해주세요.	table_input	{"columns": [{"name": "vulnerable_asset", "type": "text", "label": "지역/자산명", "placeholder": "예: 청주 사업장"}, {"name": "monetary_value", "type": "number", "label": "금액 (단위: 억원)", "placeholder": "금액을 숫자로만 입력"}, {"name": "calculation_basis", "type": "text_long", "label": "산정 기준", "placeholder": "예: 해당 사업장의 장부가액 기준"}]}	예: 해당 지역은 극한기온 및 수자원 부족 리스크가 2030년대 이후 높아질 것으로 분석됨. 다만, 현재까지 직접적인 피해 이력은 없음.		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-11	s2-m9	1	기업이 어떤 사업활동을 '기후 관련 기회'로 분류하는지, 그 판단 기준이나 근거(예: EU Taxonomy)를 설명해주세요.	text_long	null	예: EU Taxonomy에 따라 적격/적합 경제활동으로 분류된 사업활동을 기회로 분류		2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-12	s2-m9	2	위에서 작성한 기준에 따라 식별된 각 기회 요인의 재무적 가치를 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "asset_activity", "type": "text", "label": "자산 및 사업활동", "placeholder": "예: 저탄소 제품 라인, 에너지 효율 개선 사업"}, {"name": "revenue", "type": "number", "label": "매출액 (단위: 억원)", "placeholder": "숫자만 입력"}, {"name": "capex", "type": "number", "label": "자본지출 (단위: 억원)", "placeholder": "숫자만 입력"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-13	s2-m11	1	기업의 내부 탄소 가격(Internal Carbon Price)은 얼마로 설정되어 있나요? (단위 포함)	text	null			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-14	s2-m11	2	내부 탄소 가격제의 운영 방식을 아래 고정된 양식에 맞춰 작성해주세요.	internal_carbon_price_input	{"rows": [{"key": "application_method", "label": "의사결정 적용여부 및 방법"}, {"key": "application_scope", "label": "구체적 적용 범위"}, {"key": "calculation_methodology", "label": "주요한 가정 및 계산 방법론"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-15	s2-m11	3	내부 탄소 가격제를 적용한 주요 사례와, 이를 통해 유도된 긍정적 효과(예: 투자회수기간 단축)에 대해 구체적으로 서술해주세요.	text_long	null			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-16	s2-m12	1	경영진 보상에 기후 관련 사항이 어떻게 고려되는지, 관련 정책이나 최근 변경사항을 아래에 항목별로 추가하여 설명해주세요	structured_list	{"fields": [{"name": "policy_target", "type": "text", "label": "적용 대상/목표", "placeholder": "예: C-level 경영진, CEO 단기 경영목표"}, {"name": "policy_description", "type": "text_long", "label": "주요 내용 (정책 또는 변경사항)", "placeholder": "예: ESG 지표 가중치를 5%에서 10%로 확대"}, {"name": "effective_date", "type": "text", "label": "적용/변경 시점 (선택 사항)", "placeholder": "예: 2024년 4월"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-17	s2-m12	2	당기 성과평가에 반영된 주요 기후 관련 KPI와, 해당 KPI가 경영진 보상에 연계된 백분율(%) 정보를 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "target_executive", "type": "text", "label": "대상", "placeholder": "예: CEO, 전체 경영진"}, {"name": "kpi_name", "type": "text", "label": "주요 KPI", "placeholder": "예: 온실가스 감축 목표 달성률"}, {"name": "compensation_percentage", "type": "number", "label": "연계 보상 백분율 (%)", "placeholder": "숫자만 입력 (예: 10)"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-18	s2-m14	1	목표의 기준이 되는 기준연도는 몇 년도인가요?	number	null			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-19	s2-m14	2	목표의 중간연도는 몇 년도인가요?	number	null			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-20	s2-m14	3	목표의 최종연도는 몇 년도인가요?	number	null			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-21	s2-m14	4	설정한 연도에 맞춰, 기업의 주요 기후 관련 목표를 아래 표에 작성해주세요.	table_input	{"columns": [{"name": "target_metric", "type": "text", "label": "목표지표"}, {"name": "scope", "type": "text", "label": "범위"}, {"name": "target_type", "type": "select", "label": "목표유형", "options": ["절대량 목표", "원단위 목표"]}], "dynamic_columns_from": [{"value_key": "baseline_value", "label_prefix": "기준연도 (", "label_suffix": ")", "source_req_id": "met-18"}, {"value_key": "interim_value", "label_prefix": "중간 목표 (", "label_suffix": ")", "source_req_id": "met-19"}, {"value_key": "final_value", "label_prefix": "최종 목표 (", "label_suffix": ")", "source_req_id": "met-20"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-22	s2-m16	1	기업의 기후 관련 목표 및 데이터에 대해 제3자 검증 또는 인증을 받은 사례가 있다면, 아래 형식에 맞춰 추가하여 작성해주세요.	structured_list	{"fields": [{"name": "verification_scope", "type": "text", "label": "검증 대상", "placeholder": "예: Scope 1, 2 온실가스 배출량 (2023년 데이터)"}, {"name": "verifier", "type": "text", "label": "검증 기관", "placeholder": "예: KPMG, 한국경영인증원(KMR)"}, {"name": "verification_standard", "type": "text", "label": "검증 기준/표준", "placeholder": "예: ISO 14064-3, ISAE 3000"}, {"name": "assurance_level", "type": "select", "label": "검증 수준", "options": ["제한된 수준의 검증 (Limited Assurance)", "합리적인 수준의 검증 (Reasonable Assurance)"]}, {"name": "verification_opinion", "type": "text_long", "label": "검증 의견 (결과 요약)", "placeholder": "검증 보고서에 명시된 최종 의견이나 주요 결과를 요약하여 작성해주세요."}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-23	s2-m17	1	기후 관련 목표를 검토하고 관리하기 위한 주요 내부 프로세스나 제도가 있다면, 그 내용을 아래에 항목별로 추가하여 설명해주세요.	structured_list	{"fields": [{"name": "process_name", "type": "text", "label": "프로세스/제도명 또는 주요 활동", "placeholder": "예: 전사 에너지 결산제 도입, 해외 사업장 확대"}, {"name": "process_details", "type": "text_long", "label": "상세 내용", "placeholder": "해당 프로세스의 목적, 운영 방식, 내용 등을 구체적으로 서술해주세요."}, {"name": "process_date", "type": "text", "label": "도입/시행 시점 (선택)", "placeholder": "예: 2022년부터"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-24	s2-m18	1	각 기후 관련 목표의 진척도를 모니터링하는 데 사용하는 지표를 아래 형식에 맞춰 작성해주세요.	table_input	{"columns": [{"name": "progress_metric", "type": "text", "label": "진척도 모니터링 지표", "placeholder": "목표 달성 여부를 추적하기 위해 사용하는 구체적인 지표를 서술해주세요."}, {"name": "interim_target_recap", "type": "text", "label": "중장기 목표", "placeholder": "달성하고자 하는 중장기 목표를 다시 한번 기재하거나 상세히 서술해주세요."}, {"name": "final_target_recap", "type": "text", "label": "최종목표", "placeholder": "달성하고자 하는 최종 목표를 다시 한번 기재하거나 상세히 서술해주세요."}], "source_requirement": "met-21", "source_field_to_display": "target_metric"}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-25	s2-m19	1	기존에 설정한 기후 관련 목표에 수정사항이 있었다면, 아래 형식에 맞춰 변경 내용을 작성해주세요.	table_input	{"columns": [{"name": "achievement_timeframe", "type": "text", "label": "달성 시점", "placeholder": "예: 2030년"}, {"name": "before_revision", "type": "text_long", "label": "수정 전", "placeholder": "수정 전 목표 내용을 기재"}, {"name": "after_revision", "type": "text_long", "label": "수정 후", "placeholder": "수정 후 목표 내용을 기재"}], "source_requirements": [{"display_label": "목표지표", "requirement_id": "met-21", "field_to_display": "target_metric"}, {"display_label": "진척도 모니터링 지표", "requirement_id": "met-24", "field_to_display": "progress_metric"}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-26	s2-m20	1	설정한 기후 관련 목표 대비 당기의 성과를 아래 형식에 맞춰 작성해주세요. (목표 및 지표는 이전에 작성한 내용이 자동으로 표시됩니다.)	performance_tracking_input	{"columns": [{"key": "target_metric", "type": "read_only", "label": "목표지표", "source_field": "target_metric", "source_req_id": "met-21"}, {"key": "progress_metric", "type": "read_only", "label": "진척도 모니터링 지표", "source_field": "progress_metric", "source_req_id": "met-24"}, {"key": "previous_year_performance", "type": "text", "label": "전년도 실적", "source": "user_input", "placeholder": "전년도 성과 입력"}, {"key": "current_year_performance", "type": "text", "label": "당년도 실적", "source": "user_input", "placeholder": "당년도 성과 입력"}, {"key": "interim_target", "type": "read_only", "label": "중간 목표", "source_field": "interim_value", "source_req_id": "met-21"}, {"key": "final_target", "type": "read_only", "label": "최종목표", "source_field": "final_value", "source_req_id": "met-21"}], "source_requirement": "met-21"}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-27	s2-m10	1	기후 관련 위험 및 기회에 대응하기 위해 투입된 자본 정보를 아래 표에 추가하여 작성해주세요.	table_input	{"columns": [{"name": "category", "type": "text", "label": "구분", "placeholder": "예: 온실가스 감축설비 투자, 신재생에너지 투자"}, {"name": "amount_krw_million", "type": "number", "label": "금액 (단위: 백만원)", "placeholder": "숫자만 입력"}, {"name": "details", "type": "text_long", "label": "세부사항", "placeholder": "관련된 세부 내용을 서술해주세요."}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
met-28	s2-m19	2	수정사항이 있었다면 그 사유에 대해서 설명해주세요.	text_long	null			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
gen-1	s2-gen	1	보고서의 발행 연도, 대상 기업, 보고 기간을 입력해 주세요.	structured_list	{"fields": [{"name": "company_name", "type": "text", "label": "기업명", "required": true, "placeholder": "기업명을 입력하세요"}, {"name": "report_year", "type": "number", "label": "보고서 발행년도", "required": true, "placeholder": "YYYY"}, {"name": "start_date", "type": "date", "label": "보고 시작일자", "required": true}, {"name": "end_date", "type": "date", "label": "보고 종료일자", "required": true}]}			2025-07-02 03:26:23.206138+00	2025-07-02 03:26:23.206138+00
\.


--
-- Data for Name: issb_s2_term; Type: TABLE DATA; Schema: public; Owner: hc_user
--

COPY public.issb_s2_term (term_id, term_ko, term_en, definition_ko, definition_en, created_at, updated_at) FROM stdin;
1	탄소 크레딧	carbon credit	탄소 크레딧 프로그램이 발행하는 배출권 단위로, 온실가스의 감축 또는 제거를 나타낸다. 탄소 크레딧은 전자 등록부를 통해 고유 일련번호 부여·발행·추적·소각(취소)된다.	An emissions unit that is issued by a carbon crediting\nprogramme and represents an emission reduction or removal of\ngreenhouse gases. Carbon credits are uniquely serialised,\nissued, tracked and cancelled by means of an electronic\nregistry.	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
2	기후 회복력	climate resilience	기후 관련 변화·전개·불확실성에 대해 조정(적응)할 수 있는 능력. 여기에는 기후 관련 위험을 관리하고 기후 관련 기회를 활용할 수 있는 역량, 즉 전환?위험·물리적?위험에 대응·적응할 수 있는 능력이 포함된다. 기업의 기후 회복력은 전략적 회복력과 운영상의 회복력 모두를 뜻한다.	The capacity of an entity to adjust to climate-related changes,\ndevelopments or uncertainties. Climate resilience involves the\ncapacity to manage climate-related risks and benefit from\nclimate-related opportunities, including the ability to respond\nand adapt to climate-related transition risks and climaterelated physical risks. An entity’s climate resilience includes\nboth its strategic resilience and its operational resilience to\nclimate-related changes, developments and uncertainties.	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
3	기후 관련 물리적 위험	climate-related\nphysical risks	기후변화로부터 발생하는 위험으로, 사건 기반(급성 물리적 위험)이나 장기적인 기후 패턴 변화(만성 물리적 위험)로 구분된다. 급성 물리적 위험은 폭풍·홍수·가뭄·폭염 같은 기상 사건의 빈도와 강도가 증가함으로써 발생한다. 만성 물리적 위험은 강수량·기온의 장기 변화로 일어나며, 해수면 상승·수자원 부족·생물다양성 감소·토양 생산성 변화 등을 초래할 수 있다. 이러한 위험은 자산의 직접적 피해비용이나 공급망 붕괴로 인한 간접효과 등 재무적 영향을 초래할 수 있다. 또한 수자원 가용성·조달·품질 변화, 극심한 온도 변동은 사업장, 운영, 공급망, 운송 수요, 종업원 안전·보건 등에 영향을 미쳐 기업 재무성과에 영향을 줄 수 있다.	Risks resulting from climate change that can be event-driven\n(acute physical risk) or from longer-term shifts in climatic\npatterns (chronic physical risk). Acute physical risks arise from\nweather-related events such as storms, floods, drought or\nheatwaves, which are increasing in severity and frequency.\nChronic physical risks arise from longer-term shifts in climatic\npatterns including changes in precipitation and temperature\nwhich could lead to sea level rise, reduced water availability,\nbiodiversity loss and changes in soil productivity.\nThese risks could carry financial implications for an entity,\nsuch as costs resulting from direct damage to assets or indirect\neffects of supply-chain disruption. The entity's financial\nperformance could also be affected by changes in water\navailability, sourcing and quality; and extreme temperature\nchanges affecting the entity's premises, operations, supply\nchains, transportation needs and employee health and safety.	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
4	기후 관련 위험과 기회	climate-related risks\nand opportunities	기후 관련 위험은 기후변화가 기업에 미칠 수 있는 부정적 영향을 말하며, 기후 관련 물리적 위험과 기후 관련 전환 위험으로 구분된다. 기후 관련 기회는 기후변화로 인해 기업이 얻을 수 있는 잠재적 긍정적 효과를 말한다. 기후변화 완화·적응 노력이 기업에 기후 관련 기회를 창출할 수 있다.	Climate-related risks refers to the potential negative effects of\nclimate change on an entity. These risks are categorised as\nclimate-related physical risks and climate-related transition\nrisks.\nClimate-related opportunities refers to the potential positive\neffects arising from climate change for an entity. Efforts to\nmitigate and adapt to climate change can produce climaterelated opportunities for an entity	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
5	기후 관련 전환 계획	climate-related\ntransition plan	저탄소 경제로의 전환을 위해 기업이 설정한 목표·활동·자원을 제시한, 기업의 전체 전략의 한 부분. 여기에는 온실가스 배출 저감과 같은 조치가 포함된다.	An aspect of an entity’s overall strategy that lays out the\nentity’s targets, actions or resources for its transition towards a\nlower-carbon economy, including actions such as reducing its\ngreenhouse gas emissions	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
6	기후 관련 전환 위험	climate-related\ntransition risks	저탄소 경제로 전환하는 과정에서 발생하는 위험. 정책·법률·기술·시장·평판 위험이 포함된다. 이러한 위험은 기후 관련 신규·개정 규제로 인해 영업비용 증가나 자산 손상 같은 재무적 영향을 초래할 수 있다. 또한 소비자 수요 변화나 신기술 개발·도입으로 기업의 재무성과가 영향받을 수 있다.	Risks that arise from efforts to transition to a lower-carbon\neconomy. Transition risks include policy, legal, technological,\nmarket and reputational risks. These risks could carry financial\nimplications for an entity, such as increased operating costs or\nasset impairment due to new or amended climate-related\nregulations. The entity's financial performance could also be\naffected by shifting consumer demands and the development\nand deployment of new technology.	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
7	CO₂ 환산 (CO₂e)	CO2 equivalent	각 온실가스의 지구온난화지수(GWP)를 고려해 이산화탄소 1단위와 동일한 지구온난화 효과를 나타내는 보편적 측정 단위. 서로 다른 온실가스 배출·감축을 공통 기준으로 평가하는 데 사용된다.	The universal unit of measurement to indicate the global\nwarming potential of each greenhouse gas, expressed in terms\nof the global warming potential of one unit of carbon dioxide.\nThis unit is used to evaluate releasing (or avoiding releasing)\ndifferent greenhouse gases against a common basis	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
8	금융 지원 배출량	financed emissions	기업이 투자·대출을 제공한 피투자처 또는 거래상대방의 총 온실가스 배출량 중 기업에 귀속되는 부분. 〈온실가스 프로토콜 기업가치사슬(범위 3) 회계·보고 표준(2011)〉에서 정의된 범위 3 범주 15(투자)에 해당한다.	The portion of gross greenhouse gas emissions of an investee or\ncounterparty attributed to the loans and investments made by\nan entity to the investee or counterparty. These emissions are\npart of Scope 3 Category 15 (investments) as defined in the\nGreenhouse Gas Protocol Corporate Value Chain (Scope 3)\nAccounting and Reporting Standard (2011)	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
9	지구온난화지수 (GWP)	global warming\npotential	특정 온실가스 1단위가 대기에 미치는 복사강제력(대기 위해 정도)을 이산화탄소 1단위와 비교해 나타낸 계수.	A factor describing the radiative forcing impact (degree of harm\nto the atmosphere) of one unit of a given greenhouse gas\nrelative to one unit of CO2.	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
10	온실가스	greenhouse gases	교토의정서에 명시된 7대 온실가스?이산화탄소(CO₂), 메탄(CH₄), 아산화질소(N₂O), 수소불화탄소(HFCs), 삼불화질소(NF₃), 과불화탄소(PFCs), 육불화황(SF?).	The seven greenhouse gases listed in the Kyoto Protocol?\ncarbon dioxide (CO2); methane (CH4); nitrous oxide (N2O);\nhydrofluorocarbons (HFCs); nitrogen trifluoride (NF3);\nperfluorocarbons (PFCs) and sulphur hexafluoride (SF6).	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
11	간접 온실가스 배출	indirect greenhouse\ngas emissions	기업 활동의 결과로 발생하지만, 배출원은 다른 기업이 소유·통제하는 곳에 위치한 배출.	Emissions that are a consequence of the activities of an entity,\nbut occur at sources owned or controlled by another entity.	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
12	내부 탄소 가격	internal carbon price	기업이 투자·생산·소비 패턴 변화, 기술 발전, 미래 배출 감축 비용의 재무적 영향을 평가할 때 사용하는 가격. 기업이 흔히 사용하는 두 가지 내부 탄소 가격: (a) 섀도 가격: 실제 부과하지 않는 이론적 비용 또는 명목 금액으로, 위험 영향·신규 투자·프로젝트 순현재가치·다양한 이니셔티브의 비용·편익 등 경제적 함의를 이해할 때 사용. (b) 내부 세금/수수료: 사업 활동·제품 라인·사업 부문에 그 배출량을 기준으로 부과하는 탄소 가격(회사 내부 이전가격과 유사).	Price used by an entity to assess the financial implications of\nchanges to investment, production and consumption patterns,\nand of potential technological progress and future emissionsabatement costs. An entity can use internal carbon prices for a\nrange of business applications. Two types of internal carbon\nprices that an entity commonly uses are:\n(a) a shadow price, which is a theoretical cost or notional\namount that the entity does not charge but that can be\nused to understand the economic implications or tradeoffs for such things as risk impacts, new investments,\nthe net present value of projects, and the cost and\nbenefit of various initiatives; and\n(b) an internal tax or fee, which is a carbon price charged to\na business activity, product line, or other business unit\nbased on its greenhouse gas emissions (these internal\ntaxes or fees are similar to intracompany transfer\npricing).	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
13	최신 국제 기후변화 협정	latest international\nagreement on climate\nchange	기후변화에 대응하기 위해 유엔기후변화협약(UNFCCC) 당사국들이 체결한 협정. 해당 협정은 온실가스 감축을 위한 규범과 목표를 설정한다.	An agreement by states, as members of the United Nations\nFramework Convention on Climate Change, to combat climate\nchange. The agreements set norms and targets for a reduction\nin greenhouse gases	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
14	Scope 1 온실가스 배출	Scope 1 greenhouse\ngas emissions	기업이 소유·통제하는 배출원에서 직접 발생하는 온실가스 배출.	Direct greenhouse gas emissions that occur from sources that\nare owned or controlled by an entity.	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
15	Scope 2 온실가스 배출	Scope 2 greenhouse\ngas emissions	기업이 소비하는 구매·취득 전기, 스팀, 난방, 냉방의 생산 과정에서 발생하는 간접 온실가스 배출. 구매·취득 전기는 기업 경계 내로 유입된 전기를 의미하며, 범위 2 배출은 전기가 생산되는 시설에서 물리적으로 발생한다.	Indirect greenhouse gas emissions from the generation of\npurchased or acquired electricity, steam, heating or cooling\nconsumed by an entity.\nPurchased and acquired electricity is electricity that is\npurchased or otherwise brought into an entity’s boundary.\nScope 2 greenhouse gas emissions physically occur at the\nfacility where electricity is generated.	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
16	Scope 3 온실가스 배출	Scope 3 greenhouse\ngas emissions	기업의 가치사슬에서 발생하지만 범위 2에 포함되지 않는 간접 온실가스 배출(상류·하류 모두 포함). 〈온실가스 프로토콜 기업가치사슬(범위 3) 회계·보고 표준(2011)〉의 범위 3 모든 범주를 포함한다.	Indirect greenhouse gas emissions (not included in Scope 2\ngreenhouse gas emissions) that occur in the value chain of an\nentity, including both upstream and downstream emissions.\nScope 3 greenhouse gas emissions include the Scope 3\ncategories in the Greenhouse Gas Protocol Corporate Value\nChain (Scope 3) Accounting and Reporting Standard (2011).	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
17	Scope 3 범주	Scope 3 categories	〈온실가스 프로토콜 기업가치사슬(범위 3) 회계·보고 표준(2011)〉에서 정의된 15개 범주: (1) 구매한 재화·서비스(2) 자본재(3) 연료·에너지 관련 활동(범위 1·2 제외)(4) 상류 운송·유통(5) 운영 중 발생 폐기물(6) 출장(7) 직원 통근(8) 상류 임대 자산(9) 하류 운송·유통(10) 판매 제품 가공(11) 판매 제품 사용(12) 판매 제품 폐기 단계 처리(13) 하류 임대 자산(14) 프랜차이즈(15) 투자.	Scope 3 greenhouse gas emissions are categorised into these\n15 categories?as described in the Greenhouse Gas Protocol\nCorporate Value Chain (Scope 3) Accounting and Reporting\nStandard (2011):\n(1) purchased goods and services;\n(2) capital goods;\n(3) fuel- and energy-related activities not included in Scope\n1 greenhouse gas emissions or Scope 2 greenhouse gas\nemissions;\n(4) upstream transportation and distribution;\n(5) waste generated in operations;\n(6) business travel;\n(7) employee commuting;\n(8) upstream leased assets;\n(9) downstream transportation and distribution;\n(10) processing of sold products;\n(11) use of sold products;\n(12) end-of-life treatment of sold products;\n(13) downstream leased assets;\n(14) franchises; and\n(15) investments.	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
18	사업 모델	business model	기업이 투입물을 활동을 통해 산출물·성과로 전환하여 전략적 목적을 달성하고, 단·중·장기적으로 현금흐름을 창출하도록 설계된 시스템.	An entity’s system of transforming inputs through its activities\ninto outputs and outcomes that aims to fulfil the entity’s\nstrategic purposes and create value for the entity and hence\ngenerate cash flows over the short, medium and long term.	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
19	공시 주제	disclosure topic	IFRS 지속가능성 공시기준 또는 SASB 기준에 명시된 산업별 활동에 근거한 특정 지속가능성 관련 위험 또는 기회.	A specific sustainability-related risk or opportunity based on\nthe activities conducted by entities within a particular industry\nas set out in an IFRS Sustainability Disclosure Standard or a\nSASB Standard.	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
20	일반목적 재무보고서	general purpose\nfinancial reports	자원 제공과 관련한 의사결정을 내리는 주요 이용자에게 유용한 재무정보를 제공하는 보고서. 주요 이용자의 의사결정은 (a) 주식·채권 매수·매도·보유, (b) 대출·신용 제공·처분, (c) 경영진 행동에 대한 의결권 행사 또는 영향력 행사 등을 포함한다. 일반목적 재무보고서에는 기업의 일반목적 재무제표와 지속가능성 관련 재무 공시가 포함(이에 한정되지 않음)된다.	Reports that provide financial information about a reporting\nentity that is useful to primary users in making decisions\nrelating to providing resources to the entity. Those decisions\ninvolve decisions about:\n(a) buying, selling or holding equity and debt instruments;\n(b) providing or selling loans and other forms of credit; or\n(c) exercising rights to vote on, or otherwise influence, the\nentity’s management’s actions that affect the use of the\nentity’s economic resources.\nGeneral purpose financial reports include?but are not\nrestricted to?an entity’s general purpose financial statements\nand sustainability-related financial disclosures.	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
21	불가능	impracticable	기업이 모든 합리적 노력을 다해도 해당 요구사항을 적용할 수 없는 경우.	Applying a requirement is impracticable when an entity cannot\napply it after making every reasonable effort to do so	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
22	일반목적 재무보고서 주요 이용자	primary users of\ngeneral purpose\nfinancial reports\n(primary users)	기존 및 잠재적 투자자·대출자·기타 채권자.	Existing and potential investors, lenders and other creditors.	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
23	가치사슬	value chain	기업의 비즈니스 모델과 그 운영 환경과 관련된 상호작용·자원·관계의 전체 범위. 가치사슬은 개념에서 최종 소비·폐기 단계까지, 그리고 기업 운영(인적 자원 등), 공급·마케팅·유통 채널(재료·서비스 조달, 제품·서비스 판매·전달), 금융·지리·지정학·규제 환경 등 기업이 의존·활용하는 상호작용·자원·관계를 포괄한다.	The full range of interactions, resources and relationships\nrelated to a reporting entity’s business model and the external\nenvironment in which it operates.\nA value chain encompasses the interactions, resources and\nrelationships an entity uses and depends on to create its\nproducts or services from conception to delivery, consumption\nand end-of-life, including interactions, resources and relationships in the entity’s operations, such as human\nresources; those along its supply, marketing and distribution\nchannels, such as materials and service sourcing, and product\nand service sale and delivery; and the financing, geographical,\ngeopolitical and regulatory environments in which the entity\noperates.	2025-07-02 03:26:23.270983+00	2025-07-02 03:26:23.270983+00
\.


--
-- Data for Name: member; Type: TABLE DATA; Schema: public; Owner: hc_user
--

COPY public.member (user_id, google_id, email, username, created_at, updated_at, last_login_at) FROM stdin;
8b1375e0-c770-4c5e-adf0-bf18067e4999	108579693569567630430	junyeongc1000@gmail.com	천준영	2025-07-02 03:35:54.370434+00	2025-07-02 03:38:48.78994+00	2025-07-02 03:38:48.792722+00
\.


--
-- Data for Name: report_template; Type: TABLE DATA; Schema: public; Owner: hc_user
--

COPY public.report_template (report_content_id, section_kr, content_order, depth, content_type, content_template, source_requirement_ids, slm_prompt_template, created_at, updated_at) FROM stdin;
cover-h1	표지	1	1	HEADING_1	SUSTAINABILITY DISCLOSURE	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gen-h1	일반 현황	3	1	HEADING_2	일반 현황	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gen-h2	일반 현황	4	1	HEADING_3	1. 보고서의 개요	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gen-h3	일반 현황	6	1	HEADING_3	2. 보고기업 및 범위	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gen-h4	일반 현황	8	1	HEADING_3	3. 보고 기준	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gen-h5	일반 현황	10	1	HEADING_3	4. 보고 기간	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gen-h6	일반 현황	12	1	HEADING_3	5. 표시 통화	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h1	목차	14	1	HEADING_2	목차	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h2	목차	15	1	HEADING_2	지배구조	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h3	목차	16	1	HEADING_3	1. 의사결정기구	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h4	목차	17	2	HEADING_4	(1) 의사결정기구 및 책임에 관한 정책	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h5	목차	18	2	HEADING_4	(2) 관리감독을 위한 역량 판단 및 개발	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h6	목차	19	2	HEADING_4	(3) 위험 및 기회 관련 정보 획득 방법 및 빈도	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h7	목차	20	2	HEADING_4	(4) 주요 의사결정 과정에서 기후 관련 위험 및 기회를 고려하는 방식	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h8	목차	21	2	HEADING_4	(5) 목표 설정 및 진척도에 대한 관리 감독	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h9	목차	22	1	HEADING_3	2. 경영진	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h10	목차	23	2	HEADING_4	(1) 기후관련 관리감독 역할 위임	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h11	목차	24	2	HEADING_4	(2) 경영진의 통제 및 절차 사용	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h12	목차	25	1	HEADING_2	전략	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h13	목차	26	1	HEADING_3	1. 기후관련 위험 및 기회	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h14	목차	27	2	HEADING_4	(1) 위험 및 기회 영향 유형	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h15	목차	28	2	HEADING_4	(2) 식별된 위험 및 기회의 영향 기간 범위	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h16	목차	29	1	HEADING_3	2. 사업모형과 가치사슬	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h17	목차	30	2	HEADING_4	(1) 사업모형과 가치사슬에 미치는 현재 및 예상 영향	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h18	목차	31	2	HEADING_4	(2) 위험과 기회가 집중된 영역	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h19	목차	32	1	HEADING_3	3. 전략 및 의사결정	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h20	목차	33	2	HEADING_4	(1) 위험 및 기회 대응 및 계획	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h21	목차	34	2	HEADING_4	(2) 자원조달 계획	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h22	목차	35	2	HEADING_4	(3) 과거 보고기간에 공시된 계획의 진척도에 대한 양적 및 질적 정보	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h23	목차	36	1	HEADING_3	4. 기후회복력	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h24	목차	37	2	HEADING_4	(1) 기후 관련 시나리오 분석 방법론	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h25	목차	38	2	HEADING_4	(2) 시나리오 분석 결과	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h26	목차	39	1	HEADING_2	위험관리	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h27	목차	40	1	HEADING_3	1. 기후 관련 위험 및 기회 관리 프로세스	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h28	목차	41	2	HEADING_4	(1) 투입변수 및 매개변수	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h29	목차	42	2	HEADING_4	(2) 기후 관련 위험 및 기회 식별	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h30	목차	43	2	HEADING_4	(3) 기후 관련 위험 및 기회 평가	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h31	목차	44	2	HEADING_4	(4) 다른 지속가능성 위험과 비교 시 기후 관련 위험 및 기회의 우선순위 정도	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h32	목차	45	2	HEADING_4	(5) 기후 관련 위험 및 기회 모니터링	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h33	목차	46	2	HEADING_4	(6) 위험관리 프로세스 변경사항	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h34	목차	47	1	HEADING_2	지표 및 목표	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h35	목차	48	1	HEADING_3	1. 기후 관련 지표	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h36	목차	49	2	HEADING_4	(1) 온실가스	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h37	목차	50	2	HEADING_4	(2) 기후 관련 전환 위험에 취약한 자산 또는 사업활동	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h38	목차	51	2	HEADING_4	(3) 기후 관련 물리적 위험에 취약한 자산 또는 사업활동	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h39	목차	52	2	HEADING_4	(4) 기후 관련 기회에 부합하는 자산 또는 사업활동	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h40	목차	53	2	HEADING_4	(5) 자본 배치	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h41	목차	54	2	HEADING_4	(6) 내부 탄소 가격	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h42	목차	55	2	HEADING_4	(7) 보상	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h43	목차	56	1	HEADING_3	2. 기후 관련 목표	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gen-p4	일반 현황	11	1	STATIC_PARAGRAPH	본 보고서의 보고 기간은 ‘{{start_date}}’부터 ‘{{end_date}}’까지입니다.	["gen-1"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gen-p5	일반 현황	13	1	STATIC_PARAGRAPH	본 보고서의 표시통화는 대한민국 원화로 표시되어 있습니다.	\N	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h44	목차	57	2	HEADING_4	(1) 목표 설정에 사용된 지표 관련 정보	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h45	목차	58	2	HEADING_4	(2) 목표에 대한 진척도 모니터링 방법	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
toc-h46	목차	59	2	HEADING_4	(3) 목표 대비 성과 분석	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-h1	지배구조	60	1	HEADING_2	지배구조	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-h2	지배구조	61	1	HEADING_3	1. 의사결정기구	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-h3	지배구조	62	1	HEADING_4	(1) 의사결정기구 및 책임에 관한 정책	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-p1	지배구조	63	1	PARAGRAPH	\N	["gov-1"]	# 작업 목표\r\n의사결정기구의 공식 명칭을 사용하여, 보고서의 '지배구조' 챕터 도입부에 해당 기구를 소개하는 간결하고 명확한 문장을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [gov-1] (조직 명칭): {{answer_gov-1}}\r\n\r\n# 생성 가이드\r\n- [gov-1]의 답변을 사용하여, 기업의 기후 관련 최종 의사결정 주체를 명시하는 문장을 만들어주세요.\r\n- 문장은 객관적인 사실을 전달하는 공식적인 톤을 유지해야 합니다.\r\n\r\n# 최종 결과물 스타일 예시\r\n"기업의 기후 관련 위험 및 기회에 대한 최종 의사결정은 '{{answer_gov-1}}'(을)를 통해 이루어집니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-t1	지배구조	64	1	TABLE	의사결정기구 인력 현황	["gov-2"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-p2	지배구조	65	1	PARAGRAPH	\N	["gov-1", "gov-3"]	# 작업 목표\r\n사용자가 입력한 의사결정기구의 공식 명칭과 상세 책임 범위를 조합하여, 해당 조직의 핵심 권한을 설명하는 공식적인 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [gov-1] (조직 명칭): {{answer_gov-1}}\r\n- [gov-3] (주요 책임 및 권한 범위): {{answer_gov-3}}\r\n\r\n# 생성 가이드\r\n1. [gov-1]의 답변을 문장의 주어로 사용하세요. (예: "ESG 위원회에서는...")\r\n2. [gov-3]의 답변 내용을 바탕으로, 이 조직이 수행하는 구체적인 역할을 서술해주세요.\r\n3. 문장의 어미는 "...사항을 심의 및 결의할 수 있습니다." 그리고 "...관리감독할 책임이 있습니다." 와 같이 공식적인 표현을 사용하여 자연스럽게 마무리해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"{{answer_gov-1}}에서는 {{answer_gov-3}}에 대한 사항을 심의 및 결의할 수 있습니다. 또한 관련 위험 및 기회에 대한 이행 성과를 관리감독할 책임이 있습니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-p3	지배구조	66	1	PARAGRAPH	\N	["gov-4"]	# 작업 목표\r\n사용자가 입력한 여러 개의 '주요 의사결정 이력'을 시간 순서대로 자연스럽게 연결하여, 공식 보고서에 적합한 하나의 요약 문장을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [gov-4] (주요 의사결정 이력 목록 / JSON 배열): {{answer_gov-4_json}}\r\n\r\n# 생성 가이드\r\n1.  [gov-4] 답변으로 제공된 JSON 배열 데이터를 시간 순서대로 자연스럽게 연결해주세요.\r\n2.  각 이력을 연결할 때, '{decision_date}에는 {decision_body}에서 {decision_details}하였고,' 와 같이 문맥에 맞는 조사와 연결어미를 사용해주세요.\r\n3.  마지막 이력의 서술어는 '{decision_details}하였습니다.' 와 같이 문장을 자연스럽게 종결해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"{첫 번째 이력의 date}에는 {첫 번째 이력의 body}에서 {첫 번째 이력의 details}하였고, {두 번째 이력의 date}에는 {두 번째 이력의 body}에서 {두 번째 이력의 details}하였습니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-h4	지배구조	67	1	HEADING_4	(2) 관리감독을 위한 역량 판단 및 개발	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-p4	지배구조	68	1	PARAGRAPH	\N	["gov-5", "gov-6"]	# 작업 목표\r\n기후 관련 역량 판단 '기준'과 그 실행 '절차'를 논리적으로 연결하여 설명하는 공식 보고서용 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [gov-5] (역량 판단 기준): {{answer_gov-5}}\r\n- [gov-6] (역량 판단 절차/도구): {{answer_gov-6}}\r\n\r\n# 생성 가이드\r\n1. 첫 문장은 [gov-5]의 답변을 사용하여, '...를 기준으로 ... 역량을 보유하고 있는지 여부를 판단하고 있습니다.' 와 같은 형태로 구성해주세요.\r\n2. 두 번째 문장은 [gov-6]의 답변을 사용하여, '해당 기준 충족 여부 판단 절차로 ...' 와 같이 시작하여 첫 문장의 내용을 뒷받침하도록 자연스럽게 연결해주세요.\r\n3. 전체적으로 전문성과 신뢰성이 느껴지는 톤앤매너를 유지해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"저희는 {{answer_gov-5}}를 기준으로 기후 관련 위험 및 기회에 대응하기 위한 전략을 감독할 수 있는 적절한 역량을 보유하고 있는지 여부를 판단하고 있습니다. 해당 기준 충족 여부 판단 절차로 {{answer_gov-6}}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-p5	지배구조	69	1	PARAGRAPH	\N	["gov-7"]	# 작업 목표\r\n사용자가 입력한 여러 '주요 인물 역량' 사례를 바탕으로, 각 인물의 전문성을 상세히 설명하는 공식 보고서용 서술형 문단을 생성합니다. 각 인물은 별도의 문단으로 구분해야 합니다.\r\n\r\n# 제공되는 데이터\r\n- [gov-7] (주요 인물 역량 목록 / JSON 배열): {{answer_gov-7_json}}\r\n\r\n# 생성 가이드\r\n1.  [gov-7] 답변으로 제공된 JSON 배열의 각 객체(인물)에 대해 하나의 문단을 할당해주세요.\r\n2.  각 문단은 '{member_name} {member_title}는(은)' 과 같이 이름과 직책으로 시작해주세요.\r\n3.  {competency_details}에 서술된 경력과 활동 내역을 자연스럽게 연결하여 그 인물의 전문성을 부각시켜주세요.\r\n4.  전체적인 톤은 객관적인 사실을 전달하는 전문적인 보고서 스타일을 유지해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"{첫 번째 인물의 name} {첫 번째 인물의 title}의 경우, {첫 번째 인물의 details}.\r\n\r\n{두 번째 인물의 name} {두 번째 인물의 title}는 {두 번째 인물의 details}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-p6	지배구조	70	1	PARAGRAPH	\N	["gov-8", "gov-9"]	# 작업 목표\r\n기업 차원의 역량 강화 방안(일반론)과 구성원 개인의 실천 사례(각론)를 논리적으로 연결하여, 체계적인 노력을 보여주는 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [gov-8] (기업 차원의 역량 강화 방안): {{answer_gov-8}}\r\n- [gov-9] (구성원 개인의 역량 강화 사례 목록 / JSON 배열): {{answer_gov-9_json}}\r\n\r\n# 생성 가이드\r\n1.  먼저, [gov-8]의 답변을 사용하여 '저희 기업은 이사의 역량 향상을 위해 ...를 실시하고 있으며, ... 통해 역량 강화를 판단하고 있습니다.' 와 같이 기업 전체의 일반적인 노력을 설명하는 문장을 생성해주세요.\r\n2.  그 다음, [gov-9] 배열에 데이터가 있는 경우, 목록의 **첫 번째 사례**를 사용하여 뒷 문장을 자연스럽게 이어주세요.\r\n3.  '기업의 제도적 노력이 개인의 구체적인 실천으로 이어진다'는 논리적 흐름으로 구성해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"저희 기업은 {{answer_gov-8}}. {{gov-9의 첫 번째 사례 member_name_and_title}}의 경우 {{gov-9의 첫 번째 사례 activity_details}}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-h5	지배구조	71	1	HEADING_4	(3) 위험 및 기회 관련 정보 획득 방법 및 빈도	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-p7	지배구조	72	1	PARAGRAPH	\N	["gov-1", "gov-10", "gov-11", "gov-12"]	# 작업 목표\r\n의사결정기구의 정보 수신 체계에 대한 포괄적이고 전문적인 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [gov-1] (조직 명칭): {{answer_gov-1}}\r\n- [gov-10] (주요 정보 제공 부서): {{answer_gov-10}}\r\n- [gov-11] (의사결정 지원 절차): {{answer_gov-11}}\r\n- [gov-12] (외부 자문 활용 방안): {{answer_gov-12}}\r\n\r\n# 생성 가이드\r\n1.  [gov-1]의 답변을 문단의 주어로 사용하세요.\r\n2.  [gov-10]의 답변을 활용하여, 정보의 주요 출처를 설명하는 첫 번째 문장을 만드세요.\r\n3.  [gov-11]의 답변을 활용하여, 회의 시 지원 절차를 설명하며 두 번째 문장을 구성하세요.\r\n4.  [gov-12]의 답변을 활용하여, 외부 자문 가능성을 언급하며 문단을 마무리하세요.\r\n5.  전체 문단이 논리적으로 자연스럽게 연결되도록 적절한 접속사와 어미를 사용하세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"저희 {{answer_gov-1}}는(은) 기후 관련 정보를 주로 {{answer_gov-10}}로부터 제공받고 있습니다. 또한 위원회 개최 시, {{answer_gov-11}}. 저희 위원회는 필요한 경우에 {{answer_gov-12}}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-p8	지배구조	73	1	PARAGRAPH	\N	["gov-1", "gov-13", "gov-14", "gov-15"]	# 작업 목표\r\n의사결정기구의 안건 보고, 결의 후 통지, 그리고 개최 빈도에 대한 절차를 설명하는 공식적인 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [gov-1] (조직 명칭): {{answer_gov-1}}\r\n- [gov-13] (보고 절차): {{answer_gov-13}}\r\n- [gov-14] (결의 후 통지 절차): {{answer_gov-14}}\r\n- [gov-15] (위원회 개최 빈도): {{answer_gov-15}}\r\n\r\n# 생성 가이드\r\n1. [gov-13]과 [gov-14]의 답변을 조합하여 정보의 보고 및 통지 절차를 설명하는 첫 번째 문장을 구성하세요.\r\n2. 두 번째 문장은 [gov-1]의 답변을 주어로 사용하여, [gov-15]의 답변 내용으로 개최 빈도를 설명하며 문단을 마무리하세요.\r\n3. 전체적으로 절차를 명확하고 간결하게 설명하는 톤앤매너를 유지하세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"기후 관련 위험 및 기회에 대한 안건을 {{answer_gov-13}}하며, 위원회에서 결의된 사항은 {{answer_gov-14}}하고 있습니다. 저희 {{answer_gov-1}}는 {{answer_gov-15}} 개최되고 있습니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-t2	지배구조	74	1	TABLE	주요 정보 획득 현황	["gov-16"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-h6	지배구조	75	1	HEADING_4	(4) 주요 의사결정 과정에서 기후 관련 위험 및 기회를 고려하는 방식	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-p9	지배구조	76	1	PARAGRAPH	\N	["gov-1", "gov-17", "gov-18"]	# 작업 목표\r\n일상적인 모니터링과 중대한 의사결정 과정을 구분하여, 기업의 체계적인 의사결정 방식을 설명하는 공식적인 서술형 문장을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [gov-1] (조직 명칭): {{answer_gov-1}}\r\n- [gov-17] (정기 모니터링 방식): {{answer_gov-17}}\r\n- [gov-18] (중대 의사결정 안건): {{answer_gov-18}}\r\n\r\n# 생성 가이드\r\n1. [gov-17]과 [gov-18]의 답변을 논리적으로 연결하여 하나의 문장으로 구성하세요.\r\n2. 문장의 전반부는 [gov-17]의 내용을 사용하여 '기후 관련 위험 및 기회 모니터링은 ... 이루어지고 있으며,' 와 같이 구성하세요.\r\n3. 문장의 후반부는 [gov-18]의 내용을 사용하여 ', ... 수반하는 사항은 이사회에서 심의·결의하고 있습니다.' 와 같이 전반부와 자연스럽게 연결하세요.\r\n4. 전체적으로 기업의 의사결정 프로세스가 체계적임을 보여주는 톤앤매너를 유지하세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"기후 관련 위험 및 기회 모니터링은 {{answer_gov-17}} 이루어지고 있으며, {{answer_gov-18}}은(는) 이사회에서 심의·결의하고 있습니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-t3	지배구조	77	1	TABLE	주요 의사결정 안건	["gov-19"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-h7	지배구조	78	1	HEADING_4	(5) 목표 설정 및 진척도에 대한 관리 감독	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-p10	지배구조	79	1	PARAGRAPH	\N	["gov-20", "gov-21"]	# 작업 목표\r\n기업의 기후 관련 목표 설정 및 진척도 감독 프로세스를 설명하는 공식적인 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [gov-20] (감독 주체 및 역할): {{answer_gov-20}}\r\n- [gov-21] (진척도 관리 방식): {{answer_gov-21}}\r\n\r\n# 생성 가이드\r\n1. [gov-20]의 답변 내용을 사용하여, 목표 관리의 주체와 전반적인 역할을 설명하는 첫 번째 문장을 구성하세요. (예: "...를 통해 ... 목표 설정 및 이행경과를 관리, 감독하고 있습니다.")\r\n2. [gov-21]의 답변 내용을 사용하여, 구체적인 관리 방식을 설명하는 두 번째 문장을 생성하며 자연스럽게 연결하세요. (예: "수립된 목표에 대한 ...으로 이행경과와 성과를 관리하고 있습니다.")\r\n3. 전체적으로 기업의 목표 관리 체계가 잘 잡혀있음을 보여주는 신뢰감 있는 톤앤매너를 유지하세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"저희는 {{answer_gov-20}}하고 있습니다. 또한, 수립된 목표에 대해 {{answer_gov-21}}으로 이행경과와 성과를 관리하고 있습니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-t4	지배구조	80	1	TABLE	목표 감독 활동	["gov-22"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-p11	지배구조	81	1	PARAGRAPH	\N	["gov-23"]	# 작업 목표\r\n사용자가 서술한 '성과 연계 보상 정책' 내용을 바탕으로, 공식 보고서에 적합한 하나의 잘 정제된 문장을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [gov-23] (성과 연계 보상 정책 설명): {{answer_gov-23}}\r\n\r\n# 생성 가이드\r\n1. 사용자의 답변([gov-23]) 내용에서 '정책의 목적', '근거 규정', '연계 내용' 등 핵심 요소를 파악해주세요.\r\n2. "기후변화 대응에 대한 최고경영진의 책임을 명확히 하기 위해"와 같이 정책의 목적을 먼저 제시하며 문장을 시작하세요.\r\n3. 그 다음, "‘{답변 내용 속 근거 규정}’에 근거하여 {답변 내용 속 연계 내용}." 과 같이 자연스러운 흐름으로 문장을 완성하세요.\r\n4. 전체적으로 정책의 타당성과 실행력을 강조하는 전문적인 톤앤매너를 유지하세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"기후변화 대응에 대한 최고경영진의 책임을 명확히 하기 위해 {{answer_gov-23}}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-p12	지배구조	82	1	PARAGRAPH	\N	["gov-24"]	# 작업 목표\r\n사용자가 서술한 '보상 연계 종합평가'의 상세 내용을 바탕으로, 평가 체계의 구체성과 전문성을 보여주는 공식 보고서용 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [gov-24] (상세 평가 항목 설명): {{answer_gov-24}}\r\n\r\n# 생성 가이드\r\n1. [gov-24]의 답변 내용을 '종합적인 평가 결과에 기반해 결정됩니다'라는 문장으로 시작하여 자연스럽게 풀어내 주세요.\r\n2. 답변 내용에 포함된 '계량지표'와 '비계량지표'를 명확히 구분하여 설명해주세요.\r\n3. '특히', '또한'과 같은 접속사를 활용하여 문단 내 정보들을 논리적으로 연결해주세요.\r\n4. 전체적으로 기업의 보상 체계가 매우 구체적이고 체계적이며, 기후변화 대응 노력을 실질적으로 반영하고 있음을 강조하는 톤앤매너를 유지하세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"사내이사의 보수는 {{answer_gov-24}}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-h8	지배구조	83	1	HEADING_3	2. 경영진	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-h9	지배구조	84	1	HEADING_4	(1) 기후관련 관리감독 역할 위임	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-p13	지배구조	85	1	PARAGRAPH	\N	["gov-1", "gov-25"]	# 작업 목표\r\n두 개의 개별 답변(위임주체, 위임대상)을 조합하여, 책임 위임 관계를 설명하는 명료하고 공식적인 문장을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [gov-1] (위임 주체): {{answer_gov-1}}\r\n- [gov-25] (위임 대상): {{answer_gov-25}}\r\n\r\n# 생성 가이드\r\n1. [gov-1]의 답변을 문장의 주어로 사용하고, [gov-25]의 답변을 목적어로 사용하여 문장을 구성해주세요.\r\n2. "기후 관련 위험 및 기회를 관리·감독하는 책임을 ...에게 위임하였습니다." 라는 구조에 맞춰 자연스럽게 조합해주세요.\r\n3. 문장이 간결하고 명확하게 사실을 전달하는 데 집중하도록 해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"{{answer_gov-1}}는(은) 기후 관련 위험 및 기회를 관리·감독하는 책임을 {{answer_gov-25}}에게 위임하였습니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-p14	지배구조	86	1	PARAGRAPH	\N	["gov-26"]	# 작업 목표\r\n사용자가 입력한 '경영진 직책별 역할' 목록을 바탕으로, 경영진의 기후 관련 업무 분장 및 책임 소재를 명확히 설명하는 공식 보고서용 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [gov-26] (경영진 역할 목록 / JSON 배열): {{answer_gov-26_json}}\r\n\r\n# 생성 가이드\r\n1. [gov-26]에 담긴 JSON 배열의 각 객체(직책별 역할)에 대해 하나의 문장을 생성해주세요.\r\n2. 각 문장은 '{management_position}는(은) {responsibilities} 역할을 수행합니다.' 와 같은 구조를 따르도록 해주세요.\r\n3. 여러 개의 역할이 입력된 경우, 각 문장을 자연스럽게 연결하여 하나의 문단으로 만들어주세요.\r\n4. 전체적으로 기업의 경영진이 체계적으로 역할을 분담하여 기후 이슈에 대응하고 있음을 보여주는 전문적인 톤을 유지해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"{첫 번째 역할의 management_position}는 {첫 번째 역할의 responsibilities}. {두 번째 역할의 management_position}은 {두 번째 역할의 responsibilities}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-h10	지배구조	87	1	HEADING_4	(2) 경영진의 통제 및 절차 사용	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gov-p15	지배구조	88	1	PARAGRAPH	\N	["gov-27", "gov-28"]	# 작업 목표\r\n기업의 기후 관련 내부 감사 및 통제 프로세스를 시작부터 끝까지 체계적으로 설명하는 공식 보고서용 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [gov-27] (내부 감사 및 후속 조치 절차): {{answer_gov-27}}\r\n- [gov-28] (감사 주제 선정 방식): {{answer_gov-28}}\r\n\r\n# 생성 가이드\r\n1. [gov-27]의 답변 내용을 사용하여, 내부 감사가 어떻게 수행되고 결과가 보고되며 후속 조치가 이루어지는지에 대한 프로세스의 주된 흐름을 먼저 서술해주세요.\r\n2. 그 다음, [gov-28]의 답변 내용을 사용하여 '내부감사 주제 선정은 ... 통해 이뤄지고 있습니다.' 와 같이 감사 계획 단계를 설명하며 문단을 마무리해주세요.\r\n3. 전체적으로 기업의 내부 통제 시스템이 독립적이고 체계적으로 운영되고 있음을 보여주는 전문적인 톤앤매너를 유지해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"{{answer_gov-27}}. 내부감사 주제 선정은 {{answer_gov-28}}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h1	전략	89	1	HEADING_2	전략	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h2	전략	90	1	HEADING_3	1. 기후관련 위험 및 기회	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h3	전략	91	1	HEADING_4	(1) 위험 및 기회 영향 유형	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p1	전략	92	1	PARAGRAPH	\N	["str-1", "str-2", "str-3"]	# 작업 목표\r\n사용자가 기회 및 위험 식별에 활용한 정보 출처를 설명하는 문단을 생성합니다. 단, 출처의 종류에 따라 문장의 상세 수준을 동적으로 조절해야 합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-1] (주요 정보 출처): {{answer_str-1}}\r\n- [str-2] (사업모형 참조 주제): {{answer_str-2}}\r\n- [str-3] (가치사슬 참조 주제): {{answer_str-3}}\r\n\r\n# 생성 가이드\r\n1.  **기본 문장 생성:** 먼저, [str-1]의 답변을 사용하여 '저희 기업은... 기회 식별 단계에서 {{answer_str-1}}을(를) 주요 정보 출처로 활용하였습니다.' 와 같이 기본 문장을 생성해주세요.\r\n2.  **조건부 상세화:** 그 다음, [str-1]의 답변 내용에 'SASB' 또는 'TCFD'와 같이 세부 주제를 가질 수 있는 특정 프레임워크 이름이 포함된 경우에만, [str-2]와 [str-3]의 답변을 사용하여 세부 설명을 덧붙여주세요.\r\n3.  **예외 처리:** 만약 [str-1]의 답변이 'IPCC 보고서' 또는 '내부 리서치'처럼 세부 주제가 없는 정보 소스라면, [str-2]와 [str-3]의 내용은 답변이 있더라도 무시하고 1단계에서 생성한 기본 문장만으로 문단을 최종 완성해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n## 예시 1 (IF str-1 답변이 "SASB 공시기준"인 경우):\r\n"저희 기업은 기후 관련 위험 및 기회 식별 단계에서 SASB 공시기준을 주요 정보 출처로 활용하였습니다. 사업모형에서는 {{answer_str-2}}을(를) 참조하였으며, 가치사슬에서는 {{answer_str-3}} 등의 공시주제를 참조하였습니다."\r\n\r\n## 예시 2 (IF str-1 답변이 "IPCC 6차 평가보고서"인 경우):\r\n"저희 기업은 기후 관련 위험 및 기회 식별 단계에서 IPCC 6차 평가보고서를 주요 정보 출처로 활용하였습니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p2	전략	93	1	PARAGRAPH	\N	["str-4"]	# 작업 목표\r\n사용자가 입력한 '주요 리스크/기회 목록'을 분석하여, 리스크와 기회의 총개수를 요약하는 문장을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-4] (주요 리스크/기회 목록 / JSON 배열): {{answer_str-4_json}}\r\n\r\n# 생성 가이드\r\n1.  [str-4]로 제공된 JSON 배열에서, `category`가 '전환 리스크' 또는 '물리적 리스크'인 항목의 개수를 세어 주세요.\r\n2.  `category`가 '기회'인 항목의 개수를 세어 주세요.\r\n3.  계산된 개수를 사용하여, "저희 기업은 중대성 평가 결과, 보고서에 상세히 기술할 주요 기후 관련 리스크 {계산된 리스크 개수}개와 기회 {계산된 기회 개수}개를 식별하였습니다." 와 같은 요약 문장을 생성해주세요.	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-t1	전략	94	1	TABLE	주요 기후 관련 리스크 및 기회	["str-4"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h4	전략	95	1	HEADING_4	(2) 식별된 위험 및 기회의 영향 기간 범위	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p3	전략	96	1	PARAGRAPH	당사는 기후 관련 위험 및 기회가 발생할 것으로 예상되는 기간범위를 아래와 같이 정의하고 있습니다.	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-t2	전략	97	1	TABLE	기간 정의	["str-5", "str-6", "str-7"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p4	전략	98	1	PARAGRAPH	\N	["str-8"]	# 작업 목표\r\n사용자가 서술한 '전략 계획과 기후 요소 연계 방식'에 대한 내용을 바탕으로, 기업의 체계적인 의사결정 프로세스를 설명하는 공식 보고서용 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-8] (전략 계획 연계 방식 설명): {{answer_str-8}}\r\n\r\n# 생성 가이드\r\n1. [str-8]의 답변 내용에서 '전략 계획의 종류 및 주기', '주기 설정의 근거', '기후 요소 고려 방식'을 파악해주세요.\r\n2. 파악된 내용을 재구성하여, 논리적인 흐름을 가진 두 개의 문장으로 만들어주세요.\r\n3. 첫 번째 문장은 '저희 기업의 전략적 의사결정은 ...을 통하여 이루어지고 있습니다.' 와 같이 계획의 종류와 주기를 설명하도록 해주세요.\r\n4. 두 번째 문장은 '이는 ... 고려했을 때이며, 해당 계획 수립 과정에서 ... 고려되고 있습니다.' 와 같이 그 근거와 기후 요소 연계 방식을 설명하도록 구성해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"{{answer_str-8}}"	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h5	전략	99	1	HEADING_3	2. 사업모형과 가치사슬	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h6	전략	100	1	HEADING_4	(1) 사업모형과 가치사슬에 미치는 현재 및 예상 영향	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p5	전략	101	1	PARAGRAPH	\N	["str-9"]	# 작업 목표\r\n사용자가 입력한 여러 '사업 부문' 목록을 하나의 자연스러운 문장으로 엮어, 기업의 전체적인 사업 모형을 설명하는 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-9] (사업 부문 목록 / JSON 배열): {{answer_str-9_json}}\r\n\r\n# 생성 가이드\r\n1. "저희 기업은 ... 사업의 성격에 따라" 라는 도입부로 문장을 시작해주세요.\r\n2. [str-9]에 담긴 JSON 배열의 각 항목(사업 부문)을 , (쉼표)로 연결하고, 마지막 항목 앞에는 '그리고' 또는 '등으로'와 같은 적절한 연결어를 사용해주세요.\r\n3. 각 항목은 "'{segment_name}' 부문," 과 같이 부문명을 먼저 제시하고, 그 뒤에 {segment_description} 내용을 자연스럽게 연결해주세요. (예: "...운영하는 '담배부문', ...운영하는 '건강기능부문' 등")\r\n4. 문장의 마지막은 "...으로 사업모형을 구분하고 있습니다." 와 같이 공식적인 톤으로 마무리해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"저희 기업은 당사와 연결대상 종속회사가 영위하는 사업의 성격에 따라 {첫 번째 부문의 segment_description}을(를) 운영하는 ‘{첫 번째 부문의 segment_name}’, {두 번째 부문의 segment_description}을(를) 운영하는 ‘{두 번째 부문의 segment_name}’ 등으로 사업모형을 구분하고 있습니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p6	전략	102	1	PARAGRAPH	\N	["str-10"]	# 작업 목표\r\n사용자가 서술한 '가치사슬의 정의 및 범위'를 바탕으로, 공식 보고서에 포함될 정의 문장을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-10] (가치사슬의 정의): {{answer_str-10}}\r\n\r\n# 생성 가이드\r\n1. [str-10]의 답변 내용을 사용하여, '각 사업모형별 가치사슬은 저희 기업이 ... 포함하고 있습니다.' 와 같은 구조의 공식적인 정의 문장을 생성해주세요.\r\n2. 문장이 간결하고 명확하게 '가치사슬'의 범위를 설명하는 데 집중하도록 해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"각 사업모형별 가치사슬은 저희 기업이 {{answer_str-10}}을(를) 포함하고 있습니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p7	전략	103	1	PARAGRAPH	\N	["str-11", "str-12", "str-13"]	# 작업 목표\r\n핵심 사업 부문을 명시하고, 해당 부문의 사업 모형과 가치사슬 구성 요소를 상세히 설명하는 공식 보고서용 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-11] (핵심 사업 부문): {{answer_str-11}}\r\n- [str-12] (사업 모형 구성 요소): {{answer_str-12}}\r\n- [str-13] (가치사슬 구성 요소): {{answer_str-13}}\r\n\r\n# 생성 가이드\r\n1. [str-11]의 답변을 사용하여, "저희 기업은 ... 위험 및 기회를 식별하였습니다." 와 같이 어떤 사업 부문에 집중했는지를 설명하는 첫 문장을 생성해주세요.\r\n2. [str-11]의 답변을 다시 주어로 사용하여, "‘{{answer_str-11}}’ 사업모형은 {{answer_str-12}}이며, 가치사슬 활동은 {{answer_str-13}}입니다." 와 같이 사업 모형과 가치사슬의 구성 요소를 설명하는 두 번째 문장을 생성해주세요.\r\n3. 전체적으로 기업이 체계적인 분석 틀에 따라 리스크와 기회를 식별했음을 보여주는 논리적인 톤앤매너를 유지해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"저희 기업은 ... {{answer_str-11}}의 지속가능성 관련 위험 및 기회를 식별하였습니다. ‘{{answer_str-11}}’ 사업모형은 {{answer_str-12}}이며, 가치사슬 활동은 {{answer_str-13}}입니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
rsk-p1	위험관리	156	1	PARAGRAPH	\N	["rsk-2"]	# 작업 목표\r\n사용자가 서술한 '시나리오 분석 활용 방안'을 바탕으로, 보고서에 포함될 공식적이고 명료한 문장을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [rsk-2] (시나리오 분석 활용 방안): {{answer_rsk-2}}\r\n\r\n# 생성 가이드\r\n1.  [rsk-2]의 답변 내용을 사용하여, "저희 기업은 기후 시나리오 분석을 통해..."로 시작하는 공식적인 문장을 구성해주세요.\r\n2.  문장에는 분석의 '목적'(영향 파악)과 '활용'(관리체계 강화)이 모두 포함되도록 자연스럽게 다듬어주세요.\r\n3.  전체적으로 기업이 체계적인 프로세스를 통해 리스크를 관리하고 있음을 보여주는 톤앤매너를 유지해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"저희 기업은 {{answer_rsk-2}}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
rsk-h5	위험관리	157	1	HEADING_4	(3) 기후 관련 위험 및 기회 평가	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p8	전략	104	1	PARAGRAPH	\N	["str-14"]	# 작업 목표\r\n사용자가 입력한 '위험/기회 요인'의 개요 설명을 공식 보고서에 적합한 톤앤매너로 다듬고, 어떤 사업 활동에 영향을 미치는지 명시하여 문단을 완성합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-14] (위험/기회별 영향 상세 목록 / JSON 배열): {{answer_str-14_json}}\r\n\r\n# 생성 가이드\r\n1. [str-14]로 제공된 JSON 배열의 각 객체에 대해 아래 작업을 반복하여 각각 별도의 문단을 생성해주세요.\r\n2. {overview_description} 내용을 바탕으로 공식 보고서에 적합한 톤앤매너로 문장을 다듬어주세요.\r\n3. {impact_details_table}에 있는 '활동'들의 이름을 참조하여, "...는 저희 기업의 사업모형 및 가치사슬 중 {영향받는 활동 1}와 {영향받는 활동 2}에 주된 영향을 미칩니다." 와 같이 영향을 받는 영역을 명시하며 문단을 마무리해주세요.\r\n\r\n# 최종 결과물 스타일 예시 (하나의 요인에 대해)\r\n"{risk_opportunity_factor}의 경우, {overview_description}. 이에 {risk_opportunity_factor}은(는) 저희 기업의 사업모형 및 가치사슬 중 {활동 1}와 {활동 2}에 주된 영향을 미칩니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-t3	전략	105	1	TABLE	위험/기회별 상세 영향	["str-14"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h7	전략	106	1	HEADING_4	(2) 위험과 기회가 집중된 영역	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p9	전략	107	1	PARAGRAPH	\N	["str-15"]	# 작업 목표\r\n사용자가 자유롭게 서술한 '집중 영역'에 대한 설명을 바탕으로, 공식 보고서에 적합한 간결하고 명료한 요약 문장을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-15] (집중 영역 설명): {{answer_str-15}}\r\n\r\n# 생성 가이드\r\n1. "저희 기업과 종속회사의 기후 관련 위험 및 기회가 집중된 영역은" 이라는 문장으로 시작해주세요.\r\n2. [str-15]의 답변 내용을 자연스럽게 연결하여 문장의 핵심 내용으로 사용해주세요.\r\n3. 문장의 마지막은 "...입니다."로 명확하게 마무리해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"저희 기업과 종속회사의 기후 관련 위험 및 기회가 집중된 영역은 {{answer_str-15}}입니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h8	전략	108	1	HEADING_3	3. 전략 및 의사결정	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h9	전략	109	1	HEADING_4	(1) 위험 및 기회 대응 및 계획	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h10	전략	110	1	HEADING_4	(가) 사업모형에 대한 자원배분 변화	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p10	전략	111	1	PARAGRAPH	\N	["str-16", "str-17", "str-18"]	# 작업 목표\r\n기업의 기후 관련 자원 배분 현황과 미래 계획, 그리고 구체적인 실행 사례를 종합하여 설득력 있는 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-16] (과거/현재 변화): {{answer_str-16}}\r\n- [str-17] (미래 계획 방향성): {{answer_str-17}}\r\n- [str-18] (구체적 실행 사례 목록 / JSON 배열): {{answer_str-18_json}}\r\n\r\n# 생성 가이드\r\n1. [str-16]의 답변을 사용하여 첫 문장을 생성해주세요. (예: "2023년 사업모형에 대한 직접적인 기후 관련 자원배분의 변화는 없습니다.")\r\n2. [str-17]의 답변을 사용하여 "다만, ... {{answer_str-17}} 등을 위해 자원배분 계획을 수립하여 실행하고 있습니다." 와 같이 두 번째 문장을 생성해주세요.\r\n3. [str-18] 배열에 데이터가 있는 경우, 목록의 첫 번째 사례를 사용하여 세 번째 문단(구체적 사례 설명)을 생성해주세요. 각 field의 내용을 자연스럽게 연결하여 상세한 프로젝트 설명을 만들어주세요.\r\n4. 전체적으로 과거-현재-미래의 흐름이 논리적으로 연결되도록 구성해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"{{answer_str-16}}. 다만, {{answer_str-17}} 등을 위해 자원배분 계획을 수립하여 실행하고 있습니다.\r\n저희 기업은 {{str-18 첫 번째 사례의 location_scale}}에 {{str-18 첫 번째 사례의 investment}}을(를) 투자해 {{str-18 첫 번째 사례의 project_name}}을(를) 진행 중이며 {{str-18 첫 번째 사례의 timeline}}. {{str-18 첫 번째 사례의 details}}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h11	전략	112	1	HEADING_4	(나) 직접적인 완화 및 적응을 위한 노력	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-t4	전략	113	1	TABLE	직접적인 완화 및 적응 노력	["str-19"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p11	전략	114	1	PARAGRAPH	\N	["str-19", "str-20"]	# 작업 목표\r\n사용자가 각 활동에 대해 자유롭게 서술한 상세 내용(narrative_text)을, 공식 보고서에 적합하도록 톤앤매너를 다듬고 문장을 교정하여 최종 본문 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-19] (완화 및 적응 노력 요약 목록 / JSON 배열): {{answer_str-19_json}}\r\n- [str-20] (활동별 상세 서술 내용 목록 / JSON 배열): {{answer_str-20_json}}\r\n\r\n# 생성 가이드\r\n1. 이 작업 지시서는 [str-19]의 각 '세부 활동'에 해당하는 상세 설명을 렌더링할 때 사용됩니다.\r\n2. [str-19]의 N번째 항목과 [str-20]의 N번째 항목을 짝지어 처리해주세요.\r\n3. [str-20]의 N번째 항목에 있는 {narrative_text}를 가져와, 문법적으로 어색하거나 구어체적인 표현이 있다면 전문적인 보고서 톤으로 수정해주세요.\r\n\r\n# 최종 결과물 스타일 예시 (하나의 활동에 대해)\r\n"? {str-19의 첫 번째 활동 action_description}\r\n\r\n{str-20의 첫 번째 활동 narrative_text 내용(SLM이 다듬은 후)}"	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h12	전략	115	1	HEADING_4	(다) 간접적인 완화 및 적응을 위한 노력	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-t5	전략	116	1	TABLE	간접적인 완화 및 적응 노력	["str-21"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p12	전략	117	1	PARAGRAPH	\N	["str-21", "str-22"]	# 작업 목표\r\n사용자가 각 간접적 활동에 대해 자유롭게 서술한 상세 내용(narrative_text)을, 공식 보고서에 적합하도록 톤앤매너를 다듬고 문장을 교정하여 최종 본문 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-21] (간접적 완화 및 적응 노력 요약 목록 / JSON 배열): {{answer_str-21_json}}\r\n- [str-22] (간접적 활동별 상세 서술 내용 목록 / JSON 배열): {{answer_str-22_json}}\r\n\r\n# 생성 가이드\r\n1. 이 작업 지시서는 [str-21]의 각 '세부 활동'에 해당하는 상세 설명을 렌더링할 때 사용됩니다.\r\n2. [str-21]의 N번째 항목과 [str-22]의 N번째 항목을 짝지어 처리해주세요.\r\n3. [str-22]의 N번째 항목에 있는 {narrative_text}를 가져와, 문법적으로 어색하거나 구어체적인 표현이 있다면 전문적인 보고서 톤으로 수정해주세요.\r\n\r\n# 최종 결과물 스타일 예시 (하나의 간접적 활동에 대해)\r\n"① {str-21의 첫 번째 활동 action_description}\r\n\r\n{str-22의 첫 번째 활동 narrative_text 내용(SLM이 다듬은 후)}"	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h13	전략	118	1	HEADING_4	(라) 기후 관련 전환 계획	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h9	지표 및 목표	181	1	HEADING_4	(2) 기후 관련 전환 위험에 취약한 자산 또는 사업활동	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p13	전략	119	1	PARAGRAPH	\N	["str-23", "str-24", "str-25"]	# 작업 목표\r\n사용자가 입력한 3가지 종류의 데이터를 종합하고 논리적으로 재구성하여, 기업의 포괄적인 기후 전환 계획을 설명하는 상세한 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-23] (전환 계획 기본 원칙 및 장기 목표): {{answer_str-23}}\r\n- [str-24] (주요 정량/정성 목표 목록 / JSON 배열): {{answer_str-24_json}}\r\n- [str-25] (Scope 3 관리 전략): {{answer_str-25}}\r\n\r\n# 생성 가이드\r\n1.  **첫 번째 문단 생성:**\r\n    - [str-23]의 답변 내용을 바탕으로, "... 파리협정과 연계된 목표를 설정하고, ... SBTi 가이드라인에 따라 중장기 감축목표를 수립하였습니다." 와 같이 전환 계획의 큰 틀과 지향점을 설명하는 도입부를 만들어주세요.\r\n    - 그 다음, [str-24]의 JSON 배열 데이터를 분석해주세요. 배열의 각 항목을 "저희 기업은 {target_year}년까지 {scope} 배출량을 {target_details}하는 것을 목표로 설정하였습니다." 또는 "또한 {target_year}까지 {scope}를 대상으로 {target_details}을(를) 실현할 계획입니다." 와 같이, 각 목표에 대한 개별 문장으로 변환해주세요.\r\n    - 이렇게 변환된 여러 목표 문장들을 도입부 뒤에 자연스럽게 연결하여 첫 번째 문단을 완성해주세요.\r\n2.  **두 번째 문단 생성:**\r\n    - [str-25]의 답변 내용을 사용하여, Scope 3 관리에 대한 상세 내용을 별도의 문단으로 구성해주세요.\r\n    - "아울러, ..." 와 같은 접속사를 사용하여 앞 문단과 자연스럽게 연결해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"{{answer_str-23}}. {{str-24의 첫 번째 목표를 풀어쓴 문장}}. {{str-24의 두 번째 목표를 풀어쓴 문장}}.\r\n\r\n아울러, {{answer_str-25}}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-t6	전략	120	1	TABLE	주요 가정 및 의존 요소	["str-26"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h14	전략	121	1	HEADING_4	(마) 기후 관련 목표 달성 계획	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-t7	전략	122	1	TABLE	감축 수단 및 이행 계획	["str-24", "str-27"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h15	전략	123	1	HEADING_4	(2) 자원조달 계획	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p14	전략	124	1	PARAGRAPH	\N	["str-28", "str-29", "str-30", "str-31"]	# 작업 목표\r\n사용자가 입력한 4가지 종류의 자본 활용 계획을 논리적인 순서에 따라 하나의 포괄적인 문단으로 통합합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-28] (친환경 자금 조달 사례 / JSON 배열): {{answer_str-28_json}}\r\n- [str-29] (내부 투자 결정 정책 / Text): {{answer_str-29}}\r\n- [str-30] (비용 효율화 전략 / Text): {{answer_str-30}}\r\n- [str-31] (인력 채용 계획 / JSON 배열): {{answer_str-31_json}}\r\n\r\n# 생성 가이드\r\n1.  제공된 4가지 데이터가 모두 존재할 경우, 각 내용을 별도의 문장으로 생성한 뒤, "또한,", "이와 더불어," 와 같은 적절한 접속사를 사용하여 자연스럽게 연결해주세요.\r\n2.  특정 데이터가 없다면, 해당 부분은 건너뛰고 나머지 내용만으로 문단을 구성해주세요.\r\n    -   (1단계) [str-28]의 첫 번째 사례를 사용하여 그린본드 발행에 대한 문장을 만들어주세요.\r\n    -   (2단계) [str-29]의 답변을 사용하여 내부 탄소가격제에 대한 문장을 만들어주세요.\r\n    -   (3단계) [str-30]의 답변을 사용하여 MACC 분석 등 방법론에 대한 문장을 만들어주세요.\r\n    -   (4단계) [str-31]의 첫 번째 사례를 사용하여 인력 채용에 대한 문장을 만들어주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"저희 기업은 {{answer_str-28 첫 사례의 issue_date}}에 {{answer_str-28 첫 사례의 scale}} 규모의 {{answer_str-28 첫 사례의 financing_type}}을(를) 발행했으며, 마련한 자금은 {{answer_str-28 첫 사례의 use_of_proceeds}}. 또한 {{answer_str-29}}. 이와 더불어 저희는 {{answer_str-30}}. 또한 {{answer_str-31 첫 사례의 hiring_period}}에 {{answer_str-31 첫 사례의 num_of_hires}}명의 관련 인력을 추가 채용하였으며, {{answer_str-31 첫 사례의 roles_and_plans}}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h16	전략	125	1	HEADING_4	(3) 과거 보고기간에 공시된 계획의 진척도에 대한 양적 및 질적 정보	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p15	전략	126	1	PARAGRAPH	지표 및 목표 내 기후 관련 목표 ‘3) 목표 대비 성과 분석’을 참고 해주시기 바랍니다.	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h17	전략	127	1	HEADING_3	4. 기후회복력	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p16	전략	128	1	PARAGRAPH	\N	["str-32"]	# 작업 목표\r\n사용자가 서술한 '시나리오 분석 목적'을 바탕으로, 보고서의 도입부에 사용될 공식적이고 명료한 문장을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-32] (시나리오 분석 목적): {{answer_str-32}}\r\n\r\n# 생성 가이드\r\n1. "저희 기업은" 이라는 주어로 문장을 시작해주세요.\r\n2. [str-32]의 답변 내용을 사용하여, 문장의 핵심 목적 부분을 구성해주세요.\r\n3. 문장의 마지막은 "...기후변화 시나리오 분석을 수행하였습니다." 와 같이 공식적인 서술어로 자연스럽게 마무리해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"저희 기업은 {{answer_str-32}} 기후변화 시나리오 분석을 수행하였습니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h18	전략	129	1	HEADING_4	(1) 기후 관련 시나리오 분석 방법론	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h19	전략	130	1	HEADING_4	(가) 시나리오 분석 절차	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p17	전략	131	1	PARAGRAPH	\N	["str-33", "str-34"]	# 작업 목표\r\n시나리오 분석에 사용된 참고 프레임워크와 선택된 시나리오들을 논리적으로 연결하여, 분석의 배경과 범위를 설명하는 공식 보고서용 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-33] (참고 프레임워크/기관): {{answer_str-33}}\r\n- [str-34] (활용 시나리오 및 선택 이유): {{answer_str-34}}\r\n\r\n# 생성 가이드\r\n1. [str-33]의 답변을 사용하여 "본 분석에서는 ... 고려하기 위해, 국제적으로 공신력 있는 기관인 {{answer_str-33}}을(를) 채택하였습니다." 와 같이 첫 문장을 구성해주세요.\r\n2. [str-34]의 답변 내용을 사용하여, "{{answer_str-34}}하여, 각 경로가 기업에 미치는 영향을 종합적으로 분석하였습니다." 와 같이 두 번째 문장을 생성하며 자연스럽게 연결해주세요.\r\n3. 전체적으로 분석의 근거와 방법론이 체계적임을 보여주는 전문적인 톤앤매너를 유지해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"본 분석에서는 기업의 기후 대응 수준에 따른 미래의 불확실성을 고려하기 위해, 국제적으로 공신력 있는 기관인 {{answer_str-33}}을(를) 채택하였습니다. {{answer_str-34}}하여, 각 경로가 기업에 미치는 영향을 종합적으로 분석하였습니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p18	전략	132	1	PARAGRAPH	\N	["str-35"]	# 작업 목표\r\n사용자가 입력한 '시나리오 분석 단계' 목록을 바탕으로, 절차를 요약하는 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-35] (시나리오 분석 단계 목록 / JSON 배열): {{answer_str-35_json}}\r\n\r\n# 생성 가이드\r\n1. "저희 기업은 아래와 같은 체계적인 절차에 따라 시나리오 분석을 수행하였습니다." 라는 고정된 도입부 문장으로 시작해주세요.\r\n2. [str-35]에 담긴 JSON 배열의 각 {step_description}을 자연스럽게 연결하여, "...을 바탕으로, ...를 정의하고 ...를 분석하여 최종적으로 ...을 수립합니다." 와 같이 전체 프로세스를 요약하는 하나의 흐름으로 만들어주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"저희 기업은 아래와 같은 체계적인 절차에 따라 시나리오 분석을 수행하였습니다. 저희는 {1단계 step_description}을(를) 바탕으로, {2단계 step_description} 및 {3단계 step_description}을(를) 거쳐 {4단계 step_description}을(를) 분석하고 최종적으로 {5단계 step_description}을(를) 수립합니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-f1	전략	133	1	FIGURE	시나리오 분석 절차	["str-35"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h20	전략	134	1	HEADING_4	[나] 시나리오별 주요 가정 및 변수	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-t8	전략	135	1	TABLE	시나리오별 주요 가정 및 변수	["str-36"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h21	전략	136	1	HEADING_4	(2) 시나리오 분석 결과	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p19	전략	137	1	PARAGRAPH	시나리오 분석 결과, 주요 기후 관련 리스크 및 기회 요인이 기업의 재무 상태에 미칠 것으로 예상되는 영향은 아래와 같습니다.	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-t9	전략	138	1	TABLE	위험/기회 요인별 재무 영향 및 대응 현황	["str-4", "str-37"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h22	전략	139	1	HEADING_4	[가] 전환 리스크	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p20	전략	140	1	PARAGRAPH	\N	["str-4", "str-38"]	# 작업 목표\r\n사용자가 입력한 특정 위험 요인에 대한 4가지 상세 분석 내용을 조합하여, 매우 상세하고 전문적인 '전환리스크 심층 분석' 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-4] (주요 리스크/기회 요인 목록 / JSON 배열): {{answer_str-4_json}}\r\n- [str-38] (리스크별 상세 분석 내용 목록 / JSON 배열): {{answer_str-38_json}}\r\n\r\n# 생성 가이드\r\n1. 이 작업 지시서는 보고서 생성 시, [str-4]의 각 '위험' 요인에 해당하는 상세 설명을 렌더링할 때 사용됩니다.\r\n2. [str-4]의 N번째 위험 항목과 [str-38]의 N번째 항목을 짝지어 처리해주세요.\r\n3. [str-38]의 N번째 항목에 있는 4개의 필드(analysis_overview, context_and_impact, quantification_methodology, financial_statement_impact)를 각각 별도의 문단으로 삼거나, 논리적인 흐름에 맞게 자연스럽게 연결하여 하나의 긴 서술형 문단으로 재구성해주세요.\r\n4. 특히 {financial_statement_impact} 내용은 별도의 문단으로 명확하게 구분하여, 재무제표에 미치는 영향을 강조해주세요.\r\n\r\n# 최종 결과물 스타일 예시 (하나의 위험 요인에 대해)\r\n"{str-4의 N번째 위험 요인 factor}\r\n\r\n{str-38의 N번째 항목 analysis_overview}\r\n\r\n{str-38의 N번째 항목 context_and_impact}\r\n\r\n{str-38의 N번째 항목 quantification_methodology}\r\n\r\n{str-38의 N번째 항목 financial_statement_impact}"	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h23	전략	141	1	HEADING_4	[나] 물리적 리스크	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-c1	전략	143	1	BAR_CHART	시나리오별 물리적 리스크 정량 데이터	["str-39"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-c2	전략	144	1	MAP_CHART	지역별 물리적 리스크 지도	["str-39"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-t10	전략	145	1	TABLE	재무 영향 산정 근거	["str-40"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-c3	전략	146	1	BAR_CHART	시나리오별 예측 손실액	["str-41"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-p21	전략	142	1	PARAGRAPH	\N	["str-39", "str-40", "str-41", "str-42"]	# 작업 목표\r\n사용자가 입력한 여러 구조화된 데이터와 서술형 데이터를 종합적으로 분석, 요약, 재구성하여 '물리적 리스크 상세 분석'에 대한 전문적인 보고서 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [str-39] (물리적 리스크 정량 데이터 / JSON 배열): {{answer_str-39_json}}\r\n- [str-40] (재무 영향 산정 근거 / JSON 배열): {{answer_str-40_json}}\r\n- [str-41] (최종 예측 손실액 / JSON 배열): {{answer_str-41_json}}\r\n- [str-42] (재무제표 영향 서술 / Text): {{answer_str-42}}\r\n\r\n# 생성 가이드\r\n1. **첫 번째 문단 생성 (물리적 리스크 동향 분석):**\r\n    - [str-39]의 데이터를 분석하여, 여러 location들의 risk_type(예: '폭염')에 대한 value를 비교하고, 전반적인 경향을 요약해주세요.\r\n    - 특정 시나리오에서의 연도별, 지역별 value 변화를 구체적인 숫자를 인용하여 나열해주세요.\r\n    - 숫자들을 바탕으로 데이터 기반의 인사이트와 결론을 도출해주세요.\r\n2. **두 번째 문단 생성 (재무 영향 분석):**\r\n    - [str-40]의 calculation_method(산출 방식) 내용을 사용하여, 재무 영향 산정 방법론을 요약 설명해주세요.\r\n    - [str-41]의 데이터를 사용하여, 최종적인 정량 분석 결과를 제시해주세요.\r\n    - 마지막으로, [str-42]의 답변 내용을 사용하여, 이 재무적 영향이 실제 재무제표에 어떻게 반영되는지를 설명하며 문단을 마무리해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"(첫 번째 문단)\r\n[str-39] 데이터를 분석한 결과, ... 전반적인 리스크 동향은 ... 합니다. 대표적인 예로, {{str-39의 구체적 수치 데이터 나열}}. 따라서, {{str-39 데이터 기반의 종합 결론 및 인사이트}}.\r\n\r\n(두 번째 문단)\r\n이러한 물리적 리스크로 인한 잠재적 재무 영향을 산정하기 위해, 저희 기업은 {{str-40의 내용}}. {{str-41의 정량적 분석 결과}}. 이러한 영향은 재무제표에 {{answer_str-42}}과 같이 반영될 수 있습니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h24	전략	147	1	HEADING_4	[다] 기후변화에 대해 전략과 사업모형을 조정하거나 적응시킬 수 있는 기업의 역량 	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-t11	전략	148	1	TABLE	기업의 역량	["str-43"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-h25	전략	149	1	HEADING_4	[라] 기후 시나리오 분석에서 고려된 유의적인 불확실성의 영역	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
str-t12	전략	150	1	TABLE	유의적인 불확실성 영역	["str-44"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
rsk-h1	위험관리	151	1	HEADING_2	위험관리	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
rsk-h2	위험관리	152	1	HEADING_3	1. 기후 관련 위험 및 기회 관리 프로세스	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
rsk-h3	위험관리	153	1	HEADING_4	(1) 투입변수 및 매개변수	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
rsk-t1	위험관리	154	1	TABLE	투입변수 및 데이터 원천	["rsk-1"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
rsk-h4	위험관리	155	1	HEADING_4	(2) 기후 관련 위험 및 기회 식별	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
rsk-p2	위험관리	158	1	PARAGRAPH	\N	["rsk-3", "rsk-4"]	# 작업 목표\r\n사용자가 입력한 '내부 평가 프로세스'와 '외부 자원 활용' 정보를 유기적으로 결합하여, 기업의 리스크 평가 프로세스가 체계적이고 전문적임을 보여주는 종합적인 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [rsk-3] (내부 평가 프로세스): {{answer_rsk-3}}\r\n- [rsk-4] (외부 자원 활용): {{answer_rsk-4}}\r\n\r\n# 생성 가이드\r\n1.  [rsk-3]의 답변을 사용하여, "저희 기업은 ... 기후 관련 위험 및 기회를 식별 및 평가합니다. ...이러한 프로세스를 통해 ... 대응 전략을 검토합니다." 와 같이 기업의 기본적인 평가 프로세스에 대한 전체적인 문단을 먼저 구성해주세요.\r\n2.  그 다음, 구성된 문단의 중간에 [rsk-4]의 답변 내용을 "이와 더불어," 또는 "추가적으로" 와 같은 접속사를 사용하여 자연스럽게 삽입해주세요.\r\n3.  삽입되는 내용은 외부 자원을 활용하여 분석 수준을 '고도화'하고 있음을 강조하는 뉘앙스를 담아야 합니다.\r\n\r\n# 최종 결과물 스타일 예시\r\n"저희 기업은 {{answer_rsk-3의 도입부}}. 이와 더불어 {{answer_rsk-4}}을 통해 분석 수준을 고도화하고 있습니다. 이러한 프로세스를 통해 {{answer_rsk-3의 결론부}}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
rsk-h6	위험관리	159	1	HEADING_4	(4) 다른 지속가능성 위험과 비교 시 기후 관련 위험 및 기회의 우선순위 정도	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
rsk-p3	위험관리	160	1	PARAGRAPH	\N	["rsk-5", "rsk-6", "rsk-7"]	# 작업 목표\r\n사용자가 입력한 3가지 답변(rsk-5, rsk-6, rsk-7)을 종합하여, 기업의 기후 위험 우선순위 결정 및 관리 '프로세스'를 설명하는 포괄적인 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [rsk-5] (통합 관리 체계): {{answer_rsk-5}}\r\n- [rsk-6] (우선순위 결정 프로세스): {{answer_rsk-6}}\r\n- [rsk-7] (보고 및 공개 방식): {{answer_rsk-7}}\r\n\r\n# 생성 가이드\r\n1.  [rsk-5]와 [rsk-6]의 답변 내용을 유기적으로 결합하여, 기업이 어떻게 기후 위험을 평가하고 우선순위를 결정하는지에 대한 전체적인 방법론을 하나의 문장 또는 두 개의 문장으로 설명해주세요.\r\n2.  그 다음, {rsk-7}의 답변 내용을 사용하여, "이렇게 평가된 위험에 대한 대응 활동은 ... 관련 정보를 투명하게 공개하고 있습니다." 와 같이 보고 및 공개에 대한 내용으로 자연스럽게 문단을 마무리해주세요.\r\n3.  전체적으로 위험 관리 '프로세스'의 체계성을 강조하는 톤앤매너를 유지해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"{{answer_rsk-5}}. 또한 {{answer_rsk-6}}을 통해 기후 위험의 우선순위를 결정합니다. 이렇게 식별 및 평가된 위험에 대한 대응 활동과 관리 현황은 {{answer_rsk-7}}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
rsk-h7	위험관리	161	1	HEADING_4	(5) 기후 관련 위험 및 기회 모니터링	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
rsk-p4	위험관리	162	1	PARAGRAPH	\N	["rsk-8", "rsk-9", "rsk-10"]	# 작업 목표\r\n사용자가 입력한 3가지 답변(모니터링 지표, 업데이트 절차, 감독 거버넌스)을 종합하여, 기업의 지속적인 리스크 모니터링 체계를 상세하고 논리적으로 설명하는 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [rsk-8] (모니터링 지표): {{answer_rsk-8_json}}\r\n- [rsk-9] (업데이트 절차 및 사례): {{answer_rsk-9}}\r\n- [rsk-10] (감독 거버넌스): {{answer_rsk-10}}\r\n\r\n# 생성 가이드\r\n1.  [rsk-8]의 JSON 배열에서 각 객체의 parameter_name 값을 모두 추출해주세요.\r\n2.  추출된 값들을 ,(쉼표)와 '등'을 사용하여 자연스러운 목록 형태의 문자열로 만들어주세요. (예: "정책 이행 수준, 온실가스 배출량 추이, 탄소 가격 등")\r\n3.  이 생성된 목록 문자열을 가지고, "저희 기업은 {생성된 목록 문자열} 주요 매개변수를 모니터링하고 있으며..." 와 같이 전체 문장의 일부를 완성해주세요.\r\n4.  이 완성된 문장에 [rsk-9]의 답변을 결합하여, "저희 기업은 {rsk-8의 답변} 등 주요 매개변수를 모니터링하고 있으며, ... {rsk-9의 답변}" 와 같이 '무엇을' 모니터링하고 '어떻게' 대응하는지를 설명하는 전반부를 구성해주세요.\r\n5.  그 다음, [rsk-10]의 답변을 사용하여 "... {rsk-10의 답변}" 과 같이 이 모든 과정을 '누가' 감독하는지에 대한 거버넌스 설명을 덧붙여 문단을 완성해주세요.\r\n6.  전체적으로 기업이 일회성 평가가 아닌, 살아있는 상시 모니터링 시스템을 갖추고 있음을 보여주는 톤앤매너를 유지해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"저희 기업은 {{answer_rsk-8}} 등 주요 매개변수를 모니터링하고 있으며, {{answer_rsk-9}}. 한편, {{answer_rsk-10}}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
rsk-h8	위험관리	163	1	HEADING_4	(6) 위험관리 프로세스 변경사항	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
rsk-p5	위험관리	164	1	PARAGRAPH	당사의 보고기간 내 위험관리 프로세스 변경 사항은 아래와 같습니다.	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
rsk-t2	위험관리	165	1	TABLE	프로세스 변경 이력	["rsk-11"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h1	지표 및 목표	166	1	HEADING_2	지표 및 목표	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h2	지표 및 목표	167	1	HEADING_3	1. 기후 관련 지표	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h3	지표 및 목표	168	1	HEADING_4	(1) 온실가스	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h4	지표 및 목표	169	1	HEADING_4	[가] 절대 총 배출량	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-t1	지표 및 목표	170	1	TABLE	온실가스 배출량	["met-1"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h5	지표 및 목표	171	1	HEADING_4	[나] 배출량 산정 지침	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-p1	지표 및 목표	172	1	PARAGRAPH	당사가 온실가스 배출량 측정을 위해 적용한 지침은 아래와 같습니다.	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-t2	지표 및 목표	173	1	TABLE	온실가스 배출량 측정 적용 지침	["met-2"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h6	지표 및 목표	174	1	HEADING_4	[다] 온실가스 배출량 산정에 포함된 온실가스 종류	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-t3	지표 및 목표	175	1	TABLE	배출량에 포함된 온실가스	["met-3"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h7	지표 및 목표	176	1	HEADING_4	[라] 투입변수 및 주요 가정	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-t4	지표 및 목표	177	1	TABLE	Scope 1, 2 온실가스 배출량 측정 방법론	["met-4"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-t5	지표 및 목표	178	1	TABLE	Scope 3 온실가스 배출량 측정 방법론	["met-5"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h8	지표 및 목표	179	1	HEADING_4	[마] Scope2 온실가스 배출량 관련 계약 상품 정보	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-t6	지표 및 목표	180	1	TABLE	Scope 2 계약 상품 정보	["met-6"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-p2	지표 및 목표	182	1	PARAGRAPH	\N	["met-7"]	# 작업 목표\r\nmet-7에 입력된 각 '취약 자산'별로, '잠재적 위험'과 '대응 노력'을 논리적으로 연결하여 설득력 있는 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [met-7] (전환 위험 상세 목록 / JSON 배열): {{answer_met-7_json}}\r\n\r\n# 생성 가이드\r\n1.  [met-7] 배열의 각 객체(항목)에 대해 하나의 문단을 생성해주세요.\r\n2.  먼저, {vulnerable_asset}과 {potential_risk} 내용을 조합하여, 어떤 자산이 어떤 위험에 노출되어 있는지 설명하는 전반부를 구성해주세요.\r\n3.  그 다음, "이에 따라 저희 기업은"과 같은 연결어를 사용하여, {mitigation_effort} 내용을 바탕으로 기업의 구체적인 대응 노력을 서술하며 문단을 마무리해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"{{vulnerable_asset}}의 경우, {{potential_risk}}. 이에 따라, {{mitigation_effort}}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-t7	지표 및 목표	183	1	TABLE	전환 위험에 취약한 자산 및 사업활동 금액	["met-8"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h10	지표 및 목표	184	1	HEADING_4	(3) 기후 관련 물리적 위험에 취약한 자산 또는 사업활동	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-p3	지표 및 목표	185	1	PARAGRAPH	\N	["met-9"]	# 작업 목표\r\nmet-9에 입력된 각 '취약 자산'별로, '잠재적 위험'과 '대응 노력'을 논리적으로 연결하여 설득력 있는 서술형 문단을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [met-9] (물리적 위험 상세 목록 / JSON 배열): {{answer_met-9_json}}\r\n\r\n# 생성 가이드\r\n[met-9] 배열의 각 객체(항목)에 대해 하나의 문단을 생성해주세요. (A.1의 가이드와 동일한 로직 적용)\r\n\r\n# 최종 결과물 스타일 예시\r\n"{{vulnerable_asset}}의 경우, {{potential_risk}}. 이에 따라, {{mitigation_effort}}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-t8	지표 및 목표	186	1	TABLE	물리적 위험에 취약한 자산 및 사업활동 금액	["met-10"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h11	지표 및 목표	187	1	HEADING_4	(4) 기후 관련 기회에 부합하는 자산 또는 사업활동	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-p4	지표 및 목표	188	1	PARAGRAPH	\N	["met-11"]	# 작업 목표\r\n사용자가 입력한 '기회 요인 판단 기준'을 바탕으로, 보고서에 포함될 공식적인 문장을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [met-11] (기회 요인 판단 기준): {{answer_met-11}}\r\n\r\n# 생성 가이드\r\n[met-11]의 답변을 사용하여, "저희 기업은 {{answer_met-11}}을(를) 기후 관련 기회에 부합하는 자산 및 사업활동으로 분류하였습니다." 와 같은 구조의 문장을 생성해주세요.	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-t9	지표 및 목표	189	1	TABLE	기회 요인별 재무 가치	["met-12"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h12	지표 및 목표	190	1	HEADING_4	(5) 자본 배치	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-p5	지표 및 목표	191	1	PARAGRAPH	기후 관련 위험 및 기회에 대비하여 배치된 자본적 지출은 다음과 같습니다.	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-t10	지표 및 목표	192	1	TABLE	자본 배치 계획	["met-27"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h13	지표 및 목표	193	1	HEADING_4	(6) 내부 탄소 가격	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-p6	지표 및 목표	194	1	PARAGRAPH	\N	["met-13"]	# 작업 목표\r\n사용자가 입력한 '내부 탄소 가격' 정보를 바탕으로, 보고서의 도입부 문장을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [met-13] (내부 탄소 가격): {{answer_met-13}}\r\n\r\n# 생성 가이드\r\n[met-13]의 답변을 사용하여, "저희 기업의 내부 탄소 가격은 {{answer_met-13}}(으)로 설정하였으며, 산출방법 및 주요가정과 의사결정에 적용하는 방법은 다음과 같습니다.” 와 같은 문장을 생성해주세요.	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-t11	지표 및 목표	195	1	TABLE	내부 탄소 가격 상세	["met-14", "met-15"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h14	지표 및 목표	196	1	HEADING_4	(7) 보상	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-p7	지표 및 목표	197	1	PARAGRAPH	\N	["met-16"]	# 작업 목표\r\n사용자가 입력한 여러 '보상 연계 정책 및 사례' 목록을 하나의 자연스러운 서술형 문단으로 재구성합니다.\r\n\r\n# 제공되는 데이터\r\n- [met-16] (보상 연계 정책 목록 / JSON 배열): {{answer_met-16_json}}\r\n\r\n# 생성 가이드\r\n1.  [met-16]으로 제공된 JSON 배열의 각 객체(항목)들을 논리적인 순서로 연결하여 하나의 문단으로 만들어주세요.\r\n2.  첫 번째 항목을 사용하여 보상 연계의 전반적인 방침을 설명하는 문장을 먼저 구성해주세요.\r\n3.  그 다음 항목들을 "또한,", "특히,"와 같은 접속사를 사용하여 자연스럽게 연결하고, effective_date가 있는 경우 " {{effective_date}}에는" 과 같이 시점 정보를 문장에 포함시켜주세요.\r\n4.  전체적으로 기업의 보상 체계가 기후 성과를 실질적으로 반영하기 위해 지속적으로 개편되고 있음을 보여주는 톤앤매너를 유지해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"저희 기업은 {첫 번째 항목의 policy_target} 보수에 {첫 번째 항목의 policy_description}. {두 번째 항목의 effective_date}에는 {두 번째 항목의 policy_target} 설정 시 {두 번째 항목의 policy_description}하였으며, 특히 {세 번째 항목의 policy_target}에는 {세 번째 항목의 policy_description}하여 보수 체계를 개편하였습니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-t12	지표 및 목표	198	1	TABLE	대상별 KPI 및 보상 연계	["met-17"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h15	지표 및 목표	199	1	HEADING_3	2. 기후 관련 목표	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h16	지표 및 목표	200	1	HEADING_4	(1) 목표 설정에 사용된 지표 관련 정보	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-t13	지표 및 목표	201	1	TABLE	기후 관련 목표 상세	["met-18", "met-19", "met-20", "met-21"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h17	지표 및 목표	202	1	HEADING_4	(2) 목표에 대한 진척도 모니터링 방법	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h18	지표 및 목표	203	1	HEADING_4	[가] 제 3자 검증 여부	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-p8	지표 및 목표	204	1	PARAGRAPH	\N	["met-22"]	# 작업 목표\r\n사용자가 입력한 '제3자 검증 사례'의 구조화된 데이터를 바탕으로, 신뢰도 높은 공식적인 '검증 선언문'을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [met-22] (제3자 검증 사례 목록 / JSON 배열): {{answer_met-22_json}}\r\n\r\n# 생성 가이드\r\n1.  [met-22]에 담긴 JSON 배열의 각 객체(검증 사례)에 대해 하나의 완성된 선언문 문단을 생성해주세요.\r\n2.  "저희 기업은 {verification_scope}에 대하여" 와 같이 검증 대상을 명시하며 문장을 시작해주세요.\r\n3.  "공신력 있는 제3자 검증기관인 {verifier}을(를) 통해 {verification_standard}에 따라 {assurance_level}을 획득하였습니다." 와 같이 기관, 기준, 수준을 명시하는 핵심 문장을 구성해주세요.\r\n4.  마지막으로, "검증 결과, {verification_opinion}" 와 같이 최종 검증 의견을 덧붙여 문단을 마무리해주세요.\r\n5.  전체적으로 객관적이고 신뢰성 있는 사실을 전달하는 톤앤매너를 유지해주세요.\r\n\r\n# 최종 결과물 스타일 예시 (하나의 검증 사례에 대해)\r\n"저희 기업은 {{verification_scope}}에 대하여, 공신력 있는 제3자 검증기관인 {{verifier}}(으)로부터 {{verification_standard}}에 의거한 {{assurance_level}}을 획득하였습니다. 검증 결과, {{verification_opinion}}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h19	지표 및 목표	205	1	HEADING_4	[나] 목표 검토 프로세스	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-p9	지표 및 목표	206	1	PARAGRAPH	\N	["met-23"]	# 작업 목표\r\n사용자가 입력한 여러 '목표 검토 프로세스' 항목들을 하나의 자연스러운 서술형 문단으로 재구성합니다.\r\n\r\n# 제공되는 데이터\r\n- [met-23] (목표 검토 프로세스 목록 / JSON 배열): {{answer_met-23_json}}\r\n\r\n# 생성 가이드\r\n1.  [met-23]으로 제공된 JSON 배열의 각 객체(항목)들을 논리적인 순서에 따라 자연스럽게 연결하여 하나의 문단으로 만들어주세요.\r\n2.  각 항목을 연결할 때, "또한,", "그리고" 와 같은 적절한 접속사를 사용하고, process_date 정보가 있는 경우 " {{process_date}}부터는" 과 같이 문장에 포함시켜주세요.\r\n3.  전체적으로 기업의 목표 관리 체계가 구체적이고 체계적으로 운영되고 있음을 보여주는 톤앤매너를 유지해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"저희 기업은 {항목1의 process_details}를 위해 {항목1의 process_date} {항목1의 process_name}을 도입하여 시행하고 있습니다. 이 제도는 {항목2의 process_details}. 또한, {항목3의 process_date}는 {항목3의 process_name}을 통해 {항목3의 process_details}하였으며, {항목4의 process_details}하고 있습니다."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h20	지표 및 목표	207	1	HEADING_4	[다] 목표 달성 진척도 모니터링 지표	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-p10	지표 및 목표	208	1	PARAGRAPH	당사는 기후 관련 목표 달성 진척도와 관련하여 아래와 같은 지표를 모니터링하고 있습니다.	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-t14	지표 및 목표	209	1	TABLE	진척도 모니터링 지표	["met-21", "met-24"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h21	지표 및 목표	210	1	HEADING_4	[라] 목표 수정사항 및 사유	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-t15	지표 및 목표	211	1	TABLE	목표 수정 이력	["met-21", "met-24", "met-25"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-p11	지표 및 목표	212	1	PARAGRAPH	\N	["met-28"]	# 작업 목표\r\n사용자가 서술한 '기후 관련 목표 수정사항 사유'를 바탕으로, 보고서에 포함될 공식적이고 명료한 문장을 생성합니다.\r\n\r\n# 제공되는 데이터\r\n- [met-28] (목표 수정사항에 대한 설명): {{answer_met-28}}\r\n\r\n# 생성 가이드\r\n1.  [met-28]의 답변 내용을 사용하여, "당사는 기존에 설정한 기후 관련 목표에서..."로 시작하는 공식적인 문장을 구성해주세요.\r\n2.  문장에는 기존 목표의 수정 사유가 포함되도록 자연스럽게 다듬어주세요.\r\n3.  전체적으로 기업이 합당한 이유로 기존 목표를 수정했음을 보여주는 톤앤매너를 유지해주세요.\r\n\r\n# 최종 결과물 스타일 예시\r\n"당사는 기존에 설정한 기후 관련 목표에서 {{answer_met-28}}."	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-h22	지표 및 목표	213	1	HEADING_4	(3) 목표 대비 성과 분석	null	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
met-t16	지표 및 목표	214	1	TABLE	목표 대비 성과	["met-21", "met-24", "met-26"]	\N	2025-07-02 03:56:23.892974+00	2025-07-02 03:56:23.892974+00
gen-p1	일반 현황	5	1	STATIC_PARAGRAPH	본 보고서는 2023년 6월 IFRS(International Financial Reporting Standards) 재단의 ISSB(International Sustainability Standards Board)에서 제정·공표한 IFRS S2 ‘기후 관련 공시’ 요구사항에 대해 선제적으로 지속가능경영 현황을 공유하고 이해관계자와의 소통을 제고하기 위한 보고서입니다.‘{{company_name}}’의 지속가능한 성장과 사회적 가치 창출을 위한 현재 또는 과거의 활동, 성과 외에도 미래에 대한 예측, 전망, 추정치에 관한 사항을 포함하고 있습니다. 미래와 관련된 사항들은 보고서 작성일을 기준으로 당사의 합리적 가정 및 예상, 기대에 기초한 것일 뿐이므로 알려지거나 알려지지 않은 위험과 불확실성을 수반하며, 예측, 전망, 추정치에 대한 실제 결과는 애초에 예측했던 것과는 상이할 수 있습니다.	["gen-1"]	\N	2025-07-03 00:50:37.205267+00	2025-07-03 00:50:37.205267+00
gen-p2	일반 현황	7	1	STATIC_PARAGRAPH	본 보고서는 '{{company_name}}' 기업과 '{{company_name}}'의 연결대상 종속기업에 대한 정보를 포함하고 있습니다.	["gen-1"]	\N	2025-07-03 00:50:37.205267+00	2025-07-03 00:50:37.205267+00
gen-p3	일반 현황	9	1	STATIC_PARAGRAPH	본 보고서의 보고 기간은 '{{start_date}}'부터 '{{end_date}}'까지입니다.	["gen-1"]	\N	2025-07-03 00:50:37.205267+00	2025-07-03 00:50:37.205267+00
cover-h2	표지	2	1	STATIC_PARAGRAPH	{{report_year}} {{company_name}} CLIMATE CHANGE REPORT	["gen-1"]	\N	2025-07-03 00:50:37.205267+00	2025-07-03 00:50:37.205267+00
\.


--
-- Name: climate_disclosure_concept_concept_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hc_user
--

SELECT pg_catalog.setval('public.climate_disclosure_concept_concept_id_seq', 7, true);


--
-- Name: heatwave_summary_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hc_user
--

SELECT pg_catalog.setval('public.heatwave_summary_id_seq', 1, false);


--
-- Name: issb_adoption_status_adoption_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hc_user
--

SELECT pg_catalog.setval('public.issb_adoption_status_adoption_id_seq', 22, true);


--
-- Name: issb_s2_term_term_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hc_user
--

SELECT pg_catalog.setval('public.issb_s2_term_term_id_seq', 23, true);


--
-- Name: answer answer_pkey; Type: CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT answer_pkey PRIMARY KEY (answer_id);


--
-- Name: climate_disclosure_concept climate_disclosure_concept_concept_name_key; Type: CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.climate_disclosure_concept
    ADD CONSTRAINT climate_disclosure_concept_concept_name_key UNIQUE (concept_name);


--
-- Name: climate_disclosure_concept climate_disclosure_concept_pkey; Type: CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.climate_disclosure_concept
    ADD CONSTRAINT climate_disclosure_concept_pkey PRIMARY KEY (concept_id);


--
-- Name: heatwave_summary heatwave_summary_pkey; Type: CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.heatwave_summary
    ADD CONSTRAINT heatwave_summary_pkey PRIMARY KEY (id);


--
-- Name: issb_adoption_status issb_adoption_status_country_key; Type: CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.issb_adoption_status
    ADD CONSTRAINT issb_adoption_status_country_key UNIQUE (country);


--
-- Name: issb_adoption_status issb_adoption_status_pkey; Type: CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.issb_adoption_status
    ADD CONSTRAINT issb_adoption_status_pkey PRIMARY KEY (adoption_id);


--
-- Name: issb_s2_disclosure issb_s2_disclosure_pkey; Type: CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.issb_s2_disclosure
    ADD CONSTRAINT issb_s2_disclosure_pkey PRIMARY KEY (disclosure_id);


--
-- Name: issb_s2_requirement issb_s2_requirement_pkey; Type: CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.issb_s2_requirement
    ADD CONSTRAINT issb_s2_requirement_pkey PRIMARY KEY (requirement_id);


--
-- Name: issb_s2_term issb_s2_term_pkey; Type: CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.issb_s2_term
    ADD CONSTRAINT issb_s2_term_pkey PRIMARY KEY (term_id);


--
-- Name: issb_s2_term issb_s2_term_term_ko_key; Type: CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.issb_s2_term
    ADD CONSTRAINT issb_s2_term_term_ko_key UNIQUE (term_ko);


--
-- Name: member member_email_key; Type: CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_email_key UNIQUE (email);


--
-- Name: member member_google_id_key; Type: CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_google_id_key UNIQUE (google_id);


--
-- Name: member member_pkey; Type: CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (user_id);


--
-- Name: report_template report_template_pkey; Type: CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.report_template
    ADD CONSTRAINT report_template_pkey PRIMARY KEY (report_content_id);


--
-- Name: answer uq_user_requirement; Type: CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT uq_user_requirement UNIQUE (user_id, requirement_id);


--
-- Name: idx_heatwave_composite; Type: INDEX; Schema: public; Owner: hc_user
--

CREATE INDEX idx_heatwave_composite ON public.heatwave_summary USING btree (scenario, region_name, year_period);


--
-- Name: idx_heatwave_period; Type: INDEX; Schema: public; Owner: hc_user
--

CREATE INDEX idx_heatwave_period ON public.heatwave_summary USING btree (year_period);


--
-- Name: idx_heatwave_region; Type: INDEX; Schema: public; Owner: hc_user
--

CREATE INDEX idx_heatwave_region ON public.heatwave_summary USING btree (region_name);


--
-- Name: idx_heatwave_scenario; Type: INDEX; Schema: public; Owner: hc_user
--

CREATE INDEX idx_heatwave_scenario ON public.heatwave_summary USING btree (scenario);


--
-- Name: idx_report_template_content_order; Type: INDEX; Schema: public; Owner: hc_user
--

CREATE INDEX idx_report_template_content_order ON public.report_template USING btree (content_order);


--
-- Name: idx_report_template_section_kr; Type: INDEX; Schema: public; Owner: hc_user
--

CREATE INDEX idx_report_template_section_kr ON public.report_template USING btree (section_kr);


--
-- Name: issb_s2_requirement fk_disclosure; Type: FK CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.issb_s2_requirement
    ADD CONSTRAINT fk_disclosure FOREIGN KEY (disclosure_id) REFERENCES public.issb_s2_disclosure(disclosure_id) ON DELETE SET NULL;


--
-- Name: answer fk_requirement; Type: FK CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT fk_requirement FOREIGN KEY (requirement_id) REFERENCES public.issb_s2_requirement(requirement_id) ON DELETE CASCADE;


--
-- Name: answer fk_user; Type: FK CONSTRAINT; Schema: public; Owner: hc_user
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.member(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


