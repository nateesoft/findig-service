pipeline {
    agent { label 'windows' }

    parameters {
        choice(
            name: 'DEPLOY_TARGET',
            choices: ['ALL', 'SERVICE_ONLY', 'WEB_ONLY'],
            description: 'เลือก service ที่ต้องการ deploy'
        )

        // ─── realtime-service ────────────────────────────────────────────────
        separator(name: 'SERVICE_SECTION', sectionHeader: 'realtime-service Config')

        string(name: 'SERVICE_PORT',      defaultValue: '9090',              description: 'Backend port')
        string(name: 'APP_PREFIX',        defaultValue: 'realtime-service',  description: 'App prefix')
        string(name: 'DB_APP_NAME',       defaultValue: 'Stock Realtime',    description: 'Application display name')
        string(name: 'DB_HOST',           defaultValue: '',                  description: 'Database host')
        string(name: 'DB_PORT',           defaultValue: '3306',              description: 'Database port')
        string(name: 'DB_USER',           defaultValue: 'root',              description: 'Database user')
        password(name: 'DB_PASS',         defaultValue: '',                  description: 'Database password')
        string(name: 'DB_POS_NAME',       defaultValue: '',                  description: 'POS database name')
        string(name: 'DB_CRM_NAME',       defaultValue: '',                  description: 'CRM database name')
        string(name: 'DB_BOR_NAME',       defaultValue: '',                  description: 'BOR database name')
        string(name: 'MYSQLDUMP_PATH',    defaultValue: 'D:\\MySQL5\\bin',   description: 'Path to mysqldump binary')
        string(name: 'WEB_USER_AUTH',     defaultValue: 'admin',             description: 'Web UI username')
        password(name: 'WEB_USER_PASS',   defaultValue: '',                  description: 'Web UI password')
        password(name: 'API_SECRET_PASS', defaultValue: '',                  description: 'API secret key')

        // ─── realtime-web ─────────────────────────────────────────────────────
        separator(name: 'WEB_SECTION', sectionHeader: 'realtime-web Config')

        string(name: 'WEB_PORT',          defaultValue: '3008',                    description: 'Frontend port')
        string(name: 'BACKEND_HOST',      defaultValue: 'http://127.0.0.1:9090',  description: 'Backend URL สำหรับ proxy')
        string(name: 'BACKEND_PREFIX',    defaultValue: 'realtime-service',        description: 'Backend prefix')
    }

    environment {
        SERVICE_DIR = 'realtime-service'
        WEB_DIR     = 'realtime-web'
        NODE_ENV    = 'production'
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                bat 'git log -1 --oneline'
            }
        }

        // ══════════════════════════════════════════════════════════════════════
        // realtime-service
        // ══════════════════════════════════════════════════════════════════════
        stage('Install: realtime-service') {
            when {
                expression { params.DEPLOY_TARGET in ['ALL', 'SERVICE_ONLY'] }
            }
            steps {
                dir(SERVICE_DIR) {
                    bat 'npm ci --omit=dev'
                }
            }
        }

        stage('Config: realtime-service') {
            when {
                expression { params.DEPLOY_TARGET in ['ALL', 'SERVICE_ONLY'] }
            }
            steps {
                dir(SERVICE_DIR) {
                    script {
                        def cfg = """\
module.exports = {
  apps: [
    {
      name: 'realtime-service',
      script: 'bin/www',
      env: {
        PORT: ${params.SERVICE_PORT},
        NODE_ENV: 'production',
        APP_PREFIX: '${params.APP_PREFIX}',
        dbConfig: 'PRODUCTION',
        WEB_USER_AUTH: '${params.WEB_USER_AUTH}',
        WEB_USER_PASS: '${params.WEB_USER_PASS}',
        API_SECRET_PASS: '${params.API_SECRET_PASS}',
        DB_HOST: '${params.DB_HOST}',
        DB_PORT: '${params.DB_PORT}',
        DB_USER: '${params.DB_USER}',
        DB_PASS: '${params.DB_PASS}',
        DB_DRIVER: 'mysql',
        DB_APP_NAME: '${params.DB_APP_NAME}',
        DB_POS_NAME: '${params.DB_POS_NAME}',
        DB_CRM_NAME: '${params.DB_CRM_NAME}',
        DB_BOR_NAME: '${params.DB_BOR_NAME}',
        MYSQLDUMP_PATH: '${params.MYSQLDUMP_PATH.replace('\\', '\\\\')}',
      }
    }
  ]
}
"""
                        writeFile file: 'ecosystem.config.js', text: cfg
                        echo 'ecosystem.config.js (realtime-service) updated'
                    }
                }
            }
        }

        stage('Deploy: realtime-service') {
            when {
                expression { params.DEPLOY_TARGET in ['ALL', 'SERVICE_ONLY'] }
            }
            steps {
                dir(SERVICE_DIR) {
                    bat '''
                        pm2 describe realtime-service >nul 2>&1
                        if %errorlevel% equ 0 (
                            pm2 reload ecosystem.config.js --only realtime-service
                        ) else (
                            pm2 start ecosystem.config.js --only realtime-service
                        )
                        pm2 save
                    '''
                }
            }
        }

        // ══════════════════════════════════════════════════════════════════════
        // realtime-web
        // ══════════════════════════════════════════════════════════════════════
        stage('Install: realtime-web') {
            when {
                expression { params.DEPLOY_TARGET in ['ALL', 'WEB_ONLY'] }
            }
            steps {
                dir(WEB_DIR) {
                    bat 'npm ci'
                }
            }
        }

        stage('Build: realtime-web') {
            when {
                expression { params.DEPLOY_TARGET in ['ALL', 'WEB_ONLY'] }
            }
            steps {
                dir(WEB_DIR) {
                    bat 'npm run build'
                }
            }
        }

        stage('Config: realtime-web') {
            when {
                expression { params.DEPLOY_TARGET in ['ALL', 'WEB_ONLY'] }
            }
            steps {
                dir(WEB_DIR) {
                    script {
                        def cfg = """\
module.exports = {
  apps: [
    {
      name: 'realtime-web',
      script: 'server.js',
      env: {
        PORT: ${params.WEB_PORT},
        NODE_ENV: 'production',
        APP_PREFIX: 'realtime-web',
        BACKEND_PREFIX: '${params.BACKEND_PREFIX}',
        BACKEND_HOST: '${params.BACKEND_HOST}',
      }
    }
  ]
}
"""
                        writeFile file: 'ecosystem.config.js', text: cfg
                        echo 'ecosystem.config.js (realtime-web) updated'
                    }
                }
            }
        }

        stage('Deploy: realtime-web') {
            when {
                expression { params.DEPLOY_TARGET in ['ALL', 'WEB_ONLY'] }
            }
            steps {
                dir(WEB_DIR) {
                    bat '''
                        pm2 describe realtime-web >nul 2>&1
                        if %errorlevel% equ 0 (
                            pm2 reload ecosystem.config.js --only realtime-web
                        ) else (
                            pm2 start ecosystem.config.js --only realtime-web
                        )
                        pm2 save
                    '''
                }
            }
        }

    }

    post {
        always {
            bat 'pm2 status'
        }
        success {
            echo "Deploy สำเร็จ: ${params.DEPLOY_TARGET}"
        }
        failure {
            echo "Deploy ล้มเหลว — ดู log ด้านบน"
        }
    }
}
