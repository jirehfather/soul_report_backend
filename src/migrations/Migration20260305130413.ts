import { Migration } from '@mikro-orm/migrations';

export class Migration20260305130413 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      -- ==========================================
      -- 1. 사전 정의: ENUM 타입 및 공통 함수
      -- ==========================================

      -- 권한 및 유저 상태 정의
      CREATE TYPE user_role AS ENUM ('ADMIN', 'MEMBER');
      CREATE TYPE user_status AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

      -- updated_at 자동 갱신을 위한 함수 (ORM 누락 대비 안전장치)
      CREATE OR REPLACE FUNCTION update_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;


      -- ==========================================
      -- 2. 테이블 생성 (정규화 및 관계 설정)
      -- ==========================================

      -- [Churches] 교회 마스터 정보
      CREATE TABLE churches (
          id UUID PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          address TEXT,
          phone_number VARCHAR(20),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL
      );

      -- [Users] 계정 및 인증 핵심 정보
      CREATE TABLE users (
          id UUID PRIMARY KEY,
          church_id UUID NOT NULL REFERENCES churches(id) ON DELETE RESTRICT,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role user_role NOT NULL DEFAULT 'MEMBER',
          status user_status NOT NULL DEFAULT 'ACTIVE',
          created_at TIMESTAMP WITH TIME ZONE NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL
      );

      -- [User_Profiles] 유저 부가 정보 (1:1 관계)
      CREATE TABLE user_profiles (
          user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          nickname VARCHAR(50),
          avatar_url TEXT,
          bio TEXT, -- 자기소개/상태메시지
          phone_number VARCHAR(20),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL
      );

      -- [Sessions] 인증 세션 관리
      CREATE TABLE sessions (
          id UUID PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          session_token TEXT UNIQUE NOT NULL,
          user_agent TEXT,
          ip_address VARCHAR(45),
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL
      );


      -- ==========================================
      -- 3. 성능 최적화를 위한 인덱스 설정
      -- ==========================================

      CREATE INDEX idx_users_church_id ON users(church_id);
      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);


      -- ==========================================
      -- 4. 데이터 무결성을 위한 트리거 설정
      -- ==========================================

      CREATE TRIGGER tr_update_churches_at 
          BEFORE UPDATE ON churches 
          FOR EACH ROW EXECUTE FUNCTION update_timestamp();

      CREATE TRIGGER tr_update_users_at 
          BEFORE UPDATE ON users 
          FOR EACH ROW EXECUTE FUNCTION update_timestamp();

      CREATE TRIGGER tr_update_profiles_at 
          BEFORE UPDATE ON user_profiles 
          FOR EACH ROW EXECUTE FUNCTION update_timestamp();`);
  }

  override async down(): Promise<void> {
    this.addSql(`
      -- 롤백 시 테이블 삭제 (생성 역순)
      DROP TABLE IF EXISTS sessions;
      DROP TABLE IF EXISTS user_profiles;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS churches;

      -- ENUM 타입 삭제
      DROP TYPE IF EXISTS user_status;
      DROP TYPE IF EXISTS user_role;

      -- 트리거 및 함수 삭제
      DROP FUNCTION IF EXISTS update_timestamp();`);
  }
}
