pipeline {
  agent any
  environment {
    COMPOSE_PROJECT_NAME = 'mern-deploy'
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Install & Build') {
      steps {
        sh 'docker compose build'
      }
    }
    stage('Test') {
      steps {
        sh 'docker compose run --rm server node --check server.js'
      }
    }
    stage('Deploy') {
      steps {
        sh 'docker compose up -d'
      }
    }
  }
  post {
    success { echo 'MERN Deploy Lab is live.' }
    failure { echo 'Pipeline failed. Check the stage logs.' }
  }
}
