"use strict";

// check if gulp dist was called
if (process.argv.indexOf("dist") !== -1) {
  // add ship options to command call
  process.argv.push("--ship");
}

const path = require("path");
const gulp = require("gulp");
const build = require("@microsoft/sp-build-web");
const gulpSequence = require("gulp-sequence");
const spsync = require("gulp-spsync-creds").sync;
const sppkgDeploy = require("node-sppkg-deploy");
const fs = require("fs");

const environmentInfo = require("./deploy");

build.addSuppression(
  `Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`
);

// Create clean distrubution package
gulp.task("dist", gulpSequence("clean", "bundle", "package-solution"));
// Create clean development package
gulp.task("dev", gulpSequence("clean", "bundle", "package-solution"));

build.task("upload-app-pkg", {
  execute: config => {
    environmentInfo.username =
      config.args["username"] || environmentInfo.username;
    environmentInfo.password =
      config.args["password"] || environmentInfo.password;
    environmentInfo.tenant = config.args["tenant"] || environmentInfo.tenant;
    environmentInfo.catalogSite =
      config.args["catalogsite"] || environmentInfo.catalogSite;

    return new Promise((resolve, reject) => {
      const pkgFile = require("./config/package-solution.json");
      const folderLocation = `./sharepoint/${pkgFile.paths.zippedPackage}`;

      return gulp
        .src(folderLocation)
        .pipe(
          spsync({
            username: environmentInfo.username,
            password: environmentInfo.password,
            site: `https://${environmentInfo.tenant}.sharepoint.com/${
              environmentInfo.catalogSite
            }`,
            libraryPath: "AppCatalog",
            publish: true
          })
        )
        .on("finish", resolve);
    });
  }
});

build.task("deploy-sppkg", {
  execute: config => {
    environmentInfo.username =
      config.args["username"] || environmentInfo.username;
    environmentInfo.password =
      config.args["password"] || environmentInfo.password;
    environmentInfo.tenant = config.args["tenant"] || environmentInfo.tenant;
    environmentInfo.catalogSite =
      config.args["catalogsite"] || environmentInfo.catalogSite;

    const pkgFile = require("./config/package-solution.json");
    if (pkgFile) {
      // Retrieve the filename from the package solution config file
      let filename = pkgFile.paths.zippedPackage;
      // Remove the solution path from the filename
      filename = filename.split("/").pop();
      // Retrieve the skip feature deployment setting from the package solution config file
      const skipFeatureDeployment = pkgFile.solution.skipFeatureDeployment
        ? pkgFile.solution.skipFeatureDeployment
        : false;
      // Deploy the SharePoint package
      return sppkgDeploy.deploy({
        username: environmentInfo.username,
        password: environmentInfo.password,
        tenant: environmentInfo.tenant,
        site: environmentInfo.catalogSite,
        filename: filename,
        skipFeatureDeployment: skipFeatureDeployment,
        verbose: true
      });
    }
  }
});

/**
 * Custom Framework Specific gulp tasks
 */

build.initialize(gulp);

/**
 * Continuous Integration
 */
