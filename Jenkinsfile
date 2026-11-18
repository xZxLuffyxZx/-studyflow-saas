
pipeline {
    agent any

    options {
        disableConcurrentBuilds()
    }

    stages {
        stage('Prepare Environment') {
            steps {
                withCredentials([
                    string(credentialsId: 'MYSQL_ROOT_PASSWORD',
                           variable: 'MYSQL_ROOT_PASSWORD'),
                    string(credentialsId: 'MYSQL_PASSWORD',
                           variable: 'MYSQL_PASSWORD')
                ]) {
                    sh '''
                        set +x
                        umask 077
                        cat > .env <<EOF
MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD
MYSQL_DATABASE=studyflow
MYSQL_USER=studyflow_luffy
MYSQL_PASSWORD=$MYSQL_PASSWORD
WEB_PORT=8081
PMA_PORT=8082
EOF
                    '''
                }
                sh 'docker compose config -q'
            }
        }

        stage('Build') {
            steps {
                sh 'docker compose build web'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    timeout 120 sh -c \
                    'until curl -fsS http://localhost:8081/api/tasks; do sleep 3; done'
                '''
                sh 'docker compose ps'
            }
        }
    }

    post {
        success {
            echo 'StudyFlow deployed successfully!'
        }
        failure {
            echo 'Deployment failed. Check the console output.'
        }
    }
}
