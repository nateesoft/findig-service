pipeline {
    agent any

    parameters {
        string(name: 'DB_HOST',           defaultValue: '183.88.210.11',        description: 'Database host')
        string(name: 'DB_USER',           defaultValue: 'root',                 description: 'Database user')
        string(name: 'DB_POS_NAME',       defaultValue: 'MyRetail652findigColo', description: 'POS database name')
        string(name: 'DB_CRM_NAME',       defaultValue: 'MyCrmBranch',          description: 'CRM database name')
        string(name: 'DB_BOR_NAME',       defaultValue: 'MyBorLocal',           description: 'BOR database name')
        string(name: 'FRONTEND_APP_NAME', defaultValue: 'realtime-web',         description: 'PM2 app name for frontend')
        string(name: 'FRONTEND_PORT',     defaultValue: '3008',                 description: 'Port for frontend server')
        string(name: 'FRONTEND_PREFIX',   defaultValue: 'realtime-web',         description: 'URL prefix for frontend service')
    }

    environment {
        DEPLOY_DIR = 'D:\\apps\\findig-service'
        PM2_HOME   = 'C:\\ProgramData\\pm2'

        // ---- App config (เปลี่ยน prefix / port ได้จากที่นี่ที่เดียว) ----
        BACKEND_APP_NAME  = 'realtime-service'
        FRONTEND_APP_NAME = "${params.FRONTEND_APP_NAME}"

        BACKEND_PORT      = '9090'
        FRONTEND_PORT     = "${params.FRONTEND_PORT}"

        // URL prefix ที่ใช้ serve แต่ละ service  (http://host/<prefix>/...)
        BACKEND_PREFIX    = 'realtime-service'
        FRONTEND_PREFIX   = "${params.FRONTEND_PREFIX}"
        REACT_APP_BASENAME = "/${params.FRONTEND_PREFIX}"

        BACKEND_HOST      = 'http://127.0.0.1:9090'

        // ---- Database config — ใช้ Jenkins credentials แทน plaintext ถ้าเป็นไปได้ ----
        // credentials('id') → สร้าง secret text ใน Jenkins แล้วใส่ ID ที่นี่
        DB_CONFIG   = 'PRODUCTION'
        DB_HOST     = "${params.DB_HOST}"
        DB_PORT     = '3326'
        DB_USER     = "${params.DB_USER}"
        DB_PASS     = credentials('DB_PASS')
        DB_DRIVER   = 'mysql'
        DB_POS_NAME = "${params.DB_POS_NAME}"
        DB_CRM_NAME = "${params.DB_CRM_NAME}"
        DB_BOR_NAME = "${params.DB_BOR_NAME}"
        // ----------------------------------------------------------------
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('realtime-service') {
                    bat 'npm ci'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('realtime-web') {
                    bat 'npm ci'
                    bat 'npm run build:windows'
                }
            }
        }

        // Generate ecosystem configs from pipeline vars — ไม่ copy จาก repo
        stage('Generate Ecosystem Configs') {
            steps {
                script {
                    writeFile file: 'ecosystem-backend.config.js', text: """\
module.exports = {
  apps: [
    {
      name: '${env.BACKEND_APP_NAME}',
      script: 'bin/www',
      env: {
        PORT: ${env.BACKEND_PORT},
        APP_PREFIX: '${env.BACKEND_PREFIX}',
        NODE_ENV: 'production',
        dbConfig: '${env.DB_CONFIG}',
        DB_HOST: '${env.DB_HOST}',
        DB_PORT: '${env.DB_PORT}',
        DB_USER: '${env.DB_USER}',
        DB_PASS: '${env.DB_PASS}',
        DB_DRIVER: '${env.DB_DRIVER}',
        DB_POS_NAME: '${env.DB_POS_NAME}',
        DB_CRM_NAME: '${env.DB_CRM_NAME}',
        DB_BOR_NAME: '${env.DB_BOR_NAME}'
      }
    }
  ]
}
"""
                    writeFile file: 'ecosystem-frontend.config.js', text: """\
module.exports = {
  apps: [
    {
      name: '${env.FRONTEND_APP_NAME}',
      script: 'server.js',
      env: {
        PORT: ${env.FRONTEND_PORT},
        APP_PREFIX: '${env.FRONTEND_PREFIX}',
        BACKEND_PREFIX: '${env.BACKEND_PREFIX}',
        BACKEND_HOST: '${env.BACKEND_HOST}'
      }
    }
  ]
}
"""
                }
            }
        }

        stage('Stop PM2') {
            steps {
                bat "pm2 stop %BACKEND_APP_NAME% %FRONTEND_APP_NAME% 2>nul & exit 0"
                bat "pm2 delete %BACKEND_APP_NAME% %FRONTEND_APP_NAME% 2>nul & exit 0"
            }
        }

        stage('Deploy Backend') {
            steps {
                bat "if not exist %DEPLOY_DIR%\\%BACKEND_APP_NAME%\\logs mkdir %DEPLOY_DIR%\\%BACKEND_APP_NAME%\\logs"

                // robocopy exit codes 0-7 = success (8+ = error)
                bat "robocopy realtime-service\\src %DEPLOY_DIR%\\%BACKEND_APP_NAME%\\src /E /PURGE & if %ERRORLEVEL% LEQ 7 exit 0"
                bat "robocopy realtime-service\\bin %DEPLOY_DIR%\\%BACKEND_APP_NAME%\\bin /E /PURGE & if %ERRORLEVEL% LEQ 7 exit 0"
                bat "robocopy realtime-service\\public %DEPLOY_DIR%\\%BACKEND_APP_NAME%\\public /E /PURGE & if %ERRORLEVEL% LEQ 7 exit 0"
                bat "robocopy realtime-service\\templates %DEPLOY_DIR%\\%BACKEND_APP_NAME%\\templates /E /PURGE & if %ERRORLEVEL% LEQ 7 exit 0"
                bat "robocopy realtime-service\\scripts %DEPLOY_DIR%\\%BACKEND_APP_NAME%\\scripts /E /PURGE & if %ERRORLEVEL% LEQ 7 exit 0"

                bat "copy /Y realtime-service\\package.json %DEPLOY_DIR%\\%BACKEND_APP_NAME%\\package.json"
                bat "copy /Y realtime-service\\package-lock.json %DEPLOY_DIR%\\%BACKEND_APP_NAME%\\package-lock.json"
                bat "copy /Y ecosystem-backend.config.js %DEPLOY_DIR%\\%BACKEND_APP_NAME%\\ecosystem.config.js"

                bat "cd /D %DEPLOY_DIR%\\%BACKEND_APP_NAME% && npm ci --omit=dev"
            }
        }

        stage('Deploy Frontend') {
            steps {
                bat "if not exist %DEPLOY_DIR%\\%FRONTEND_APP_NAME% mkdir %DEPLOY_DIR%\\%FRONTEND_APP_NAME%"

                bat "robocopy realtime-web\\build %DEPLOY_DIR%\\%FRONTEND_APP_NAME%\\build /E /PURGE & if %ERRORLEVEL% LEQ 7 exit 0"

                bat "copy /Y realtime-web\\server.js %DEPLOY_DIR%\\%FRONTEND_APP_NAME%\\server.js"
                bat "copy /Y realtime-web\\package.json %DEPLOY_DIR%\\%FRONTEND_APP_NAME%\\package.json"
                bat "copy /Y realtime-web\\package-lock.json %DEPLOY_DIR%\\%FRONTEND_APP_NAME%\\package-lock.json"
                bat "copy /Y ecosystem-frontend.config.js %DEPLOY_DIR%\\%FRONTEND_APP_NAME%\\ecosystem.config.js"

                bat "cd /D %DEPLOY_DIR%\\%FRONTEND_APP_NAME% && npm ci --omit=dev"
            }
        }

        stage('Start PM2') {
            steps {
                bat "cd /D %DEPLOY_DIR%\\%BACKEND_APP_NAME% && pm2 start ecosystem.config.js"
                bat "cd /D %DEPLOY_DIR%\\%FRONTEND_APP_NAME% && pm2 start ecosystem.config.js"
                bat 'pm2 save'
            }
        }
    }

    post {
        success {
            bat 'pm2 list'
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed — check the logs above.'
        }
    }
}
