pipeline {
    agent any

    parameters {
        choice(name: 'ENV', choices: ['default', 'staging', 'production'], description: 'Target environment')
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Browser')
        string(name: 'MARKERS', defaultValue: '', description: 'Pytest markers (e.g. smoke)')
    }

    environment {
        ENV      = "${params.ENV}"
        BROWSER  = "${params.BROWSER}"
        HEADLESS = 'true'
    }

    stages {
        stage('Setup') {
            steps {
                sh '''
                    python3 -m pip install --upgrade pip
                    pip3 install -r requirements.txt
                    python3 -m playwright install --with-deps chromium
                '''
            }
        }

        stage('API Tests') {
            steps {
                sh '''
                    pytest tests/api -m "api" \
                        --tb=short \
                        --html=reports/api_report.html --self-contained-html \
                        --junitxml=reports/api_results.xml \
                        -v
                '''
            }
        }

        stage('UI Tests') {
            steps {
                script {
                    def markerFlag = params.MARKERS ? "-m ${params.MARKERS}" : ""
                    sh """
                        pytest tests/ui ${markerFlag} \
                            --tb=short \
                            --html=reports/ui_report.html --self-contained-html \
                            --junitxml=reports/ui_results.xml \
                            -v
                    """
                }
            }
        }
    }

    post {
        always {
            junit 'reports/*_results.xml'
            publishHTML(target: [
                reportDir: 'reports',
                reportFiles: 'ui_report.html,api_report.html',
                reportName: 'Test Reports'
            ])
            archiveArtifacts artifacts: 'screenshots/**/*.png', allowEmptyArchive: true
            archiveArtifacts artifacts: 'logs/**/*.log', allowEmptyArchive: true
        }
        failure {
            echo 'Tests failed — check reports and screenshots.'
        }
        cleanup {
            cleanWs()
        }
    }
}
