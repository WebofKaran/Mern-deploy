pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Backend') {
            steps {
                dir('server') {
                    sh 'npm install'
                    sh 'node --check server.js'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('client') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                sh '''
                    rm -rf /opt/mern-deploy/server/*
                    cp -a server/. /opt/mern-deploy/server/
                '''
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                    rm -rf /var/www/mern-deploy/*
                    cp -a client/dist/. /var/www/mern-deploy/
                '''
            }
        }

        stage('Restart Backend') {
            steps {
                sh 'sudo systemctl restart mern-deploy'
                sh 'sudo systemctl is-active --quiet mern-deploy'
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    sleep 3
                    curl --fail http://127.0.0.1:5000/api/health
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully.'
        }
        failure {
            echo 'Deployment failed. Check the Jenkins console output.'
        }
    }
}
