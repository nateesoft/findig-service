pipeline {
    agent any

    parameters {
        choice(
            name: 'DEPLOY_TARGET',
            choices: ['ALL', 'SERVICE_ONLY', 'WEB_ONLY'],
            description: 'เลือก service ที่ต้องการ deploy'
        )
        string(
            name: 'DEPLOY_PATH',
            defaultValue: 'D:\\ICS-Projects\\apps\\findig-service',
            description: 'Deploy path บน Windows server'
        )

        // ─── realtime-service ────────────────────────────────────────────────
        separator(name: 'SERVICE_SECTION', sectionHeader: 'realtime-service Config')

        string(name: 'DB_POS_NAME',       defaultValue: 'MyRetail652findigColo',                  description: 'POS database name')

        // ─── realtime-web ─────────────────────────────────────────────────────
        separator(name: 'WEB_SECTION', sectionHeader: 'realtime-web Config')

        string(name: 'WEB_PORT',          defaultValue: '3008',                    description: 'Frontend port')
    }

    environment {
        SERVICE_DIR = 'realtime-service'
        WEB_DIR     = 'realtime-web'
        NODE_ENV    = 'production'
    }

    options {
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
                dir("${SERVICE_DIR}") {
                    // validate package-lock.json integrity only (node_modules excluded from sync)
                    bat 'npm ci --omit=dev'
                }
            }
        }

        stage('Sync: realtime-service') {
            when {
                expression { params.DEPLOY_TARGET in ['ALL', 'SERVICE_ONLY'] }
            }
            steps {
                script {
                    def src = "${env.WORKSPACE}\\${SERVICE_DIR}"
                    def dst = "${params.DEPLOY_PATH}\\${SERVICE_DIR}"
                    bat """
                        if not exist "${dst}" mkdir "${dst}"
                        robocopy "${src}" "${dst}" /MIR /XD node_modules .git /XF .env* /NFL /NDL /NJH /NJS
                        if %errorlevel% leq 7 exit /b 0
                    """
                }
            }
        }

        stage('Install Prod Deps: realtime-service') {
            when {
                expression { params.DEPLOY_TARGET in ['ALL', 'SERVICE_ONLY'] }
            }
            steps {
                script {
                    def dst = "${params.DEPLOY_PATH}\\${SERVICE_DIR}"
                    bat """
                        cd /d "${dst}"
                        npm ci --omit=dev
                    """
                }
            }
        }

        stage('Config: realtime-service') {
            when {
                expression { params.DEPLOY_TARGET in ['ALL', 'SERVICE_ONLY'] }
            }
            steps {
                script {
                    def dst = "${params.DEPLOY_PATH}\\${SERVICE_DIR}"
                    def cfg = """\
module.exports = {
  apps: [
    {
      name: 'realtime-service',
      script: 'bin/www',
      env: {
        PORT: 9090,
        NODE_ENV: 'production',
        APP_PREFIX: 'realtime-service',
        dbConfig: 'PRODUCTION',
        WEB_USER_AUTH: 'admin',
        WEB_USER_PASS: 'supersecret',
        API_SECRET_PASS: 'XkhZG4fW2t2W',
        DB_HOST: '183.88.210.11',
        DB_PORT: '3326',
        DB_USER: 'root',
        DB_PASS: 'P@ssword!#',
        DB_DRIVER: 'mysql',
        DB_APP_NAME: 'Stock Realtime',
        DB_POS_NAME: '${params.DB_POS_NAME}',
        DB_CRM_NAME: 'MyCrmBranch',
        DB_BOR_NAME: 'MyBorLocal',
        MYSQLDUMP_PATH: 'D:\\MySQL5\\bin',
      }
    }
  ]
}
"""
                    writeFile file: "${dst}\\ecosystem.config.js", text: cfg
                    echo "ecosystem.config.js written to ${dst}"
                }
            }
        }

        stage('Deploy: realtime-service') {
            when {
                expression { params.DEPLOY_TARGET in ['ALL', 'SERVICE_ONLY'] }
            }
            steps {
                script {
                    def dst = "${params.DEPLOY_PATH}\\${SERVICE_DIR}"
                    bat """
                        cd /d "${dst}"
                        pm2 startOrRestart ecosystem.config.js --update-env --only realtime-service
                        pm2 save
                    """
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
                dir("${WEB_DIR}") {
                    bat 'npm ci'
                }
            }
        }

        stage('Build: realtime-web') {
            when {
                expression { params.DEPLOY_TARGET in ['ALL', 'WEB_ONLY'] }
            }
            steps {
                dir("${WEB_DIR}") {
                    bat 'npm run build'
                }
            }
        }

        stage('Sync: realtime-web') {
            when {
                expression { params.DEPLOY_TARGET in ['ALL', 'WEB_ONLY'] }
            }
            steps {
                script {
                    def src = "${env.WORKSPACE}\\${WEB_DIR}"
                    def dst = "${params.DEPLOY_PATH}\\${WEB_DIR}"
                    bat """
                        if not exist "${dst}" mkdir "${dst}"

                        rem --- sync React build output ---
                        robocopy "${src}\\build" "${dst}\\build" /MIR /NFL /NDL /NJH /NJS
                        if %errorlevel% leq 7 (set ERR=0) else (exit /b %errorlevel%)

                        rem --- sync root files (server.js, package*.json) ---
                        robocopy "${src}" "${dst}" server.js package.json package-lock.json /NFL /NDL /NJH /NJS
                        if %errorlevel% leq 7 exit /b 0
                    """
                }
            }
        }

        stage('Install Prod Deps: realtime-web') {
            when {
                expression { params.DEPLOY_TARGET in ['ALL', 'WEB_ONLY'] }
            }
            steps {
                script {
                    def dst = "${params.DEPLOY_PATH}\\${WEB_DIR}"
                    bat """
                        cd /d "${dst}"
                        npm ci --omit=dev
                    """
                }
            }
        }

        stage('Config: realtime-web') {
            when {
                expression { params.DEPLOY_TARGET in ['ALL', 'WEB_ONLY'] }
            }
            steps {
                script {
                    def dst = "${params.DEPLOY_PATH}\\${WEB_DIR}"
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
        BACKEND_PREFIX: 'realtime-service',
        BACKEND_HOST: 'http://127.0.0.1:9090',
      }
    }
  ]
}
"""
                    writeFile file: "${dst}\\ecosystem.config.js", text: cfg
                    echo "ecosystem.config.js written to ${dst}"
                }
            }
        }

        stage('Deploy: realtime-web') {
            when {
                expression { params.DEPLOY_TARGET in ['ALL', 'WEB_ONLY'] }
            }
            steps {
                script {
                    def dst = "${params.DEPLOY_PATH}\\${WEB_DIR}"
                    bat """
                        cd /d "${dst}"
                        pm2 startOrRestart ecosystem.config.js --update-env --only realtime-web
                        pm2 save
                    """
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
