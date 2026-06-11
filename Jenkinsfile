pipeline {
    agent any

    // ============================================================
    // ปรับค่าเหล่านี้ให้ตรงกับ server จริง
    // ============================================================
    environment {
        DEPLOY_ROOT       = 'D:\\ICS-Projects\\apps\\findig-service'
        BACKEND_DIR       = 'D:\\ICS-Projects\\apps\\findig-service\\realtime-service'
        FRONTEND_DIR      = 'D:\\ICS-Projects\\apps\\findig-service\\realtime-web'
        BACKEND_PM2_NAME  = 'realtime-service'
        FRONTEND_PM2_NAME = 'realtime-web'
        PM2_HOME          = 'C:\\ProgramData\\pm2'

        // ป้องกัน Puppeteer โหลด Chromium ระหว่าง npm ci (เร็วกว่า)
        PUPPETEER_SKIP_DOWNLOAD = 'true'
        // เพิ่ม heap สำหรับ React build
        NODE_OPTIONS = '--max-old-space-size=4096'
    }

    stages {

        // ──────────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
                bat 'git log -1 --oneline'
            }
        }

        // ──────────────────────────────────────────────────────
        stage('Install Dependencies') {
            parallel {
                stage('Backend: npm ci') {
                    steps {
                        dir('realtime-service') {
                            bat 'npm ci'
                        }
                    }
                }
                stage('Frontend: npm ci') {
                    steps {
                        dir('realtime-web') {
                            bat 'npm ci'
                        }
                    }
                }
            }
        }

        // ──────────────────────────────────────────────────────
        // REACT_APP_* ต้องตั้งค่าก่อน build (ถูก bake เข้า bundle)
        // ค่า REACT_APP_API_KEY เก็บใน Jenkins Credentials ชื่อ react-app-api-key
        stage('Build Frontend') {
            steps {
                dir('realtime-web') {
                    withCredentials([
                        string(credentialsId: 'react-app-api-key', variable: 'API_KEY')
                    ]) {
                        bat """
                            set REACT_APP_SERVICE_HOST=/api/realtime-service
                            set REACT_APP_API_USER=admin
                            set REACT_APP_API_KEY=%API_KEY%
                            npm run build
                        """
                    }
                }
            }
        }

        // ──────────────────────────────────────────────────────
        stage('Deploy') {
            parallel {

                stage('Deploy Backend') {
                    steps {
                        // สร้าง dir ถ้ายังไม่มี
                        bat "if not exist \"%BACKEND_DIR%\" mkdir \"%BACKEND_DIR%\""

                        // คัดลอก source ยกเว้น node_modules / logs / .env / ecosystem.config.js
                        // (ecosystem.config.js ที่ deploy มี credentials อยู่แล้ว ไม่ต้อง overwrite)
                        bat """
                            robocopy "%WORKSPACE%\\realtime-service" "%BACKEND_DIR%" ^
                              /E /COPY:DAT ^
                              /XD node_modules logs .git ^
                              /XF .env .env.local .env.prod .env.test ecosystem.config.js *.log ^
                              /NFL /NDL /NJH /NJS
                            if %ERRORLEVEL% LEQ 7 exit /b 0
                        """

                        // ติดตั้ง production deps ที่ deploy dir
                        dir("%BACKEND_DIR%") {
                            bat 'npm ci --omit=dev'
                        }
                    }
                }

                stage('Deploy Frontend') {
                    steps {
                        bat "if not exist \"%FRONTEND_DIR%\" mkdir \"%FRONTEND_DIR%\""
                        bat "if not exist \"%FRONTEND_DIR%\\build\" mkdir \"%FRONTEND_DIR%\\build\""
                        bat "if not exist \"%FRONTEND_DIR%\\server\" mkdir \"%FRONTEND_DIR%\\server\""

                        // คัดลอก React build output
                        bat """
                            robocopy "%WORKSPACE%\\realtime-web\\build" "%FRONTEND_DIR%\\build" ^
                              /E /COPY:DAT /NFL /NDL /NJH /NJS
                            if %ERRORLEVEL% LEQ 7 exit /b 0
                        """

                        // คัดลอก server files (server.js, server/, package*.json)
                        // ไม่คัดลอก src/ public/ node_modules/ .env* ecosystem.config.js
                        bat """
                            robocopy "%WORKSPACE%\\realtime-web" "%FRONTEND_DIR%" ^
                              server.js package.json package-lock.json ^
                              /COPY:DAT /NFL /NDL /NJH /NJS
                            if %ERRORLEVEL% LEQ 7 exit /b 0
                        """

                        bat """
                            robocopy "%WORKSPACE%\\realtime-web\\server" "%FRONTEND_DIR%\\server" ^
                              /E /COPY:DAT /NFL /NDL /NJH /NJS
                            if %ERRORLEVEL% LEQ 7 exit /b 0
                        """

                        // ติดตั้ง production deps ที่ deploy dir
                        dir("%FRONTEND_DIR%") {
                            bat 'npm ci --omit=dev'
                        }
                    }
                }
            }
        }

        // ──────────────────────────────────────────────────────
        stage('Restart Services') {
            steps {
                // pm2 restart ถ้ามีอยู่แล้ว ไม่งั้น pm2 start จาก ecosystem.config.js
                bat """
                    pm2 describe %BACKEND_PM2_NAME% >nul 2>&1
                    if %ERRORLEVEL% equ 0 (
                        pm2 restart %BACKEND_PM2_NAME%
                    ) else (
                        pm2 start "%BACKEND_DIR%\\ecosystem.config.js"
                    )
                """
                bat """
                    pm2 describe %FRONTEND_PM2_NAME% >nul 2>&1
                    if %ERRORLEVEL% equ 0 (
                        pm2 restart %FRONTEND_PM2_NAME%
                    ) else (
                        pm2 start "%FRONTEND_DIR%\\ecosystem.config.js"
                    )
                """

                bat 'pm2 save'
                bat 'pm2 list'
            }
        }

        // ──────────────────────────────────────────────────────
        stage('Health Check') {
            steps {
                // รอให้ service start แล้วตรวจสอบ
                bat 'ping -n 6 127.0.0.1 >nul'
                bat 'curl -sf http://127.0.0.1:9090/api/realtime-service/version || echo "Backend health check failed"'
                bat 'curl -sf http://127.0.0.1:3008/realtime-web || echo "Frontend health check failed"'
            }
        }
    }

    // ──────────────────────────────────────────────────────────
    post {
        success {
            echo '=============================='
            echo ' Deployment SUCCESS'
            echo '=============================='
            bat 'pm2 list'
        }
        failure {
            echo '=============================='
            echo ' Deployment FAILED'
            echo '=============================='
            bat 'pm2 list'
        }
        always {
            // ล้าง workspace เพื่อประหยัด disk (optional)
            // cleanWs()
        }
    }
}
