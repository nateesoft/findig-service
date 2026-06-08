pipeline {
    agent any

    environment {
        DEPLOY_DIR = 'C:\\apps\\findig-service'
        PM2_HOME   = 'C:\\ProgramData\\pm2'
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

        stage('Stop PM2') {
            steps {
                bat 'pm2 stop realtime-service realtime-web 2>nul & exit 0'
                bat 'pm2 delete realtime-service realtime-web 2>nul & exit 0'
            }
        }

        stage('Deploy Backend') {
            steps {
                bat "if not exist %DEPLOY_DIR%\\realtime-service\\logs mkdir %DEPLOY_DIR%\\realtime-service\\logs"

                // robocopy exit codes 0-7 = success (8+ = error)
                bat "robocopy realtime-service\\src %DEPLOY_DIR%\\realtime-service\\src /E /PURGE & if %ERRORLEVEL% LEQ 7 exit 0"
                bat "robocopy realtime-service\\bin %DEPLOY_DIR%\\realtime-service\\bin /E /PURGE & if %ERRORLEVEL% LEQ 7 exit 0"
                bat "robocopy realtime-service\\public %DEPLOY_DIR%\\realtime-service\\public /E /PURGE & if %ERRORLEVEL% LEQ 7 exit 0"
                bat "robocopy realtime-service\\templates %DEPLOY_DIR%\\realtime-service\\templates /E /PURGE & if %ERRORLEVEL% LEQ 7 exit 0"
                bat "robocopy realtime-service\\scripts %DEPLOY_DIR%\\realtime-service\\scripts /E /PURGE & if %ERRORLEVEL% LEQ 7 exit 0"

                bat "copy /Y realtime-service\\package.json %DEPLOY_DIR%\\realtime-service\\package.json"
                bat "copy /Y realtime-service\\package-lock.json %DEPLOY_DIR%\\realtime-service\\package-lock.json"
                bat "copy /Y realtime-service\\ecosystem.config.js %DEPLOY_DIR%\\realtime-service\\ecosystem.config.js"

                bat "cd %DEPLOY_DIR%\\realtime-service && npm ci --omit=dev"
            }
        }

        stage('Deploy Frontend') {
            steps {
                bat "if not exist %DEPLOY_DIR%\\realtime-web mkdir %DEPLOY_DIR%\\realtime-web"

                bat "robocopy realtime-web\\build %DEPLOY_DIR%\\realtime-web\\build /E /PURGE & if %ERRORLEVEL% LEQ 7 exit 0"

                bat "copy /Y realtime-web\\server.js %DEPLOY_DIR%\\realtime-web\\server.js"
                bat "copy /Y realtime-web\\package.json %DEPLOY_DIR%\\realtime-web\\package.json"
                bat "copy /Y realtime-web\\package-lock.json %DEPLOY_DIR%\\realtime-web\\package-lock.json"
                bat "copy /Y realtime-web\\ecosystem.config.js %DEPLOY_DIR%\\realtime-web\\ecosystem.config.js"

                bat "cd %DEPLOY_DIR%\\realtime-web && npm ci --omit=dev"
            }
        }

        stage('Start PM2') {
            steps {
                bat "cd %DEPLOY_DIR%\\realtime-service && pm2 start ecosystem.config.js --env production"
                bat "cd %DEPLOY_DIR%\\realtime-web && pm2 start ecosystem.config.js"
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
