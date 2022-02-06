import sonarqubeScanner from "sonarqube-scanner";
import "dotenv/config";

sonarqubeScanner(
  {
    serverUrl: process.env.SONAR_SERVER_URL,
    options: {
      "sonar.projectKey": process.env.SONAR_PROJECT_KEY,
      "sonar.sources": "src",
      "sonar.inclusions": "src/**",
      "sonar.exclusions":
        "**/node_modules/**,**public**, src/infra/database/typeorm/migrations/**",
      "sonar.test.inclusions":
        "src/application/controllers/**/__tests__/*.controller.spec.ts, src/application/use-cases/**/__tests__/*.usecase.spec.ts, src/application/validators/**/__tests__/*.validator.spec.ts",
      "sonar.javascript.lcov.reportPaths": "coverage/lcov.info",
      "sonar.testExecutionReportPaths": "coverage/test-reporter.xml",
      "sonar.login": process.env.SONAR_LOGIN,
      "sonar.password": process.env.SONAR_PASSWORD,
    },
  },
  () => {
    console.log("SonarQube analysis is finished");
  }
);
