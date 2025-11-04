


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


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."complete_mission"("p_user_id" character varying, "p_mission_id" character varying, "p_custom_data" "jsonb" DEFAULT NULL::"jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    mission_data JSONB;
    mission_rewards JSONB;
    mission_xp INTEGER;
BEGIN
    -- Obtener datos de la misión
    SELECT mission_data, rewards, xp_reward 
    INTO mission_data, mission_rewards, mission_xp
    FROM missions WHERE id = p_mission_id;
    
    -- Actualizar progreso del usuario
    UPDATE user_progress 
    SET 
        completed_missions = completed_missions || jsonb_build_object(p_mission_id, NOW()),
        total_xp = total_xp + mission_xp,
        game_state = 
            CASE 
                WHEN mission_rewards ? 'resources' THEN
                    COALESCE(game_state, '{}') || jsonb_build_object(
                        'resources', 
                        COALESCE(game_state->'resources', '{}') || mission_rewards->'resources'
                    )
                WHEN p_custom_data IS NOT NULL THEN
                    COALESCE(game_state, '{}') || p_custom_data
                ELSE COALESCE(game_state, '{}')
            END,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Recalcular nivel
    UPDATE user_progress 
    SET level = (total_xp / 500) + 1
    WHERE user_id = p_user_id;
END;
$$;


ALTER FUNCTION "public"."complete_mission"("p_user_id" character varying, "p_mission_id" character varying, "p_custom_data" "jsonb") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."achievements" (
    "id" character varying NOT NULL,
    "title" character varying NOT NULL,
    "description" "text",
    "xp_reward" integer DEFAULT 50,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."achievements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_progress" (
    "user_id" character varying NOT NULL,
    "level" integer DEFAULT 1,
    "total_xp" integer DEFAULT 0,
    "game_state" "jsonb" DEFAULT '{}'::"jsonb",
    "completed_missions" "jsonb" DEFAULT '{}'::"jsonb",
    "unlocked_achievements" "jsonb" DEFAULT '[]'::"jsonb",
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" character varying NOT NULL,
    "email" character varying NOT NULL,
    "username" character varying,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."leaderboard" WITH ("security_invoker"='on') AS
 SELECT "u"."username",
    "up"."level",
    "up"."total_xp",
    ("up"."total_xp" + ("up"."level" * 100)) AS "leaderboard_score"
   FROM ("public"."user_progress" "up"
     JOIN "public"."users" "u" ON ((("u"."id")::"text" = ("up"."user_id")::"text")))
  ORDER BY ("up"."total_xp" + ("up"."level" * 100)) DESC;


ALTER VIEW "public"."leaderboard" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."missions" (
    "id" character varying NOT NULL,
    "title" character varying NOT NULL,
    "description" "text",
    "mission_type" character varying,
    "region" character varying,
    "difficulty" character varying DEFAULT 'easy'::character varying,
    "xp_reward" integer DEFAULT 100,
    "rewards" "jsonb" DEFAULT '{"xp": 100}'::"jsonb",
    "mission_data" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "missions_difficulty_check" CHECK ((("difficulty")::"text" = ANY ((ARRAY['easy'::character varying, 'medium'::character varying, 'hard'::character varying])::"text"[]))),
    CONSTRAINT "missions_mission_type_check" CHECK ((("mission_type")::"text" = ANY ((ARRAY['quiz'::character varying, 'puzzle'::character varying, 'drag_drop'::character varying, 'exploration'::character varying, 'memory'::character varying, 'timeline'::character varying])::"text"[])))
);


ALTER TABLE "public"."missions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."missions"
    ADD CONSTRAINT "missions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



CREATE INDEX "idx_missions_region" ON "public"."missions" USING "btree" ("region");



CREATE INDEX "idx_missions_type" ON "public"."missions" USING "btree" ("mission_type");



CREATE INDEX "idx_user_progress_level" ON "public"."user_progress" USING "btree" ("level" DESC);



CREATE INDEX "idx_user_progress_xp" ON "public"."user_progress" USING "btree" ("total_xp" DESC);



ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Anyone can view achievements" ON "public"."achievements" FOR SELECT USING (true);



CREATE POLICY "Anyone can view leaderboard" ON "public"."user_progress" FOR SELECT USING (true);



CREATE POLICY "Anyone can view missions" ON "public"."missions" FOR SELECT USING (true);



CREATE POLICY "Users can insert own profile" ON "public"."users" FOR INSERT WITH CHECK ((("id")::"text" = ("auth"."jwt"() ->> 'sub'::"text")));



CREATE POLICY "Users can insert own progress" ON "public"."user_progress" FOR INSERT WITH CHECK ((("user_id")::"text" = ("auth"."jwt"() ->> 'sub'::"text")));



CREATE POLICY "Users can update own progress" ON "public"."user_progress" FOR UPDATE USING ((("user_id")::"text" = ("auth"."jwt"() ->> 'sub'::"text")));



CREATE POLICY "Users can view own profile" ON "public"."users" FOR SELECT USING ((("id")::"text" = ("auth"."jwt"() ->> 'sub'::"text")));



CREATE POLICY "Users can view own progress" ON "public"."user_progress" FOR SELECT USING ((("user_id")::"text" = ("auth"."jwt"() ->> 'sub'::"text")));



ALTER TABLE "public"."achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."missions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."complete_mission"("p_user_id" character varying, "p_mission_id" character varying, "p_custom_data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."complete_mission"("p_user_id" character varying, "p_mission_id" character varying, "p_custom_data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."complete_mission"("p_user_id" character varying, "p_mission_id" character varying, "p_custom_data" "jsonb") TO "service_role";


















GRANT ALL ON TABLE "public"."achievements" TO "anon";
GRANT ALL ON TABLE "public"."achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."achievements" TO "service_role";



GRANT ALL ON TABLE "public"."user_progress" TO "anon";
GRANT ALL ON TABLE "public"."user_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."user_progress" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."leaderboard" TO "anon";
GRANT ALL ON TABLE "public"."leaderboard" TO "authenticated";
GRANT ALL ON TABLE "public"."leaderboard" TO "service_role";



GRANT ALL ON TABLE "public"."missions" TO "anon";
GRANT ALL ON TABLE "public"."missions" TO "authenticated";
GRANT ALL ON TABLE "public"."missions" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";

alter table "public"."missions" drop constraint "missions_difficulty_check";

alter table "public"."missions" drop constraint "missions_mission_type_check";

alter table "public"."missions" add constraint "missions_difficulty_check" CHECK (((difficulty)::text = ANY ((ARRAY['easy'::character varying, 'medium'::character varying, 'hard'::character varying])::text[]))) not valid;

alter table "public"."missions" validate constraint "missions_difficulty_check";

alter table "public"."missions" add constraint "missions_mission_type_check" CHECK (((mission_type)::text = ANY ((ARRAY['quiz'::character varying, 'puzzle'::character varying, 'drag_drop'::character varying, 'exploration'::character varying, 'memory'::character varying, 'timeline'::character varying])::text[]))) not valid;

alter table "public"."missions" validate constraint "missions_mission_type_check";


